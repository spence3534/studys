# 方法

## 方法声明

方法的声明和函数声明一样，只不过在函数前面加多一个参数。该参数把这个方法绑定到该参数对应的类型上。看下面的例子：

```go
type Person struct {
  Height int
  Name   string
}

// Person类型的方法
func (p Person) getName(info Person) (string, int) {
  return info.Name, info.Height
}
```

附加参数`p`称为方法的接收者。命名最好取类型的首字母，因为在开发中频繁用到。上面的`Person`中的`p`。这个`p`就像面向对象中的`this`或`self`，所以我们是给`Person`结构体声明一个`getName`方法。下面来看看怎么调用。

```go
func main() {
  p := Person{Name: "图图", Height: 175}
  fmt.Println(p.getName(p)) // 图图 175
}
```

表达式`p.getName`称为**选择子**，因为它为接收者`p`选择合适的`getName`方法。选择子也用于选择结构类型中的某些字段值，就像`p.Name`字段值。由于方法和字段来自同一个命名空间，因此在`Person`结构类型中声明一个`Name`方法会和`Name`字段会冲突。

你可以把一个类型想象成js中的一个类。但有一个区别是：Go中，类型的代码和绑定在它上面的方法可以不放在一起。也就是说，可以存在不同的源文件。但它们必须是同一个包。

接收者类型可以是任何类型，不仅仅是结构体类型。任何类型都可以有方法，甚至可以是函数类型，`int`、`bool`、`string`或数组的别名类型。只要它的类型既不是指针类型也不是接口类型就好，它也可以是任何其他允许类型的指针。这样可以给类型附加一些方法。

类型拥有的所有方法名都必须是唯一的，不同的类型可以使用相同的方法名。比如下面的代码中展示了两个同名方法，但定义在不同的接收者类型中。

```go
func (c CounterA) Add(x, y int) int {
  return x + y
}
func (c CounterB) Add(z, y int) int {
  return z + y
}
```

## 指针接收者的方法

接收者还可以是一个指针类型，比如`*Point`。

```go
type Point struct {
  X float64
  Y float64
}

func (p *Point) scaleBy(factor float64) {
  p.X *= factor
  p.Y *= factor
}

func main() {
  p := &Point{X: 100, Y: 150}
  p.scaleBy(0.5)
  fmt.Println(p.X, p.Y) // 50 75
}
```

这个方法的名是`(*Point).ScaleBy`。记住，圆括号是必须的；没有圆括号，表达式会被解析成`*(Point.ScaleBy)`。

命名类型`Person`和指向它们的指针`*Point`是唯一可以出现在接收者声明处的类型。不允许指针的类型进行方法声明:

```go
type P *int

func (P) point() {} // invalid receiver type P (pointer or interface type)
```

如果接收者`p`是`Point`类型的变量，但方法要求一个`*Point`接收者，可以简写成:

```go
p := Point{X: 100, Y: 150}
p.scaleBy(0.5)
```

实际上编译器会对变量进行`&p`的隐式转换。但只有变量才可以这样做，包括结构体字段，像`p.X`和数组或`slice`对元素，比如`perim[0]`。不可以对一个不能取地址的`Point`接收者参数调用`*Point`方法，因为无法获取临时变量的地址。

```go
Point{1, 2}.ScaleBy(2) // 编译错误❌
```

如果实参接收者是`*Point`类型，也就是`p := &Point{X: 100, Y: 150}`，直接`p.scaleBy(...)`调用也是可以的。因为我们可以从地址中获取`Point`的值；只要**解引用**指向接收者的指针值就可以了。编译器会自动插入一个隐式的`*`操作符。

下面来总结一下这些例子。在合法的方法调用表达式中，只要符合下面三种形式的语句才能成立。

实参接收者和形参接收者为同一类型，比如都是`T`类型或都是`*T`类型：

```go
Point{1, 2}.ScaleBy(1) // Point
p.ScaleBy(2) // *Point
```

或者实参接收者是`T`类型的变量而形参接收者是`*T`类型。编译器会隐式地获取变量的地址。

```go
p.scaleBy(0.5) // 隐式转换为(&p)
```

或者实参接收者是`*T`类型而形参接收者是`T`类型。编译器会隐式地解引用接收者，获取实际的值。

```go
p.scaleBy(1) // 隐式转换为(*p)
```

如果所有类型`T`方法的接收者是`T`自己（而非`*T`），那么复制它的实例是安全的；调用方法的时候都必须进行一次复制。

## 内嵌组成类型

当一个其他的类型被内嵌在结构体中时，该类型的方法也会被内嵌在其中。相当于外层类型**继承**了这些方法，这种机制相当于面向对象中的子类和继承的效果。

看下面的例子：

```go
type Point struct {
  X, Y float64
}

type ColoredPoint struct {
  Point
  Color color.RGBA
}

func (p Point) getCoordinate() float64 {
  return p.X
}

func main() {
  red := color.RGBA{255, 0, 0, 255}
  p := ColoredPoint{Point{10, 20}, red}
  fmt.Println(p.getCoordinate()) // 10
}
```

这里就用结构体类型做为例子。可以看到声明了两个结构类型`Point`和`ColoredPoint`，把`Point`内嵌在`ColoredPoint`中，然后给`Point`类型声明了一个方法。通过`ColoredPoint`类型的接收者`p`调用内嵌类型的`Point`的方法是合法的。即使`ColoredPoint`类型中没有声明`getCoordinate`方法也能访问到。

`Point`的方法都被嵌入到`ColoredPoint`中。以这种方式，可以实现复杂的类型。

在面向对象中，我们可以看作`ColoredPoint`继承了`Point`的属性和方法，`ColoredPoint`作为子类或派生类。但这样有个误解。看下面的代码：

```go
func (p Point) Distance(p, q Point) float64 {
  return q.X - p.X
}

func main() {
  red := color.RGBA{255, 0, 0, 255}
  blue := color.RGBA{0, 0, 255, 255}
  p := ColoredPoint{Point{10, 20}, red}
  q := ColoredPoint{Point{100, 150}, blue}
  fmt.Println(p.Distance(q.Point)) // -140
  fmt.Println(p.Distance(q)) // 报错
}
```

这里调用`Distance`的地方，`Distance`有个形参`Point`，`q`不是`Point`，虽然`q`有个内嵌的`Point`字段，但必须得显式地使用它。如果只传递`q`作为参数会导致报错。

匿名字段类型可以式指向命名类型的指针，此时，字段和方法间接地来自指向的对象。这样可以共享通用的结构以及使对象之间的关系更加动态、多样化。下面的`ColoredPoint`声明内嵌的`*Point`。

```go
type Point struct {
  X, Y float64
}

type ColoredPoint struct {
  *Point
  Color color.RGBA
}

func (p Point) getCoordinate() float64 {
  return p.X
}

func (p Point) Distance(q Point) float64 {
  return p.X - q.Y
}

func main() {
  red := color.RGBA{255, 0, 0, 255}
  blue := color.RGBA{0, 0, 255, 255}
  p := ColoredPoint{&Point{1, 1}, red}
  q := ColoredPoint{&Point{5, 4}, blue}
  fmt.Println(p.Distance(*q.Point)) // -3
  q.Point = p.Point
  p.getCoordinate()
  fmt.Println(*p.Point, *p.Point) // {1 1} {1 1}
}
```

这个类型的值就拥有了`Point`和`RGBA`所有的方法，以及其他任何直接在`ColoredPoint`类型中声明的方法。当编译器处理选择子（比如`p.getCoordinate`）时，会先查找到直接声明的方法`getCoordinate`，之后再从`ColoredPoint`的内嵌字段的方法中查找，再之后从`Point`和`RGBA`中内嵌字段的方法中进行查找，以此类推。当同一个查找级别中有同名方法时，编译器会报告选择子不明确的错误。

方法只能在命名的类型（比如`Point`）和指向它的指针（`*Point`）中声明。

## 方法变量和方法表达式

选择子`p.Distance`可以赋值给一个变量，这个变量就是一个函数，把方法`Point.Distance`绑定到接收者`p`上。函数只需要传递参数即可。

```go
func main() {
  p := Point{10, 20}
  q := Point{20, 30}

  distanceFromP := p.Distance
  fmt.Println(distanceFromP(q)) // -20

  var origin Point
  fmt.Println(distanceFromP(origin)) // 10

  getCoordinateP := p.getCoordinate
  fmt.Println(getCoordinateP()) // 10
}
```

方法表达式和调用一个普通的函数不同，在调用方法时必须提供接收者，并且按选择子的语法来调用。方法表达式写成`T.f`或`(*T).f`，这个`T`是类型，是一种函数变量，把原先的方法接收者作为函数的第一个形参，就可以像平常的函数一样调用。

```go
func main() {
  p := Point{10, 20}
  q := Point{20, 30}

  distance := Point.Distance // 方法表达式
  fmt.Println(distance(p, q))  // -20
  fmt.Printf("%T\n", distance) // func(main.Point, main.Point) float64

  getCoordinate := (*Point).getCoordinate
  fmt.Println(getCoordinate(&p)) // 10
}
```

如果你需要用一个值来代表多个方法中的其中一个，而方法都是同一个类型，方法变量可以帮你调用这个值所对应的方法来处理不同的接收者。看下面的例子：

```go
type Point struct {
  X, Y float64
}

func (p Point) Add(q Point) Point {
  return Point{p.X + q.X, p.Y + q.Y}
}

func (p Point) Sub(q Point) Point {
  return Point{p.X - q.X, p.Y - q.Y}
}

type Path []Point

func main() {
  path := []Point{{10, 20}}
  Path.TranslateBy(path, Point{10, 20}, true)
}

func (path Path) TranslateBy(offset Point, add bool) {
  var op func(p, q Point) Point
  if add {
    op = Point.Add
  } else {
    op = Point.Sub
  }
  for i := range path {
    path[i] = op(path[i], offset)
    fmt.Println(path[i]) // {20 40}
  }
}
```

## 封装

如果变量和方法不能通过对象访问，这行为称之为**封装**的变量或方法。有时称为**数据隐藏**。

Go中只有一个方式控制命名的可见性。定义时，首字母大写证明可以从包中导出，而首字母没有大写则不可导出。同样的机制也同样作用于结构体内的字段和类型中的方法。要封装一个对象，必须使用结构体。

Go中封装的单元是包而不是类型。无论是在函数内的代码还是方法内的代码，结构体类型内的字段对于同一个包中的所有代码都是可见的。

封装提供了三个优点：

1. 因为使用方不能直接修改对象的变量，所以不需要更多的语句用来检查变量的值。
2. 隐藏实现细节可以防止使用方依赖的属性发生改变，使得设计者可以更加灵活地改变API的实现而不破坏兼容性。
3. 防止使用者任意地改变对象内的变量。因为对象的变量只能被同一个包内的函数修改，所以包的作者能够保证所有的函数都可以维护对象内的资源。

用来获取或者修改内部变量的函数称为`getter`和`setter`操作。
