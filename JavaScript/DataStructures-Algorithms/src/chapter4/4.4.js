/*
  ## 保护数据结构内部元素

  在多人开发情况下，在创建别的开发者也可以使用的数据结构或对象的时候，希望保护内部的元素，只有
  暴露出来的方法才能修改内部结构。对于`Stack`类来说，要确保元素只会被添加到栈顶，而不是栈底或者
  栈的其他位置。但是在`Stack`类中声明的`items`和`count`属性并没有得到保护，因为js的类就是这样
  工作的。

  来看下面的代码。
  ```js
  const stack = new Stack();
  console.log(Object.getOwnPropertyNames(stack)); // [ 'count', 'items' ]
  console.log(Object.keys(stack)); // [ 'count', 'items' ]
  console.log(stack.items); // {}
  ```
  上面的代码中，前两个`log`输出结果是`[ 'count', 'items' ]`。这就表示`count`和`items`属性是
  公开的，可以像第三个`log`那样直接访问它们。这样的话，我们就可以随便给这两个属性赋新的值了。这样就
  严重破坏了这些数据。下面来看看其他使用js来实现私有属性的方法。

  ### 下划线命名
  一部分开发人员喜欢在js里使用下划线命名来标记一个属性为私有属性。
  ```js
  class Stack {
    constructor() {
      this._count = 0;
      this._items = {};
    }
  }
  ```
  下划线命名只是在属性名前加一个下划线（_）。这种方式只是一种约定，并不能保护数据。而且只能依赖于使用代码
  的开发人员具备的常识。

  ### 用ES6的限定作用域Symbol实现类
  ES6新增了一个叫做`Symbol`的基本类型，它表示独一无二的，可以用作对象的属性。看看怎么使用它在`Stack`类中
  声明`items`属性。
  ```js
  const _items = Symbol("stackItems");
  class Stack {
    constructor() {
      this[_items] = [];
    }
  }
  ```
  在上面的代码中，声明了`Symbol`类型的变量`_items`，在类的`constructor`函数中初始化它的值。要访问`_items`，
  必须把所有的`this.items`替换成`this[_items]`。

  这种方法创建了一个假的私有属性，因为ES6新增了一个`Object.getOwnPropertySymbols`方法能够取得类里面声明的所
  有`Symbols`属性。下面是一个破坏`Stack`类的例子。
  ```js
  const stack = new Stack();
  stack.push(5);
  stack.push(8);
  let objSymbols = Object.getOwnPropertySymbols(stack);
  console.log(objSymbols.length); // 1
  console.log(objSymbols); // [ Symbol(stackItems) ]
  console.log(objSymbols[0]); // Symbol(stackItems)
  stack[objSymbols[0]].push(1);
  console.log(stack[_items]); // [ 5, 8, 1 ]
  ```
  从上面的代码来看，访问`stack[objSymbols[0]]`可以得到`_items`。而且，`_items`属性是一个数组，可以进行任意
  的数组操作，比如从中间删除或添加元素。但是现在操作的是栈，所以不应该出现这种行为。

  ### 用ES6的WeakMap实现类
  `WeakMap`可以确保属性是私有的，`WeakMap`可以储存键值对，其中键是对象，值可以是任意数据类型。

  使用`WeakMap`来存储`items`属性，看下面的代码。
  ```js
  const items = new WeakMap();

  class Stack {
    constructor() {
      items.set(this, []);
    }

    push(ele) {
      const s = items.get(this);
      s.push(ele);
    }

    pop() {
      const s = items.get(this);
      const r = s.pop();
    }
  }
  ```
  上面代码中，声明一个WeakMap类型的变量items。在`constructor`中，以`this`（`Stack`类自己的引用）为键，把代表
  栈的数组存入`items`。在`push`方法中，从`WeakMap`中取出值，即以`this`为键从`items`中取值。

  现在我们知道了，`items`在`Stack`类里是真正的私有属性。但是采用这种方法，代码可读性不强，而且在扩展该类时无法继承私有
  属性。
*/
