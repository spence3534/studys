# 接口

Go中不像面向对象语言那样，它没有类和继承的概念。

Go中有一种类型称为接口类型，接口是一种抽象类型。它并没有暴露所含数据的布局或内部结构，也没有数据的基本操作，它所提供的只是一些方法。如果拿到一个接口类型的值，你不需要关心它是什么，你只要知道他能做什么，或者说它提供了什么方法。

接口可以让我们把不同的类型绑定到一组公共的方法上，从而实现多态和灵活的设计。

看下面的代码：

```go
type Person interface {
  getName() string
  setName()
  getHeight() int
}
```

这就是一个接口，定义了一组方法集。如果一个具体类型要实现该接口，必须实现接口类型定义的所有方法。但这些方法不包含（实现）代码，它们没有被实现（它们是抽象的），接口里也不能包含变量。Go中的接口通常会包含0个、最多3个方法。

Go中接口可以有值，一个接口类型的变量或一个接口值。

类型（比如结构体）可以实现某个接口的方法集。这个实现描述为，该类型的变量上的每个具体方法所组成的集合，包含了该接口的方法集。

类型不需要显式声明它实现了某个接口，接口被隐式地实现。多个类型可以实现同一个接口。

实现某个接口的类型（除了实现接口方法外）可以有其他的方法。一个类型可以实现多个接口。

接口类型可以包含一个实例的引用，该实例的类型实现了此接口（接口是动态类型）。

即使接口在类型之后才定义，二者处于不同的包中被单独编译。只要类型实现了接口中的方法，它就实现了这个接口。

来看下面的例子：

```go
type Shaper interface {
  Area() float32
}

type Square struct {
  side float32
}

func (sq *Square) Area() float32 {
  return sq.side * sq.side
}

func main() {
  sq1 := new(Square)
  sq1.side = 4

  var areaIntf Shaper
  areaIntf = sq1

  fmt.Printf("%f\n", areaIntf.Area()) // 16.000000
}
```

上面的代码中，定义了一个结构体`Square`和一个接口`Shaper`，`Shaper`中有一个`Area`方法。

`main`方法中创建了一个`Square`的实例。在外面还定义了一个接收者类型是`Square`方法的`Area`函数。这里结构体`Square`实现了`Shaper`接口。

所以可以把一个`Square`类型的变量赋值给一个接口类型的变量`areaIntf = sq1`。

现在接口变量包含一个指向`Square`变量的引用，通过它能调用`Square`上的方法。当然也可以直接在`Square`的实例上调用。

这是多态的Go版本，根据当前的类型选择正确的方法。或者说：同一种类型在不同的实力上似乎表现出不同的行为。

如果`Square`没有实现`Area`方法，那么编译器会给出错误信息：

```go
cannot use sq1 (variable of type *Square) as Shaper value in assignment: *Square does not implement Shaper (missing method Area)s
```

如果`Shaper`有另一个方法`Add`，`Square`没有实现它，即使没有在`Square`实例上调用这个方法，编译器一样会给出错误信息。

下面来看一下接口的多态行为，比如一个`Rectangle`结构体也实现了`Shaper`接口。接着创建一个`Shaper`类型的数组，迭代它的每一个元素并在上面调用`Area`方法。

```go
type Shaper interface {
  Area() float32
}

type Square struct {
  side float32
}

func (sq *Square) Area() float32 {
  return sq.side * sq.side
}

type Rectangle struct {
  length, width float32
}

func (r Rectangle) Area() float32 {
  return r.length * r.width
}

func main() {
  r := Rectangle{5, 3}
  q := &Square{5}

  shapes := []Shaper{r, q}
  for n, _ := range shapes {
    fmt.Println(shapes[n])
    fmt.Println(shapes[n].Area())
    // {5 3}
    // 15
    // &{5}
    // 25
  }
}
```

上面代码中，在调用`shapes[n].Area`时，只知道`shapes[n]`是一个`Shaper`对象，最后摇身一变成为了一个`Square`或`Rectangle`对象，并且表现出相对应的行为。

接下来看一个更具体的例子：

```go
type stockPosition struct {
  ticker     string
  sharePrice float32
  count      float32
}

func (s stockPosition) getValue() float32 {
  return s.sharePrice * s.count
}

type car struct {
  make  string
  model string
  price float32
}

func (c car) getValue() float32 {
  return c.price
}

type valuable interface {
  getValue() float32
}

func showValue(asset valuable) {
  fmt.Printf("%f\n", asset.getValue())
}

func main() {
  var o valuable = stockPosition{"goog", 302.20, 4}
  showValue(o) // 1208.800049
  o = car{"bmw", "x5", 100000}
  showValue(o) // 100000.000000
}
```

这里的例子中。有两个类型`stockPosition`和`car`，它们都有一个`getValue`方法，那么我们可以定一个具有该方法的接口`valuable`。接着定义一个用`valuable`类型作为参数的函数`showValue`，所以实现了`valuable`接口的类型都可以用这个函数。

## 嵌套接口

一个接口可以嵌套多个其他的接口，相当于直接把这些内嵌接口的方法列举在外层接口中。看下面的例子：

```go
type ReadWriter interface {
  Read(p []byte) (n int, err error)
  Write(p []byte) (n int, err error)
}

type Lock interface {
  Lock()
  Unlock()
}

type File interface {
  ReadWriter
  Lock
  Close()
}
```

这里的`File`接口中包含了`ReadWriter`和`Lock`的所有方法，还额外多出一个`Close`方法。

## 接口值

一个接口类型的值（简称接口值）有两部分：一个具体类型和该类型的一个值。二者称为接口的动态类型和动态值。

对于Go这样的静态类型语言，类型仅仅是一个编译时的概念，所以类型不是一个值。在我们的概念模型中，用**类型描述符**来提供每个类型的具体信息，比如它的名字和方法。对于一个接口值，类型部分就用对应的类型描述符来表述。

下面四个语句中，变量`w`有三个不同的值：

```go
var w io.Writer
w = os.Stdout
w = new(bytes.Buffer)
w = nil
```

接下来我们来详细地看一下在每个语句之后`w`的值和相关的动态行为。

1. 第一个语句声明了`w`:

```go
var w io.Writer
```

在Go中，变量总是初始化为一个特定的值，接口也如此。接口的零值就是把它的动态类型和值都设置为`nil`。

一个接口值是否为`nil`取决于它的动态类型，所以现在这是一个`nil`接口值。可以用`w == nil`或者`w != nil`来校验一个接口值是否为`nil`。调用一个`nil`接口的任何方法都会导致崩溃。

```go
fmt.Println(w.Write([]byte("hello"))) // panic: runtime error: invalid memory address or nil pointer dereference
```

2. 第二句把一个`*os.File`类型的值赋给了`w`:

```go
w = os.Stdout
```

这次赋值把一个具体类型隐式转换为一个接口类型，它和对应的显式转换`io.Writer(os.Stdout)`等价。无论这种类型的转换是隐式还是显式的，它都可以转换操作数的类型和值。接口值的动态类型会设置为指针类型`*os.File`的类型描述符，它的动态值会设置为`os.Stdout`的副本，也就是一个指向代表进程的标准输出的`os.File`类型的指针。

调用该接口值的`Write`方法，调用的是`(*os.File).Write`方法，输出"hello"。

```go
var w io.Writer
w = os.Stdout
fmt.Println(w.Write([]byte("hello"))) // hello5 <nil>
```

在编译时我们无法知道一个接口值的动态类型会是什么，所以通过接口来做调用必然需要使用**动态分发**。编译器必须生成一段代码来从类型描述符拿到名为`Write`的方法，再间接调用该方法地址。调用的接收者就是接口值的动态值，也就是`os.Stdout`，所以实际效果和直接调用是等价的。

```go
fmt.Println(os.Stdout.Write([]byte("hello"))) // hello5 <nil>
```

3. 第三句把一个`*bytes.Buffer`类型的值赋给了接口值:

```go
w = new(bytes.Buffer)
```

动态类型现在是`*bytes.Buffer`，动态值则是一个指向新分配的缓冲区的指针。调用`Write`方法的机制和第二局一样:

```go
w.Write([]byte("hello"))
```

这次，类型描述符是`*bytes.Buffer`，所以调用的是`(*bytes.Buffer).Write`方法，方法的接收者是缓冲区地址。调用该方法会追加`hello`到缓冲区。

4. 最后，把`nil`赋值给了接口值。`w = nil`。这个语句把动态类型和动态值都设置成`nil`，所以就回到了`w`最初声明的状态。

一个接口值可以指向多个任意大的动态值。比如，`time.Time`类型可以表示一个时刻，它是一个包含几个非导出字段的结构。如果它从创建一个接口值:

```go
var x interface{} = time.Now()
```

无论动态值有多大，它永远在接口值内部。

接口值可以用`==`和`!=`操作符来比较。如果两个接口都是`nil`或者两者的动态类型完全一致且两者动态值相等，说明这两个接口值相等。接口值可以做比较，那么它们可以作为`map`的键，也可以作为`switch`语句的操作数。

需要注意的是，比较两个接口值时，如果两个接口值的动态类型一致，但对应的动态值是不可比较的，那么这个比较会导致崩溃:

```go
var x interface{} = []int{1, 2, 3}
fmt.Println(x == x) // panic: runtime error: comparing uncomparable type []int
```

从这点来看，接口类型是非凡的。其他类型要么时可以安全比较的（比如基础类型和指针），要么是完全不可比较的（比如`slice`、`map`和函数），但当比较接口值或者其中包含接口值的聚合类型时，必须小心崩溃的可能性。当把
接口作为`map`的键或者`switch`语句的操作数时，也存在类似的风险。仅在能确认接口值包含的动态值可以比较时，才比较接口值。

当处理错误或调试时，能拿到接口值的动态类型时很有帮助的。可以使用`fmt`包的`%T`来实现这个需求:

```go
func main() {
  var w io.Writer
  fmt.Printf("%T\n", w) // <nil>

  w = os.Stdout
  fmt.Printf("%T\n", w) // *os.File

  w = new(bytes.Buffer)
  fmt.Printf("%T\n", w) // *bytes.Buffer
}s
```

在内部实现中，`fmt`用反射来拿到接口动态类型的名字。

### 含有空指针的非空接口

空的接口值和仅仅动态值为`nil`的接口值是不一样的。看下面的例子：

```go
const debug = false

func main() {
  var buf *bytes.Buffer
  if debug {
    buf = new(bytes.Buffer)
  }
  f(buf)
}

func f(out io.Writer) {
  if out != nil {
    fmt.Println(out.Write([]byte("done!\n")))
    // panic: runtime error: invalid memory address or nil pointer dereference
  }
}
```

这个例子中，当`debug`设置为`true`时，`main`函数收集`f`函数的输出到一个缓冲区中。当把`debug`设置为`false`时，按理说不会收集输出，但实际上会导致宕机。

当`main`函数调用`f`时，它把一个类型为`*bytes.Buffer`的空指针赋给了`out`参数，所以`out`的动态值为空。但它的动态类型是`*bytes.Buffer`，这说明`out`是一个包含空指针的非空接口，所以`out != nil`校验还是为`true`。

问题在于，尽管一个空的`*bytes.Buffer`指针拥有的方法满足了该接口，但它并不满足该接口所需的行为。特别是，这个调用违背了`(*bytes.Buffer).Write`的一个隐式的前置条件，接收者不能为空，所以把空指针赋给这个接口是个错误的操作。
只要把`main`函数中的`buf`类型改为`io.Writer`即可。
