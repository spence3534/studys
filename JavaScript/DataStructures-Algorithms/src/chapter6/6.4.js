/*
  ## 有序链表
  有序链表指的是保持元素有序的链表结构。
  ```js
  const Compare = {
    LESS_THAN: -1,
    BIGGER_THAN: 1,
  };

  class SortedLinkedList extends LinkedList {
    constructor(equalsFn) {
      super(equalsFn);
      this.compareFn = function defaultCompare(a, b) {
        if (a === b) {
          return 0;
        }
        return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
      };
    }
  }
  ```
  `SortedLinkedList`类继承了`LinkedList`类中的所有属性和方法，但是这个类比较特殊，需要用一个比较元素的`compareFn`函数。
  如果元素有相同的引用，就返回`0`。如果第一个元素小于第二个元素，就返回`-1`，否则返回`1`。

  ### 有序插入元素
  ```js
  insert(ele) {
    if (this.isEmpty()) {
      return super.insert(ele, 0);
    }
    const pos = this.getIndexNextSortedEle(ele);
    return super.insert(ele, pos);
  }
  ```
  这个`insert`方法里，没有`index`参数，因为插入元素的位置是内部控制的，并不想在任何位置插入元素。如果有序链表为空，直接调用
  `LinkedList`的`insert`方法并传入`0`作为`index`。如果有序链表不为空，就知道插入元素的正确位置并且调用`LinkedList`的`insert`方法，
  传入这个位置来保存链表的有序。

  ### 
  ```js
  getIndexNextSortedEle(ele) {
    let current = this.head;
    let i = 0;
    for (; i < this.size() && current; i++) {
      const comp = this.compareFn(ele, current.element);
      if (comp === Compare.LESS_THAN) {
        return i;
      }
      current = current.next;
    }
    return i;
  }
  ```
  如果获取插入元素的正确位置，这里创建了一个`getIndexNextSortedEle`方法。在这个方法中，迭代整个有序链表一直找到要插入元素的位置或者迭代
  完所有的元素。在后者的场景中，返回的`index`是有序链表的长度（把元素插入链表的末尾）。然后使用`compareFn`来比较传入构造函数的元素。当要
  插入有序链表的元素小于`current`的元素时，就找到插入元素的位置。

  其他的方法和`LinkedList`是一样的。所以直接调用`LinkedList`里的方法即可。

  ### 有序链表整体代码
  ```js
  const Compare = {
    LESS_THAN: -1,
    BIGGER_THAN: 1,
  };

  class SortedLinkedList extends LinkedList {
    constructor(equalsFn) {
      super(equalsFn);
      this.compareFn = function (a, b) {
        if (a === b) {
          return 0;
        }
        // 如果插入的元素小于当前元素，插入的元素就在当前元素的前面，所以返回-1
        return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
      };
    }

    push(ele) {
      if (this.isEmpty()) {
        super.push(ele);
      } else {
        const index = this.getIndexNextSortedEle(ele);
        super.index(ele, index);
      }
    }

    insert(ele) {
      if (this.isEmpty()) {
        return super.insert(ele, 0);
      }
      const pos = this.getIndexNextSortedEle(ele);
      return super.insert(ele, pos);
    }

    getIndexNextSortedEle(ele) {
      let current = this.head;
      let i = 0;
      for (; i < this.size() && current; i++) {
        const comp = this.compareFn(ele, current.element);
        if (comp === Compare.LESS_THAN) {
          return i;
        }
        current = current.next;
      }
      return i;
    }
  }
  ```
 */
const { LinkedList } = require("./6.2");
const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1,
};

class SortedLinkedList extends LinkedList {
  constructor(equalsFn) {
    super(equalsFn);
    this.compareFn = function (a, b) {
      if (a === b) {
        return 0;
      }
      // 如果插入的元素小于当前元素，插入的元素就在当前元素的前面，所以返回-1
      return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
    };
  }

  push(ele) {
    if (this.isEmpty()) {
      super.push(ele);
    } else {
      const index = this.getIndexNextSortedEle(ele);
      super.index(ele, index);
    }
  }

  insert(ele) {
    if (this.isEmpty()) {
      return super.insert(ele, 0);
    }
    const pos = this.getIndexNextSortedEle(ele);
    return super.insert(ele, pos);
  }

  getIndexNextSortedEle(ele) {
    let current = this.head;
    let i = 0;
    for (; i < this.size() && current; i++) {
      const comp = this.compareFn(ele, current.element);
      if (comp === Compare.LESS_THAN) {
        return i;
      }
      current = current.next;
    }
    return i;
  }
}

const list = new SortedLinkedList();

list.insert(5);
list.insert(10);
list.insert(4);
console.log(list);
