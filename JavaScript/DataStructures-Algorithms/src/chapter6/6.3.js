/*
  ## 循环链表

  **循环链表**是单双向链表的组合体。可单向引用，也可以双向引用。和链表之间的唯一区别就是，最后一个元素指向下一个
  元素的指针（`tail.next`）不是引用`undefined`，而是指向第一个元素`head`。如图所示。

  <img src="./images/6/6-3-1.png" />

  双向循环链表的`tail.next`指向`head`，`head.prev`则指向`tail`。

  <img src="./images/6/6-3-2.png" />

  ### 创建循环链表
  ```js
  class CircularLinkedList extends LinkedList {
    constructor(equalsFn) {
      super(equalsFn);
    }
  }
  ```
  `CircularLinkedList`类没有任何额外的属性，直接继承`LinkedList`类并且覆盖要改写的方法就行了。

  ### 在任何位置插入元素

  向循环链表插入元素的逻辑跟向普通链表中插入元素的逻辑一样。不同之处就是把循环链表尾部节点的`next`指向头部节点。
  ```js
  insert(ele, index) {
    if (index >= 0 && index <= this.count) {
      const node = new Node(ele);
      let current = this.head;
      if (index === 0) {
        if (this.head === undefined) {
          this.head = node;
          // 插入元素的next指针指向头部元素（也就是指向了本身）
          node.next = this.head;
        } else {
          node.next = current;
          // 获取链表最后一个元素
          current = this.getElementAt(this.size());
          // 更新链表
          this.head = node;
          // 最后一个元素指针指向头部元素
          current.next = this.head;
        }
      } else {
        // 和单链表的insert没变
        const prev = this.getElementAt(index - 1);
        node.next = prev.next;
        prev.next = node;
      }
      this.count++;
      return true;
    }
    return false;
  }
  ```

  来分析一样两种不同的场景。
  1. 要在循环链表第一个位置插入元素，如果循环链表为空，就把`head`属性赋值为`node`，并把最后一个元素链接到`head`。而
  这个最后的元素也就是`node`。同时也是`head`。

  <img src="./images/6/6-3-1-1.png" />

  2. 在一个非空循环链表的第一个位置插入元素，需要把`node.next`指向`head`（`current`变量）。然后用`getElementAt`方法，
  传入循环链表的长度作为参数。将头部元素更新为新元素，再把最后一个节点（current）指向新的头部节点。

  <img src="./images/6/6-3-1-2.png" />

  如果想在循环链表中间插入元素，代码和`LinkedList`一模一样，因为并没有对循环链表的第一个和最后一个节点做任何修改。

  ### 从任意位置移除元素
  ```js
  removeAt(index) {
    if (index >= 0 && index <= this.count) {
      let current = this.head;
      if (index === 0) {
        if (this.size() === 1) {
          this.head = undefined;
        } else {
          const removed = this.head;
          current = this.getElementAt(this.size());
          this.head = this.head.next;
          current.next = this.head;
          // 改变current引用，因为后面return的时候要用到并且表示移除了元素的值。
          current = removed;
        }
      } else {
        // 不变
        const prev = this.getElementAt(index - 1);
        current = prev.next;
        prev.next = current.next;
      }
      this.count--;
      return current.element;
    }
    return undefined;
  }
  ```
  从循环链表中移除元素，只要考虑第二种情况，也就是修改循环链表的`head`元素。
  1. 第一种情况是从只有一个元素的循环链表中移除元素，只需要把`head`赋值为`undefined`。
  2. 第二种情况是从一个非空循环链表中移除第一个元素。首先保存现在的`head`元素引用，将从循环链表中移除。接下来，获取
  循环链表最后一个元素的引用，它被存储在`current`变量里。获取所有需要的节点引用之后，开始构建新的节点指向。首先，更新
  `head`，把`head`指向第二个元素，然后再把最后一个元素指向`head`。最后更新`current`变量的引用，因为还要返回删除的
  元素的值表示移除元素的值。

  <img src="./images/6/6-3-1-3.png" />

  ### 循环链表整体代码
  ```js
  class CircularLinkedList extends LinkedList {
    constructor(equalsFn) {
      super(equalsFn);
    }

    push(ele) {
      const node = new Node(ele);
      let current = "";
      if (this.head === undefined) {
        this.head = node;
      } else {
        current = this.getElementAt(this.size() - 1);
        current.next = node;
      }
      node.next = this.head;
      this.count++;
    }

    insert(ele, index) {
      if (index >= 0 && index <= this.count) {
        const node = new Node(ele);
        let current = this.head;
        if (index === 0) {
          if (this.head === undefined) {
            this.head = node;
            // 插入元素的next指针指向头部元素（也就是指向了本身）
            node.next = this.head;
          } else {
            node.next = current;
            // 获取循环链表最后一个元素
            current = this.getElementAt(this.size());
            // 更新链表
            this.head = node;
            // 最后一个元素指针指向头部元素
            current.next = this.head;
          }
        } else {
          const prev = this.getElementAt(index - 1);
          node.next = prev.next;
          prev.next = node;
        }
        this.count++;
        return true;
      }
      return false;
    }

    removeAt(index) {
      if (index >= 0 && index <= this.count) {
        let current = this.head;
        if (index === 0) {
          if (this.size() === 1) {
            this.head = undefined;
          } else {
            const removed = this.head;
            current = this.getElementAt(this.size());
            this.head = this.head.next;
            current.next = this.head;
            // 改变current引用，因为后面return的时候要用到并且表示移除了元素的值。
            current = removed;
          }
        } else {
          const prev = this.getElementAt(index - 1);
          current = prev.next;
          prev.next = current.next;
        }
        this.count--;
        return current.element;
      }
      return undefined;
    }
  }
  ```
 */
const { LinkedList, Node } = require("./6.2");

class CircularLinkedList extends LinkedList {
  constructor(equalsFn) {
    super(equalsFn);
  }

  push(ele) {
    const node = new Node(ele);
    let current = "";
    if (this.head === undefined) {
      this.head = node;
    } else {
      current = this.getElementAt(this.size() - 1);
      current.next = node;
    }
    node.next = this.head;
    this.count++;
  }

  insert(ele, index) {
    if (index >= 0 && index <= this.count) {
      const node = new Node(ele);
      let current = this.head;
      if (index === 0) {
        if (this.head === undefined) {
          this.head = node;
          // 插入元素的next指针指向头部元素（也就是指向了本身）
          node.next = this.head;
        } else {
          node.next = current;
          // 获取循环链表最后一个元素
          current = this.getElementAt(this.size());
          // 更新链表
          this.head = node;
          // 最后一个元素指针指向头部元素
          current.next = this.head;
        }
      } else {
        const prev = this.getElementAt(index - 1);
        node.next = prev.next;
        prev.next = node;
      }
      this.count++;
      return true;
    }
    return false;
  }

  removeAt(index) {
    if (index >= 0 && index <= this.count) {
      let current = this.head;
      if (index === 0) {
        if (this.size() === 1) {
          this.head = undefined;
        } else {
          const removed = this.head;
          current = this.getElementAt(this.size());
          this.head = this.head.next;
          current.next = this.head;
          // 改变current引用，因为后面return的时候要用到并且表示移除了元素的值。
          current = removed;
        }
      } else {
        const prev = this.getElementAt(index - 1);
        current = prev.next;
        prev.next = current.next;
      }
      this.count--;
      return current.element;
    }
    return undefined;
  }
}
