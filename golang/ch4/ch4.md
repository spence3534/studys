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

函数在go中属于头等公民的存在，和JS函数一样，可以赋值给变量或者传递或者从其他函数中返回。

```go
func square(n int) int {
 return n * n
}

func negative(n int) int {
 return -n
}

func product(m, n int) int {
 return m * n
}

func main() {
 f := square
 fmt.Println(f(10)) // 100

 f = negative
 fmt.Println(f(9))     // -9
 fmt.Printf("%T\n", f) // func(int) int

 f = product // 编译错误：不能把类型 func(m int, n int) int 赋给 func(n int) int
}
```

函数类型的零值是`nil`（空值），调用一个空的函数变量会导致宕机。

```go
var a func(int) int

func main() {
  fmt.Println(a(3)) // panic
}
```

函数变量可以跟空值进行比较。

```go
var a func(int) int

func main() {
  if a == nil {
    fmt.Print("a是一个空函数")
  } else {
    fmt.Print("a不是一个空函数")
  }
}
```

但函数本身不可比较，所以不可以互相进行比较或者用做`map`中的键值。

函数变量不仅可以把数据进行参数化，还可以当作参数进行传递。看下面简单的例子：

```go
func add(x, y int) (count int) {
  return x * y
}

func sum(add func(x, y int) int, n int) int {
  return add(10, 20) + n
}

func main() {
  var sum int = sum(add, 9)
  fmt.Println(sum)
}
```

### 匿名函数

命名函数只能在包级别的作用域进行声明，但我们能使用函数字面量在任何表达式内指定函数变量。函数字面量就像函数声明，但在`func`关键字后面没有函数的名称。它是一种表达式，叫做**匿名函数**。

用这种方式来定义的函数可以获取整个词法环境，里面的函数可以使用外层函数的变量。

```go
package main

import "fmt"

func squares() func() int {
  var x int = 2
  return func() int {
    x++
    return x * x
  }
}

func main() {
  f := squares()
  fmt.Println(f()) // 9
  fmt.Println(f()) // 16
  fmt.Println(f()) // 25
  fmt.Println(f()) // 36
}
```

这里我们实现了一个闭包函数`squares`，它返回了一个函数，类型为`func() int`。调用`squares`创建一个局部变量`x`而且返回一个函数，每次调用`squares`都会递增`x`的值然后返回`x`的平方。第二次调用`squares`函数会创建第二个变量`x`，然后返回一个递增`x`值的新匿名函数。

### 变长函数

**变长**函数被调用的时候可以有可变的参数个数。`fmt.Printf`就是一个典型的例子，`Printf`开头固定一个参数，后面可以接受任意数目的参数。

在参数列表最后的类型前使用省略号`...`表示声明一个变长函数，调用该函数时可以传递该类型任意数目的参数。

```go
func sum(vals ...int) int {
  total := 0
  for _, v := range vals {
    total += v
  }
  return total
}

func main() {
  fmt.Println(sum())           // 0
  fmt.Println(sum(10))         // 10
  fmt.Println(sum(10, 20, 30)) // 60
}
```

还可以传递一个数组，把实参复制给这个数组，并将一个数组`slice`传递给函数。上面的最后一个调用和下面的调用是一样的，这里只是展示当实参已经存在于一个`slice`中的时候怎么调用变长函数。只需要在最后一个参数后面加上`...`省略号即可。

```go
func main() {
  values := []int{1, 2, 3, 4, 5, 6}
  fmt.Println(sum(values...)) // 21
}
```

虽然`...int`参数看上去有点像一个`slice`，但变长函数的类型和一个带有普通`slice`参数的函数的类型截然不同。

```go
func x(...int) {}

func y([]int) {}

func main() {
  fmt.Printf("%T\n", x) // func(...int)
  fmt.Printf("%T\n", y) // func([]int)
}
```

变长函数通常用于格式化字符串。下面的`errorf`函数构建一条格式化的错误消息，在消息的开头带有行号。函数的后缀`f`是广泛使用的命名习惯，用于可变长`Printf`风格的字符串格式化输出函数。

```go
func errorf(linenum int, format string, args ...interface{}) {
  fmt.Fprintf(os.Stderr, "Line %d: ", linenum)
  fmt.Fprintf(os.Stderr, format, args...)
  fmt.Fprintln(os.Stderr)
}

func main() {
  linenum, name := 12, "count"
  errorf(linenum, "undefined: %s", name) // Line 12: undefined: count
}
```

### defer延迟函数调用

`defer`语句是一个普通的函数或方法调用，在调用前加上关键字`defer`。`defer`调用只会在`return`之后或函数执行完之后调用，这种操作可以用来清除资源占用问题。`defer`没有限制调用次数，执行时以调用`defer`语句顺序的倒序进行。

```go
import "fmt"

func main() {
  defer delay(1)
  defer delay(2)
  defer delay(3)
}

func delay(x int) {
  fmt.Println("a", x)
  // a 3
  // a 2
  // a 1
}
```

如果`defer`后面是一个匿名函数一定要加上括号。

```go
func main() {
  defer func () {
    fmt.Println("a", 1)
  } // error: function must be invoked in defer statement
  defer func () {
    fmt.Println("a", 2) // a 2
  }()
}
```

`defer`语句经常用于成对的操作，比如打开和关闭，连接和断开，加锁和解锁，即使是再复杂的控制流，资源在任何情况下都能得到释放。

延迟执行函数在`return`之后执行，并且可以更新函数的结果变量。因为匿名函数可以得到其外层函数作用域内的变量，所以延迟执行的函数可以观察到函数的返回结果。看下面的例子：

```go
import "fmt"

func main() {
  fmt.Println(deferFunc(1, 2)) // 5
}

func deferFunc(x, y int) (result int) {
  var z int = x + y
  defer func() {
    result += 2
  }()
  return z
}
```

通过命名结果变量和`defer`语句，我们可以每次调用函数的时候修改它的结果。

```go
func main() {
  fmt.Println(triple(3))
  // double(3) = 6
  // 9
}

func double(x int) (result int) {
  defer func() {
    fmt.Printf("double(%d) = %d\n", x, result)
  }()
  return x + x
}

func triple(x int) (result int) {
  defer func() {
    result += x
  }()
  return double(x)
}
```

### 异常处理

在go中，是没有`try...catch`语句的。只能通过`panic`内置函数抛出一个异常，然后通过`defer`中调用`recover`函数捕获这个异常，然后正常处理。如果碰到一些不可能发生的状况，宕机是最好的处理方式。比如逻辑上不可能满足条件的时候。

```go
func main()  {
  switch s := suit(drawCard); s {
    case "spades":
      break
    case "hearts":
      break
    case "diamonds":
      break
    case "clubs":
      break
    default:
      panic(fmt.Sprintf("invalid suit %q:" s))
  }
}
```

当发生宕机时，所有的延迟函数以倒序执行，从栈最上面的函数开始一直返回至`main`函数，如下面所示：

```go
func main() {
  d(3)
}

func d(x int) {
  fmt.Printf("f(%d)\n", x+0/x)
  defer fmt.Printf("defer %d\n", x)
  d(x - 1)
}

// 输出结果：
// f(3)
// f(2)
// f(1)
// defer 1
// defer 2
// defer 3
// panic: runtime error: integer divide by zero

// goroutine 1 [running]:
// main.d(0x10c7ac0?)
//  /Users/main.go:12 +0x113
// main.d(0x1)
//  /Users/main.go:14 +0xf5
// main.d(0x2)
//  /Users/main.go:14 +0xf5
// main.d(0x3)
//  /Users/main.go:14 +0xf5
// main.main()
//  /Users/main.go:8 +0x1e
// exit status 2
```

当调用`f(0)`时发生了宕机，执行了三个延迟`fmt.Printf`调用。之后，运行时终止了这个程序，输出了宕机消息和一个栈转储信息到标准错误流。

`runtime`包提供了转储栈的方法使得我们可以诊断错误。下面在代码`main`函数中延迟`printStack`的执行：

```go
func printStack() {
  var buf [4096]byte
  n := runtime.Stack(buf[:], false)
  os.Stdout.Write(buf[:n])
}

func main() {
  defer printStack()
  d(3)
}
```

内置的`recover`函数可以让宕机流程中的`goroutine`恢复过来，`recover`只在`defer`延迟函数中有效，看下面的例子：

```go
func test() {
  defer func() {
    if err := recover(); err != nil {
    fmt.Print("宕机啦！！！", err) // 宕机啦！！！panic error
    }
  }()
  panic("panic error")
}

func main() {
  test()
}
```

`defer`中引发的错误，可以被后面延迟调用捕获，但是只有最后一个错误可被捕获。

```go
func test() {
  defer func() {
    fmt.Println(recover()) // defer中发生错误啦
  }()

  defer func() {
    panic("defer中发生错误啦")
  }()
  panic("宕机啦！")
}

func main() {
  test()
}
```

捕获函数`recover`只有在延迟函数内调用才会终止`panic`继续向上传递，一直沿着调用栈向外传递。在正常的执行过程中调用`recover`，会返回`nil`值。

```go
func test() {
  defer func() {
    fmt.Println(recover()) // 宕机啦!!!
  }()
  defer recover()              // 无效recover
  defer fmt.Println(recover()) // nil
  defer func() {
    // 这里的代码块直接导致编辑器报错
    func() {
    println("defer inner") // defer inner
    recover()
    }()
  }()
  panic("宕机啦!!!")
}

func main() {
  test()
}
```
