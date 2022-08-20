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
