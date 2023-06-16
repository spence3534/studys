## 复合数据类型

### 数组

数组是具有固定长度且拥有`0`个或多个相同数据类型元素的序列。由于数组的长度固定，所以在`go`里面很少直接使用。`slice`的长度可以增长和缩短，在很多场合下使用得更多。在理解`slice`前，我们先来了解`go`中的数组。

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

元素`june`同时包含在两个`slice`中。下面来输出两个`slice`的共同元素。

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

因为`slice`包含了指向数组元素的指针，所以把一个`slice`传递给函数的时候，可以在函数内部修改底层数组的元素。换句话说，复制一个`slice`只是对底层数组创建了一个新的`slice`别名。以下函数`reverse`在原内存空间把`[]int`类型的`slice`反转，而且它可以用于任意长度的`slice`。

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

在底层，`make`创建了一个无名数组并返回了它的一个`slice`；这个数组只能通过这个`slice`访问。在第一种语句中，所返回的`slice`引用了整个数组。在第二种语句中，`slice`只引用了数组的前`len`个元素，它的容量是数组的长度，这为未来的`slice`元素留出空间。

### append函数

Go中内置的`append`函数用来把元素追加到`slice`的尾部（效果类似js数组的push方法）。

```go
func main() {
  var runes []rune
  for _, v := range "你好，图图" {
    runes = append(runes, v)
  }
  fmt.Printf("%q\n", runes) // ['你' '好' '，' '图' '图']
}
```

上面演示了怎样用`append`来给一个`rune`类型的`slice`添加元素。

`append`函数可以同时给`slice`添加多个元素，甚至可以添加另一个`slice`中的所有元素。

```go
func main() {
 var x []int
 x = append(x, 1)
 x = append(x, 1, 2, 3)
 x = append(x, 1, 2, 3, 4, 5, 6)
 x = append(x, x...)

 fmt.Println(x) // [1 1 2 3 1 2 3 4 5 6 1 1 2 3 1 2 3 4 5 6]
}
```

这里的`...`表示把`slice`打散进行传递。还有一种用法类似`js`的剩余参数。

### slice 就地修改

下面来实现一个给定的一个字符串列表中去除空字符串并返回一个新的`slice`函数。

```go
func nonempty(strings []string) []string {
 i := 0
 for _, s := range strings {
  if s != "" {
   strings[i] = s
   i++
  }
 }
 return strings[:i]
}
```

`nonempty`函数传入的`slice`和返回的`slice`都是拥有相同的底层数组，这样就避免了在函数中重新分配一个数组。这种情况下，底层数组的元素只是部分被修改。

```go
func main() {
 txt := []string{"1", "2", "", "3", "", "4"}
 fmt.Printf("%q\n", nonempty(txt)) // ["1" "2" "3" "4"]
 fmt.Printf("%q\n", txt)           // ["1" "2" "3" "4" "" "4"]
}
```

也可以用`append`函数来实现:

```go
func anotherNonempty(strings []string) []string {
 out := strings[:0]
 for _, v := range strings {
  if v != "" {
   out = append(out, v)
  }
 }
 return out
}
```

`slice`可以用来实现一个栈。声明一个空的`slice`元素`stack`，用刚才学的`append`函数向`slice`末尾添加元素。

```go
func main() {
 var stack []string

 // 向末尾添加元素
 stack = append(stack, "1", "2", "3", "4")

 // 获取栈顶的元素，也就是最后一个元素
 top := stack[len(stack)-1]
 fmt.Print(top) // 4

 // 删除栈顶的元素
 stack = stack[:len(stack)-1]
 fmt.Print("\n", stack)
}
```

为了从`slice`的中间移除一个元素，并保留剩余元素的顺序，我们使用`copy`函数来把高位索引的元素向前移动来覆盖被移除元素所在的位置。

```go
func main() {
 s := []int{5, 6, 7, 8, 9}
 fmt.Println(remove(s, 2)) // [5 6 8 9]
}

func remove(slice []int, i int) []int {
 copy(slice[i:], slice[i+1:])
 return slice[:len(slice)-1]
}
```

如果不需要保留`slice`中剩余元素的顺序，可以简单地把`slice`的最后一个元素赋值给被移除元素所在索引位置:

```go
func main() {
 s := []int{5, 6, 7, 8, 9}
 fmt.Println(remove(s, 2)) // [5 6 9 8]
}

func remove(slice []int, i int) []int {
 slice[i] = slice[len(slice)-1]
 return slice[:len(slice)-1]
}
```

### map

`map`散列表是一个拥有键值对元素的无序集合。在这个集合里，键的值是唯一的，键对应的值可以通过键来获取、更新或删除。在Go中，`map`是散列表的引用，`map`的类型是`map[K]V`，其中`K`和`V`是字典的键和值对应的数据类型。`map`中所有的键都拥有相同的数据类型，同时所有的值也拥有相同的类型，但是键的类型和值的类型不一定相同。键的类型`K`，必须是可以通过操作符`==`来进行比较的数据类型，所以`map`可以检测某一个键是否存在。

以下是创建`map`的几种方法:

```go
package main

import "fmt"

func main() {
  // 1. 使用make函数创建一个map
  names := make(map[string]int)
  fmt.Println(names) // map[]

  //2. 使用map字面量创建一个带有初始化键值对元素的字典
  ages := map[string]int{
    "图图": 25,
    "小美": 23,
  }

  // 等价于
  names := make(map[string]int)
  ages["图图"] = 25
  ages["小美"] = 23
  fmt.Println(ages) // map[图图:25 小梅:23]

  //3. 创建一个空map
  heights := map[string]int{}
}
```

访问`map`中的元素通过下标方式获取。

```go
fmt.Println(ages["图图"]) //25
```

使用内置函数`delete`根据键来删除字典中的元素。

```go
delete(ages, "图图")
fmt.Println(ages) // map[小美:23]
```

即使键不存在`map`中，这里的删除操作也是可行的。`map`使用键来查找元素，如果对应的元素不存在，就会返回值类型的零值。

```go
fmt.Println(ages["图爸爸"]) // 0
```

这里我们从`ages`字典中获取`图爸爸`的键，由于这个键并不存在`ages`中。所以返回了`int`类型的零值`0`。

注意，`map`元素不是一个变量，不能获取它地址，例如这样:

```go
_ = &ages["图图"] // 无效操作：无法获取 ages[“图图”] 的地址（int 类型的映射索引表达式）
```

无法获取`map`元素的地址是因为`map`的增长会导致已有的元素会被重新分布到新的存储位置，这样就导致获取地址失败。

用`for`循环（结合`range`关键字）遍历`map`中所有的键和对应的值。

```go
func main() {
  ages := map[string]int{
    "小美": 23,
    "图图": 25,
  }
  for name, age := range ages {
    fmt.Println(name, age)
    // 小美 23
    // 图图 25
  }
}
```

`map`中元素的迭代顺序是不固定的，如果需要按照某种顺序来遍历`map`中的元素，必须显式地来给键排序。比如，键是字符串类型，可以使用`sort`包中的`Strings`函数来进行键的排序。

```go
import (
 "fmt"
 "sort"
)
func main() {
  ages := map[string]int{
    "小美": 23,
    "图图": 25,
  }
  var names []string
  for name := range ages {
    names = append(names, name)
  }
  sort.Strings(names)
  for _, name := range names {
    fmt.Printf("%s\t%d\n", name, ages[name])
    // 图图 25
    // 小美 23
  }
}
```

在这个例子，第一个`for`循环中，我们只需要`map ages`中的所有键，所以忽略掉第二个循环变量。在第二个循环中，使用`slice names`中的元素值，所以这里使用空白标识符`_`来忽略第一个循环变量，也就是元素的索引。

`map`类型的零值为`nil`，也就是没有引用任何散列表。

```go
func main() {
  var ages map[string]int
  fmt.Println(ages == nil)    // true
  fmt.Println(len(ages) == 0) // true
}
```

通常大部分`map`的操作都能安全地在`map`的零值`nil`上执行，包括查找元素，删除元素，获取`map`元素的个数，执行`range`循环，因为这跟空`map`的行为一致。但如果向零值`map`设置元素会导致错误:

```go
func main() {
  var ages map[string]int
  ages["图图"] = 25 // panic: assignment to entry in nil map
}
```

所以设置元素之前，必须得初始化`map`。像下面这样:

```go
var ages = map[string]int{}
ages["图图"] = 25
fmt.Println(ages) // map[图图:25]
```

通过键`key`访问`map`中的元素总会有值。如果键`key`在`map`中，那么会得到`key`对应的值。如果键`key`不在`map`中，则会得到`map`值的类型的零值。有时候需要知道一个元素是否在`map`中。例如，元素类型是数值类型，而你需要区分一个不存在的元素或者是这个元素的值为`0`，可以像下面这样调试:

```go
ages := map[string]int{
  "图图": 25,
}
age, ok := ages["图爸爸"]
if !ok {
  fmt.Print("不存在", age)
}
```

还可以把这两条语句合并为一条语句，像下面这样:

```go
if age, ok := ages["图爸爸"]; !ok {
  fmt.Print("不存在", age, ok) // 不存在0 false
}
```

使用下标的方法来访问`map`的元素会产生两个值，第一个是键的值，第二个是布尔值，表示这个元素是否存在。

`map`之间也是不能用来做比较的，只能和`nil`比较。要判断两个`map`中是否有相同的键和值，需要用循环来实现。

```go
func main() {
  ages := map[string]int{
    "图图": 25,
    "小美": 23,
  }

  anotherAges := map[string]int{
    "图图2": 23,
    "小美":  23,
  }

  threeAges := map[string]int{
    "图图": 25,
    "小美": 23,
  }
  fmt.Println(equal(ages, anotherAges)) // false
  fmt.Println(equal(ages, threeAges))   // true
}

func equal(x, y map[string]int) bool {
  if len(x) != len(y) {
    return false
  }

  for k, xv := range x {
    if yv, ok := y[k]; !ok || yv != xv {
    return false
    }
  }
  return true
}
```

可以看到例子中如何使用`!ok`来区分“有没有这个元素”和“有这个元素但值为零”的情况。如果只是用`xv != y[k]`来判断，下面的调用会产生错误的结果：

```go
fmt.Println(equal(map[string]int{"A": 0}, map[string]int{"B": 42})) // true
```

Go中没有提供`Set`类型，但可以用`map`来实现这个功能。因为`map`的键是唯一的。

有时候，需要一个`map`它的键为`slice`时（`slice`是不能比较的），而`map`的键必须是可比较的。所以这个功能无法实现。但可以分两步来做：先定义一个函数`k`把每个键都映射到字符串，当`x`和`y`相等时，`k(x) == k(y)`才会成立。然后，创建一个`map`，`map`的键是字符串类型，在每个键元素被访问的时候，调用这个`k`函数。

```go
func main() {
  var m = make(map[string]int)

  var k = func(list []string) string {
    return fmt.Sprintf("%q", list)
  }

  var Add = func(list []string) {
    m[k(list)]++
  }

  var Count = func(list []string) int {
    return m[k(list)]
  }
}
```

这个例子中，原理就是使用`fmt.Sprintf`来将`slice`转换成`map`键的字符串，使用`%q`来格式化`slice`并记录每个字符串。这个方法不仅使用于`slice`，可以用于任何不可直接比较的键类型。

`map`的值类型可以是复合数据类型，例如`map`或`slice`。下面的代码中，变量`graph`的键类型是`string`类型；值类型是`map`类型`map[string]bool`，表示一个字符串集合。

```go
var graph = make(map[string]map[string]bool)

func addEdge(from, to string) {
  edges := graph[from]
  if edges == nil {
    edges = make(map[string]bool)
    graph[from] = edges
  }
  edges[to] = true
}

func hasEdge(from, to string) bool {
  return graph[from][to]
}
```

`addEdge`函数延迟初始化`map`方法，也就是说在每个值第一次作为`key`时才会初始化。`addEdge`函数显示了如何让`map`为零值下也能正常工作。即使`from`和`to`都不存在，`graph[from][to]`始终返回一个值。

### 结构体

结构体是把零个或者多个任意类型的命名变量组合在一起的聚合数据类型。每个变量都叫做结构体的成员。结构体使用的典型的例子是员工信息记录，记录中有唯一`ID`、姓名、地址、出生日期、职位、薪水、直属领导等信息。所有的员工信息成员都作为一个整体组合在一个结构体中，可以复制一个结构体。将它传递给函数，作为函数的返回值，将结构体存储在数组里等等。

这里定义了一个叫`Employee`的结构体和一个结构体变量`dilbert`。

```go
package main

import "time"

type Employee struct {
  ID        int
  Name      string
  Address   string
  DoB       time.Time
  Position  string
  Salary    int
  ManagerID int
}

var dilbert Employee
```

`dilbert`的每个成员都可以通过点号`.`来访问，就像JS访问对象属性一样`dilbert.Name`这样。由于`dilbert`是一个变量，它的所有成员都是变量，那么我们可以给这些成员进行赋值操作。

```go
func main() {
  dilbert.Salary += 15000 // 表现很好，加薪！

  fmt.Print(dilbert.Salary) // 15000

  // 获取成员变量的地址，通过指针来访问它
  position := &dilbert.Position
  *position = "图图" + *position
  fmt.Println(dilbert.Position) // 图图
}
```

点号也可以用在结构体指针上：

```go
func main() {
  var employeeOfTheMonth *Employee = &dilbert
  employeeOfTheMonth.Position += "( proactive team player )"
  fmt.Println(employeeOfTheMonth.Position) // ( proactive team player )

  // 中间那句等于
  (*employeeOfTheMonth).Position += "( proactive team player )"
}
```

函数`EmployeeByID`通过给定参数ID返回一个指向`Employee`结构体的指针。可以用点号来访问它的成员变量：

```go
func main() {
  fmt.Println(EmployeeByID(dilbert.ManagerID).Position)

  id := dilbert.ID
  EmployeeByID(id).Salary = 0
}

func EmployeeByID(id int) *Employee {
  return &dilbert
}
```

`main`函数中的最后一条语句更新了函数`EmployeeByID`返回的指针指向的结构体`Employee`。如果函数`EmployeeByID`的返回类型是`Employee`而不是`*Employee`的话，那么代码无法通过编译的。由于赋值表达式的左边无法识别出一个变量。

结构体的成员变量一般是一行写一个，变量名在类型的前面，相同的类型的变量可以写在一行上，就像下面这样。

```go
type AnotherEmployee struct {
  ID            int
  Name, Address string
  DoB           time.Time
  Position      string
  Salary        int
  ManagerID     int
}
```

结构成员的顺序也很重要。如果把`Position`和`Name、Address`合在一起或者调整`Name`和`Address`的顺序，那么就是定义了一个不同的结构体类型。一般只会把相关成员变量写到一起。

如果一个结构体的变量名以大写字母开头的话，这个变量就是可导出的，这是Go最主要的访问控制机制。一个结构体可以同时包含可导出和不可导出的变量。

结构体类型的定义一般都是比较长的，因为每个变量占一行。虽然每次都可以重新定义整个结构体类型，但重复编写就很麻烦，所以完整的结构体通常只会在类型声明语句的地方出现。比如`Employee`。

一个名为`S`的结构体类型是不能再包含`S`结构体类型的成员变量的（也就是聚合类型不能包含自己）。但`S`中可以定义一个`S`的指针类型，也就是`*S`，这样我们可以创建一些递归数据结构。如链表和树。

```go
func Sort(values []int) {
  var root *tree
  for _, v := range values {
    root = add(root, v)
  }
  appendValues(values[:0], root)
}

func appendValues(values []int, t *tree) []int {
  if t != nil {
    values = appendValues(values, t.left)
    values = appendValues(values, t.value)
    values = appendValues(values, t.right)
  }
  return values
}

func add(t *tree, value int) *tree {
  if t == nil {
    t = new(tree)
    t.value = value
    return t
  }

  if value < t.value {
    t.left = add(t.left, value)
  } else {
    t.right = add(t.right, value)
  }
  return t
}
```

结构体的零值是由结构体成员的零值组成。没有任何成员变量的结构体叫做空结构体，写作`struct{}`。它没有长度，也不带任何信息，但有时候会很有用。有些开发人员用`map`模拟`Set`数据结构时，用它来当作`map`中的布尔值类型的`value`。只是强调只有`key`有用，但这种方式节约的内存很少且语法复杂，所以一般不要这么干。

```go
func Seen() {
  seen := make(map[string]struct{})
  // ....
  if _, ok := seen[s]; !ok {
    seen[s] = struct{}{}
  }
}
```

#### 结构体字面量

结构体类型的值可以通过结构体字面量来设置的，结构体字面量可以指定每个成员的值。

```go
type Point struct {
 X, Y int
}

p := Point{ 100, 50 }
```

有两种格式的结构体字面量。这里是第一种，要求按照正确的顺序，给每个成员变量指定一个值。这会导致开发和阅读代码的人必须记住每个成员变量的类型和顺序，还有在之后结构体成员变量扩充或者重新排列的时候代码维护性就很差。这种方式一般用来定义结构体类型的包中或者小结构体中，比如`image.Point{x, y}`或者`color.RGBA{red, green, blue, alpha}`。

用得多的还是第二种方式，通过指定部分或全部成员变量的名称和值来初始化结构体变量。像下面这样:

```go
type Person struct {
  name        string
  age, height int
}

func main() {
  p := Person{name: "图图", height: 175}
  fmt.Printf("%#v\n", p) // {name:"图图", age:0, height:175}
}
```

如果在这种初始化方式中某个成员变量没有指定，那它的值就是该成员变量类型的零值。指定了成员变量的名字，她们的顺序是无所谓的啦。

这两种初始化方式不能混一起使用，另外也无法使用第一种初始化方式来绕过不可导出变量无法在其他包中使用的规则。

```go
package p
type T struct { a, b int }

package q
import "p"
var _ = p.T{ a: 1, b: 2 }
var _ = p.T{1, 2}
```

这里的最后一行代码没有显示地提到不可导出变量，但它们被隐式地引用了，所以这也是不允许的。

结构体类型的值可以作为参数传递给函数或者作为函数的返回值。看下面的例子：

```go
type Point struct{ X, Y int }

func Scale(p Point, factor int) Point {
  return Point{p.X * factor, p.Y * factor}
}

func main() {
  fmt.Println(Scale(Point{100, 50}, 5)) // {500 250}
}
```

如果是比较大的结构体通常都是用结构体指针的方式传递给函数或从函数中返回。

```go
type Employee struct {
  ID        int
  Name      string
  Address   string
  DoB       time.Time
  Position  string
  Salary    int
  ManagerID int
}

func Bonus(e *Employee, percent int) int {
  return (e.Salary * percent) / 100
}

func main() {
  fmt.Println(Bonus(&Employee{Salary: 10000}, 10)) // 1000
}
```

这种方式在函数需要修改结构体内容的时候也是必需的，在Go这种按值调用的语言中，调用的函数接收到的是实参的一个副本，并不是实参的引用。

```go
fmt.Println(AwardAnnualRaise(&Employee{Salary: 3000}).Salary) // 3150

func AwardAnnualRaise(e *Employee) *Employee {
  e.Salary = e.Salary * 105 / 100
  return e
}
```

一般结构体都通过指针的方式使用，那么我们可以使用一种简单的方式来创建、初始化一个`struct`类型的变量并获取它的地址:

```go
type Point struct{ X, Y int }

func main() {
  pp := &Point{1, 2}
  fmt.Println(pp)

  //等价于
  yy := new(Point)
  *yy = Point{1, 2}
  fmt.Println(yy)
}
```

以`&Point{1,2}`这种方式可以直接使用在表达式中，如函数调用。

#### 结构体比较

如果结构体所有成员变量都可以比较，那么这个结构体是可比较的，两个结构体的比较可以用`==`或`!=`。其中`==`操作符按照顺序比较两个结构体变量成员，看下面的例子。

```go
type Point struct{ X, Y int }

func main() {
  p := Point{100, 50}
  q := Point{100, 50}
  fmt.Println(p.X == q.X && p.Y == q.Y)
  fmt.Println(p == q)
}
```

和其他可比较的类型一样，可比较的结构体类型都可以作为`map`的键类型。

```go
func main() {
  hits := make(map[Address]int)
  hits[Address{"baidu.com", 433}]++
  fmt.Println(hits) // map[{baidu.com 433}:1]
}

type Address struct {
  hostname string
  port     int
}
```

#### 结构体嵌套和匿名成员

Go具有不同寻常的结构体嵌套机制，这个机制可以把一个命名结构体作为另一个结构体类型的匿名成员使用；并提供了方便的语法，使用简单的表达式（比如`x.f`）就可以代替连续的成员（比如`x.d.e.f`）。

比如，有个包含多个人信息的`Perons`结构体，里面有图图、小美。下面来定义这些人的类型。

```go
type Tutu struct {
  name, sex string
  age    int
}

type XiaoMei struct {
  name, sex   string
  age, height int
}
```

`Tutu`类型定义了人名`name`、性别`sex`、年龄`age`，`XiaoMei`类型拥有`Tutu`类型的变量，另外还多了个`height`变量。创建一个`XiaoMei`对象:

```go
func main() {
  var x XiaoMei
  x.name = "小美"
  x.sex = "女"
  x.age = 23
  x.height = 170
  fmt.Println(x) // {小美 女 23 170}
}
```

可以看到，`Tutu`和`XiaoMei`结构体中有部分变量是相同的，所以我们可以把相同部分抽离成另一个结构体。

```go
type Person struct {
  name, sex string
}
type Tutu struct {
  person Person
  age    int
}

type XiaoMei struct {
  personInfo Person
  age        int
  height     int
}

func main() {
  var m XiaoMei
  m.personInfo.name = "小美"
  m.personInfo.sex = "女"
  m.age = 23
  m.height = 170
}
```

这样看就清晰很多了，但是访问`XiaoMei`的成员就变得麻烦了。

Go是允许我们定义不带名称的结构体成员的，只要指定类型就好；这种结构体成员称为匿名成员。这个结构体成员的类型必须是一个命名类型或者指向命名类型的指针。看下面的例子:

```go
type Person struct {
 name, sex string
}

type Tutu struct {
 Person
 age int
}

type XiaoMei struct {
 Tutu
 height int
}
```

`Tutu`和`XiaoMei`都有一个匿名成员。这里`Person`被嵌套在`Tutu`中，而`Tutu`又被嵌套在`XiaoMei`中。

正是因为有了这种结构体嵌套的功能，我们才能直接访问到需要的变量而不是指定一长串中间变量：

```go
func main() {
  var m XiaoMei
  m.name = "小美" // 等价于m.personInfo.name = "小美"
  m.sex = "女" // 等价于m.personInfo.sex = "女"
  m.age = 23
  m.height = 170
}
```

使用“匿名成员”的说法多少有点不合适。上面的结构体成员`Person`和`Tutu`都是有名字的，对应类型的名字，只是这些名字在点号访问变量时是可选的。当访问需要的变量时可以省略中间所有的匿名成员。

遗憾的是，结构体字面量并没有快捷方式来初始化结构体，所以下面的语法是会报错的:

```go
func main() {
  var m XiaoMei
  m = XiaoMei{"小美", "女", 23, 170}                         // 报错
  m = XiaoMei{name: "小美", sex: "女", age: 23, height: 170} // 报错
}
```

结构体字面量必须遵循形态类型的定义，所以我们用下面的两种方式来初始化，这两种方式是等价的:

```go
type Person struct {
  name, sex string
}
type Tutu struct {
  Person
  age int
}

type XiaoMei struct {
  Tutu
  height int
}

func main() {
  var m XiaoMei
  m = XiaoMei{Tutu{Person{"小美", "女"}, 23}, 170}
  fmt.Printf("%#v\n", m) // {Tutu:main.Tutu{Person:main.Person{name:"小美", sex:"女"}, age:23}, height:170}

  m = XiaoMei{
    Tutu: Tutu{
    Person: Person{
      name: "图图",
      sex:  "男",
    },
    age: 25,
    },
    height: 175,
  }
  fmt.Printf("%#v\n", m) // {Tutu:main.Tutu{Person:main.Person{name:"图图", sex:"男"}, age:25}, height:175}

  m.age = 24
  fmt.Printf("%#v\n", m) // {Tutu:main.Tutu{Person:main.Person{name:"图图", sex:"男"}, age:24}, height:175}
}
```

“匿名成员”拥有隐式的名字，所以不能在一个结构体中定义两个相同类型的匿名成员，不然会冲突。匿名成员的名字是由它们的类型决定的，它们的可导出性也是由它们的类型所决定。上面的例子中，`Person`和`Tutu`两个匿名成员是可导出的。即使这两个结构体不可导出的（`person`和`tutu`），仍然可以使用快捷方式:

```go
m.name = "牛爷爷" // 等价于m.tutu.person.x = "牛爷爷"
```

但是注释中那种显式指定中间匿名成员的方式在声明`person`和`tutu`的包之外是不允许的，因为它们不可导出的。

### JSON

Go通过标准库`encoding/json`、`encoding.xml`、`encoding/asn1`和其他的库对这些格式的编码和解码提供了友好的支持，这些库都拥有相同的`API`。这里我们用的最多的是`encoding/json`。

有这么一个程序需要收集电影的观看次数并提供推荐。这个程序的`Movie`类型和典型的元素列表都在下面提供了。

```go
type Movie struct {
  Title  string
  Year   int  `json:"released"`
  Color  bool `json:"color, omitemply"`
  Actors []string
}

var movies = []Movie{
  {Title: "casblanca", Year: 1942, Color: false, Actors: []string{"Humphery Bogart", "Ingrid Bergman"}},
  {Title: "Cool Hand Luke", Year: 1967, Color: true, Actors: []string{"Paul Newman"}},
  {Title: "Bullitt", Year: 1968, Color: true, Actors: []string{"Steve McQueen", "Jacqueline Bisset"}},
}
```

这种类型的数据结构体最合适JSON，无论是从Go对象转为JSON还是从JSON转换为Go对象都很容易，把Go的数据结构（比如movies）转为JSON称为marshal（整理、排列、编列）。marshal是通过`json.Marshal`实现的：

```go
func main() {
  data, err := json.Marshal(movies)
  if err != nil {
  log.Fatalf("json marshaling failed: %s", err)
  }
  fmt.Printf("%s\n", data)

}
```

`Marshal`生成一个字节`slice`，包含了一个很长的字符串。把生成的结果堆在一起。

```json
[{"Title":"casblanca","released":1942,"color":false,"Actors":["Humphery Bogart","Ingrid Bergman"]},{"Title":"Cool Hand Luke","released":1967,"color":true,"Actors":["Paul Newman"]},{"Title":"Bullitt","released":1968,"color":true,"Actors":["Steve McQueen","Jacqueline Bisset"]}]
```

这种紧凑的格式让人难以阅读。为了方便阅读，有一个`json.MarshalIndent`方法可以输出整齐格式化后的结果。这个函数有两个参数。一个是定义每行输出的前缀字符串，另一个是定义缩进的字符串。通常两个缩进就好。

```go
func main() {
  data, err := json.MarshalIndent(movies, "", "  ")
  if err != nil {
    log.Fatalf("json marshaling failed: %s", err)
  }
  fmt.Printf("%s\n", data)
  // [
  //   {
  //     "Title": "casblanca",
  //     "released": 1942,
  //     "color": false,
  //     "Actors": [
  //       "Humphery Bogart",
  //       "Ingrid Bergman"
  //     ]
  //   },
  //   {
  //     "Title": "Cool Hand Luke",
  //     "released": 1967,
  //     "color": true,
  //     "Actors": [
  //       "Paul Newman"
  //     ]
  //   },
  //   {
  //     "Title": "Bullitt",
  //     "released": 1968,
  //     "color": true,
  //     "Actors": [
  //       "Steve McQueen",
  //       "Jacqueline Bisset"
  //     ]
  //   }
  // ]
}
```

`marshal`使用Go结构体成员的名称作为JSON对象里面字段的名称。只有可导出的成员可以转换为JSON字段，这就是为什么我们把Go结构体中的所有成员首字母都定义为大写。

上面的结构体成员`Year`对应地转换为`released`，另外`Color`转换为`color`。这是通过 **成员标签定义** 实现的。成员标签定义是结构体成员在编译期间关联的一些元信息。

成员标签定义可以是任意字符串，但按照习惯，是由一串由空格分开的标签键值对`key: "value"`组成的；因为标签的值使用双引号括起来，所以一般标签都是原生的字符串字面量。标签值的第一部分指定了Go结构体成员对应JSON中字段的名字。成员的标签通常是这样用。比如`total_count`对应Go里面的`TotalCount`。`Color`的标签还有一个额外的选项`omitempty`，它表示如果这个成员的值是零值或者为空，那么这个成员不会出现在JSON中。所以就上面的JSON中没有`Color`字段。

`marshal`的逆操作是把JSON字符串解码为Go数据结构。通过调用`json.unmarshal`来实现。下面的代码把上面的JSON数据转成结构体`slice`，该结构体只有一个成员`Title`。通过合理定义Go的数据结构，可以选择把哪部分JSON数据解码到结构体对象中，哪些数据可以不要。当函数`unmarshal`调用完后，它将填充结构体`slice`中`Title`的值，其他字段全部丢弃。

```go
func main() {
  data, err := json.MarshalIndent(movies, "", "  ")
  fmt.Print(err)
  var titles []struct{ Title string }
  if err := json.Unmarshal(data, &titles); err != nil {
    log.Fatalf("json unmarshaling failed: %s", err)
  }
  fmt.Println(titles) // [{casblanca} {Cool Hand Luke} {Bullitt}]
}
```

很多web服务器都提供了JSON接口，通过发送HTTP请求来获取想要的JSON信息。我们通过GitHub提供的issue跟踪接口来演示一下。首先，定义需要的类型和常量:

```go
const IssuesURL = "https://api.github.com/search/issues"

type IssuesSearchResult struct {
  TotalCount int `json: "total_count"`
  Items      []*Issue
}

type Issue struct {
  Number    int
  HTMLURL   string `json: html_url`
  Title     string
  State     string
  User      *User
  CreatedAt time.Time `json: "create_at"`
  Body      string    // markdown格式
}

type User struct {
  Login   string
  HTMLURL string `json: html_url`
}
```

这里和前面一样，对应的JSON字段名称不是首字母大写，结构体成员名称也必须首字母大写。由于在`unmarshal`阶段，JSON字段的名称关联到Go结构体成员的名称是忽略大小写的，因此只要在JSON中有下划线而Go中没有下划线的时候使用一下成员标签定义。这里只是选择性地对JSON中的字段解码，因为GitHub返回的信息有点多。

`SearchIssues`函数发送HTTP请求并将回复解析成JSON。由于用户的查询请求参数中可能存在一些字符，这些字符在URL中是特殊字符，比如`?`或`&`，因此用`url.QueryEscape`函数来对查询中的特殊字符进行转义。

```go
func SearchIssues(terms []string) (*IssuesSearchResult, error) {
  q := url.QueryEscape(strings.Join(terms, " "))
  resp, err := http.Get(IssuesURL + "?q=" + q)
  if err != nil {
    return nil, err
  }

  if resp.StatusCode != http.StatusOK {
    resp.Body.Close()
    return nil, fmt.Errorf("search query failed: %s", resp.Status)
  }

  var result IssuesSearchResult
  if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
    resp.Body.Close()
    return nil, err
  }

  resp.Body.Close()
  return &result, nil
}

func main() {
  var arr = []string{"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"}
  result, err := SearchIssues(arr)
  if err != nil {
    log.Fatal(err)
  }
  fmt.Printf("%d issues: \n", result.TotalCount)
  for _, item := range result.Items {
    fmt.Printf("#%-5d %9.9s %.55s\n", item.Number, item.User.Login, item.Title)
  }
}
```

前面的例子用了`json.Unmarshal`把整个字节`slice`解码为单个JSON实体。而这里使用了流式解码器（`json.Decoder`），用它来依次从字节流里面解码出多个JSON实体，现在还用不到这个功能。但有个方法`json.Encoder`的流式编码器。

调用`Decode`方法来填充变量`result`。有各种方法将结果格式化得好看点。

### 文本和HTML模板

上面的例子只是简单的格式化，`Printf`函数足以完成，但有些情况下格式化会比这个复杂得多，而且要求格式和代码彻底分离。这个可以通过`text/template`包和`html/template`包里面的方法来实现，它们都提供一种机制，可以将变量的值填充到一个文本或HTML格式的模板中。

模版是一个字符串或文件，它包含一个或多个两边用双大括号包围的单元`{{...}}`，这叫做操作。多数的字符串是直接输出的，但操作可以引发其他的行为。每个操作在模版里面都对应一个表达式，提供都简单强大的功能包括：输出值，选择结构体成员，调用函数和方法，描述控制逻辑（比如`if-else`和`range`循环），实例化其他的模版等等。下面是一个简单的字符串模版例子：

```go
const templ = `{{.TotalCount}} issues:
{{range .Items}}---------------------
Number: {{.Number}}
User:  {{.User.Login}}
Title: {{.Title | printf "%.64s"}}
Age: {{.CreatedAt | daysAgo}} days {{end}}`
```

模版首先输出符合条件的`issue`数量，然后输出每个`issue`序号、用户、标题和距离创建时间已过去的天数。在这个操作里面，有一个表示当前值的标记，用点号`.`表示。当前值`.`最初被初始化为调用模版时的参数，这个例子中对应`IssuesSearchResult`。操作`{{.TotalCount}}`代表`TotalCount`成员的值，直接输出。`range.Items`和`end`操作创建一个循环，所以它们内部的值会展开很多次，这里的`.`号表示`Items`元素的值。

在操作中，符号`|`会把前一个表达式的结果作为后一个函数的输入，类似`UNIX`中管道的概念。在`Title`的例子中，第二个操作就是`printf`函数，在所有的模板中，就是内置函数`fmt.Sprintf`的同义词。对于`Age`部分，第二个操作就是`daysAgo`，这个函数使用`time.Since`把`CreatedAt`转换为已过去的时间。

```go
func daysAgo(t time.Time) int {
 return int(time.Since(t).Hours() / 24)
}
```

需要注意，`CreatedAt`的类型是`time.Time`而不是`string`类型。同样地，一个类型可以定义方法来控制自己的字符串格式化方式，另外也可以定义方法来控制自身JSON序列化和反序列化的方式。`time.Time`的 JSON 序列化值就是该类型标准的字符串表示方法。

通过模板输出结果需要两个步骤。首先，需要解析模版并转换为内部的表示方法，然后在指定的输入上面执行。解析模板只需要执行一次。下面代码创建并解析上面定义的文本模板`templ`。注意方法的链式调用：`template.New`创建并返回一个新的模版，`Funcs`方法把`daysAgo`等自定义函数注册到模板中，并返回模板；最后调用`Parse`方法。

```go
var report = template.Must(template.New("issuelist").Funcs(template.FuncMap{"daysAgo": daysAgo}).Parse(templ))
```

模板通常是在编译期间固定下来的，所以无法解析模板是程序中一个严重的bug。帮助函数`template.Must`提供了一种错误处理的方式，它接受一个模版和`error`类型作为参数，检查错误是否为`nil`（如果不是`nil`，则宕机），然后返回该模板。

一旦创建了模板，添加了内部可调用的函数`daysAgo`，然后解析，再检查，就可以使用`IssuesSearchResult`作为数据源，使用`os.Stdout`作为输出目标执行这个模版：

```go
var report = template.Must(template.New("issuelist").Funcs(template.FuncMap{"daysAgo": daysAgo}).Parse(templ))

func main() {
  var arr = []string{"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"}
  result, err := SearchIssues(arr)
  if err != nil {
    log.Fatal(err)
  }

  if err := report.Execute(os.Stdout, result); err != nil {
    log.Fatal(err)
  }
}
```

下面来看`html/template`包。它使用和`text/template`包里一样的API和表达式语句，并且额外会对出现在HTML、Javascript、CSS和URL中的字符串进行自动转义。这些功能可以避免生成的HTML引发一些安全问题，比如通过生成HTML注入攻击，通过构造一个含恶意代码的问题标题，在模版中如果没有合理地进行转义，会让它们控制整个页面。

```go
var report = template.Must(template.New("issuelist").Parse(`
<h1>{{.TotalCount}}</h1>
<table>
  <tr style="text-align: left">
    <th>#</th>
    <th>State</th>
    <th>User</th>
    <th>Title</th>
  </tr>
  {{range .Items}}
  <tr>
    <td><a href='{{.HTMLURL}}'>{{.Number}}</a></td>
    <td>{{.State}}</td>
    <td><a href='{{.User.HTMLURL}}'>{{.User.Login}}</a></td>
    <td><a href='{{.HTMLURL}}'>{{.Title}}</a></td>
  </tr>
  {{end}}
</table>
`))
```

需要注意的是，`html/template`包会自动把HTML元字符转义，这样标题才会正常显示。如果错误得用到了`text/template`包，那么字符串`&lt;`会被当做小于号`<`，而字符串`<link>`将变成一个`link`元素，这将改变HTML的文档结构，甚至会产生安全问题。

我们可以通过使用命名的字符串类型`template.HTML`类型而不是字符串类型避免模板自动转移受信任的HTML数据。同样的命名类型适用于受信任的 Javascript、CSS和URL。下面演示相同的数据在不同类型下的效果，A是字符串而B是`template.HTML`类型。

```go
func main() {
  const templ = `<p>A: {{.A}}</p><p>B: {{.B}}</p>`
  t := template.Must(template.New("escape").Parse(templ))
  var data struct {
    A string
    B template.HTML
  }

  data.A = "<b>hello!</b>"
  data.B = "<b>hello!</b>"
  if err := t.Execute(os.Stdout, data); err != nil {
    log.Fatal(err)
  }
}
```
