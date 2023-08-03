## 语句

### for

在Go中只有`for`循环这一种循环语句。`for`循环有多种形式，其中一种如下所示：

```go
for initialization; condition; post {
 // ...
}
```

`for`循环的三部分不用括号包起来。花括号是必须的，左花括号必须和`post`语句在同一行。实际上，这三部分每个都是可省略的。如果`initialization`和`post`省略后，分号也可以省略：

```go
for condition {

}
```

连`condition`都省略掉的话，那么就变成一个无限循环了。

```go
for {

}
```

### if...else

Go中的`if`条件语句和`for`循环一样，条件两边不用加上括号。但主体部分要加上花括号。

```go
if condition {

} else {

}
```

### switch

Go中的`switch`语句有两种方式：一种是带操作对象。另一种是不带操作对象，默认用`true`代替，这种行为叫做无**tag switch**。

```go
package main

import "fmt"

func main() {
 fmt.Println(noTagSwitch(1))
 tagSwitch(false)
}

// 不带操作对象时，
func noTagSwitch(x int) int {
 switch {
 case x == 1:
  return 1
 default:
  return 0
 }
}

// 带操作对象的
func tagSwitch(y bool) {
 var a int = 1
 switch y {
 case true:
  a++
 default:
  a--
 }
 fmt.Println(a)
}
```

需要注意的是，Go语言不需要显示地在每个`case`后写`break`，默认执行完`case`之后的逻辑语句会自动退出。

## 程序结构

### 关键字

下面列出Go中的关键字。只能在特定语法结构中使用。

```golang
break   default   func    interface   select
case    defer     go      map         struct
chan    else      goto    package     switch
const   fallthrough   if    range     type
continue  for     import    return    var
```

除此之外，还有约30个预定义的名字。如`int`和`true`等等。

```golang
内置常量：true    false   iota    nil

内置类型：int   int8    int16   int32   int64
         unit  unit8   unit16  unit32  unit64   unitptr
         float32  float64   complex128  complex64
         bool  type    rune    string  error

内置函数：make    len   cap   new   append    copy    close   delete
         complex    real    imag    panic   recover
```

这些内置的名称并不是关键字，你可以在定义中重新使用它们。

一个名字是在函数内部定义的话，它只能在函数内部有效。如果在函数外部定义，它将在当前包的所有文件中都可以访问。名字的开头字母大小写决定了名字在包外的可见性。如果一个名字是大写字母开头，它将被视为导出的。也就是说可以被外部的包访问，比如`fmt`包的`Printf`函数就是导出的，可以在`fmt`包外部访问。包本身的名字一般都是用小写字母。

### 声明

Go主要有四种类型的声明语句：`var`（变量）、`const`（常量）、`type`（类型）和`func`（函数）。看下面的例子：

```golang
package main

import "fmt"

const boilingF = 212.0

func main() {
 var f = boilingF
 var c = (f - 32) * 5 / 9
 fmt.Printf("boilingF point = %g or %g\n", f, c)
}

func fToC(f float64) float64 {
 return (f - 32) * 5 / 9
}
```

这里我们声明了`boilingF`常量和两个变量`f`和`c`，还有一个函数`fToC`。其中常量boilingF是在包一级范围中声明的。因此，`boilingF`可在整个包对应的每个源文件中访问。如果一个函数没有返回值，那么返回值的类型可省略掉。

### 变量

`var`关键字可以创建一个特定类型的变量，随后给变量起一个名字，并且设置变量的初始值。

```go
var variableName Type = value
```

`Type`和`value`部分都可以省略。如果省略了类型信息，那么初始化表达式来推导变量的类型。这点和TS一样。如果省略掉初始化表达式，那么变量的初始化值为**零值**。数值类型对应的零值为`0`。布尔类型对应的零值为`false`。字符串类型对应的零值为空字符串。接口或引用类型（`slice`、指针、`map`、`chan`和函数）对应的零值为`nil`。数组或结构体等聚合类型每个元素或字段都是对应该类型的零值。

一个声明语句中也可以同时声明一组变量，或用一组初始化表达式声明并初始化一组变量。

```golang
package main

import (
 "fmt"
 "reflect"
)

var variableName string

// 声明多个变量
var i, j, k int
var b, f, s = true, 2.3, "four"

func main() {
 fmt.Println(reflect.TypeOf(variableName)) // string

 fmt.Println(reflect.TypeOf(i), reflect.TypeOf(j), reflect.TypeOf(k)) // int int int

 fmt.Println(reflect.TypeOf(b), reflect.TypeOf(f), reflect.TypeOf(s)) // bool float64 string

 fmt.Println(variableName) // ""
 fmt.Println(i, j, k)      // 0 0 0
}
```

为了方便演示，这里引入了`reflect`包用于查看变量的类型。

### 简短变量声明

在函数体内，有一种叫做**简短变量**的声明语句。可用于声明和初始化局部变量。以`variableName := value`表达式声明变量，变量的类型根据表达式自动推导。

```golang
func main() {
 a := 1
 b := 2
 c := 3
 fmt.Println(a, b, c)
}
```

**简短变量**语句简洁和灵活，被广泛用于声明局部变量和初始化。和`var`声明语句一样，简短变量声明也可以用来声明和初始化一组变量。

```golang
func main() {
 a, b, c := 1, 2, 3
 fmt.Println(a, b, c)
}
```

**简短变量**有个有趣的地方：在相同的词法作用域中对已经声明过的简短变量再次声明，那么简短变量声明语句会对这些声明过的变量进行赋值操作：

```golang
func main() {
 a, b := 1, 2
 c, a, b := 3, 5, 4
 fmt.Println(a, b, c)
}
```

这里的第一个语句中`a`、`b`变量。在第二个语句声明了`c`变量，然后对已经声明的`a`和`b`进行赋值操作。要注意的是，简短变量声明语句中必须至少要声明一个新的变量。否则会导致编译报错：

```golang
func main() {
  a, b := 1, 2
 a, b := 3, 4 // no new variables on left side of :=compiler
  fmt.Println(a, b)
}
```

遇到这种情况可以把第二个简短变量声明语句改成普通的多重赋值语句。

### 指针

一个指针的值是一个变量的地址。一个指针对应变量在内存中的存储位置。不是每个值都有一个内存地址，但每一个变量必定有对应的内存地址。通过指针，可以直接读或更新对应变量的值，而不需要知道该变量的名字（如果变量有名字的话）。

通过`& + variableName`表达式可以访问该变量的内存地址，并且会返回一个指向该变量的指针：

```golang
func main() {
 a := 1
 x := &a
 fmt.Println(x)  // 0xc00012a008
 fmt.Println(*x) // 1
 *x = 10
 fmt.Println(a) // 10
}
```

这里声明了`a`变量和`x`指针，`x`指针指向了变量`a`（或者说`x`指针保存了`a`变量的内存地址）。同时`*x`表达式对应`x`指针指向变量的值，`*x`表达式是读取指针指向的变量的值。这里为`int`类型的值。由于`*p`对应的是一个变量，所以该表达式也可以进行赋值操作，表示更新指针所指向的变量的值。

任何类型的指针的零值都为`nil`。如果`x`指向某个有效变量，那么`x != nil`为`true`。指针之间是可以进行相等测试的，只有它们指向同一个变量或全部是`nil`时才相等。

```golang
func main() {
 var a, b int
 fmt.Println(&a == &a, &a == &b, &a == nil)
 // true false false
}
```

在Go中，返回函数中的局部变量的地址是安全的。例如下面的代码，调用`f`函数时创建局部变量`c`，在局部变量地址被返回之后依然有效，因为指针`d`依然引用这个变量。

```golang
func main() {
 var d = f()
 fmt.Println(d)
}

func f() *int {
 c := 1
 return &c
}
```

每次调用`f`函数都会返回不同的结果：

```golang
fmt.Println(f() == f()) // false
```

指针包含了一个变量的地址，如果把指针当作参数去调用函数。将可以在函数中通过该指针更新变量的值。看下面的例子：

```golang
func main() {
 x := 1
 set(&x)
 fmt.Println(set(&x)) // 3
}

func set(a *int) int {
 *a++
 return *a
}
```

每次对变量取地址或复制指针，都是为原变量创建新的别名。例如，`*a`就是变量`x`的别名。指针特别有价值的地方在于可以不用名字访问一个变量。但这是一把双刃剑：要找到一个变量的所有访问者并不容易，我们必须知道变量全部的别名。不仅仅是指针会创建别名，很多其他引用类型也会创建别名。例如`slice`、`map`和`chan`，甚至结构体、数组和接口都会创建所引用变量的别名。

### new函数

还有一种创建变量的方法是调用内置的`new`函数。`new(T)`表达式会创建一个`T`类型的匿名变量，初始化为`T`类型的零值。然后返回变量地址，返回的指针类型为`*T`。

```golang
func main() {
 s := new(string)
 fmt.Println("s变量在这", *s)
 *s = "here"
 fmt.Println(*s) // here
}
```

用`new`创建变量和普通变量声明语句创建变量没啥区别。`new`函数更像是一种语法糖，而不是新的基础概念。

由于`new`只是一个预定义的函数，它不是一个关键字，因此我们可以把`new`名字重新定义为别的类型。看下面的例子：

```golang
func main() {
 fmt.Println(delta(10, 2)) // -2
}

func delta(old, new int) int {
 return new - old
}
```

由于`new`被定义为`int`类型的变量名，因此在`delta`函数内部是无法使用内置的`new`函数的。

### 变量的生命周期

变量的生命周期指的是在程序运行期间变量有效存在的时间段。对于在包一级声明的变量来说，它们的生命周期和整个程序的运行周期是一致的。而相比之下，局部变量的生命周期则是动态的：每次从创建一个新变量的声明语句开始，直到该变量不再被引用为止，变量的存储空间可能会被回收。函数的参数变量和返回值变量都是局部变量。它们在函数每次调用时创建。

### 类型

一个类型声明语句创建一个新的类型名称，和现有类型具有相同的底层结构。新命名的类型提供一个方法，用来分隔不同概念的类型，即使它们的底层类型相同也是不兼容的。

```golang
type typeName Type
```

类型声明语句一般出现在包一级中，创建一个类型名字的首字符为大写，在包外部也可以使用。

下面我们来看一下Go中的类型声明。

```golang
package main

import "fmt"

type Celsius float64
type Fahrenheit float64

const (
 absoluteZeroC Celsius = -273.15
 FreezingC     Celsius = 0
 BoilingC      Celsius = 100
)

func main() {
 fmt.Printf("%g\n", BoilingC-FreezingC)
 boilingF := CToF(BoilingC)
 fmt.Printf("%g\n", boilingF-CToF(FreezingC))
 fmt.Printf("%g\n", boilingF-FreezingC) // 编译错误：类型不匹配
}

func CToF(c Celsius) Fahrenheit {
 return Fahrenheit(c*9/5 + 32)
}

func FToC(f Fahrenheit) Celsius {
 return Celsius((f - 32) * 5 / 9)
}
```

这个例子中分别声明了两个不同温度单位的类型`Celsius`和`Fahrenheit`。虽然底层的类型都是`float64`，但它们不是相同的类型，所以它们不能使用算术表达式进行比较和合并。`Celsius(t)`和`Fahrenheit(t)`是类型转换。而不是函数调用。它们不会改变值和表达方式，但改变了显式意义。函数`CToF`和`FToC`用来在两种温度计量单位之间转换，返回不同的数值。

对于每个类型`T`，都有一个对应的类型转换操作`T(x)`把值`x`转换为类型`T`。如果两个类型具有相同的底层类型或两者都是指向相同底层类型变量的命名指针类型，那么两者都可以互相转换。类型转换不改变类型值的表达方式，仅仅改变类型。

通过`==`和`<`之类的比较操作符，命名类型的值可以和其相同类型的值或者底层类型相同的未命名类型的值相比较。但是不同命名类型的不能直接比较：

```golang
func main() {
 var c Celsius
 var f Fahrenheit
 fmt.Println(c == 0)
 fmt.Println(f >= 0)
 fmt.Println(c == f) // 编译错误 类型不匹配
 fmt.Println(c == Celsius(f))
}
```

这个例子中，类型转换`Celsius(f)`并没有改变参数的值，只是改变了类型。最后结果为`true`，因为`c`和`f`的值都是零值。

命名类型还可以为该类型的值定义新的行为。这些行为表示为一组关联到该类型的函数集合，称为类型的方法集。之后会讲到，这里看一下简单的用法。

```golang
func (c Celsius) String() string {
 return fmt.Sprintf("%g℃", c)
}
```

这里声明语句中，`Celsius`类型的参数`c`出现在函数名的前面。表示声明的是`Celsius`类型的一个名叫`String`的方法，该方法返回该类型对象`c`带着`°C`温度单位的字符串。

许多类型都会定义一个`String`方法，因为使用`fmt`包的打印方法时，会优先使用该类型对应的`String`方法返回的打印结果。

```golang
func main() {
 c := FToC(212.0)
 fmt.Println(c.String()) // 100℃
 fmt.Printf("%v\n", c) // 100℃
 fmt.Printf("%s\n", c) // 100℃
 fmt.Println(c) // 100℃
 fmt.Println(float64(c)) // 100
}
```

### 转义字符

像C语言或其他语言中的`printf`一样，函数`fmt.Printf`对一些表达式产生格式化输出。该函数的首个参数是一个格式字符串，指定后续参数被如何格式化。各个参数的格式取决于“转义字符”，形式为百分号后跟一个字母。举个例子，`%d`表示以十进制形式
打印一个整数。`%s`则表示把字符串变量的值展开。

`Printf`函数有超过10这样的转义字符，Go程序员称之为动词（verb）。下面的表格虽然远不是完整的规范，但展示了可用的很多特性：

```go
%d           十进制整数
%x, %o, %b   十六进制，八进制，二进制整数
%f, %g, %e   浮点数：3.141593 3.141592653589793 3.141593e+00
%t           布尔：true或false
%c           字符（rune）（Unicode码点）
%s           字符串
%q           带双引号的字符串"abc"或带单引号的字符'c'
%v           变量的自然形式（natural format）
%T           变量的类型
%%           字面上的百分号标识（无操作数）
```
