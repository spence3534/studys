/*
  # 递归

  ## 什么是递归
  首先来举个例子：
  > 从前有座山，山里有座庙，庙里有个老和尚，正在给小和尚讲故事呢！故事是什么呢？"从前有座山，山里有座庙，庙里有个老和尚，正在给小和尚讲故事呢！故事是什么呢？'从前有座山，山里有座庙，庙里有个老和尚，正在给小和尚讲故事呢！故事是什么呢？……'"
  > 要理解什么是递归，首先要理解什么递归。

  递归是一种解决问题的方法，它从解决问题的各个小部分开始，直到解决最初的大问题。

  在计算机中，在函数中通过调用函数自身就叫递归。来看个例子。
  ```js
  function recursion(res) {
    recursion(res);
  }
  ```
  像下面这样简介调用函数自身的函数，也是一个递归。
  ```js
  function recursion1() {
    recursion2();
  }

  function recursion2() {
    recursion1();
  }
  ```
  那么执行`recursion`的结果又会怎么样呢？就拿上面的两个例子来说，它会进入一个死循环。因此，每个递归函数必须要有一个终止递归的条件。比如，“要理解什么是递归，首先要理解什么递归”
  这句话。可以通过百度啊，查阅资料啊，这就是终止递归的条件。

  我们原归正题，在理解什么是递归后，也就解决了最开始的问题。
  ```js
  function recursion1() {
    const answer = getAnswer("你理解递归了吗？");

    if (answer === true) {  // 终止递归的条件
      return true;
    }

    recursion1(); // 递归调用
  }
  ```
  `recursion1`函数不断调用自己，只有`answer`的值为`true`时。返回了`true`，也退出了递归调用。

  有了基本的了解之后，来看看计算机中有哪些著名的递归算法。

  ## 数的阶乘
  下面来看看如何计算一个数的阶乘。数`n`的阶乘，表示从`1`到`n`的整数的乘积。`5`的阶乘表示为`5`，和`5 x 4 x 3 x 2 x 1`相同，结果为`120`。

  ### 迭代阶乘
  使用一个循环来写计算一个数阶乘的函数，看下面代码。
  ```js
  function iteration(num) {
    if (num < 0) return undefined;
    let total = 1;
    for (let n = num; n > 1; n--) {
      total = total * n;
    }
    return total;
  }

  console.log(iteration(5)); // 120
  ```

  ### 递归阶乘
  我们来用递归重写`iteration`函数。
  ```js
  function iteration(num) {
    if (num === 1 || num === 0) { // 基线条件
      return 1;
    }
    return num * iteration(num - 1); // 递归调用
  }
  ```
*/
function iteration(num) {
  if (num === 1 || num === 0) {
    return 1;
  }
  return num * iteration(num - 1);
}

console.log(iteration(5));
