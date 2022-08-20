## 复合数据类型

### 数组

数组是具有固定长度且拥有`0`个货多个相同数据类型元素的序列。由于数组的长度固定，所以在`go`里面很少直接使用。`slice`的长度可以增长和缩短，在很多场合下使用得跟过。在理解`slice`前，我们先来了解`go`中的数组。

数组中的每个元素是通过索引来访问的，索引从0到数组长度减1。`go`内置的函数`len`可以返回数组中的元素个数。

```go
package main

import "fmt"

func main() {
 var a [3]int // 3个整数的数组
 fmt.Println(a[0]) // 获取数组的第一个元素
 fmt.Println(a[len(a) - 1]) // 获取数组的最后一个元素，也就是a[2]

 // 获取数组的索引和元素
 for i, v := range a {
  fmt.Printf("%d %d\n", i, v)
 }

 // 获取数组中的元素
 for _, v := range a {
  fmt.Printf("%d\n", v)
 }
}
```

默认情况下，一个新数组中的元素初始值为元素类型的零值，对于数字来说，就是`0`。也可以使用**数组字面量**根据一组值来初始化一个数组。

```go
var r [3]int = [3]int{1, 2}
fmt.Println(r[2]) // 0
```

在数组字面量中，如果省略号`...`出现在数组长度的位置，那么数组的长度由初始化数组的元素个数决定。以上数组的`r`的定义可以简化成：

```go
r:=[...]int {1, 2, 3}
fmt.Printf("%T\n", r) // [3]int
```

数组的长度数组类型的一部分，所以`[3]int`和`[4]int`是两种不同的数组类型。数组的长度必须是常量表达式，也就是说，这个表达式的值在编译阶段就可以确定。

```go
r:= [3]int{1, 2, 3}
r:= [4]int{1, 2, 3, 4} // 编译错误： 不可以将[4]int 赋值给 [3]int
```

数组、`slice`、`map`和结构体的字面量语法都是相似的。以上的例子是按顺序给出一组值；也可以像下面这样给出一组值，这组值同样具有索引和索引对应的值：

```go
type Currency int
const (
  USD Currency = iota
  EUR
  GBP
  RMB
)
symbol := [...]string {USD: "$", EUR: "€", GBP: "￡", RMB: "￥"}

fmt.Println(RMB,symbol[RMB]) // 3 ￥
```

在这种情况下，索引可以按照任意顺序出现，并且有的时候还可以省略。和上面一样，没有指定值的索引位置的元素默认被赋予数组元素类型的零值。例如，

```go
r := [...]int{99 : -1}
```

定义了一个有100个元素的数组`r`，除了最后一个元素值是`-1`外，其他的元素值都为`0`。

如果一个数组的元素类型是可比较的，那么这个数组也是可比较的，这样就可以直接用`==`操作符来比较两个数组，比较的结果是两边元素的值是否完全相同。用`!=`来比较两个数组是否不同。

```go
a := [2]int{1, 2}
b := [...]int{1, 2}
c := [2]int{1, 3}
fmt.Println(a == b, a == c, b == c) // true false false

d := [3]int{1, 2}
fmt.Println(a == d) // 编译错误：无法比较 [2]int == [3]int
```

当调用一个函数时，每个传入的参数都会创建一个副本，然后复制给对应的函数变量，所以函数接受的是一个副本，而不是原始的参数。使用这种方式传递大的数组会变得很低效，并且在函数内部对数组的任何修改都只会影响副本，而不是原数组。这种情况下，go把数组和其他的类型都看成值传递。而在其他的语言中，数组是隐式地使用引用传递。

当然，也可以显式地传递一个数组的指针给函数，这样在函数内部对数组的任何修改都会反映到原始数组上面。下面来展示如何将一个数组`[32]byte`的元素清零：

```go
func zero(ptr *[32]byte)  {
 for _, v := range ptr {
  ptr[v] = 0
 }
}
```

数组字面量`[32]byte{}`可以生成一个拥有`32`个字节元素的数组。数组中每个元素的值都是字节类型的零值，即`0`。可以利用这一点来写另一个版本的数组清零程序：

```go
func zero(ptr *[32]byte)  {
 *ptr = [32]byte{}
}
```

使用数组指针是高效的，同时允许被调函数修改调用方数组中的元素，但是因为数组长度是固定的，所以数组本身是不可变的。例如上面的`zero`函数不能接受一个`[16]byte`这样的数组指针，同样，也无法为数组添加或者删除元素。由于数组的长度不可变的特性，除了在特殊情况之外，我们很少使用数组。

### slice

`slice`表示一个拥有相同类型元素的可变长度的序列。`slice`常常写成`[]T`，其中元素的类型为`T`；

`slice`是一种轻量级的数据结构，可以用来访问数组的元素，而这个数组称为`slice`的底层数组。`slice`有三个属性：指针、长度、和容量。指针指向`slice`元素对应的底层数组元素的地址，这个元素并不一定是数组的第一个元素。长度是指`slice`中的元素个数，不能超过`slice`的容量。容量的大小为`slice`的起始元素到底层数组的结尾位置的个数。

一个底层数组可以对应多个`slice`，这些`slice`可以引用数组的任何位置，引用的数组部分区间可以重叠。数组定义如下：

```go
func main() {
 months := []string{1: "january", 2: "february", 3: "march", 4: "april", 5: "may", 6: "june", 7: "july", 8: "august", 9: "september", 10: "october", 11: "november", 12: "december"}
}
```

`january`就是`months[1]`，`december`是`months[12]`。通常，数组中索引`0`的位置存放数组的第一个元素，由于月份总是从1开始，因此可以不设置索引为0的元素，那么它就是一个空字符串。

`slice`操作符`s[i:j]`（0 ≤ i ≤ j ≤ cap(s)）创建一个新的`slice`，这个`slice`引用了`s`找那个从`i`到`j-1`索引位置的所有元素，`s`既可以是数组或者指向数组的指针，也可以是`slice`。新`slice`的元素个数是`j-i`个。如果`i`索引位置被省略，那么将用`0`代替。如果`j`索引位置被省略，将会用`len(s)`代替。因此`slice months[1:13]`引用了所有有效月份，和`months[1:]`操作一样。`slice months[:]`表示引用了整个数组。下面来定义元素重叠的`slice`。

```go
Q2 := months[4:7]
summer := months[6:9]
fmt.Println(Q2)     // [april may june]
fmt.Println(summer) // [june july august]
```

元素`june`同时包含在两个`slice`钟。下面来输出两个`slice`的共同元素。

```go
for _, s := range summer {
  for _, q := range Q2 {
    if s == q {
      fmt.Println("重复元素为", s) // 重复元素为 june
    }
  }
}
```

如果`slice`的引用超过了被引用对象的容量，也就是`cap(s)`，就会导致宕机；但如果`slice`的引用超出了被引用对象的长度，即`len(s)`，最终`slice`会比原`slice`长。

```go
fmt.Println(summer[:20]) // panic: runtime error: slice bounds out of range [:20] with capacity 7
endlessSummer := summer[:6]
fmt.Println(endlessSummer) // [june july august september october november]
```

另外，字符串的切片操作和`[]byte`字节类型切片的切片操作是相似的，都可以写成`x[m:n]`，并且返回一个原始字节序列的子序列，底层都是共享之前的底层数组，所以这种操作都是常量时间复杂度。`x[m:n]`切片操作对于子字符串则生成一个新字符串，如果`x`是`[]byte`，那么返回一个新的`[]byte`。

因为`slice`包含了指向数组元素的指针，所以把一个`slice`传递给函数的时候，可以在函数内部修改底层数组的元。换句话说，复制一个`slice`只是对底层数组创建了一个新的`slice`别名。以下函数`reverse`在原内存空间把`[]int`类型的`slice`反转，而且它可以用于任意长度的`slice`。

```go
func reverse(s []int) {
 for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
  s[i], s[j] = s[j], s[i]
 }
}

a := []int{0, 1, 2, 3, 4, 5}
reverse(a[:])
fmt.Println(a) // [5 4 3 2 1 0]
```

和数组不同的是，`slice`无法做比较，因此不能用`==`来校验两个`slice`是否相等。标准库里面提供了高度优化的函数`bytes.Equal`来比较两个字节`slice`（`[]byte`）。但是对其他类型的`slice`，必须自己写函数来比较。

```go
func equal(x, y []string) bool {
 if len(x) != len(y) {
  return false
 }

 for i := range x {
  if x[i] != y[i] {
   return false
  }
 }
 return true
}
```

`slice`不可以直接用`==`做比较有两个原因。首先，和数组元素不同，`slice`的元素是非直接的，有可能`slice`可以包含自身。虽然有办法处理这种情况，但是没有一种方法是简单、高效、直观的。其次，因为`slice`的元素不是直接的，所以底层数组元素改变，同一个`slice`在不同的时间会拥有不同的元素。由于散列表（`map`类型）仅对元素的键做浅拷贝，这就要求散列表里面键在散列表的整个生命周期内必须保持不变。因此`slice`需要深度做比较，所以就不能用`slice`作`map`的键。对于引用类型，例如指针和通道，`==`相等测试可以判断两个是否是引用相同的对象。一个针对`slice`的浅相等测试的`==`操作可能是一定用处的，也能临时解决`map`类型的`key`问题。但`slice`和数组不同的相对测试行为会让人困惑。因此，安全的做法是直接禁止`slice`之间的比较操作。

`slice`唯一允许的比较操作是和`nil`做比较。例如：

```go
if summer == nil {
  //....
}
```

`slice`类型的零值是`nil`。值为`nil`的`slice`没有对应的底层数组。值为`nil`的`slice`长度和容量都为零，但是也有非`nil`的`slice`长度和容量是零，例如`[]int{}`或`make([]int, 3)[3:]`。对于任何类型，如果它们的值可以是`nil`，那么这个类型的`nil`值可以使用一种转换表达式，例如`[]int(nil)`。

```go
var s []int
fmt.Println(len(s), s == nil) // 0 true
s = nil
fmt.Println(len(s) == 0, s == nil) // true true
s = []int(nil)
fmt.Println(len(s) == 0, s == nil) // true true
s = []int{}
fmt.Println(len(s) == 0, s != nil) // true true
```

如果想检查一个`slice`是否为空，使用`len(s) == 0`，而不是`s == nil`，因为`s != nil`的情况下，`slice`也有可能为空。

内置函数`make`可以创建一个具有指定元素类型、长度和容量的`slice`。其中容量参数可以省略，这种情况下，`slice`的长度和容量相等。

```go
make([]T, len)
make([]T, len, cap) // 和make([]T, cap)[:len]功能相同
```
在底层，`make`创建了一个无名数组并返回了它的一个`slice`；这个数组只能通过这个`slice`访问。在第一种语句中，所返回的`slice`引用了整个数组。在第二种语句中，`slice`只引用了数组的前`len`个元素，但是它的容量是数组的长度，这为未来的`slice`元素留出空间。
