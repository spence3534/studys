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
