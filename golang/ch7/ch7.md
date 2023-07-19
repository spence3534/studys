# goroutine协程和通道

## goroutine

在Go中，每个并发执行的活动称为`goroutine`。一个程序有两个函数，一个做计算工作，另一个把结果输出，假设它们不相互调用。顺序程序可能调用一个函数，然后调用另一个，但在有两个或多个`goroutine`的并发程序中，两个函数可以同时执行。

`goroutine`类似于线程，然后写出正确程序。`goroutine`和线程之间在数量上有很大差别。

在程序启动时，Go程序会为`main`函数创建一个默认的`goroutine`，它是一个主`goroutine`。新的`goroutine`通过`go`语句来创建。语法上，一个`go`语句是在普通的函数或方法调用前加上`go`关键字前缀。`go`语句使得函数在一个新创建的`goroutine`
中调用。`go`语句本身的执行立即完成:

```go
f()  // 调用f函数，等待它返回
go f() // 新建一个调用f函数的goroutine，不用等待
```

下面的例子中，主`goroutine`计算第45个斐波那契数。它使用低效的递归算法，因此需要大量的时间来执行，在这期间里我们提供了一个可见的提示，显示一个字符串`spinner`来知识程序依然在运行。

```go
func main() {
  go spinner(100 * time.Microsecond)
  const n = 45
  fibN := fib(n)
  fmt.Printf("\rFibonacci(%d) = %d\n", n, fibN)
}

func spinner(delay time.Duration) {
  for {
    for _, v := range `-\|/` {
    fmt.Printf("\r%c", v)
    time.Sleep(delay)
    }
  }
}

func fib(x int) int {
  fmt.Print("进入1111111111")
  if x < 2 {
    return x
  }
  return fib(x-1) + fib(x-2)
}
```

这个例子中，N秒后，`fib(45)`返回，`main`函数输出的结果:

```go
Fibonacci(45) = 1134903170
```

然后`main`函数返回，当它发生时，所有的`goroutine`都暴力地直接终结了，然后程序退出。除了从`main`返回或者退出程序之外，没有程序化的方法让一个`goroutine`来停止另一个，但有办法和`goroutine`通信来要求它停止。

注意一下这里的两个单独的单元是怎么进行组合的（`spinner`和`fib`的计算），分别在独立的函数中，但两个函数都是同时执行的。

### 多个goroutine

## 通道

通道是多个`goroutine`之间的连接。可以让一个`goroutine`发送特定值到另一个`goroutine`的通信机制。每个通道是一个具体类型的导管，称之为通道的**元素类型**。一个`int`类型元素的通道写为`chan int`。

用内置的`mack`函数创建一个通道:

```go
ch := make(chan int) // ch 的类型为chan int
```

和`map`一样，通道是一个使用`make`创建的数据结构的引用。当复制或参数传递到一个函数时，复制的时引用，这样调用者和被调用者都引用同一份数据结构。和其他引用类型一样，通道的零值为`nil`。

同类型的通道可以使用`==`进行比较。两者都是同一通道数据的引用时，值就为`true`。通道也可以和`nil`比较。

通道主要有两个操作: 发送（send）和接收（receive）。两者称之为**通信**。`send`语句从一个`goroutine`传输一个值到另一个在执行接收表达式的`goroutine`。两个操作都使用`<-`操作符书写。发送语句中，通道和值分别在`<-`的左右两边。
在接收表达式中，`<-`放在通道操作数前面。在接收表达式中，其结果未被使用也是合法的。

```go
 var x int
 ch := make(chan int)

 ch <- x // 发送语句：用通道ch发送变量x

 x = <-ch // 赋值语句中接收表达式：变量x从通道ch接收数据
 <-ch // 接收语句，丢弃结果
```

通道支持第三个操作：关闭（close），它设置一个标志位来指示值当前已经发送完毕，这个通道后面没值了；关闭后的发送操作将导致宕机。在一个已经关闭的通道上进行接收操作，将获取所有已经发送的值，直到通道为空；这时任何接收操作会立即完成，同时获取到一个通道元素类型对应的零值。

关闭通道操作:

```go
close(ch)
```

使用`make`函数创建的通道叫无缓冲通道，`make`还可以接受第二个可选参数，一个表示通道容量的整数。如果容量为0，`make`创建一个无缓冲通道：

```go
ch = make(chan int) // 无缓冲通道
ch = make(chan int, 0) // 无缓冲通道
ch = make(chan int, 3) // 容量为3的缓冲通道
```

我们先来看看什么是无缓冲通道。

### 无缓冲通道

无缓冲通道上的发送操作会导致阻塞，直到另一个`goroutine`在对应的通道上执行接收操作，这时值传送完成，两个`goroutine`都可以继续执行。如果接收操作先执行，接收方`goroutine`将阻塞，直到另一个`goroutine`在同一个通道上发送一个值。

使用无缓冲通道进行的通信导致发送和接收`goroutine`同步化。因此，无缓冲通道也叫做**同步通道**。当一个值在无缓冲通道上传递时，接收值后发送方`goroutine`才会被再次唤醒。下面来验证一下：

```go
func main() {
  ch := make(chan int)
  go pump(ch)
  fmt.Println(<-ch) // 0
}

func pump(ch chan int) {
  for i := 0; i < 10; i++ {
    ch <- i
  }
}
```

这里的代码中，`goroutine`在无限循环中给通道发送数据。因为没有接收者，导致只输出了一个数字`0`。

为了解除通道阻塞，下面定义一个`suck`函数在无限循环中读取通道。

```go
func main() {
  ch := make(chan int)
  go pump(ch)
  go suck(ch)
}

func suck() {
  for {
    fmt.Println(<-ch)
  }
}
```

### 管道

通道可以用来连接`goroutine`，这样一个的输出是另一个都输入。这叫做管道。来看下面的例子：

```go
func main() {
  naturals := make(chan int)
  squares := make(chan int)

  // counter
  go func() {
    for x := 0; ; x++ {
    naturals <- x
    }
  }()

  // squares
  go func() {
    for {
    x := <-naturals
    squares <- x * x
    }
  }()

  // printer
  for {
    fmt.Println(<-squares)
  }
}

```

这里的代码中由三个`goroutine`组成，它们被两个通道连接起来。第一个`goroutine`是`counter`，生成一个0，1，2的整数序列，然后通过一个管道发送给第二个`goroutine`（squares），计算数值的平方，然后把结果通过另一个通道发送给第三个
`goroutine`（printer），接收值并输出它们。

我们这里用无限循环生成的整数序列，这使得程序输出无限的平方序列。如果要通过管道发送有限的数字或数据，可以调用内置函数`close`来关闭管道。

```go
// counter
go func() {
  for x := 0; x < 100; x++ {
    naturals <- x
  }
  close(naturals)
}()
```

当一个通道被关闭之后，再向该通道发送数据会导致崩溃异常。当一个被关闭的通道中已经发送的数据被成功接收后，后续的接收操作不会阻塞，它们会返回一个零值。上面的例子中关闭了`naturals`变量对应的`channel`并不会终止循环，它依然会收到一个永无休止的零值序列，
然后将它们发送给`printer`。

没有一个直接的方式来检测通道是否已经关闭，但有一个接收操作的变种，它产生两个结果：接收到通道元素和一个布尔值（`ok`），`ok`值为`true`的时候表示接收成功，`false`表示当前的接收操作在一个关闭并且没值可接收的通道上。使用该特性，我们来改一下`squares`循环，
当`naturals`通道读完后，关闭`squares`通道。

```go
// squares
go func() {
  for {
    x, ok := <-naturals
    if !ok {
      break
    }
    squares <- x * x
  }
  close(squares)
}()
```

因为上面的语法比较笨拙，而这种处理模式很常见。所以Go的`range`循环可以直接在通道上迭代。这样更方便接收在通道上所有发送的值，接收完最后一个值后关闭循环。

下面来改造一下上面的例子，`counter`协程只生成50个整数序列，之后关闭`naturals`通道，导致`squares`结束循环并关闭`squares`通道。最后，主协程`printer`结束，程序退出。

```go
func main() {
  naturals := make(chan int)
  squares := make(chan int)

  go func() {
    for x := 0; x < 100; x++ {
    naturals <- x
    }
    close(naturals)
  }()

  go func() {
    for x := range naturals {
    squares <- x * x
    }
    close(squares)
  }()

  for x := range squares {
    fmt.Println(x)
  }
}
```

并不是每个通道都需要关闭操作。只有在通知接收方`goroutine`所有的数据都发送完毕的时候才关闭通道。通道也是可以通过垃圾回收器根据它是否可以访问来决定是否回收，而不是根据它是否关闭。（不要把这里的`close`操作和文件的`close`操作混淆了）

如果关闭一个已经关闭的通道会导致宕机，就像关闭一个空通道一样。

### 单向通道类型

Go的类型系统提供了单向通道类型，用于只发送或只接收。类型`chan<- int`是一个只能发送的通道，只能发送不能接收。相反，类型`<-chan int`是一个只能接收的`int`类型通道，只能接收不能发送。这种限制会在编译时检查出来。

调用`close`操作就证明通道上没有数据发送了，那么只有在发送方`goroutine`才会调用`close`函数，如果关闭一个只接收的通道会在编译时报错。

这里我们把上面的例子改成使用单向通道类型：

```go
func main() {
  naturals := make(chan int)
  squares := make(chan int)
  go counter(naturals)
  go squarer(squares, naturals)
  printer(squares)
}

func counter(out chan<- int) {
  for x := 0; x < 100; x++ {
    out <- x
  }
}

func squarer(out chan<- int, in <-chan int) {
  for v := range in {
    out <- v * v
  }
  close(out)
}

func printer(in <-chan int) {
  for v := range in {
    fmt.Println(v)
  }
}
```

`counter(naturals)`的调用隐式地把`chan int`类型转化为`chan<- int`类型。调用`printer(squares)`也做了类似`<-chan int`的转换。在任何赋值操作中把双向通道转成单向通道是可以的，但反过来就不行。一旦有一个像`chan<- int`这样的单向
通道，是无法通过它获取到引用同一个数据结结构的`chan int`数据类型的。

### 缓冲通道

缓冲通道有一个元素队列，队列的最大长度在创建时通过`make`的容量参数来设置。下面的例子中创建一个容纳三个字符串的缓冲通道。

```go
ch := make(chan string)
```

缓冲通道上的发送操作在队列的尾部插入一个元素，接收操作从队列的头部移除一个元素。如果通道满了，发送操作会阻塞`goroutine`，一直到另一个`goroutine`进行接收操作才会释放空间。反之，如果通道是空的，执行接收操作的`goroutine`阻塞，直到另一个
`goroutine`在通道上发送数据。

可以在当前通道上无阻塞发送三个值并且接收一个值:

```go
ch := make(chan string, 3)
ch <- "a"
ch <- "b"
ch <- "c"
fmt.Println(<-ch) // a
```

这时，通道是满的，如果再向通道发送值会阻塞。控制台会死锁错误。

通道在不满也不空的情况下，接收或发送操作都不会阻塞。通过这个方式，通道的缓冲区将发送和接收`goroutine`进行解耦。

如果想知道缓冲通道的长度（或者说容量吧），可以通过调用`cap`函数获取。

```go
fmt.Println(cap(ch)) // 3
```

使用内置函数`len`时，可以获取当前通道中的元素个数。在并发程序中该信息会随着接收操作失效，但它用于错误诊断和性能优化很有帮助。

```go
ch := make(chan string, 3)
ch <- "a"
ch <- "b"
ch <- "c"
fmt.Println(len(ch)) // 3
```

接下来的接收操作，使得通道又变空了，第四次接收将会阻塞:

```go
// 接收一个值
fmt.Println(<-ch)    // a
fmt.Println(len(ch)) // 2

fmt.Println(<-ch)    // b
fmt.Println(len(ch)) // 1

fmt.Println(<-ch)    // c
fmt.Println(len(ch)) // 0
```

这里例子中，发送和接收操作都由同一个`goroutine`执行，但在开发中通常由不同的`goroutine`执行。由于语法简单，新手有时候粗暴地把缓冲通道作为队列在单个`goroutine`中使用，这是一个错误的用法。
通道和`goroutine`的调度深度关联，如果没有另一个`goroutine`通过进行接收，发送者（也许是整个程序）会面临永久阻塞的风险。如果仅仅需要一个简单的队列，使用`slice`创建一个就可以。

无缓冲和缓冲通道的选择、缓冲通道容量大小的选择，都有可能影响程序的正确性。无缓冲通道提供每个发送都需要和对应的同步接收操作，对于缓冲通道，这些操作为解耦的。
