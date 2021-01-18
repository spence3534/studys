/*
  # 栈

  ## 栈的数据结构
  栈是一种`后进前出`（LIFO）原则的有序集合（也就是说后面进来的先出去的意思）。添加或待删除的元素都保存在栈的同
  一端，叫作栈顶（栈的末尾），另一端叫做栈底。在栈里，新元素都靠近栈顶，旧元素都接近栈底。

  在我们生活中也能看到栈的例子。比如：叠放的盘子、一摞书。
  ![](./images/4-2-2.jpg)

  栈被用在编程语言的编译器和内存中保存变量、方法调用等，也被用到浏览器历史记录（浏览器的返回按钮）。

  ### 创建一个基于数组的栈
  下面创建一个类来表示栈。
  ```js
  class Stack {
    constructor() {
      this.items = [];
    }
  }
  ```
  我们需要保存一种数据结构来保存栈里的元素。可以选择数组（以上就是`items`）。数组允许我们在任何位置添加或删除元素。
  栈是遵循`LIFO`原则，需要对元素的插入和删除功能进行限制。下面要给栈声明一些方法。

  * `push()`：添加一个或者多个新元素到栈顶。
  * `pop()`：移除栈顶的元素，同时返回被移除的元素。
  * `peek()`：返回栈顶的元素，不对栈做任何修改（这个方法不会移除栈顶的元素，只是返回它而已）。
  * `isEmpty`：如果栈里没有任何元素就返回`true`，否则返回`false`。
  * `clear()`：清空栈里的所有元素。
  * `size()`：返回栈里的元素个数。
  
  #### 向栈添加元素
  实现第一个方法就是`push`，这个方法负责向栈内添加元素，有一点很重要：这个方法只添加元素到栈顶，也就是栈的末尾。代码如下。
  ```js
  push(ele) {
    this.items.push(ele);
  }
  ```
  因为是使用了数组来保存栈里的元素，所以用数组的`push`方法。

  #### 从栈里移除元素
  接着，来实现`pop`方法。这个方法用来移除栈里的元素。栈遵从`LIFO`原则，因此移出的是最后添加的元素。因此使用`pop`方法。
  ```js
  pop() {
    return this.times.pop();
  }
  ```
  只能用`push`和`pop`方法添加和删除栈中元素，这样栈自然就遵从了`LIFO`原则。

  #### 查看栈顶元素
  如果想知道栈里最后添加的元素是什么，可以用`peek`方法。这个方法将返回栈顶的元素。
  ```js
  peek() {
    return this.items[this.items.length - 1];
  }
  ```
  之所以要`length - 1`，因为访问最后一个元素用数组的长度减去`1`既可访问到数组的最后一个元素。
  
  ![](./images/4-2-3.jpg)
  上面的图中，有一个数组，数组中包含了三个元素，数组的长度是`3`。最后一项的元素是`2`，而`length - 1`（3-1）正好是`2`。

  #### 检查栈是否为空
  这里实现的方法是`isEmpty`，如果栈为空的话就返回`true`，否则就返回`false`。
  ```js
  isEmpty() {
    return this.items.length === 0;
  }
  ```
  使用`isEmpty`方法，就可以简单的判断数组的长度是否为`0`。

  那么这样的话，我们就可以用数组的`length`属性获取数组中保存的元素有多少个了。下面实现`size`方法。
  ```js
  size() {
    return this.items.length;
  }
  ```

  #### 清空栈元素
  最后，来实现`clear`方法。`clear`方法是移除栈里的所有元素，把栈清空。最简单的方法如下。
  ```js
  clear() {
    this.items = [];
  }
  ```
  这样就完成了栈的方法。

  #### 
  我们先来学习如何使用栈，首先初始化一个`Stack`类，然后查看栈是否为空。
  ```js
  const stack = new Stack();
  console.log(stack.isEmpty());  // true 为true就代表栈是空的
  ```
  然后，向栈里添加元素。
  ```js
  stack.push(1);
  stack.push(2);

  console.log(stack.peek()); // 2
  ```
  这里添加了`1`和`2`，当然你可以添加任何类型的元素。然后调用了`peek`方法，输出的是`2`，因为它是栈里最后一个元素。

  再往栈里添加一个元素。
  ```js
  stack.push(10);
  console.log(stack.size()); // 3
  console.log(stack.isEmpty()); // true
  ```
  我们往栈里添加了`10`。调用`size`方法，输出的是`3`，栈里有三个元素。调用`isEmpty`方法，输出的是`false`。

  下面展示了到现在为止对栈的操作，以及栈的当前状态。
  ![](./images/4-2-4.jpg)

  在调用`pop`方法之前，栈里有三个元素，调用两次后，现在栈只剩下`1`了。
  ```js
  stack.pop();
  stack.pop();
  console.log(stack.size());
  ```

  下面展示上面所做的操作完整代码。
  ```js
  class Stack {
    constructor() {
      this.items = [];
    }

    push(ele) {
      this.items.push(ele);
    }
    pop() {
      return this.items.pop();
    }
    peek() {
      return this.items[this.items.length - 1];
    }
    isEmpty() {
      return this.items.length === 0;
    }
    size() {
      return this.items.length;
    }
    clear() {
      this.items = [];
    }
  }

  const stack = new Stack();
  console.log(stack.isEmpty()); // true

  stack.push(1); // 向栈里添加了元素1
  stack.push(2); // 向栈里添加了元素2

  console.log(stack.peek()); // 此时栈里最后一个元素为2

  stack.push(10); // 又往栈里添加一个元素10
  console.log(stack.size()); // 这时栈的长度就变成了3
  console.log(stack.isEmpty()); // false

  stack.pop(); // 从栈顶中移除了一项
  stack.pop(); // 从栈顶中又移除了一项
  console.log(stack.size()); // 从栈中移除了两个元素，最后获取栈的长度就是1
  ```
*/