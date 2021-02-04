/*
  ## 双向链表

  双向链表和普通链表的区别在于，链表只是单向的链接。而在双向链表里，链接是双向的：第一个元素链向第二个元素，第二个元素又链向第一个元素，
  如下图。

  <img src="./images/6/6-2-1.png" />
  可以看出，双向链表的每个元素都多出了一个指针（`prev`），指向上一个元素。

  ### 创建双向链表
  下面就来实现双向链表的代码。
  ```js
  class DoublyLinkedList extends LinkedList {
    constructor(equalsFn) {
      super(equalsFn);
      this.tail = undefined; // 最后一个元素的引用
    }
  }
  ```
  由于双向链表是一种特殊的链表，这里就使用了`ES6`的`extends`关键字继承了`LinkedList`上的所有属性和方法，并且添加一个`tail`属性用于
  保存链表的最后一个元素的引用。

  ```js
  class DoublyNode extends Node {
    constructor(ele, next, prev) {
      super(ele, next);
      this.prev = prev; // 新增：前一个元素
    }
  }
  ```
  双向链表有两种迭代的方法：从头到尾或从尾到头。我们也可以访问一个特定节点的上一个或下一个元素。实现这种行为，需要追踪每个节点的前一个节点。
  所以除了`Node`类里的`element`和`next`属性，`DoubleLinkedList`会使用一个特殊的节点`DoublyNode`，该节点有一个`prev`属性。还是一样，
  `DoublyNode`继承`Node`上的所有属性。

  在单向链表里，如果迭代的时候错过了要找的元素，就需要回到起点，重新开始迭代。这是双向链表的优势。

  ### 插入元素
  往双向链表中插入一个新元素和（单向）链表类似。区别就在于，链表只要控制一个`next`指针，而双向链表需要控制`next`和`prev`两个指针。
  在`DoublyLinkedList`类里，将重写`insert`方法。
  ```js
  insert(ele, index) {
    if (index >= 0 && index <= this.count) {
      const node = new DoublyNode(ele);
      let current = this.head;
      // 情况1
      if (index === 0) {
        if (this.head === undefined) {
          // 新增
          this.head = node;
          this.tail = node;
        } else {
          node.next = this.head;
          current.prev = node; // 新增
          this.head = node;
        }
      } else if (index === this.count) {
        //情况2
        current = this.tail;
        current.next = node;
        node.prev = current;
        this.tail = node;
      } else {
        //情况3
        const prev = this.getElementAt(index - 1);
        current = prev.next;
        node.next = current;
        prev.next = node;
        current.prev = node; // 新增
        node.prev = prev; // 新增
      }
      this.count++;
      return true;
    }
    return false;
  }
  ```
  上面的代码中，插入一个元素，有三种情况。
  1. 在双向链表的第一个位置插入一个元素。如果双向链表为空，只要把`head`和`tail`指向这个节点。如果不为空，`current`变量就是
  双向链表里第一个元素。就和单向链表中的`insert`方法操作差不多，主要区别就在于需要给指向上一个元素的指针设一个值。`current.prev`
  指针指向`undefined`变成指向新元素，`node.prev`指针已经是`undefined`，所以不需要做任何操作。下图展示整个操作的过程。

  <img src="./images/6/6-2-2.png" />

  2. 如果要在双向链表最后添加一个元素。就需要控制指向最后一个元素的指针。`current`引用最后一个元素，然后建立链接，`current.next`
  指针将指向`node`（而`node.next`已经指向了`undefined`）。`node.prev`引用`current`。最后更新`tail`，它指向`current`变成
  指向`node`。下图展示整个操作的过程。

  <img src="./images/6/6-2-3.png" />

  3. 在双向链表中间插入一个元素，就跟之前的方法中所做的，迭代双链表，直到要找的位置。使用从`LinkedList`继承的`getElementAt`方法，
  在`current`和`prev`之间插入元素。先把`node.next`指向`current`，而`prev.next`指向`node`，然后需要处理所有的链接：`current.prev`
  指向`node`，而`node.prev`指向`prev`。下图展示整个操作的过程。

  <img src="./images/6/6-2-4.png" />

  ### 在任何位置移除元素
  在双向链表中移除元素和链表类似。区别在于，需要设置前一个位置的指针。
  ```js
  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;

      if (index === 0) {
        // 把head改成当前元素的下一个元素
        this.head = current.next;
        if (this.count === 1) {
          this.tail = undefined;
        } else {
          this.head.prev = undefined;
        }
      } else if (index === this.count - 1) {
        current = this.tail;
        // tail更新为倒数第二个元素
        this.tail = current.prev;
        this.tail.next = undefined;
      } else {
        // 当前元素
        current = this.getElementAt(index - 1);
        // 当前元素前面一个元素
        const prev = current.prev;
        // 当前元素前面一个元素指针指向当前元素的下一个元素，跳过当前元素
        prev.next = current.next;
        // 当前元素的prev指针指向前面一个元素
        current.next.prev = prev;
      }
      this.count--;
      return current.element;
    }
    return undefined;
  }
  ```
  同样的，需要处理三种情况：从头部、中间和尾部移除一个元素。
  1. 移除第一个元素：`current`是双向链表中的第一个元素，也是要移除的元素。就需要改变`head`的引用，把`head`从`current`改成下一个元素。
  还要更新`current.next`指向上一个元素的指针（第一个元素的`prev`指针是`undefined`）。因此，把`head.prev`的引用改成`undefined`。还
  需要控制`tail`的引用，可以检查要移除的元素是否是第一个，是的话就把`tail`设置为`undefined`。下图展示操作过程。

  <img src="./images/6/6-2-2-1.png" />

  2. 从最后一个位置移除元素：有了最后一个元素的引用（`tail`），就不需要迭代双向链表找到它。直接把`tail`赋给`current`变量。接下来，把`tail`
  更新为双链表的倒数第二个元素。然后再把`next`指针更新为`undefined`。下图展示操作过程。
  
  <img src="./images/6/6-2-2-2.png" />

  3. 从双向链表中间移除一个元素：首先需要迭代双向链表，直到该元素的位置。`current`变量就是要移除的元素。通过`prev.next`和`current.prev`
  的引用，直接跳过它。`prev.next`指向`current.next`，而`current.next.prev`指向`prev`，如下图。

  <img src="./images/6/6-2-2-3.png" />
 */

class LinkedList {
  constructor() {
    this.count = 0; // 存储链表元素数量
    this.head = undefined; // 第一个元素的引用
    // 比较链表中的元素是否相等
    this.equalsFn = function (a, b) {
      return a === b;
    };
  }

  push(ele) {
    const node = new Node(ele);
    let current = "";
    if (this.head === undefined) {
      // node里面的next属性始终undefined
      this.head = node;
    } else {
      current = this.head;
      while (current.next !== undefined) {
        // 设置current为下一个元素
        current = current.next;
      }
      // current.next为undefined就表示到了链表的尾部，然后把最后一个元素的next属性设置为下一元素
      current.next = node;
    }
    this.count++;
  }

  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;

      if (index === 0) {
        this.head = current.next;
      } else {
        const prev = this.getElementAt(index - 1);
        console.log(prev);
        current = prev.next;
        prev.next = current.next;
      }
      this.count--;
      return current.element;
    }
    return undefined;
  }

  getElementAt(index) {
    if (index >= 0 && index <= this.count) {
      // 初始化node变量，从链表的第一个元素开始迭代
      let node = this.head;
      for (let i = 0; i < index && node !== undefined; i++) {
        node = node.next;
      }
      return node;
    }
    return undefined;
  }

  insert(ele, index) {
    if (index >= 0 && index <= this.count) {
      const node = new Node(ele);
      if (index === 0) {
        const current = this.head;
        node.next = current;
        this.head = node;
      } else {
        // 需要添加新节点位置的前一个位置
        const prev = this.getElementAt(index - 1);
        // 需要添加新节点位置的后一个位置
        const current = prev.next;
        node.next = current;
        prev.next = node;
      }
      this.count++;
      return true;
    }
    return false;
  }

  indexOf(ele) {
    let current = this.head;
    for (let i = 0; i < this.count && current !== undefined; i++) {
      if (this.equalsFn(ele, current.element)) {
        return i;
      }
      current = current.next;
    }
    return -1;
  }

  remove(ele) {
    const index = this.indexOf(ele);
    return this.removeAt(index);
  }

  isEmpty() {
    return this.size() === 0;
  }

  size() {
    return this.count;
  }

  getHead() {
    return this.head;
  }

  toString() {
    if (this.head === undefined) {
      return "";
    }

    let objString = this.head.element;
    let current = this.head.next;
    for (let i = 0; i < this.size() && current !== undefined; i++) {
      objString = `${objString}, ${current.element}`;
      current = current.next;
    }
    return objString;
  }
}
// Node类：想要添加到链表中的项。
class Node {
  constructor(ele) {
    this.element = ele; // 想要加入链表元素的值
    this.next = undefined; // 指向链表中下一个元素的指针。
  }
}

class DoublyNode extends Node {
  constructor(ele, next, prev) {
    super(ele, next);
    this.prev = prev; // 新增：前一个元素
  }
}

class DoublyLinkedList extends LinkedList {
  constructor(equalsFn) {
    super(equalsFn);
    this.tail = undefined; // 最后一个元素的引用
  }

  insert(ele, index) {
    if (index >= 0 && index <= this.count) {
      const node = new DoublyNode(ele);
      let current = this.head;
      // 情况1
      if (index === 0) {
        if (this.head === undefined) {
          // 新增
          this.head = node;
          this.tail = node;
        } else {
          node.next = this.head;
          current.prev = node; // 新增
          this.head = node;
        }
      } else if (index === this.count) {
        //情况2
        current = this.tail;
        current.next = node;
        node.prev = current;
        this.tail = node;
      } else {
        //情况3
        const prev = this.getElementAt(index - 1);
        current = prev.next;
        node.next = current;
        prev.next = node;
        current.prev = node; // 新增
        node.prev = prev; // 新增
      }
      this.count++;
      return true;
    }
    return false;
  }

  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;

      if (index === 0) {
        // 把head改成当前元素的下一个元素
        this.head = current.next;
        if (this.count === 1) {
          this.tail = undefined;
        } else {
          this.head.prev = undefined;
        }
      } else if (index === this.count - 1) {
        current = this.tail;
        // tail更新为倒数第二个元素~
        this.tail = current.prev;
        this.tail.next = undefined;
      } else {
        // 当前元素
        current = this.getElementAt(index - 1);
        // 当前元素前面一个元素
        const prev = current.prev;
        // 当前元素前面一个元素指针指向当前元素的下一个元素，跳过当前元素
        prev.next = current.next;
        // 当前元素的prev指针指向前面一个元素
        current.next.prev = prev;
      }
      this.count--;
      return current.element;
    }
    return undefined;
  }
}

const list = new DoublyLinkedList();
list.insert(5, 0);
list.insert(10);
list.insert(15);
console.log(list.toString());
list.removeAt(0);
console.log(list);
