# 使用共享变量实现并发

## 竞争条件

在只有一个`goroutine`的程序中，程序的执行顺序只由程序的逻辑来决定。比如，在一系列语句中，第一句在第二句之前执行，以此类推。当一个程序有两个或者多个`goroutine`时，每个`goroutine`内的语句也是按照顺序去执行的，但一般情况下我们无法知道两个`goroutine`的事件
`x`和`y`的执行顺序，`x`是在`y`之前还是之后还是同时发生是无法判断的。如果我们无法自信地说一个事件是在另一个事件的前面或者后面发生的话，就说明这两个事件是并发的。

考虑一个能在串行程序中正确工作的函数。如果这个函数在并发调用时依然可以正确地工作，那么这个函数时是并发安全的，并发安全的函数不需要额外的同步工作。我们可以把这个概念概括为一个特定类型的一些方法和操作函数，对于某个类型来说，如果其所有可访问的方法和操作都是并发安全
的话，那么该类型便是并发安全的。

让一个程序并发安全并不需要其中的每一个具体类型都是并发安全的。实际上，并发安全的类型其实是特例而不是普遍存在的，所以仅在文档指出类型是安全的情况下，才可以并发地访问一个变量。对于大部分变量，如要回避并发访问，要么限制变量只存在一个`goroutine`中，要么维护一个更高层的
**互斥**不变量。接下来我们详细解释这些概念。

相反，包级别的导出函数一般情况下都是并发安全的，由于`package`级的变量无法被限制在单一的`goroutine`，所以修改这些变量必须使用互斥条件。

一个函数在并发调用时无法工作的原因太多了，比如死锁（deadlock）、活锁（livelock）和资源耗尽（resource starvation）。我们无法一一讨论所有的问题，这里我们只聚焦在竞争条件上。

**竞争条件** 上指的是程序在多个`goroutine`交叉执行操作时，没有给出正确的结果。竞争条件是很恶劣的一种场景，因为这种问题会一直潜伏在程序中，然后在非常少见的情况下蹦出来，或许只是会在很大的负载时才会发生，又或许是会在使用了某一个编辑器、某一种平台或者某一架构的时候
才会出现。这些使得竞争条件带来的问题非常难以复现而且难以分析诊断。

下面来用一个经济损失的隐喻来解释竞争条件的严重性，看下面的例子：

```go
var balance int

func Deposit(amount int) {
 balance = balance + amount
}

func Balance() int {
 return balance
}
```

对于这个简单的程序来说，一眼就能看出，以任意顺序调用函数`Deposit`和`Balance`都能得到正确的结果。也就是说，`Balance`会输出之前存入的金额总数。但如果这些函数的调用顺序不是串行而是并行，`Balance`就再也无法保证结果正确了。如下两个`goroutine`:

```go
func main() {
  // 图图：
  go func() {
    Deposit(200) // A1
    fmt.Println("=", Balance()) // A2
  }()

  // 小美：
  go Deposit(100) // B
}
```

图图存入200块，然后查询他的余额，此时小美存入100块。A1、A2和B是并发进行的，我们无法预测实际的执行顺序。直觉来看，可能存在三种可能性：“图图先”，“小美先”以及“图图/小美/图图”。下面表格展示每个步骤之后`balance`变量的值。带引号的字符串表示输出的账户余额。

|图图先|小美先|图图/小美/图图|
|----|----|----|
|0         |0         |         0|
|A1  200   |B      100|A1     200|
|A2  "=200"|A1     300|B      300|
|A1  300   |A2 "= 300"|A2 "= 300"|

所有情况下最终的账户余额都是300块。唯有不同的是图图看到的账户余额是否包含了小美的交易，但客户对所有情况都不会有不满。

这种直觉是错的。还有第四种可能，小美的存款在图图的存款操作中间执行，在余额被读到（balance+amount）之前，在余额被更新之前（balance=...），这样会导致小美的交易丢失。这是因为图图的存款操作A1实际上是串行的两个操作，读部分和写部分，可以称之为A1r和A1w。下面是
交叉时产生的问题：
|数据竞争| |
|----|----|
|0         |...=balance + amount|
|A1r      0||
|B      100||
|A1w    200|balance = ...|
|A2 "= 200"||

在A1r之后，表达式`balance + amount`求值结果为200，这个值在A1w步骤中用于写入，完全没有理会中间的存款操作。最终的余额为200块。银行从小美手上挣了100块。

这种状况是竞争条件中的一种，叫作**数据竞争**（data race）。**数据竞争发生于两个`goroutine`并发读写同一个变量，且其中一个是写入时会发生数据竞争**。

当发生数据竞争的变量类型是大于一个机器字长的类型（如接口、字符串或slice）时，事情就更复杂了。下面的代码并发将`x`更新位两个不同长度的`slice`。

```go
func main() {
  var x []int
  go func() {
    x = make([]int, 10)
  }()

  go func() {
    x = make([]int, 100000)
  }()

  x[999999] = 1 // 未定义行为，可能造成内存异常
  time.Sleep(time.Minute)
}
```

最后一个表达式中`x`的值是未定义的，它可能是`nil`、一个长度为10的`slice`或者一个长度为1000000的`slice`。`slice`的三部分：指针、长度和容量。如果指针来自第一个`make`调用而长度来自第二个`make`调用，那么`x`会变成一个嵌合体，它名义上长度为
1000000但底层的数组只有10个元素。在这种情况下，尝试存储到第999999个元素会碰撞一个遥远的内存位置，这种情况下难以对值进行预测，而且debug也会变成噩梦。这种语义雷区称为**未定义行为**，在go中很少有这种问题。

尽管并发程序的该娘让我们知道并发不是简单的语句交叉执行。后面会看到，数据竞争可能会有奇怪的结果。一个好的习惯是根本就没有什么所谓的良性数据竞争。所以我们一定要避免数据竞争，那怎么做呢？

再回顾一下数据竞争的定义（因为定义非常重要）：数据竞争会在两个以上的`goroutine`并发访问相同的变量且至少其中一个为写操作时发生。根据定义，有三种方式避免数据竞争：

第一种方法时不要去写变量。看下面的`map`，会被“懒”填充，也就是说每个`key`被第一次请求到的时候才会填值。如果`Icon`是被顺序调用的话，这个程序会工作正常，但如果`Icon`的调用是并发的，在访问`map`时就存在数据竞争。

```go
var icons = make(map[string]image.Image)

func loadIcon(name string) image.Image

// 并发不安全
func Icon(name string) image.Image {
  icon, ok := icons[name]
  if !ok {
    icon = loadIcon(name)
    icons[name] = icon
  }
  return icon
}
```

如果在创建`goroutine`之前就初始化`map`中的所有条目并且再也不去修改它们，那么无论多少`goroutine`并发访问`Icon`都是安全的，因为每个`goroutine`只是去读取`map`而已。

```go
var icons = map[string]image.Image{
  "spades.png":   loadIcon("spades.png"),
  "hearts.png":   loadIcon("hearts.png"),
  "diamonds.png": loadIcon("diamonds.png"),
  "clubs.png":    loadIcon("clubs.png"),
}

// 并发不安全
func Icon(name string) image.Image {
  return icons[name]
}
```

上面的例子中，`icons`变量在包初始化阶段就已经被赋值了，包的初始化时在程序`main`函数开始执行之前就完成了的。只要初始化完成，`icons`就再也不会被修改。数据结构如果从不被修改或不变量则是并发安全的，无需进行同步，不过显然，如果更新操作是
必要的，我们就没法用这种方法，比如银行账户。

第二种避免数据竞争的方法是避免从多个`goroutine`访问同一个变量。也就是说把变量限制在单个`goroutine`内部。由于其他的`goroutine`不能直接访问变量，它们只要使用通道来发送请求给指定的`goroutine`来查询更新变量。这也就是GO的口头禅：“不要使用
共享数据来通信，而是用通信来共享数据”。用通道请求来代理一个受限变量的所有访问的`goroutine`叫作该变量的监控`goroutine`（monitor goroutine）。

下面来重写之前的例子，用一个叫`teller`的监控`goroutine`限制`balance`变量:

```go
var deposit = make(chan int)
var balances = make(chan int)

func Deposit(amount int) {
  deposit <- amount
}

func Balance() int {
  return <-balances
}

func teller() {
  var balance int // 将balance限制在teller goroutine中
  for {
    select {
    case amount := <-deposit:
    balance += amount
    case balances <- balance:
    }
  }
}

func init() {
  go teller()
}

func main() {
  go func() {
    Deposit(200)
    fmt.Println("=", Balance()) // = 300
  }()

  go func() {
    Deposit(100)
  }()
  time.Sleep(time.Minute)
}
```

即使当一个变量无法在整个声明周期内被绑定到一个独立的`goroutine`，绑定依然是并发问题的一个解决方案。比如在一条流水线上的`goroutine`之间共享变量是很常见的行为，在这两者间会通过通道来传输地址信息。如果流水线的每一个阶段都能够避免
在将变量传送到下一阶段后再去访问它，那么对这个变量的所有访问就是串行的。其效果是变量会被绑定到流水线的一个阶段，传送完后被绑定到下一个，以此类推。这种规则有时也被称为串行受限。

在下面的例子中，`Cakes`会被严格地顺序访问，首先受限于`baker goroutine`，然后受限于`icer goroutine`。

```go
type Cake struct{ state string }

func baker(cooked chan<- *Cake) {
  for {
    cake := new(Cake)
    cake.state = "cooked"
    cooked <- cake // baker 不再访问 cake变量
  }
}

func icer(iced chan<- *Cake, cooked <-chan *Cake) {
  for cake := range cooked {
    cake.state = "iced"
    iced <- cake // icer 不再访问cake变量
  }
}
```

第三种避免数据竞争的办法是允许多个`goroutine`访问同一个变量，但在同一时间只有一个`goroutine`可以访问。这种方法称为**互斥机制**。

## 互斥锁: sync.Mutex

互斥锁模式应用非常广泛，所以`sync`包有一个单独的`Mutex`类型来支持这种模式。它的`Lock`方法用于获取`token`（这个过程称为上锁），`Unlock`方法用于释放这个`token`：

```go
var (
  mu      sync.Mutex
  balance int
)

func Deposit(amount int) {
  mu.Lock()
  balance = balance + amount
  mu.Unlock()
}

func Balance() int {
  mu.Lock()
  b := balance
  mu.Unlock()
  return b
}
```

一个`goroutine`在每次访问变量（这里只有balance）之前，都会调用`Mutex`的`Lock`方法获取一个互斥锁。如果其他的`goroutine`已经获得这个锁的话，此操作会被阻塞到其它`goroutine`调用了`Unlock`使该锁变回可用状态。
`Mutex`会保护共享变量。按照惯例，被`Mutex`保护的变量是在`Mutex`变量声明之后立刻声明的。

在`Lock`和`Unlock`之间的代码，可以随意读取或修改，这部分称为**临界区**。在锁的持有人调用`Unlock`之前，其他`goroutine`不能获取锁。所以很重要的一点是，`goroutine`在结束后必须释放锁，无论以哪条路径通过函数都需要释放，
即使在错误路径中，也要记得释放。

每个函数在开始时获取互斥锁并且在结束后释放锁，确保共享变量不会被并发访问。这种函数、互斥锁、变量的组合方法称为监控模式。

因为`Deposit`和`Balance`函数中的临界区都很短（只有一行，也没有分支），所以直接在函数结束时调用`Unlock`。在更复杂的临界区中，尤其是必须要尽早处理错误并返回的情况下，很难确定在所有的分支中`Lock`和`Unlock`都是成对执行的。
使用`defer`就能解决这个问题：通过延迟执行`Unlock`可以把临界区隐式地延伸到当前函数作用域最后，这样我们就从“总要记得在函数返回之后或者发生错误返回时要记得调一次`Unlock`”这种状态中获得解放了。Go会自动帮我们完成这些事情。

```go
func Balance () int {
  mu.Lock()
  defer mu.Unlock()
  return balance
}
```

在上面的例子中，`Unlock`在`return`语句读取完`balance`的值后执行，所以`Balance`函数是并发安全的。另外，也不需要使用局部变量`b`了。

此外，在临界区崩溃时延迟执行的`Unlock`也能正确执行，这对于用`recover`来恢复的程序来说是很重要的。`defer`调用只会比显式地调用`Unlock`成本要一点，不过却在很大程度上保证了代码的整洁性，大多数情况下对于并发程序来说，代码的
整洁性比过度的优化更重要。如果可能的话尽量使用`defer`来将临界区扩展到函数的结尾。

看下面的`Withdraw`函数。当成功时，余额减少了指定的数量，并返回`true`，但如果余额不足，无法完成交易，`Withdraw`恢复余额并且返回`false`。

```go
func Withdraw(amount int) bool {
  Deposit(-amount)
  if Balance() < 0 {
    Deposit(amount)
    return false
  }
  return true
}
```

函数最终能给出正确的结果，但有一个副作用。在超额取款操作时，`balance`可能会瞬间被减到0以下。着可能会引起一个并发的取款被不合逻辑地拒绝。问题在于取款不是一个原子操作：它包含了三个步骤，每一步都需要去获取并释放互斥锁，但对于整个流程没有上锁。

理想的情况下，`Withdraw`应当给整个操作获取一次互斥锁。下面这样的尝试是错误的：

```go
func Withdraw(amount int) bool {
  mu.Lock()
  defer mu.Unlock()
  Deposit(-amount)
  if Balance() < 0 {
    Deposit(amount)
    return false
  }
  return true
}
```

这个例子中，`Deposit`会通过调用`mu.Lock`二次获取互斥锁，但因为`Mutex`已经锁上了，而无法重入（go中没有重入锁）。也就是说没法对一个已经锁上的`Mutex`再次上锁，因此会导致死锁。`Withdraw`会永远阻塞下去。

Go的`Mutex`不能重入这一点具体看后面，`Mutex`的目的是确保共享变量在程序执行时的关键点上能保证不变性。不变性的含义是“没有`goroutine`访问共享变量”，但实际上这里对于`Mutex`保护的变量来说，不变性还有更深层含义：当一个`goroutine`
获得了一个互斥锁时，它能断定被互斥锁保护的变量正处于不变状态（即没有其他代码快正在读写共享变量），在其获取并保持锁期间，可能会去更新共享变量，这样不变性只是短暂地被破坏，然后当其释放锁之后，锁必须保证共享变量重获不变性并且多个`goroutine`
按顺序访问共享变量。尽管一个可以重入的`Mutex`也可以保证没有其他的`goroutine`在访问共享变量，但它不具备不变性更深层含义。

一个常见的解决方案时把`Deposit`这样的函数拆成两部分：一个不导出的函数`deposit`，它假定已经获得互斥锁，并完成实际的业务逻辑；以及一个导出的函数`Deposit`，它用来获取锁并调用`deposit`。这样我们就可以用`deposit`来实现`Withdraw`。

```go
var (
 mu      sync.Mutex
 balance int
)

func Deposit(amount int) {
  mu.Lock()
  defer mu.Unlock()
  deposit(amount)
}

func Balance() int {
  mu.Lock()
  defer mu.Unlock()
  return balance
}

func Withdraw(amount int) bool {
  Deposit(-amount)
  if balance < 0 {
    deposit(amount)
    return false
  }
  return true
}

// 这个函数要求已获取互斥锁
func deposit(amount int) {
  balance += amount
}
```

当然，这里的存款`deposit`函数很小，实际上取款`Withdraw`函数不需要理会对它的调用，但无论如果通过这个例子很好地演示了这个规则。

封装，用限制一个程序的意外交互的方式，来帮助我们保证数据结构中的不变性。因为某种原因，封装也可以用来保持并发的不变性。当使用`Mutex`时，确保`Mutex`和其保护的变量没有导出，无论这些变量是包级的变量还是一个`struct`的字段。

## 读写互斥锁: sync.RWMutex

所有的余额查询请求是顺序执行的，这样会互斥地获得锁，并且会暂时阻止其它的`goroutine`运行。

由于`Balance`函数只须读取变量的状态，所以多个`Balance`请求其实可以安全地并发运行，只要运行的时候没有存款或取款操作即可。在这种场景下，我们需要一种特殊类型的锁，它允许只读操作可以并发执行，但写操作会完全互斥。**这种锁称为多读单写锁**，Go中的
`sync.RWMutex`就提供了这种功能：

```go
var (
 mu      sync.RWMutex
 balance int
)

func Balance() int {
  mu.RLock()
  defer mu.RUnlock()
  return balance
}
```

`Balance`函数现在调用`RLock`和`RUnlock`方法来获取和释放一个读锁（也称共享锁）。`Deposit`没有变化，它通过调用`mu.Lock`和`mu.Unlock`来获取和释放一个写锁（也叫互斥锁）。

`RLock`只能在临界区共享变量没有任何写入操作时可用。一般来说，我们不应该假设逻辑上的只读函数或方法不会更新某些变量。比如一个方法功能是访问一个变量，但它也有可能会同时去给一个内部的计时器递增，或者去更新缓存使得即时的调用能更快。如果有疑惑的话，请使用互斥锁`Lock`。

只有在绝大部分`goroutine`都在获取读锁并且锁竞争激烈时（也就是说`goroutine`一般都需要等待后才能获到锁），`RWMutex`才有优势。因为`RWMutex`需要更复杂的内部记录，所以会让它比一般的无竞争锁的`Mutex`慢一些。

## 内存同步

你可能会对`Balance`方法需要互斥锁（不管是基于通道还是基于互斥量）感到奇怪。毕竟，和`Deposit`不一样，它只包含单个操作，所以并不会碰到其它`goroutine`在其执行期间执行其他逻辑的风险。这里使用`Mutex`有两方面考虑。第一`Balance`不会在其它操作比如`Withdraw`“中间”执行。
第二是“同步”不仅仅是一堆`goroutine`执行顺序的问题，同样也会涉及到内存的问题。

在现代计算机中可能会有一堆处理器，每个都会有其本地缓存。为了提高效率，对内存的写入是缓存在每个处理器中的，只要必要时才刷回内存。甚至刷回内存的顺序都可能和`goroutine`都写入顺序不一致。像通道通信或者互斥锁操作这样的同步原语都会导致处理器把累积的写
操作刷回内存并提交，这样`goroutine`在某个时间点上的执行结果才能被其它处理器上运行的`goroutine`得到。

看下面的代码可能输出：

```go
package main

import (
 "fmt"
 "time"
)

func main() {
  var x, y int
  go func() {
    x = 1                  // A1
    fmt.Print("y:", y, " ")// A2
  }()
  go func() {
    y = 1                  // B1
    fmt.Print("x:", x, " ")// B2
  }()
  time.Sleep(time.Second)
}
```

由于这两个`goroutine`并发运行且在没使用互斥锁的情况下访问共享变量，所以这里产生数据竞争。所以程序的运行结果没法预测的话也不要惊讶。我们可能希望它能够打印出下面这四种结果中的一种，相当于几种不同的交错执行时的情况：

```go
y:0 x:1
x:0 y:1
x:1 y:1
y:1 x:1
```

第四行可以由`A1,B1,A2,B2`或`B1,A1,A2,B2`这样的执行顺序来产生。然后实际运行时还是有些情况让我们惊讶:

```go
x:0 y:0
y:0 x:0
```

根据所使用的编译器，CPU或者其它情况下，这两种情况也是有可能发生的。那么这两种情况要怎么解释呢？

在单个`goroutine`中，每个语句的执行顺序是可以被保证的，也就是说`goroutine`是串行一致的。但在不使用通道或者`Mutex`来显式同步的情况下，无法保证事件在不同的`goroutine`中看到的执行顺序是一致的。尽管`goroutine A`中一定能在读取`y`
之前能观察到`x=1`的效果，但它无法确保自己观察得到`goroutine B`对`y`的写入，所以`A`可能会输出`y`的一个旧值。

尽管很容易把并发简单理解为多个`goroutine`中语句的某种交错执行方式，但正如上面的例子所显示的，这并不是一个现代编译器和CPU的工作方式。因为赋值和`Print`对应不同的变量，所以编译器就可能会认为两个语句的执行顺序不会影响效果，然后就交换了这
两个语句的执行顺序。CPU 也有类似的问题，如果两个`goroutine`在不同的CPU上执行，每个CPU都有自己的缓存，那么一个`goroutine`的写入操作在同步到内存之前对另外一个`goroutine`的`Print`语句是不可见的。

这些并发问题都可以通过采用简单、成熟的模式来避免，即在可能的情况下，把变量限制到单个`goroutine`中，对于其它变量，使用互斥锁。

## 延迟初始化: sync.Once

如果初始化成本比较大的话，那么将初始化延迟到需要的时候再去做是一个较好的选择。如果程序启动的时候就去做这类初始化的话，会增加程序的启动时间，并且因为执行的时候可能也并不需要这些变量，所以实际上有些浪费。下面来看看之前的`icons`变量:

这里的`Icon`使用了延迟初始化

```go
func loadIcons() {
  icons = map[string]image.Image{
    "spades.png":   loadIcon("spades.png"),
    "hearts.png":   loadIcon("hearts.png"),
    "diamonds.png": loadIcon("diamonds.png"),
    "clubs.png":    loadIcon("clubs.png"),
  }
}

// 注意：并发并不安全
func Icon(name string) image.Image  {
  if icons == nil {
    loadIcons() // 一次性地初始化
  }
  return icons[name]
}
```

对于那些只被一个`goroutine`访问的变量，这个模板是没问题的，但这个模板在`Icon`被并发调用时并不安全。就像前面的`Deposit`函数一样，`Icon`函数也是由多个步骤组成的：首先测试`icons`是否为空，然后`load`这些`icons`，之后将`icons`更新为一个
非空的值。直觉会告诉我们最差的情况是`loadIcons`函数会被多次访问会带来数据竞争。当第一个`goroutine`在忙着加载这些`icons`时，另一个`goroutine`进入了`Icon`函数，发现变量是`nil`，然后也会调用`loadIcons`函数。

但这种直觉是错的。（希望你现在已经有一个关于并发的新直觉，就是关于并发的直觉都不可靠）。回想上面关于内存的讨论，在缺乏显式同步的情况下，编译器和CPU在能保证每个`goroutine`都满足串行一致性的基础上可以自由地重排访问内存的顺序。
其中一种可能`loadIcons`语句重排如下所示。它在填充数据之前把一个空`map`赋值给`icons`：

```go
func loadIcons() {
  icons = make(map[string]image.Image)
  icons["spades.png"] = loadIcon("spades.png")
  icons["hearts.png"] = loadIcon("hearts.png")
  icons["diamonds.png"] = loadIcon("diamonds.png")
  icons["clubs.png"] = loadIcon("clubs.png")
}
```

因此，一个`goroutine`发现`icons`为非空时，并不代表变量的初始化就完成了。
确保所有`goroutine`都能观察到`loadIcons`效果的方式就是用一个`Mutex`来做同步：

```go
var mu sync.Mutex
var icons map[string]image.Image

func Icon(name string) image.Image  {
  mu.Lock()
  defer mu.Unlock()
  if icons == nil {
    loadIcons()
  }
  return icons[name]
}
```

采用互斥锁访问`icons`到代价是两个`goroutine`不能并发访问这个变量，即使变量已经被初始化完成切再也不会进行变动。这里我们可以引入一个运行多读的锁:

```go
var mu sync.RWMutex
var icons map[string]image.Image

// 并发安全
func Icon(name string) image.Image {
  mu.RLock()
  if icons != nil {
    icon := icons[name]
    mu.RUnlock()
    return icon
  }
  mu.RUnlock()

  mu.Lock()
  if icons == nil {
    loadIcons()
  }
  icon := icons[name]
  mu.Unlock()
  return icon
}
```

上面的代码中有两个临界区。`goroutine`首先会获取一个读锁，查询`map`，然后释放锁。如果条目被找到了，那么会直接返回。如果没有找到，那`goroutine`会获取一个锁。不释放共享锁的话，就无法将一个共享锁升级为互斥。为了避免执行这一段代码时，`icons`变量已经被其它`goroutine`
初始化了，所以我们必须重新检查`icons`是否为`nil`。

上面的模板具有更好的并发，但也更加复杂而且容易出错。幸运的是，`sync`包提供了针对一次性初始化问题的解决方案：`sync.Once`。`Once`包含一个布尔变量和一个`Mutex`互斥量，布尔变量记录初始化是否已经完成，互斥量则负责保护这个布尔变量和客户端数据结构。`Once`的唯一方法`Do`
需要接收初始化函数作为参数。看下面的例子：

```go

var loadIconsOnce sync.Once
var icons map[string]image.Image

func Icon(name string)image.Image  {
  loadIconsOnce.Do(loadIcons)
  return icons[name]
}
```

每次调用`Do(loadIcons)`时会先锁定`Mutex`互斥量并且检查里面的布尔变量。在第一次调用时，这个布尔变量为`false`，`Do`会调用`loadIcons`然后把变量设置为`true`。后续的调用相当于空操作，只是通过互斥量的同步保证`loadIcons`对内存产生的效果（在这里就是`icons`变量）
对所有的`goroutine`可见。以这种方式来使用`sync.Once`，能避免在变量被构建完成之前和其它`goroutine`共享该变量。

## 竞争条件检测

Go的运行时和工具链为我们配备了一个复杂但好用的动态分析工具: 竞争检测器。

简单地把`-race`命令行参数加到`go build`、`go run`、`go test`命令里面就可以使用该功能。它会让编译器为你的应用或者测试构建一个修改后的版本，这个版本有额外的手法用于高效记录在执行时对共享变量的所有访问，以及读写这些变量的`goroutine`标识。除此之外，修改后的版本还会
记录所有的同步事件，包括`go`语句、通道操作、`(*sync.Mutex).Lock`调用、`(*sync.WaitGroup).Wait`调用等。

竞争检查器会检查这些事件，会找到那些有问题的案例，即一个`goroutine`写入一个变量后，中间没有任何同步的操作，就有另外一个`goroutine`读写了该变量。这种案例表明有对共享变量的并发访问，即数据竞争。这个工具会打印一份报告，内容包含便来那个的标识以及读写`goroutine`
的调用栈。这些信息在定位问题时很有用。

竞争检测器会报告所有的已经发生的数据竞争。然后，它只能检测到运行时的竞争条件；并不能证明之后不会发生数据竞争。所以为了使结果尽量正确，请保证你的测试并发地覆盖到了你的包。

由于需要额外的记录，因此构建时加了竞争检测的程序跑起来会慢一些，且需要更大的内存，即使是这样，这些代价对于很多生产环境的程序来说还是可以接受的。对于一些偶发的竞争条件来说，让竞争检测器来干活可以节省无数日夜的 debugging。

## goroutine与线程

接下来介绍一下`goroutine`和操作系统（OS）线程的差异。尽管两者的区别实际上只是一个量的区别，但量变会引起质变的道理同样适用于`goroutine`和线程。下面来讨论如何区分它们。

### 可增长的栈

每个OS线程都有一个固定大小的栈内存（通常为2MB），栈内存区域用于保存在其他函数调用期间那些正在执行或临时暂停的函数中的局部变量。这个固定的栈大小同时很大又很小。2MB的栈对于一个小的`goroutine`来说是很大的内存浪费，比如有的`goroutine`仅仅等待一个`Waitgroup`
再关闭一个通道。在Go中，一次创建十万左右的`goroutine`也不罕见，对于这种情况，栈就太大了。另外，对于最复杂和深度递归的函数，固定大小的栈始终不够大。改变这个固定大小可以提高空间效率并且运行创建更多的线程，或者也可以容许更深的递归函数，但无法同时做到上面两点。

作为对比，一个`goroutine`在生命周期开始时只是一个很小的栈，典型情况下为2KB。和OS线程类似，`goroutine`的栈也用于存放那些正在执行或临时暂停的函数中的局部变量。但和OS线程不同的是，`goroutine`的栈是不固定大小的，它可以按需增大和缩小。`goroutine`的栈大小
限制可达到1GB，比线程典型的固定大小栈高几个数量级。一般情况下，大多数`goroutine`不会需要这么大的栈。

### goroutine 调度

OS 线程由OS内核来调度。每隔几毫秒，一个硬件计时器会中断CPU，CPU会调用一个叫作调度器(scheduler)的内核函数。这个函数暂停当前正在运行的线程，把它的寄存器信息保存到内存，查看线程列表并决定接下来运行哪个线程，再从内存恢复线程的注册表信息，最后继续执行选中的线程。
因为OS线程由内核来调度，所以控制权限从一个线程到另一个线程需要一个完成的上下文切换：保存一个线程的状态到内存，再恢复另外一个线程的状态，最后更新调度器的数据结构。考虑这个操作涉及的内存局域性以及涉及的内存访问数量，还有访问内存所需的CPU周期数量的增加，
这个操作是很慢的。

Go运行时包含一个自己的调度器，这个调度器使用一个称为`m:n`调度的技术（因为它可以复用/调度m个goroutine到n个OS线程）。Go调度器和内核调度器的工作类似，但Go调度器只需关心单个Go程序的`goroutine`调度问题。

和操作系统的线程调度器不同的是，Go调度器不是由硬件时钟来定时触发的，而是由特定的Go语言结构来触发的。比如当一个`goroutine`调用`time.Sleep`或被通道阻塞或对`Mutex`操作时，调度器就会把这个`goroutine`设为休眠模式，并运行其它`goroutine`直到前一个
可重新唤醒为止。因为它不需要切换到内核的上下文，所以调度一个`goroutine`比调度一个线程成本低很多。

### GOMAXPROCS

Go调度器使用GOMAXPROCS参数来确定需要使用多少个OS线程来同时执行Go代码。默认值是机器上的CPU数量，所以在一个有8个CPU的机器上，调度器会把Go代码同时调度到8个OS线程上。（GOMAXPROCS是m:n调度中的n。）正在休眠或者正被通道通行阻塞的`goroutine`不需要占用线程。
阻塞在I/O和其他系统调用中或调用非Go语言写的函数的`goroutine`需要一个独立的OS线程，但这个线程不计算在GOMAXPROCS内。

可以用GOMAXPROCS环境变量或者`runtime.GOMAXPROCS`函数来显式控制这个参数。在下面的小程序中会看到GOMAXPROCS的效果，这个程序会无限打印0和1。

```go
$ GOMAXPROCS=1 go run /Desktop/go-study/ch8/for.go
111111111111111111110000000000000000000011111

$ GOMAXPROCS=1 go run /Desktop/go-study/ch8/for.go
010101010101010101011001100101011010010100110

func main() {
  for {
    go fmt.Print(0)
    fmt.Print(1)
  }
}
```

在第一次运行时，每次最多只能有一个`goroutine`运行。最开始是主`goroutine`，它输出1。过一段时间后，Go调度器让主`goroutine`休眠，并且唤醒另一个输出0的`goroutine`，让它有机会执行。在第二次运行时，这里有两个可用的OS线程，所以两个`goroutine`可以
同时运行，以同样的频率交替打印0和1。我们必须强调的是`goroutine`的调度是受很多因子影响的。而`runtime`也是在不断发展演进的，所以这里实际得到的结果可能会因为版本的不同而跟我们运行的结果有所不同。

### goroutine没有标识

在大多数支持多线程的操作系统和程序语言中，当前的线程都有一个独特的身份（id），并且这个身份信息可以以一个普通值的形式被很容易地获取到，典型的可以是一个`integer`或者指针。这个特性让我们可以轻松构建一个线程的局部存储，它本质上就是一个全部的`map`，
以线程的标识作为键，这样每个线程都可以独立地用这个`map`存储和获取值，而不受其他线程干扰。

`goroutine`没有可供我们访问的标识。这点是设计上故意而为之，因为线程局部存储由一种被滥用的倾向。比如说，一个Web服务器用一个支持线程局部存储的语言来实现时，很多函数都会通过访问这个存储来查找关于HTT请求的信息。但就像那些过度依赖于全局变量的程序一样，
这也会导致一种不健康的“距离外行为”，在这种行为下，函数的行为不仅取决于它的参数，还取决于运行它的线程标识。因此，在线程的标识需要改变的场景（比如需要使用工作线程时），这些函数的行为就会变得神秘莫测。

Go语言鼓励更为简单的模式，在这种模式下参数（外部显式参数和内部显式参数）对函数的影响都是显式的。这样不仅可以让程序变得更容易阅读，还让我们能自由地把一个韩素的子任务分发到多个不同的`goroutine`而无需担心这些`goroutine`的标识。