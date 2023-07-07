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
