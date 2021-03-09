/*
  # 队列和双端队列
  队列和栈非常相似，但是使用了跟后进先出的不同规则。双端队列是一种把栈的原则和队列的原则混合在一起的数据结构。

  ## 队列
  队列是遵循**先进先出**（FIFO，也就是先进来的先出去）原则的一组有序的项。队列是在尾部添加新元素，并从顶部
  移除元素，最新添加的元素必须排在队列的末尾。

  在生活中有很多例子跟队列一样的，就好比如超市的收银台一样，都会排队，而排在第一位的人先接受服务。

  在计算机当中，一个比较常见的例子就是打印文件，比如说需要打印五份文件。我们会打开每个文件，然后点击
  打印。每个文件都会被发送到打印队列。第一个发送到打印队列的文档会先被打印，以此类推，直到打印完所有文件。

  ### 创建队列
  下面来创建一个类表示队列。
  ```js
  class Queue {
    constructor() {
      this.count = 0;
      this.lowestCount = 0; // 跟踪队列第一个元素的值
      this.items = {};
    }
  }
  ```
  首先用一个存储队列中的数据结构，可以是数组，也可以是对象。`items`就是用来存储元素的。而你会发现`Queue`类和
  `Stack`类非常类似，只是添加和删除的原则不一样而已。

  `count`属性是帮助我们控制队列的大小的。由于要把队列前端的元素移除，就需要一个变量来帮助我们追踪第一个元素。
  因此，声明一个`lowestCount`变量。

  以下是声明一些队列的方法。
  * `enqueue`：向队列的尾部添加一个或多个元素。
  * `dequeue`：移除队列的第一项并且返回移除的元素。
  * `peek`：返回队列中的最先添加的元素，也是最先被移除的元素。
  * `isEmpty`：如果队列为空，返回`true`，否则返回`false`。
  * `size`：返回队列中存在的元素个数，和数组的`length`类似。
  
  #### 向队列添加元素
  首先实现`enqueue`方法，该方法的用处是向队列添加元素，记住！新的项只能添加到队列末尾。这个方法和`Stack`类的
  `push`方法一样。
  ```js
  enqueue(ele) {
    this.items[this.count] = ele;
    this.count++;
  }
  ```

  #### 从队列移除元素
  下面就是`dequeue`方法，用处就是从队列移除元素。由于队列遵循先进先出的原则，最先添加的项就是最先被移除的。
  ```js
  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }

    // 暂存队列头部的值
    const result = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    this.lowestCount++;
    // 移除之后并返回
    return result;
  }
  ```
  有了这两个方法，`Queue`类就遵循了先进先出的原则。

  #### 查看队列最前元素
  `peek`方法用于查看队列最前面的元素。把`lowestCount`作为键名来获取元素值。
  ```js
  peek() {
    if (this.isEmpty()) {
      return undefined;
    }

    return this.items[this.lowestCount];
  }
  ```

  #### 检查队列是否为空并获取它的长度
  `isEmpty`方法和`Stack`类里的`isEmpty`一样，只不过这里用`count`和`lowestCount`之间的差值计算而已。
  ```js
  isEmpty() {
    return this.count - this.lowestCount === 0;
  }
  ```

  当然，`size`方法也如此，也是用`count`和`lowestCount`之间的差值计算。`size`方法只要返回这个差值就行了。
  ```js
  size() {
    return this.count - this.lowestCount;
  }
  ```

  #### 清空队列
  清空队列里的所有元素，直接把队列里面的属性值重置为构造函数里一样就可以了。
  ```js
  clear() {
    this.items = {};
    this.count = 0;
    this.lowestCount = 0;
  }
  ```

  #### 创建toString方法
  下面来增加一个`toString`方法。
  ```js
  toString() {
    if (this.isEmpty()) {
      return '';
    }

    let objString = `${this.items[this.lowestCount]}`;

    for (let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString},${this.items[i]}`;
    }

    return objString;
  }
  ```
  由于`Queue`类中的第一个索引不一定是`0`，所以从索引值为`lowestCount`的位置开始迭代。
  
  这样一个队列就大功告成了。

  `Queue`类和`Stack`类非常像。只不过区别就在于`dequeue`方法和`peek`方法，就在于这两个数据结构的原则不一样所导致的。

  ### 使用Queue类
  下面我们就来使用这个`Queue`类，先验证一下是否为空。
  ```js
  const queue = new Queue();

  console.log(queue.isEmpty()); // true
  ```
  接下来，添加一些元素，可以是任何类型的元素。
  ```js
  queue.enqueue("xiaohong");
  queue.enqueue("xiaoming");
  queue.enqueue("xiaolan");
  ```
  再执行一下其他方法。
  ```js
  console.log(queue.toString()); // 队列里有xiaohong,xiaoming,xiaolan
  console.log(queue.size()); // 3 // 队列里有三个元素
  console.log(queue.isEmpty()); // false 队列不为空
  console.log(queue.dequeue()); // 移除xiaohong
  console.log(queue.dequeue()); // 移除xiaoming
  console.log(queue.toString()); // 队列最后剩下xiaolan
  ```
  以上就是队列所有的操作。下面列出队列的所有代码。
  ```js
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
        return '';
      }

      let objString = `${this.items[this.lowestCount]}`;

      for (let i = this.lowestCount + 1; i < this.count; i++) {
        objString = `${objString},${this.items[i]}`;
      }

      return objString;
    }
  }

  const queue = new Queue();

  console.log(queue.isEmpty()); // true

  queue.enqueue("xiaohong");
  queue.enqueue("xiaoming");
  queue.enqueue("xiaolan");

  console.log(queue.toString()); // 队列里有xiaohong,xiaoming,xiaolan
  console.log(queue.size()); // 3 // 队列里有三个元素
  console.log(queue.isEmpty()); // false 队列不为空
  console.log(queue.dequeue()); // 移除xiaohong
  console.log(queue.dequeue()); // 移除xiaoming
  console.log(queue.toString()); // 队列最后剩下xiaolan
  ```
*/

/* class Queue {
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
    console.log(eliminatedList);
    console.log(queue.toString());
  }

  return {
    eliminated: eliminatedList,
    // 把队列里剩下最后一个元素移除，也是获胜者
    winner: queue.dequeue(),
  };
}

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
// 小明胜利了 */

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
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }

  toString() {
    if (this.isEmpty()) {
      return "";
    }

    let objString = `${this.items[this.lowestCount]}`;
    for (let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString}, ${this.items[i]}`;
    }

    return objString;
  }
}

class Deque {
  constructor() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }

  addFront(ele) {
    if (this.isEmpty()) {
      this.addBack(ele);
    } else if (this.lowestCount > 0) {
      this.lowestCount--;
      this.items[this.lowestCount] = ele;
    } else {
      for (let i = this.count; i > 0; i--) {
        this.items[i] = this.items[i - 1];
      }
      this.count--;
      this.lowestCount = 0;
      this.items[0] = ele;
    }
  }

  addBack(ele) {
    this.items[this.count] = ele;
    this.count++;
  }

  removeFront() {
    if (this.isEmpty()) {
      return undefined;
    }
    const result = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    this.lowestCount++;
    return result;
  }

  removeBack() {
    if (this.isEmpty()) {
      return undefined;
    }

    this.count--;
    const result = this.items[this.count];
    delete this.items[this.count];
    return result;
  }

  peekFront() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.lowestCount];
  }

  peekBack() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.count - 1];
  }

  isEmpty() {
    return this.count - this.lowestCount === 0;
  }

  size() {
    return this.count - this.lowestCount;
  }

  clear() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }

  toString() {
    if (this.isEmpty()) {
      return "";
    }

    let objString = `${this.items[this.lowestCount]}`;
    for (let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString}, ${this.items[i]}`;
    }
    return objString;
  }
}

function hotPotato(names, num) {
  const queue = new Queue();
  const eliminatedList = [];

  for (let i = 0; i < names.length; i++) {
    queue.enqueue(names[i]);
  }

  while (queue.size() > 1) {
    for (let i = 0; i < num; i++) {
      console.log(queue.items);
      queue.enqueue(queue.dequeue());
    }

    eliminatedList.push(queue.dequeue());
  }

  return {
    eliminated: eliminatedList,
    winner: queue.dequeue(),
  };
}

const names = [
  "前端工程师",
  "后端工程师",
  "算法工程师",
  "测试工程师",
  "运维工程师",
];

const result = hotPotato(names, 1);

result.eliminated.forEach((item) => {
  console.log(`${item}被淘汰了`);
});
// 后端工程师被淘汰了
// 测试工程师被淘汰了
// 前端工程师被淘汰了
// 运维工程师被淘汰了
console.log(`${result.winner}获胜了！`);
// 算法工程师获胜了！

function palindromeCheck(str) {
  // 判断传入的字符串是否合法
  if (str === undefined || str === null || (str != null && str.length === 0)) {
    return false;
  }

  const deque = new Deque();
  // 把字符串转成小写并剔除空格
  const lowerString = str.toLocaleLowerCase().split(" ").join("");

  // 回文标识
  let isEqual = true;

  // 存储双端队列头部字符串
  let firstChar = "";

  // 存储双端队列尾部字符串
  let lastChar = "";

  // 将字符串逐个添加到双端队列中
  for (let i = 0; i < lowerString.length; i++) {
    deque.addBack(lowerString.charAt(i));
  }

  while (deque.size() > 1 && isEqual) {
    // 移除双端队列头部的字符串并将返回结果赋值给firstChar变量
    firstChar = deque.removeFront();

    // 移除双端队列尾部的字符串并将返回结果赋值给lastChar变量
    lastChar = deque.removeBack();

    // 如果双端队列两端移除的元素互不相同，证明不是回文
    if (firstChar !== lastChar) {
      isEqual = false;
    }
    return isEqual;
  }
}

console.log(palindromeCheck("stts")); // true
console.log(palindromeCheck("level")); // true
console.log(palindromeCheck("小姐姐姐姐小")); // true
console.log(palindromeCheck("上海自来水来自海上")); // true
console.log(palindromeCheck("知道不不知道")); // false
