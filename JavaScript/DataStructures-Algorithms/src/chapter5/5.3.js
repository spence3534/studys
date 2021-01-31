/*
  ## 用队列、双端队列解决问题

  ### 循环队列——击鼓传花游戏

  循环队列的一个例子是击鼓传花游戏。在这个游戏里，小孩子围成一个圆圈，把花尽快地传递给旁边的人。某一时刻传花停止了，花在谁
  手里，谁就被淘汰，重复这个过程，直到只剩下一个孩子。

  下面来模拟击鼓传花游戏。
  ```js
  function hotPotato(names, num) {
    const queue = new Queue();
    const eliminatedList = []; // 淘汰的名单

    for (let i = 0; i < names.length; i++) {
      // 先把传入的人名添加到队列里
      queue.enqueue(names[i]);
    }

    // size()是队列的元素个数
    while (queue.size() > 1) {
      // 根据传入的次数进行循环
      for (let i = 0; i < num; i++) {
        // 从队列的头部移除一项，并把移除的这项放到队列尾部
        queue.enqueue(queue.dequeue());
      }
      // for循环一旦达到传入次数时，就把队列最前一项移除并添加到names数组中
      eliminatedList.push(queue.dequeue());
    }

    return {
      eliminated: eliminatedList,
      // 把队列里剩下最后一个元素移除，也是获胜者
      winner: queue.dequeue(),
    };
  }
  ```
  这里就用上面的`Queue`类了。`hotPotato`函数接收两个参数：`names`是一份名单，`num`是循环次数。首先把名单里的名字添加到
  队列中，然后用`num`迭代队列，从队列头部移除一项并这项添加到队列尾部。一旦达到`num`的次数（`for`循环停止了），将从队列移
  除一个元素并添加到淘汰名单里，直到队列里只剩下一个元素，这个元素就是获胜的人。

  ```js
  const names = ["小红", "小黄", "小明", "小兰", "小吕"];
  const result = hotPotato(names, 1);

  result.eliminated.forEach((item) => {
    console.log(`${item}被淘汰`);
    // 小黄被淘汰;
    // 小兰被淘汰;
    // 小红被淘汰;
    // 小吕被淘汰;
  });
  console.log(`${result.winner}胜利了`);
  // 小明胜利了
  ```
  `num`参数可以传入不同的数值，模拟不同的场景。

  ### 回文检查
  回文是把相同的词汇或句子，在下文中调换位置或颠倒过来，产生首尾回环的情趣，叫做“回文”。

  有不同的算法可以检查一个词或字符串是不是回文。最简单的方式就是把字符串反转过来并检查它和原字符串
  是否相同，如果相同，那就是回文。可以用栈来实现，但是利用数据结构来解决这个问题的最简单的方法就是
  双端队列。
  ```js
  function palindromeCheck(str) {
    if (str === undefined || str === null || (str !== null && str.length === 0)) {
      return false;
    }

    const deque = new Deque();
    // 把字符串转成小写并剔除空格
    const lowerString = str.toLocaleLowerCase().split(" ").join("");
    // 是否为回文标识
    let isEqual = true;
    let firstChar = ""; // 双端队列前面的字符串
    let lastChar = ""; // 双端队列后面的字符串

    for (let i = 0; i < lowerString.length; i++) {
      deque.addBack(lowerString.charAt(i));
    }

    while (deque.size() > 1 && isEqual) {
      // 从双端队列的前端移除元素并返回
      firstChar = deque.removeFront(); 
      // 从双端队列的后端移除元素并返回
      lastChar = deque.removeBack();
      // 如果双端队列前后端移除的元素互不相同就不是回文
      if (firstChar !== lastChar) {
        isEqual = false;
      }
      return isEqual;
    }
  }

  console.log("1", palindromeCheck("上海自来水来自海上")); //true
  console.log("2", palindromeCheck("天连碧水碧连天")); // true
  console.log("3", palindromeCheck("小姐姐姐姐小")); // true
  console.log("4", palindromeCheck("知道不不知道")); // false
  ```

  ### JavaScript任务队列
  任务队列中包含了输入事件（鼠标滚动、点击、移动）、微任务、文件读写、websocket、定时器
  消息队列中的任务是宏任务，每个宏任务中包含一个微任务队列。在执行宏任务的过程中，如果DOM发生变化，就将该变化添加到微任务中。
  等宏任务中的主要功能完成之后，将执行当前宏任务中的微任务。

  chrome会维护两个队列：消息队列，需要延迟执行的队列（setTimeout其他一些要延迟执行的任务）。
  处理完消息队列中的一个任务之后，就执行延迟队列中的任务，根据发起时间和延迟时间计算出到期的任务，等到期的任务执行完之后，再继续下一个循环过程。

  消息队列中宏任务的执行过程：
  先从多个消息队列中选出一个最老的任务，这个任务称为oldestTask。
  然后循环系统记录任务开始执行的时间，并把这个oldestTask设置成当前正在执行的任务
  当任务执行完成之后，删除当前正在执行的任务，并从对应的消息队列中删除这个oldestTask
  最后统计执行完成的时长等信息。

  setTimeout函数触发的回调函数都是宏任务

  异步回调概念有两种方式
  1. 把异步回调函数封装成一个宏任务，添加到消息队列尾部，当循环系统执行到该任务的时候执行回调函数。
  2. 执行时机是在主函数执行结束之后、当前宏任务结束之前执行回调函数。这通常都是以微任务形式体现的。

  微任务
  微任务就是一个需要异步执行的函数，执行时机是在主函数执行结束之后、当前宏任务之前。

  每个宏任务够关联了一个微任务队列。宏任务包括主体代码块和消息队列中的任务。
  MutationObserver属于微任务
  Promise.resolve()（.then）或Promise.reject()（.catch）属于微任务

  微任务队列什么时候被执行？
  在当前宏任务中快执行完成时，js引擎会检查全局执行上下文中的微任务队列，然后按照顺序执行队列中的微任务。执行微任务的时间点叫做检查点。

  如果在执行微任务的过程中，产生新的微任务，会将该微任务添加到微任务队列里，V8引擎一直循环执行微任务队列中的任务，直到队列为空才算执行结束。
  也就是说在执行微任务过程中产生新的微任务并不会推迟到下一个宏任务中执行，而是在当前的宏任务中继续执行。

  微任务和宏任务是绑定的，每个宏任务在执行时，会创建自己的微任务列表。
  微任务的执行时长会影响到当前宏任务的时长。
  在一个宏任务中，分别创建一个用于回调的宏任务和微任务，不管什么情况下，微任务都早于宏任务执行。
*/