/*
  # 链表

  ## 链表数据结构

  要存储多个元素，数组是最常用的数据结构。这种数据结构非常方便，用一个`[]`就可以访问元素。但是这种
  数据结构不是没有缺点的。数组的大小是固定的，从数组的起点或中间插入或移除项的成本都是非常高的，因为
  要移动元素。

  链表存储有序的元素集合，但和数组不同，链表中的元素在内存中并不是连续放置的，每个元素有一个存储元素
  本身的节点和一个指向下一个元素的引用（也叫指针或链接）组成。

  <img src="./images/6/6-1-1.jpg"  />

  链表的一个好处是，添加或移除元素时不需要移动其他元素。但链表需要指针，所以实现链表时需要额外注意。
  在数组中，我们可以直接访问任何位置的元素，要想访问链表中间的一个元素，就要从表头开始迭代链表直到
  找到所需的元素。

  在小的时候大家都玩过老鹰捉小鸡吧？小鸡队列就相当于链表。每个人是一个元素，手就是链向下一个人的指针。
  可以向队列中增加人只需要找到想加入的点，断开连接，插入一个人，再重新连接起来。
  <img src="./images/6/6-1-2.jpeg"  />

  还有一种用来说明链表的例子就是火车，每节车皮就是链表的元素，车皮间的连接就是指针。
  <img src="./images/6/6-1-3.jpeg"  />

  ### 创建链表
  ```js
  class LinkedList {
    constructor() {
      this.count = 0; // 存储链表元素数量
      this.head = undefined; // 第一个元素的引用
      // 比较链表中的元素是否相等
      this.equalsFn = function (a, b) {
        return a === b;
      }
    }
  }
  ```
  上面的代码中，`count`表示存储链表中的元素数量的。链表数据结构是动态的，所以`head`属性是把第一个元素的引用
  保存下来。`equalsFn`属性是一个函数，用来比较链表中的元素是否相等。

  ### 创建节点
  ```js
  class Node {
    constructor(ele) {
      this.element = ele; // 想要加入链表元素的值
      this.next = undefined; // 指向链表中下一个元素的指针。
    }
  }
  ```
  要表示链表中的第一个元以及其他元素，创建了一个`Node`类，表示我们想要添加到链表中的项。它有两个属性：`element`、`next`。

  下面就是`LinkedList`类的方法。
  * `push(ele)`：向链表尾部添加一个新元素。
  * `insert(ele, position)`：向链表的特定位置插入一个元素。
  * `getElementAt(index)`：返回链表中特定位置的元素，如果链表中不存在这样的元素，则返回`undefined`。
  * `remove(ele)`：从链表中移除一个元素。
  * `indexOf(ele)`：返回元素在链表中的索引，如果没找到则返回`-1`。
  * `removeAt(position)`：从链表的特定位置移除一个元素。
  * `isEmpty()`：检查链表中是否存在元素，`true`为空，`false`为非空。
  * `size()`：返回链表包含的元素个数。
  * `toString()`：返回表示整个链表的字符串。
  
  ### 向链表尾部中添加元素

  向`LinkedList`对象尾部添加元素时，有两种场景：链表为空，添加的是第一个元素；链表不为空，向链表里追加元素。
  ```js
  push(ele) {
    const node = new Node(ele);
    let current = "";
    if (this.head === undefined) {
      // node里面的next属性始终undefined
      this.head = node;
    } else {
      current = this.head;
      while (current.next !== undefined) {
        // 设置current为下一个元素进行迭代
        current = current.next;
      }
      // current.next为undefined就表示到了链表的尾部，然后把最后一个元素的next属性设置为下一元素
      current.next = node;
    }
    this.count++;
  }
  ```
  * 场景一：向空链表中添加一个元素。如果`head`等于`undefined`，那就证明是向链表添加第一个元素。
  * 场景二：向一个不为空的链表尾部添加一个元素，首先要找到最后一个元素。只能通过第一个元素的引用
  :::warning
  链表最后一个节点的下一个元素始终是`undefined`或`null`
  :::
  并且使用循环访问链表才能找到最后一个元素。这就需要一个指向链表中`current`变量。在循环访问链表的过程
  中，当`current.next`元素为`undefined`时，就证明到达链表的尾部了。然后让当前元素（也就是最后一个元素）
  的`next`指针指向想要添加到链表的节点。

  ```js
  const list = new LinkedList();

  list.push(10);
  list.push(15);
  list.push(11);
  console.log(list.head);
  Node {
    element: 10,
    next: Node {
      element: 15,
      next: Node {
        element: 11,
        next: undefined
      }
    }
  }
  ```

  ### 移除特定位置的元素
  从链表中移除元素要实现两种方法：第一种是从特定位置移除一个元素，第二种是根据元素的值移除。和`push`方法一样，
  从链表中移除元素也存在两种场景：第一种是移除第一个元素，第二种是移除第一个元素之外的其他元素。

  下面是移除元素`removeAt`方法。
  ```js
  removeAt(index) {
    // 验证index是否有效，index是从0开始。也就是count - 1
    if (index >= 0 && index < this.count) {
      // current存着第一个元素
      let current = this.head;

      // 移除第一项
      if (index === 0) {
        // 把第二个元素设置为第一个元素，就实现了删除第一个元素的效果
        this.head = current.next;
      } else {
        // 上一个元素
        let prev = "";
        for (let i = 0; i < index; i++) {
          prev = current;
          current = current.next;
        }
        // 上一个元素和下一个元素连接起来
        prev.next = current.next;
      }
      this.count--;
      return current.element;
    }
    // 如果index不是有效的位置则返回undefined
    return undefined;
  }

  console.log(list.removeAt(1)); // 15
  ```
  首先验证`index`是否有效，从`0`到链表的长度（`count - 1`，因为`index`是从`0`开始）都是有效的位置。如果不是有效的
  位置则返回`undefined`。要移除第一个元素，就是让`head`指向链表中的第二个元素。这里用`current`变量创建一个对链表
  中第一个元素的引用。如果把`head`赋为`current.next`的值就移除了第一个元素。

  要移除链表最后一个或者中间某个元素。就需要迭代链表的节点，直到找到目标位置。这里需要注意的是，`current`变量总是对所
  循环链表的当前元素的引用，这里还有一个变量`prev`。在这个例子里面`current`的值就是`prev`变量里的`next`属性的值。在迭代
  到目标位置之后，`current`变量就是我们想要从链表中移除的节点。从链表中删除当前元素，就是把`prev.next`和`current.next`
  连接起来。

  对于最后一个元素，当跳出循环时，`current`变量就是链表最后一个节点的引用（要移除的节点）。`current.next`的值将`undefined`
  （因为它是最后一个节点）。由于还保留了对`prev`节点的引用（当前节点的前一个节点），`prev.next`就指向了`current`。要移除`current`，
  就是把`prev.next`的值改成`current.next`的值。

  如果你理解了移除链表中的元素这个例子，后面获取元素和在任意位置插入元素方法就很好的理解。

  ### 获取元素
  下面是循环迭代链表直到目标位置的方法。
  ```js
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

  console.log(list.getElementAt(2));
  { element: 11, next: undefined }
  ```
  上面的代码中，初始化一个`node`变量，从链表的第一个元素`head`开始迭代整个链表。然后，迭代整个链表直到目标`index`。结束循环时，
  `node`元素就是`index`位置元素的引用（`node`的值也就是当前`index`位置元素的`next`属性的值）。

  `removeAt`方法和`getElement`方法的部分逻辑相同，那么就可以改写一下`removeAt`方法。
  ```js
  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;

      if (index === 0) {
        this.head = current.next;
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
  ```

  ### 在任意位置插入元素
  下面来实现`insert`方法，这个方法可以在任何位置插入一个元素。看下面的代码：
  ```js
  insert(ele, index) {
    if (index >= 0 && index <= this.count) {
      const node = new Node(ele);
      if (index === 0) {
        // 第一个元素的引用
        const current = this.head;
        node.next = current;
        this.head = node;
      } else {
        const prev = this.getElementAt(index - 1);
        const current = prev.next;
        node.next = current;
        prev.next = node;
      }
      this.count++;
      return true
    }
    return false;
  }
  ```
  首先，还是要检查`index`有效，和`removeAt`类似。如果位置是有效的，就要处理不同的场景。第一种场景是需要在链表的起点添加一个
  元素，也就是**第一个位置**。
  `current`变量是链表中第一个元素的引用，我们就需要把`next.next`的值设为`current`（也就是链表的第一个元素）。然后再把`head`
  的引用改成`node`，这样链表中就有了一个新元素。

  现在看第二种场景：在链表中或尾部添加一个元素。首先，需要迭代链表，找到目标位置。这时候，我们会循环到`index - 1`的位置，也就是
  需要添加新节点位置的前一个位置。当循环结束后，`prev`就是想要插入新元素的位置前一个元素的引用，而`current`变量就是想要插入新元
  素的位置后一个元素的引用。在`prev`和`current`之间添加新元素。首先要把新元素和当前元素链接起来，然后需要改变`prev`和`current`
  之间的链接。还需要让`prev.next`指向`node`，取代`current`。
  
  ```js
  list.insert(20, 3);
  console.log(list.head);
  ```
  下面是这段代码在浏览器控制台打印出来的结果。
  <img src="./images/6/6-1-5-n.jpg"  />

  :::tip
  使用变量引用的时候需要控制的节点非常重要，这样就不会丢失节点之间的链接。可以只使用一个变量`prev`，但这样很难控制节点之间的连接。
  所以，最好声明一个额外的变量来处理这些引用。
  :::

  ### 获取元素位置
  `indexOf`方法接收一个元素的值，如果在链表中找到该元素，就返回元素的位置，否则返回`-1`。
  ```js
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

  console.log(list.indexOf(20)); // 3
  ```
  一样的，需要一个变量`current`来循环访问链表，它的初始值是`head`。然后迭代元素，从`head`（索引`0`）开始，直到链表长度（`count`变量）为止。
  在每次迭代过程，用到了`equalFn`判断相等函数。这个函数和`ele === current.element`的效果一模一样的，如果元素是一个引用类型的值，就要自定
  义的函数判断元素是否相等了。如果当前位置的元素是我们要找的元素，就返回它的位置。如果不是，就迭代下一个链表节点，如果链表为空或者迭代到链表尾
  部的话，就返回`-1`。

  ### 移除元素
  `remove`方法实现就比较简单，使用`removeAt`和`indexOf`方法组合起来就行了。
  ```js
  remove(ele) {
    const index = this.indexOf(ele);
    return this.removeAt(index);
  }
  ```
  把值传给`indexOf`方法，然后把查找到的位置传给`removeAt`方法就可以移除元素了。

  ### `isEmpty`、`size`、`getHead`方法
  ```js
  isEmpty() {
    return this.size() === 0;
  }

  size() {
    return this.count;
  }
  ```
  这两个方法的实现和队列的`isEmpty`、`size`一模一样的。

  `getHead`方法只要返回头部的元素即可。
  ```js
  getHead() {
    return this.head;
  }
  ```

  ### toString方法
  `toString`方法就是把`LinkedList`对象转成字符串。
  ```js
  toString() {
    if (this.head === undefined) {
      return '';
    }

    let objString = this.head.element;
    let current = this.head.next;
    for (let i = 0; i < this.size() && current !== undefined; i++) {
      objString = `${objString}, ${current.element}`;
      current = current.next;
    }
    return objString;
  }
  ```
  和之前的栈、队列的`toString`方法都大同小异，判断链表是否为空，空则返回空字符串。如果不为空，就用链表第一个元素的值
  初始化方法最后返回的字符串。然后，迭代链表中的所有其他元素，把元素值添加到字符串上，如果链表只有一个元素，就不会进入循环，
  也不会向`objString`添加其他值，因为`current !== undefined`验证失败。

  ### 链表整体代码
  ```js
  class LinkedList {
    constructor() {
      this.count = 0; // 存储链表元素数量
      this.head = undefined; // 第一个元素的引用
      // 比较链表中的元素是否相等
      this.equalsFn = function (a, b) {
        return a === b;
      }
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
          // 设置current为下一个元素进行迭代
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
        return true
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
        return '';
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

  const list = new LinkedList();
  console.log(list.isEmpty()); // true
  // 添加元素
  list.push(10);
  list.push(15);
  list.push(11);
  console.log(list.isEmpty()); // false
  console.log(list.toString());
  // 10, 15, 11

  // 删除指定位置元素
  list.removeAt(0);
  console.log(list.toString());
  // 15, 11

  // 在指定位置添加元素
  list.insert(20, 2);
  console.log(list.toString());
  // 15, 11, 20

  // 获取链表长度
  console.log(list.size()); // 3

  // 获取链表某个位置的元素
  console.log(list.getElementAt(0));
  // {
  //   element: 15,
  //   next: Node {
  //     element: 11,
  //     next: Node {
  //       element: 20,
  //       next: undefined
  //     }
  //   }
  // }

  // 获取链表头部元素
  console.log(list.getHead());
  // {
  //   element: 15,
  //   next: Node {
  //     element: 11,
  //     next: Node {
  //       element: 20,
  //       next: undefined
  //     }
  //   }
  // }

  // 获取元素位置
  console.log(list.indexOf(20)); // 2

  // 删除指定元素
  console.log(list.remove(11)); // 11
  console.log(list.toString()); // 15, 20
  ```
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

const list = new LinkedList();
console.log(list.isEmpty()); // true
// 添加元素
list.push(10);
list.push(15);
list.push(11);
console.log(list.isEmpty()); // false
console.log(list.toString());
// 10, 15, 11

// 删除指定位置元素
list.removeAt(0);
console.log(list.toString());
// 15, 11

// 在指定位置添加元素
list.insert(20, 2);
console.log(list.toString());
// 15, 11, 20

// 获取链表长度
console.log(list.size()); // 3

// 获取链表某个位置的元素
console.log(list.getElementAt(0));
// {
//   element: 15,
//   next: Node {
//     element: 11,
//     next: Node {
//       element: 20,
//       next: undefined
//     }
//   }
// }

// 获取链表头部元素
console.log(list.getHead());
// {
//   element: 15,
//   next: Node {
//     element: 11,
//     next: Node {
//       element: 20,
//       next: undefined
//     }
//   }
// }

// 获取元素位置
console.log(list.indexOf(20)); // 2

// 删除指定元素
console.log(list.remove(11)); // 11
console.log(list.toString()); // 15, 20
