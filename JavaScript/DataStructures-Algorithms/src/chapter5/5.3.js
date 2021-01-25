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
*/
class Queue {
  constructor() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }

  enqueue(ele) {
    this.items[this.count] = ele;
    this.count++;
  }

  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }

    const result = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    this.lowestCount++;
    return result;
  }

  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.lowestCount];
  }

  isEmpty() {
    return this.count - this.lowestCount === 0;
  }

  size() {
    return this.count - this.lowestCount;
  }

  clear() {
    this.items = {};
    this.count = 0;
    this.lowestCount = 0;
  }

  toString() {
    if (this.isEmpty()) {
      return "";
    }

    let objString = `${this.items[this.lowestCount]}`;

    for (let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString},${this.items[i]}`;
    }

    return objString;
  }
}

function hotPotato(names, num) {
  const queue = new Queue();
  const eliminatedList = []; // 淘汰的人名

  for (let i = 0; i < names.length; i++) {
    // 先把传入的人名添加到队列里
    queue.enqueue(names[i]);
  }

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
    winner: queue.dequeue(),
  };
}
const names = ["小红", "小黄", "小明", "小兰", "小吕"];
const result = hotPotato(names, 1);

result.eliminated.forEach((item) => {
  console.log(`${item}被淘汰`);
});
console.log(`${result.winner}胜利了`);
