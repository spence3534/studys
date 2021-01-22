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

queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);