/*
  ## 斐波那契数列
  **斐波那契数列**是另一种用递归解决的问题。它是有`0、1、1、2、3、5、8、13、21`等数组成的序列。`2`是由`1 + 1`
  得到的，`3`是`1 + 2`得到的，`5`是`2 + 3`得到的，以此类推。下面列出斐波那契数列是如何定义的。
  * 位置`0`的斐波那契数是零。
  * `1`和`2`的斐波那契数是`1`。
  * `n`（这里`n > 2`）的斐波那契数是`(n - 1)`的斐波那契数和`(n - 2)`的斐波那契数。也就是说，`5`的斐波那契数是`3`的斐波那契数加上`2`的斐波那契数。
  
  ### 迭代求斐波那契数
  下面用迭代的方法来实现斐波那契数列。
  ```js
  function fibonacci(n) {
    if (n < 1) {
      return 0;
    }

    if (n <= 2) {
      return 1;
    }

    let fibNMinus2 = 0;
    let fibNMinus1 = 1;
    let fibN = n;
    for (let i = 2; i <= n; i++) { // n >= 2才执行循环
      fibN = fibNMinus1 + fibNMinus2; // fibonacci(n - 1) + fibonacci(n - 2)
      fibNMinus2 = fibNMinus1;
      fibNMinus1 = fibN;
    }

    return fibN;
  }

  console.log(fibonacci(8)); // 21
  ```

  ### 递归求斐波那契数
  把迭代版本的斐波那契数改成递归版本的。
  ```js
  function fibonacci(n) {
    if (n < 1) {
      return 0;
    }
    if (n <= 2) {
      return 1;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
  }

  console.log(fibonacci(10)); // 55
  ```
  上面的代码中，终止递归条件为`n < 1`和`n <= 2`以及计算`n > 2`的斐波那契数的逻辑。

  ### 记忆化斐波那契数
  记忆化是一种保存前一个结果的值的优化技术，类似缓存机制。是利用闭包特性把运算结果存在数组中，避免重复计算。
  ```js
  function fibonacciMemo() {
    const memo = [0, 1];
    const fibonacci = (n) => {
      if (memo[n] != null) {
        return memo[n];
      }
      return (memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo));
    };
    return fibonacci;
  }
  const fib = fibonacciMemo();
  console.log(fib(10)); // 55
  上面代码中，声明了一个`memo`数组来缓存所有的计算结果。如果结果已经被计算了，就返回它。否则计算该结果并将它加入缓存。
  ```

  ### 尾递归优化斐波那契数
  使用尾递归，把前两位数做成参数避免重复计算。
  ```js
  function fibonacci(n, v1 = 1, v2 = 1) {
    if (n <= 2) {
      return v2;
    }
    return fibonacci(n - 1, v2, v1 + v2);
  }

  console.log(fibonacci(10)); // 55
  ```
  使用尾调用优化，避免出现栈溢出，还可以大大减少内存的占用。
 */
