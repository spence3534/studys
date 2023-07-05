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

## 类型断言

类型断言是一个用在接口值上的操作，语法为`x.(T)`。`x`是一个接口类型的表达式，`T`是一个类型（断言类型）。类型断言会检查操作对象的动态类型是否和断言的类型匹配。也就是说，检测`x`中是否包含`T`的值。

这里有两种可能。第一种，如果断言类型`T`是一个具体类型，那么类型断言会检查`x`的动态类型是否满足`T`。如果满足，类型断言的结果就是`x`的动态值，当然类型也是`T`。换句话说，类型断言就是用来从它的操作对象中把具体类型的值提取出来的操作。
如果`x`的动态类型不是`T`，接下来会抛出`panic`。比如:

```go
import (
 "bytes"
 "fmt"
 "io"
 "os"
)

func main() {
  var w io.Writer
  w = os.Stdout
  f := w.(*os.File) // 成功：*os.File有Read和Write方法
  c := w.(*bytes.Buffer) // 宕机: 接口转换: io.Writer 是 *os.File, 不是 *bytes.Buffer
  fmt.Println(c, f)
}
```

第二种，如果断言类型`T`是接口类型，类型断言检查`x`的动态类型是否满足`T`。如果满足，动态值并不会提取出来，结果依然是一个接口值，接口值的类型和值部分也不会变更，只是结果的类型为接口类型`T`。也就是说，类型断言是一个接口值表达式，
从一个接口类型变成拥有另一套方法的接口类型，但保留了接口值中的动态类型和动态值部分。

```go
type ByteCounter int

func (c *ByteCounter) Write(p []byte) (int, error) {
  *c += ByteCounter(len(p)) // convert int to ByteCounter
  return len(p), nil
}

var w io.Writer
w = os.Stdout
rw := w.(io.ReadWriter) // 成功: *os.File有Read和Write方法

w = new(ByteCounter)
rw = w.(io.ReadWriter) // panic *ByteCounter没有Read方法
```

不管哪种类型作为断言类型，操作对象是一个空接口值的话，类型断言都会失败。我们不需要从一个接口类型向一个要求更宽松的类型做类型断言，该宽松类型的接口方法比原类型的少（是原类型的子集），因为除了在操作`nil`之外的情况下，在其他情况下这种操作和赋值一样。

```go
var w io.Writer
w = os.Stdout
rw := w.(io.ReadWriter)

w = rw // io.ReadWriter 可以赋给 io.Writer
w = rw.(io.Writer) // 只有rw为nil时失败
```

我们经常无法确定一个接口值的动态类型，此时需要检测它是否为某一个特定类型。如果类型断言出现在需要两个结果的赋值表达式中，那么断言就不会在失败时崩溃，而是会多返回一个布尔型的返回值来表示断言是否成功。

```go
var w io.Writer = os.Stdout
f, ok := w.(*os.File)      // true
b, ok := w.(*bytes.Buffer) // false
```

一般会把第二个返回值赋给`ok`变量，如果操作失败，`ok`为`false`，而第一个返回值为断言类型的零值`nil`，在这个例子中`*bytes.Buffer`是一个空指针。

下面是以一种更安全的方式来进行类型断言。

```go
if v, ok := x.(T); ok {
  // ...用v做一些操作
}
```

如果`x`满足`T`，那么`v`是`x`转换到类型`T`的值，ok就为`true`；否则`v`是类型`T`的零值，`ok`为`false`，也并不会影响程序运行。我们应该用这种方式来进行类型断言。

## 类型分支

接口变量的类型也可以用一种特殊形式来检测：`type switch`语句：

```go
switch x.(type) {
  case nil:
    //...
  case int, unit:
    //...
  case bool:
    //...
  case string:
    //...
  default:
    //...
}
```

类型分支的形式和普通分支语句类似，差别在于操作对象改为`x.(type)`（注意：这里直接写`type`关键字，而不是特定类型），每个分支是一个或多个类型。类型分支的分支判定基于接口值的动态类型，其中`nil`分支需要`x == nil`，而`default`分支则是在
其他分支都没满足的情况下运行的。另外，类型分支是不允许使用`fallthrough`的。

如果需要访问由类型断言提取出来的原始值，类型分支语句还有一种扩展形式，它用来把每个分支中提取出来的原始值绑定到一个新变量中:

```go
switch x := x.(type) {
  // ....
}
```

这里把新的变量也命名为`x`，和类型断言类似，重用变量名很普遍。和`switch`语句类似，类型分支也会隐私创建一个词法块，所以声明一个新变量`x`并不会和外部块中的变量`x`冲突。每个分支也会隐式创建各自的词法块。

下面是一个完整的例子:

```go
func typeDiagnose(x interface{}) string {
  var s string
  switch x := x.(type) {
  case nil:
    s = "NULL"
  case int, uint:
    return fmt.Sprintf("%d", x)
  case bool:
    if x {
      s = "TRUE"
    }
  case string:
    return fmt.Sprintf("%d", x)
  default:
    panic(fmt.Sprintf("unexpected type %T: %v", x, x))
  }
  return s
}
```
