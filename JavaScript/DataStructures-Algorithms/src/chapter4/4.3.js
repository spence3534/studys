/*
  ## 创建一个基于js对象的`Stack`
  创建一个`Stack`类最简单的方式就是使用一个数组来储存其元素。在处理大量的数组的时候，需要评估如何操作数据
  是最高效的。在使用数组时，大部分方法的时间复杂度是`O(n)`。`O(n)`的意思就是，需要迭代整个数组直到找到的
  那个元素，在最坏的情况下需要迭代数组的所有位置，其中的`n`代表数组的长度。如果数组有更多元素的话，所需的时
  间就会更长。另外，数组是元素的一个有序集合，为了保证元素排序有序，它会占用更多的内存空间。

  如果我们能直接获取元素，占用较少的内存空间，并且仍然保证所有元素按照我们的需要排列，那不是更好吗？对于js语言
  实现栈数据结构的场景，我们也可以用一个js对象来储存所有的栈元素，保证它们的顺序并且遵循`LIFO`原则。下面来
  实现这样的行为。

  首先声明一个`Stack`类。
  ```js
  class Stack {
    constructor() {
      this.count = 0;
      this.items = {};
    }
  }
  ```
  这个版本的`Stack`类中，将使用一个`count`属性来帮助我们记录栈的大小（也能帮助我们从数据结构中添加和删除元素）。

  #### 向栈中插入元素
  在基于数组的版本中，我们可以同时向`Stack`类中添加多个元素。由于现在使用了一个对象，这个版本的`push`方法只允许
  我们一次插入一个元素。下面展示`push`方法的代码。
  ```js
  push(ele) {
    this.items[this.count] = ele;
    this.count++;
  }
  ```

  在js中，对象是一系列 **键值对** 的集合。要向栈中添加元素，我们将使用`count`变量作为`items`对象的键名，插入的
  元素则是它的值。在向栈插入元素后，我们递增`count`变量。看下面的代码。
  ```js
  const stack = new Stack();
  stack.push(5);
  stack.push(10);
  console.log(stack);
  // { count: 2, items: { '0': 5, '1': 10 } }
  ```
  可以看到`Stack`类内部的`items`包含的值和`count`属性在最后的`log`中输出。

  ### 验证一个栈是否为空和它的大小
  `count`属性也表示栈的大小。因此，可以简单的返回`count`属性的值来实现`size`方法。
  ```js
  size() {
    return this.count;
  }
  ```

  要验证栈是否为空，可以判断`count`是否为`0`。
  ```js
  isEmpty() {
    return this.count === 0;
  }
  ```

  ### 从栈中弹出元素
  由于我们没有使用数组来储存元素，需要手动实现移除元素的逻辑。`pop`方法一样是返回了从栈中移除的元素，看下面的代码。
  ```js
  pop() {
    // 首先判断栈是否为空，如果为空，就返回undefined
    if (this.isEmpty()) {
      return undefined;
    }
    // 如果栈不为空的话，就将`count`属性减1
    this.count--;
    // result保存了栈顶的元素
    const result = this.items[this.count];
    // 删除栈顶的元素
    delete this.items[this.count];
    // 之后返回刚才保存的栈顶元素
    return result;
  }
  ```

  #### 查看栈顶的值并将栈清空
  要访问栈顶元素，需要把`count`属性减`1`。代码如下。
  ```js
  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    this.items[this.count - 1];
  }
  ```
  下面是清空栈的方法，只需要把它的值设置为初始化时候的值就行了。
  ```js
  clear() {
    this.items = {};
    this.count = 0;
  }
  ```
  当然也可以像下面这样移除栈里的所有元素。
  ```js
  anotherClear() {
    while (!this.isEmpty()) {
      this.pop();
    }
  }
  ```
  ### 创建toString方法
  在数组的版本中，并不需要关心`toString`方法的实现，因为数据结构可以直接使用数组本身的`toString`方法。
  对于使用对象的版本，将创建一个`toString`方法来像数组一样输出栈的内容。
  ```js
  toString() {
    // 栈为空，将返回一个空字符串。
    if (this.isEmpty()) {
      return "";
    }

    // 栈不为空，就需要用它底部的第一个元素作为字符串的初始值
    let objString = `${this.items[0]}`;
    // 栈只包含一个元素，就不会执行`for`循环。
    for (let i = 1; i < this.count; i++) {
      // 迭代整个栈的键，一直到栈顶，添加一个逗号（,）以及下一个元素。
      objString = `${objString},${this.items[i]}`;
    }
    return objString;
  }
  ```
  这样就完成了两个版本的`Stack`类。这也是一个用不同方式写代码的例子。对于使用`Stack`类，选择使用基于数组还是基于
  对象的版本来说并不重要，两种方法都提供一样的方法，只是内部实现就不一样。下面是基于对象的版本所有代码。
  ```js
  class Stack {
    constructor() {
      this.count = 0;
      this.items = {};
    }

    push(ele) {
      this.items[this.count] = ele;
      this.count++;
    }

    size() {
      return this.count;
    }

    isEmpty() {
      return this.count === 0;
    }

    pop() {
      // 首先判断栈是否为空，如果为空，就返回undefined
      if (this.isEmpty()) {
        return undefined;
      }
      // 如果栈不为空的话，就将`count`属性减1
      this.count--;
      // result保存了栈顶的元素
      const result = this.items[this.count];
      // 这里是删除栈顶的元素，由于使用的是对象，所以可以使用delete运算符从对象中删除一个特定的值
      delete this.items[this.count];
      // 之后返回栈顶的元素
      return result;
    }

    peek() {
      if (this.isEmpty()) {
        return undefined;
      }
      this.items[this.count - 1];
    }

    clear() {
      this.items = {};
      this.count = 0;
    }

    anotherClear() {
      while (!this.isEmpty()) {
        this.pop();
      }
    }

    toString() {
      // 栈为空，将返回一个空字符串。
      if (this.isEmpty()) {
        return "";
      }

      // 栈不为空，就需要用它底部的第一个元素作为字符串的初始值
      let objString = `${this.items[0]}`;
      // 栈只包含一个元素，就不会执行`for`循环。
      for (let i = 1; i < this.count; i++) {
        // 迭代整个栈的键，一直到栈顶，添加一个逗号（,）以及下一个元素。
        objString = `${objString},${this.items[i]}`;
      }
      return objString;
    }
  }
  ```
 */
