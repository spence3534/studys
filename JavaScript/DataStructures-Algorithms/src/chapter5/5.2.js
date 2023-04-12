/*
  ## 双端队列
  **双端队列**是一种同时可以从前和后添加或移除的特殊队列。

  在生活中也有很多常见的例子，例如：在食堂排队，你刚打完饭，发现阿姨给的饭有点少，就可以直接回到队伍头部叫阿姨给多点饭。另外，在队伍末尾的人看到前面排有很多人，你可以直接离开队伍。

  在计算机中，双端队列的一个常见的应用就是存储一系列的撤销操作。每当用户在软件中进行了一个操作，这个操作会被存在双端
  队列中。当用户点击撤销按钮时，这个操作会被从双端队列中弹出，表示它被从后面移除了。在进行了预先给定的数量操作后，
  最先进行的操作会被从双端队列的前端移除。这样双端队列同时遵守了先进先出和后进先出的原则，可以说是把队列和栈相结合
  的一种数据结构。

  ### 创建Deque类
  跟之前一样的，先声明一个`Deque`类以及构造函数。
  ```js
  class Deque {
    constructor() {
      this.count = 0;
      this.lowestCount = 0;
      this.items = {};
    }
  }
  ```
  既然双端队列是一种特殊的队列，可以看到构造函数的部分代码和队列一样的，包括相同的内部属性和下面的方法：`isEmpty`、
  `clear`、`size`和`toString`。

  双端队列可以在两端添加和移除元素，下面列出这几种方法。
  * `addFront`：在双端队列前面添加新的元素。
  * `addBack`：在双端队列的后面添加新元素。
  * `removeFront`：从双端队列前面移除一个元素。
  * `removeBack`：从双端队列后面移除一个元素。
  * `peekFront`：获取双端队列前面的第一个元素。
  * `peekBack`：获取双端队列后面的第一个元素。
  
  #### addFront方法
  ```js
  addFront(ele) {
    if (this.isEmpty) {
      this.addBack(ele);
    } else if (this.lowestCount > 0) {
      this.lowestCount--;
      this.items[this.lowestCount] = ele;
    } else {
      for (let i = this.count; i > 0; i--) {
        this.items[i] = this.items[i - 1];
      }
      this.count++;
      this.lowestCount = 0;
      this.items[0] = ele;
    }
  }
  ```
  要把一个元素添加到双端队列的前端，有三种情况。

  第一种情况：如果双端队列为空，就把元素从后面添加到双端队列中，也是添加到双端队列的前端。

  第二种情况：一个元素已经从双端队列的前端被移除，也就是说`lowestCount`的值大于等于`1`，只需要把`lowestCount`
  的值减`1`
  
  第三种情况：`lowestCount`为`0`时，我们可以设置一个负值的键，就拿数组来说，要在第一位添加一个新元素，就要把所有的元素
  都往后挪一位来空出第一个位置。于此同时，我们并不想丢失任何已经存在双端队列里的值，就从最后一位开始迭代所有的值，并
  把元素赋上索引值减`1`的位置的值。在所有的元素都完成移动之后，第一位的索引值将是`0`，再把添加的新元素覆盖它就可以了。

  ### 使用Deque类
  ```js
  const deque = new Deque();

  deque.addBack("小红");
  deque.addBack("小明");
  console.log(deque.toString()); // 小红, 小明

  deque.addBack("小兰");
  console.log(deque.toString()); // 小红, 小明, 小兰
  console.log(deque.size()); // 3

  console.log(deque.isEmpty()); // false

  deque.removeFront(); // 小红走了

  console.log(deque.toString()); // 小明, 小兰

  deque.removeBack(); // 小兰走了
  console.log(deque.toString()); // 剩下小明

  deque.addFront("小红"); // 这小红胃口有点大，决定回去叫阿姨给多点饭
  console.log(deque.toString()); // 小红, 小明
  ```
  以上就是双端队列的所有操作。下面是双端队列的所有代码。
  ```js
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
        for (let i = this.count; i > 0; i++) {
          this.items[i] = this.items[i - 1];
        }
        this.count++;
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

      let result = this.items[this.lowestCount];
      delete this.items[this.lowestCount];
      this.lowestCount++;
      return result;
    }

    removeBack() {
      if (this.isEmpty()) {
        return undefined;
      }

      this.count--;
      let result = this.items[this.count];
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
      this.items = {};
      this.count = 0;
      this.lowestCount = 0;
    }

    toString() {
      if (this.isEmpty()) {
        return "";
      }

      let objString = this.items[this.lowestCount];
      for (let i = this.lowestCount + 1; i < this.count; i++) {
        objString = `${objString}, ${this.items[i]}`;
      }
      return objString;
    }
  }
  ```
 */
