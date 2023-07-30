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

**竞争条件** 上指的是程序在多个`goroutine`交叉执行操作时，没有给出正确的结果。竞争条件时很恶劣的一种场景，因为这种问题会一直潜伏在程序中，然后在非常少见的情况下蹦出来，或许只是会在很大的负载时才会发生，又或许是会在使用了某一个编辑器、某一种平台或者某一架构的时候
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
  if Balance() < 0 {
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
