/*
  ## 创建StackLinkedList

  还可以用`LinkedList`类作为内部数据结构来创建其他数据结构。例如**栈、队列和双向队列**。
  ```js
  class StackLinkedList {
    constructor() {
      this.items = new DoublyLinkedList();
    }

    push(ele) {
      this.items.push(ele);
    }

    pop() {
      if (this.isEmpty()) {
        return undefined;
      }
      this.items.removeAt(this.size() - 1);
    }
  }
  ```
  对于`StackLinkedList`类，将使用`DoublyLinkedList`来存储数据，而不是使用数组或对象。这里使用双链表而不是链表，
  是因为对栈来说，会从链表尾部添加元素，也会从链表尾部移除元素，`DoublyLinkedList`类有列表最后一个元素（`tail`）的
  引用，不需要迭代整个链表元素就能取到它。双向链表可以直接获取头尾的元素，减少过程的消耗。

  ```js
  class StackLinkedList {
    constructor() {
      this.items = new DoublyLinkedList();
    }

    push(ele) {
      this.items.push(ele);
    }

    pop() {
      if (this.isEmpty()) {
        return undefined;
      }
      this.items.removeAt(this.size() - 1);
    }

    peek() {
      if (this.isEmpty()) {
        return undefined;
      }
      return this.items.getElementAt(this.size() - 1).element;
    }

    isEmpty() {
      return this.size() === 0;
    }

    size() {
      return this.items.size();
    }

    clear() {
      this.items.clear();
    }

    toString() {
      this.items.toString();
    }
  }
  ```
  实现上只是调用`DoublyLinkedList`类里的方法。
 */
const { DoublyLinkedList } = require("./6.2");
class StackLinkedList {
  constructor() {
    this.items = new DoublyLinkedList();
  }

  push(ele) {
    this.items.push(ele);
  }

  pop() {
    if (this.isEmpty()) {
      return undefined;
    }
    this.items.removeAt(this.size() - 1);
  }

  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items.getElementAt(this.size() - 1).element;
  }

  isEmpty() {
    return this.size() === 0;
  }

  size() {
    return this.items.size();
  }

  clear() {
    this.items.clear();
  }

  toString() {
    this.items.toString();
  }
}

const stack = new StackLinkedList();

stack.push(5);
stack.push(10);
console.log(stack.items);
