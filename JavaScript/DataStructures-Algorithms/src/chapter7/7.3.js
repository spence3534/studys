/*
  ## 集合运算
    
  ### 并集
  给定的两个集合，返回一个包含两个集合中所有元素的集合。

  下面来实现并集方法。
  ```js
  union(otherSet) {
    const unionSet = new Set();
    this.values().forEach((value) => unionSet.add(value));
    otherSet.values().forEach((value) => unionSet.add(value));
    return unionSet;
  }
  ```
  测试代码如下。
  ```js
  const setA = new Set();
  const setB = new Set();

  setA.add(1);
  setA.add(2);
  setA.add(3);

  setB.add(3);
  setB.add(4);
  setB.add(5);
  setB.add(6);

  const otherSetB = setA.union(setB);

  console.log(otherSetB.values());
  // [ 1, 2, 3, 4, 5, 6 ]
  ```
  这里注意的是`setA`和`setB`都添加了`3`，但它在结构集合只出现了一次。

  ### 交集
  给定的两个集合，返回一个包含两个集合中共有元素的集合。

  下面来实现交集方法。
  ```js
  intersection(otherSet) {
    const intersection = new Set();

    const values = this.values();

    for (let i = 0; i < values.length; i++) {
      if (otherSet.has(values[i])) {
        intersection.add(values[i]);
      }
    }
    return intersection;
  }
  ```
  `intersection`方法需要找到当前`Set`实例中所有也存在于给定`Set`实例（otherSet）中的元素。先创建一个新的实例，然后
  迭代当前`Set`实例所有的值，使用`has`方法验证它们是否也存在`otherSet`集合中。如果这个值也存在于`otherSet`集合里，就把
  它添加到一开始创建的`intersection`的集合中，最后返回它。

  测试代码如下。
  ```js
  const setA = new Set();
  const setB = new Set();

  setA.add(1);
  setA.add(2);
  setA.add(3);

  setB.add(2);
  setB.add(3);
  setB.add(4);
  setB.add(6);

  const intersection = setA.intersection(setB);

  console.log(intersection.values());
  // [ 2, 3 ]
  ```

  #### 修改交集方法
  假如有两个集合
  * `setA`的值是`[1, 2, 3, 4, 5, 6, 7]`
  * `setB`的值是`[4, 6]`
  
  使用刚才创建的`intersection`方法，就要迭代七次`setA`的值，然后还要把这七个值和`setB`里的两个值做比较。
  现在来改成只需要迭代两次`setB`就好了，更少的迭代次数减少性能的消耗。
  ```js
  otherIntersection(otherSet) {
    const intersection = new Set();
    const values = this.values();
    const otherValues = otherSet.values();
    // 当前集合实例Set的值
    let biggerSet = values;
    // 传入的Set集合的值
    let smallerSet = otherValues;

    // 如果传入的Set集合的元素长度大于当前集合实例Set的元素长度就交换
    if (otherValues.length - values.length > 0) {
      biggerSet = otherValues;
      smallerSet = values;
    }

    // 迭代元素数量比较小的集合
    smallerSet.forEach((value) => {
      if (biggerSet.includes(value)) {
        intersection.add(value);
      }
    });

    return intersection;
  }
  ```
  先创建一个新的集合来存放`intersection`方法的返回结果，同样是获取当前集合实例中的值还有传入的`otherSet`的值。然后，如果当前
  的集合元素比较多，另一个集合元素比较少。就比较两个集合的元素个数，如果另一个集合元素个数比当前集合的元素个数多的话，就交换`biggerSet`
  和`smallerSet`的值。最后，迭代较小集合计算出两个集合的共有元素并返回。

  测试代码如下。
  ```js
  const setA = new Set();
  const setB = new Set();

  setA.add(10);
  setA.add(20);
  setA.add(30);

  setB.add(30);
  setB.add(20);
  setB.add(40);

  const intersection = setA.otherIntersection(setB);

  console.log(intersection.values());
  // [ 20, 30 ]
  ```

  ### 差集
  给定的两个集合，返回一个包含所有存在于第一个集合且不存在第二个集合中的元素的新集合。

  ```js
  difference(otherSet) {
    const difference = new Set();
    this.values().forEach((value) => {
      if (!otherSet.has(value)) {
        difference.add(value);
      }
    });
    return difference;
  }
  ```
  `difference`方法会得到存在于集合`A`但不存在于集合`B`的元素。先创建结果集合，然后迭代集合中的所有值。检查当前值是否
  存在于给定集合中，如果不存在，把值加入结果集合中。

  就用`intersection`相同的集合来做测试了。
  ```js
  const setA = new Set();
  const setB = new Set();

  setA.add(10);
  setA.add(20);
  setA.add(30);

  setB.add(30);
  setB.add(20);
  setB.add(40);

  const difference = setA.difference(setB);

  console.log(difference.values());
  // [ 10 ]
  ```
  这里输出`[10]`，因为`10`是唯一一个仅存在于`setA`的元素。如果执行`setB.difference(setA)`，会输出`[40]`，因为
  `40`只存在于`setB`中的元素。

  :::warning
  这里有些人会有疑惑，为什么不像优化`intersection`方法一样去优化`difference`呢？这是因为`setA`和`setB`之间的差集可能
  与`setB`和`setA`之间的差集不同。
  :::
  
  ### 子集
  验证一个集合是否是另一个集合的子集。
  ```js
  isSubsetOf(otherSet) {
    if (this.size() > otherSet.size()) {
      return false;
    }

    let isSubset = true;
    this.values().every((value) => {
      if (!otherSet.has(value)) {
        isSubset = false;
        return false;
      }
      return true;
    });
    return isSubset;
  }
  ```
  首先验证当前`Set`实例的元素个数大小，如果当前实例中的元素比`otherSet`实例多，那就不是子集，直接返回`false`。子集的元素个数是
  要小于或等于要比较的集合的。

  上面的代码中，假定当前实例是给定集合的子集。然后迭代当前集合中的所有元素，验证这些元素是否存在`otherSet`中。如果有任何元素不存在于`otherSet`中，
  就说明它不是一个子集，返回`false`。如果所有元素都存在`otherSet`中，`isSubset`就不会赋值为`false`。返回`true`，`isSubset`的值也不会变。

  这里之所以使用`every`方法，是因为在子集逻辑中，发现一个值不存在`otherSet`中时，可以停止迭代值，表示这不是一个子集。只要回调函数返回`true`，`every`
  方法就会被调用。如果回调函数返回`false`，循环直接停止。

  测试代码如下。
  ```js
  const setA = new Set();
  const setB = new Set();
  const setC = new Set();

  setA.add(10);
  setA.add(20);

  setB.add(10);
  setB.add(20);
  setB.add(30);

  setC.add(20);
  setC.add(30);
  setC.add(40);

  console.log(setA.isSubsetOf(setB)); // true
  console.log(setA.isSubsetOf(setC)); // false
  ```
  这里有三个集合：`setA`是`setB`的子集，输出了`true`。`setA`不是`setC`的子集，因为`setC`只包含了`setA`里的`20`，所以输出`false`。
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

  union(otherSet) {
    const unionSet = new Set();
    this.values().forEach((value) => unionSet.add(value));
    otherSet.values().forEach((value) => unionSet.add(value));
    return unionSet;
  }

  intersection(otherSet) {
    const intersection = new Set();

    const values = this.values();

    for (let i = 0; i < values.length; i++) {
      if (otherSet.has(values[i])) {
        intersection.add(values[i]);
      }
    }
    return intersection;
  }

  otherIntersection(otherSet) {
    const intersection = new Set();
    const values = this.values();
    const otherValues = otherSet.values();
    // 当前集合实例Set的值
    let biggerSet = values;
    // 传入的Set集合的值
    let smallerSet = otherValues;

    // 如果传入的Set集合的元素长度大于当前集合实例Set的元素长度就交换
    if (otherValues.length - values.length > 0) {
      biggerSet = otherValues;
      smallerSet = values;
    }

    // 迭代元素数量比较小的集合
    smallerSet.forEach((value) => {
      if (biggerSet.includes(value)) {
        intersection.add(value);
      }
    });

    return intersection;
  }

  difference(otherSet) {
    const difference = new Set();
    this.values().forEach((value) => {
      if (!otherSet.has(value)) {
        difference.add(value);
      }
    });
    return difference;
  }

  isSubsetOf(otherSet) {
    if (this.size() > otherSet.size()) {
      return false;
    }

    let isSubset = true;
    this.values().every((value) => {
      if (!otherSet.has(value)) {
        isSubset = false;
        return false;
      }
      return true;
    });
    return isSubset;
  }
}

const setA = new Set();
const setB = new Set();
const setC = new Set();

setA.add(10);
setA.add(20);

setB.add(10);
setB.add(20);
setB.add(30);

setC.add(20);
setC.add(30);
setC.add(40);

console.log(setA.isSubsetOf(setB)); // true
console.log(setA.isSubsetOf(setC)); // false
