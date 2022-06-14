## 程序结构

### 关键字
下面列出Go中的关键字。只能在特定语法结构中使用。
```go
break   default   func    interface   select
case    defer     go      map         struct
chan    else      goto    package     switch
const   fallthrough   if    range     type
continue  for     import    return    var
```
除此之外，还有约30个预定义的名字。如`int`和`true`等等。
```go
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
```go
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
```go
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
```go
func main() {
	a := 1
	b := 2
	c := 3
	fmt.Println(a, b, c)
}
```
**简短变量**语句简洁和灵活，被广泛用于声明局部变量和初始化。和`var`声明语句一样，简短变量声明也可以用来声明和初始化一组变量。
```go
func main() {
	a, b, c := 1, 2, 3
	fmt.Println(a, b, c)
}
```
**简短变量**有个有趣的地方：在相同的词法作用域中对已经声明过的简短变量再次声明，那么简短变量声明语句会对这些声明过的变量进行赋值操作：
```go
func main() {
	a, b := 1, 2
	c, a, b := 3, 5, 4
	fmt.Println(a, b, c)
}
```
这里的第一个语句中`a`、`b`变量。在第二个语句声明了`c`变量，然后对已经声明的`a`和`b`进行赋值操作。要注意的是，简短变量声明语句中必须至少要声明一个新的变量。否则会导致编译报错：
```go
func main() {
  a, b := 1, 2
	a, b := 3, 4 // no new variables on left side of :=compiler
  fmt.Println(a, b)
}
```
遇到这种情况可以把第二个简短变量声明语句改成普通的多重赋值语句。

### 指针