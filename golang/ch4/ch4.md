## 函数

每个函数声明都包含一个函数名、一个形参列表、一个可选的返回值和函数体：

```go
func person(parameter-list) (result-list)  {
 body
}
```

形参列表也就是一组变量的参数名和参数类型，这些局部变量的值都是由调用者提供的实参传递过来的。返回值描述了返回值的变量名以及类型。当函数返回一个无名变量或没有返回值，返回值的括号可以省略。如果一个函数不包含返回值，那么函数执行完后，不会返回任何值。看下面例子：

```go
func hypot(x, y float64) float64 {
  return math.Sqrt(x*x + y*y)
}

func main() {
  fmt.Println(hypot(3, 4)) // 5
}
```

`x`和`y`为形参，`3`和`4`为实参，并且函数返回一个类型为`float64`的值。返回值也可以像形参那样被命名。这种情况下，每个返回值被声明成一个局部变量，并根据变量类型初始化喂相应的零值。

当函数存在返回值时，必须以`return`语句结束，除非函数明确不会走完整个执行流程，比如在函数中抛出宕机异常或者函数内存在一个没有`break`退出条件的无限`for`循环。

如果几个形参或者返回值的类型相同，就不必给每个形参都写出参数类型。下面两个声明是完全相同的：

```go
func f1(i, j, k int, s, t, string) {}

func f2(i int, j int, k int, s string, t string) {}
```

下面以4种不同的方式声明一个带有2个`int`类型参数和1个`int`返回值的函数，空白标识符（`_`）用来表示一个参数在函数中未使用到。

```go
func main() {
  fmt.Println(add(1, 3))   // 4
  fmt.Println(sub(1, 3))   // -2
  fmt.Println(first(1, 3)) // 1
  fmt.Println(zero(1, 3))  // 0
}

func add(x int, y int) int   { return x + y }
func sub(x, y int) (z int)   { z = x - y; return }
func first(x int, _ int) int { return x }
func zero(int, int) int      { return 0 }
```

函数的类型被称为**函数签名**。当两个函数拥有同样的形参和返回值时，那么这两个函数被认为有相同的类型或签名。形参和返回值的名字不会影响到函数签名，也不影响它们是否可以以省略参数类型的形式表示。

每次调用函数都必须按照声明顺序为所有参数提供实参（参数值）。在调用函数时，go中没有默认参数值，也没有任何地方可以通过参数名指定形参。因此形参和返回值的变量名对于函数调用者而言没有意义。

形参是函数的局部变量，初始值由调用者提供的实参传递。函数形参以及具名返回值作为函数最外层的局部变量，被存储在相同的词法块中。

实参是按值传递的，所以函数接收到的是每个实参的副本；修改函数的形参变量不会影响到调用者传递的实参。如果传递的是引用类型，比如指针、`slice`、`map`、函数或通道，那么当函数使用形参时就有可能回间接地修改实参数。

你可能会偶尔看到一些函数的声明没有函数体，这表示该函数不是以Go实现的。这样的声明定义了该函数的签名。

```go
package math

func Sin(x float64) float64
```

### 递归

递归就是通过调用自身，无限循环，直到有一个终止条件才会停止。下面我们用递归来实现一个斐波那契数列。

```go
package main

import "fmt"

func main() {
  for i := 0; i < 100; i++ {
    fmt.Printf("%d\n", fibonaci(i))
  }
}

func fibonaci(i int) int {
  if i == 0 {
    return 0
  }

  if i == 1 {
    return 1
  }
  return fibonaci(i-1) + fibonaci(i-2)
}
```

### 返回值

go中的返回值是可以被命名的，并且就像在函数体开头声明的变量那样使用。返回值的名称应该具有一定的意义，可以作为文档使用。函数如果有命名的返回值，可以省略`return`语句的操作数，这叫做“**裸**”返回。

```go
package main

import "fmt"

func add(x, y int) (z int) {
  z = x + y
  return
}

func calc(a, b int) (sum, avg int) {
  sum = a + b
  avg = (a + b) / 3
  return
}

func main() {
  var x, y int = 10, 20
  z := add(x, y)
  sum, avg := calc(x, y)
  fmt.Println(z, sum, avg) // 30 30 10
}
```

在go中一个函数可以返回多个结果。

```go
func compute(x, y, z int) (int, int, int) {
 return x, y, z
}

func main() {
 x, y, _ := compute(10, 20, 30)
 fmt.Println(x, y) // 10 20
}
```

调用多个返回值的函数时，如果需要用到这些值，必须把值赋给变量或者空标识符“_”。

多返回值可以作为函数的实参进行传递。

```go
package main

import "fmt"

func getNum(x, y, z int) (int, int, int) {
 return x, y, z
}

func sum(x, y, z int) (t int) {
 return x + y*z
}

func main() {
 fmt.Println(sum(getNum(10, 20, 30))) // 610
}

```

### 函数变量
