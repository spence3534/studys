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
