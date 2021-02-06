/*
  ## 创建集合
  在`ES6`里`Set`数据结构就是一个集合。这里将基于`ES6`中的`Set`类来实现一个自己的`Set`类。下面还有
  `ES6`里没有提供的集合运算，例如并集、交集和差集。

  下面声明一个`Set`类。
  ```js
  class Set {
    constructor() {
      this.items = {};
    }
  }
  ```
  这里是用对象而不使用数组来表示集合，主要原因是对象不允许一个键指向两个不同的属性，也确保集合中的元素都是唯一的。
  当然也可以使用数组。

  下面要声明一些集合用到的方法。
  * `add(ele)`：添加一个元素。
  * `delete(ele)`：移除一个元素。
  * `has(ele)`：查询一个元素是否在集合中，如果在返回`true`，否则返回`false`。
  * `clear()`：移除集合中的所有元素。
  * `size()`：获取集合中所有元素的数量。
  * `values()`：返回一个包含集合中所有值的数组。
  
  ### has方法
  `has`方法用来检查某个元素是否存在集合中。
  ```js
  has(ele) {
    return Object.prototype.hasOwnProperty.call(this.items, ele);
  }
  ```
  既然用对象来存储集合的元素，就可以用`in`操作符来验证某个元素是否是`items`对象的属性。但是这并不是最好的方式，使用
  `Object`原型上的`hasOwnProperty`方法是最稳妥的，这个方法返回一个表示对象是否包含特定属性的布尔值。`in`运算符返
  回表示对象在原型链上是否包含特定属性的布尔值。

  ### add方法
  下面来实现添加元素的方法。
  ```js
  add(ele) {
    if (!this.has(ele)) {
      this.items[ele] = ele;
      return true;
    }
    return false;
  }
  ```
  对于添加元素，首先检查它有没有在集合里，如果不在，就添加到集合里，返回`true`，表示添加了该元素。如果集合里有了这个元素
  ，返回`false`，说明没有添加它。

  :::tip
  添加一个元素时，把它作为键和值保存，这样有利于查找该元素。
  :::

  ### delete和clear方法
  ```js
  delete(ele) {
    if (this.has(ele)) {
      delete this.items[ele];
      return true;
    }
    return false;
  }
  ```
  在`delete`方法中，首先验证集合里是否存在有传入的元素，如果存在，就从集合中移除该元素并返回`true`表示已移除该元素。
  如果不存在，就返回`false`。

  `clear`方法就很简单了。
  ```js
  clear() {
    this.items = {};
  }
  ```
  直接把`items`设置成初始化的时候就可以了。但还有一种方法，通过迭代集合，用`delete`方法逐个移除所有值，不过这样显得麻烦。

  ### size方法
  有三种方式可以实现`size`方法。
  1. 第一种就像队列，栈，链表那样，在使用`add`和`delete`方法时用一个`count`变量控制它。
  2. 第二种是使用`Object.keys`方法，返回一个给定对象所有属性的数组。然后可以用这个数组的`length`属性返回`items`对象的属性个数。
  ```js
  size() {
    return Object.keys(this.items).length;
  }
  ```
  3. 第三种是用`for-in`语句遍历`items`对象的属性，记录属性的个数并返回这个数。
  ```js
  sizeLegacy() {
    let count = 0;
    for (let key in this.items) {
      if (this.has(key)) {
        count++;
      }
    }
    return count;
  }
  ```
  迭代`items`对象的所有属性，用`has`方法检查它们是否是自身的属性。如果是，递增`count`的值，最后返回`count`。
  :::warning
  但是不能简单使用`for-in`语句迭代`items`对象的属性，并递增`count`变量的值，还要用`has`方法检查对象是否具有该属性，因为对象的原型里包含
  了额外的属性（属性既有继承`Object`类的，也有属于对象自身、未用于数据结构的）。
  :::

  ### values方法
  对于`values`方法，用`Object.values`和`for-in`迭代都可以。
  ```js
  values() {
    return Object.values(this.items);
  }

  valuesLegacy() {
    let values = [];
    for (let key in this.items) {
      if (this.has(key)) {
        values.push(key);
      }
    }
    return values;
  }
  ```
  迭代`items`对象的所有属性，把它们添加到一个数组里面，并返回数组。这个方法和`sizeLegacy`一样的，只不过这里不是计算属性个数而已。

  ### 使用Set类
  下面就来测试一下`Set`类的功能。
  ```js
  const set = new Set();

  set.add(1);
  set.add(2);
  console.log(set.values()); // [ 1, 2 ]
  console.log(set.has(2)); // true
  console.log(set.has(3)); // false
  console.log(set.size()); // 2
  ```

  ### 整体代码
  ```js
  class Set {
    constructor() {
      this.items = {};
    }

    has(ele) {
      return Object.prototype.hasOwnProperty.call(this.items, ele);
    }

    add(ele) {
      if (!this.has(ele)) {
        this.items[ele] = ele;
        return true;
      }
      return false;
    }

    delete(ele) {
      if (this.has(ele)) {
        delete this.items[ele];
        return true;
      }
      return false;
    }

    clear() {
      this.items = {};
    }

    size() {
      return Object.keys(this.items).length;
    }

    sizeLegacy() {
      let count = 0;
      for (let key in this.items) {
        if (this.has(key)) {
          count++;
        }
      }
      return count;
    }

    values() {
      return Object.values(this.items);
    }

    valuesLegacy() {
      let values = [];
      for (let key in this.items) {
        if (this.has(key)) {
          values.push(key);
        }
      }
      return values;
    }
  }
  ```
*/
class Set {
  constructor() {
    this.items = {};
  }

  has(ele) {
    return Object.prototype.hasOwnProperty.call(this.items, ele);
  }

  add(ele) {
    if (!this.has(ele)) {
      this.items[ele] = ele;
      return true;
    }
    return false;
  }

  delete(ele) {
    if (this.has(ele)) {
      delete this.items[ele];
      return true;
    }
    return false;
  }

  clear() {
    this.items = {};
  }

  size() {
    return Object.keys(this.items).length;
  }

  sizeLegacy() {
    let count = 0;
    for (let key in this.items) {
      if (this.has(key)) {
        count++;
      }
    }
    return count;
  }

  values() {
    return Object.values(this.items);
  }

  valuesLegacy() {
    let values = [];
    for (let key in this.items) {
      if (this.has(key)) {
        values.push(key);
      }
    }
    return values;
  }
}

const set = new Set();

set.add(1);
set.add(2);
console.log(set.values()); // [ 1, 2 ]
console.log(set.has(2)); // true
console.log(set.has(3)); // false
console.log(set.size()); // 2
