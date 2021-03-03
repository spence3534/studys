/*
  ## 散列表

  散列算法的用处就是尽快在数据结构中找到一个值。例如，在数组中要找到一个值，就需要迭代整个数组来找到它。如果用散列函数，
  就知道值的具体位置，这样就能快速找到这个值。散列函数的作用是给定一个键值，然后返回值在表中的地址。

  散列表有一些在计算机中应用的例子。因为它是字典的一种实现，所以可以用作关联数组。它也可以用来对数据库进行索引。另一个常见的
  应用是使用散列表来表示对象。js语言内部就是用散列表来表示每个对象。对象的每个属性和方法都被存储为`key`对象类型，每个`key`
  指向对应的对象成员。

  就用地址簿为例，最常见的散列函数——**lose lose**散列函数，方法是简单把每个键值中的每个字母的**ASCII**值相加，看下面的图。
  ![](./images/8-2-1.jpg)

  ### 创建散列表
  下面将使用一个关联数组来表示散列表的数据结构，和`Dictionary`类的做法一样。
  ```js
  function defaultToString(item) {
    if (item === null) {
      return "NULL";
    } else if (item === undefined) {
      return "UNDEFINED";
    } else if (typeof item === "string" || item instanceof String) {
      return `${item}`;
    }
    return item.toString();
  }

  class HashTable {
    constructor(toStrFn = defaultToString) {
      this.toStrFn = toStrFn;
      this.table = {};
    }
  }
  ```

  然后给类添加一些方法。
  - `put(key, value)`：向散列表增加一个新的项。也可以用于更新散列表。
  - `remove(key)`：根据键值从散列表中移除值。
  - `get(key)`：返回根据键值检索到的特定的值。

  在此之前，还要实现一个散列函数，看下面的代码。
  ```js
  loseHashCode(key) {
    if (typeof key === "number") {
      return key;
    }
    // 把key转换成字符串
    const tableKey = this.toStrFn(key);
    // 字符串数值的总和
    let hash = 0;
    // 使用字符串的长度将每个字符转成数值
    for (let i = 0; i < tableKey.length; i++) {
      hash += tableKey.charCodeAt(i);
    }
    return hash % 37;
  }

  hashCode(key) {
    return this.loseHashCode(key);
  }
  ```
  `hashCode`方法只是简单的调用了`loseHashCode`方法，把`key`作为参数传给`loseHashCode`方法。

  我们来分析一个`loseHashCode`函数，首先检查传入的`key`是不是一个数。如果是，就直接返回`key`。然后，用`key`的每个字符的**ASCII**码值的和
  得到一个数。要完成这一步，首先把`key`转换成一个字符串，防止`key`是一个对象而不是字符串。还需要一个`hash`变量来存储这个总和，可以用`charCodeAt`方法。
  最后，返回`hash`值。，这样做是为了得到比较小的数值，使用`hash`值和一个任意数做除法的余数。从而可以避免操作数超过变量最大表示范围的风险。

  ### put方法
  下面来实现`put`方法，该方法用于将键和值添加到散列表中。
  ```js
  put(key, value) {
    if (key != null && value != null) {
      const position = this.hashCode(key);
      this.table[position] = new ValuePair(key, value);
      return true;
    }
    return false;
  }
  ```
  `put`方法和`Dictionary`类里的`set`方法逻辑相似。也可以把它命名为`set`，但是在大部分编程语言会在`HashTable`数据结构中使用`put`方法，因此遵循相同
  的命名方式。

  ### get方法
  从`HashTable`实例中获取一个值和`Dictionary`里的`get`相似。
  ```js
  get(key) {
    const valuePair = this.table[this.hashCode(key)];
    return valuePair == null ? undefined : valuePair.value;
  }
  ```
  不同之处就在于`Dictionary`类中，把`valuePair`保存在`table`的`key`属性中，而`HashTable`类中，是由`key`生成一个数，并把`valuePair`保存在`hash`
  （也就是`put`方法中的`hash`变量）位置。
 */
function defaultToString(item) {
  if (item === null) {
    return "NULL";
  } else if (item === undefined) {
    return "UNDEFINED";
  } else if (typeof item === "string" || item instanceof String) {
    return `${item}`;
  }
  return item.toString();
}

class ValuePair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  toString() {
    return `[#${this.key}: ${this.value}]`;
  }
}
class HashTable {
  constructor(toStrFn = defaultToString) {
    this.toStrFn = toStrFn;
    this.table = {};
  }

  loseHashCode(key) {
    if (typeof key === "number") {
      return key;
    }
    // 把key转换成字符串
    const tableKey = this.toStrFn(key);
    // 字符串数值的总和
    let hash = 0;
    // 使用字符串的长度将每个字符转成数值
    for (let i = 0; i < tableKey.length; i++) {
      hash += tableKey.charCodeAt(i);
    }
    return hash % 37;
  }

  hashCode(key) {
    return this.loseHashCode(key);
  }

  put(key, value) {
    if (key != null && value != null) {
      const position = this.hashCode(key);
      this.table[position] = new ValuePair(key, value);
      return true;
    }
    return false;
  }

  get(key) {
    const valuePair = this.table[this.hashCode(key)];
    return valuePair == null ? undefined : valuePair.value;
  }
}
