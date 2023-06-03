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

有时候，需要一个`map`它的键为`slice`时（`slice`是不能比较的），而`map`的键必须是可比较的。所以这个功能无法实现。但可以分两步来做：先定义一个函数`k`把每个键都映射到字符串，当`x`和`y`相等时，`k(x) == k(y)`才会成立。然后，创建一个`map`，`map`的键时字符串类型，在每个键元素被访问的时候，调用这个`k`函数。

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
  ID int
  Name string
  Address string
  DoB time.Time
  Position string
  Salary int
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
