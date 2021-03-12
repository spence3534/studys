/*
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
  我们来用递归重写`iteration`函数。`5`的阶乘用`5 x 4 x 3 x 2 x 1`。`4(n - 1)`的阶乘是用`4 x 3 x 2 x 1`来计算。计算`n - 1`的阶乘
  是计算原始问题`n!`（`n!`的意思是`n`的阶乘）的一个子问题。
  ```js
  function iteration(num) {
    if (num === 1 || num === 0) { // 基线条件
      return 1;
    }
    return num * iteration(num - 1); // 递归调用
  }
  ```

  #### 调用栈
  每当一个函数被调用时，这个函数会进入调用栈的顶部。当使用递归时，每个函数调用都会堆叠在调用栈的顶部，这是因为每个调用都可能依赖前一个调用的结果。
  在浏览器中可以看到调用栈的信息，如图所示。

  ![](./images/9-2-1.png)

  执行`iteration(5)`时，可以看到右边的`Call Stack`中有五个`iteration`函数的调用。

  如果忘记加上终止递归的条件，会导致**栈溢出**（`RangeError: Maximum call stack size exceeded`）。

  #### 尾递归版本
  ES6加入了尾调用优化的概念，指的是在函数的最后调用另一个函数。如果尾调用自身叫做尾递归，看下面的代码。
  ```js
  function iteration(num, total) {
    if (num === 1) {
      return total;
    }
    return iteration(num - 1, num * total);
  }

  console.log(iteration(5, 1));
  ```
  在递归阶乘中的例子中，计算`n`的阶乘，最多需要保存`n`个调用记录。改写使用尾递归，只会保留一个调用记录，这样就不会出现**栈溢出**这种情况。
 */
