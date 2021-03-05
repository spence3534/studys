/*
  ## 散列表

  散列算法（散列也称哈希）的用处是尽快在数据结构中找到一个值。例如，在数组中要找到一个值，就需要迭代整个数组来找到它。如果用散列函数，
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

  在此之前，还要实现一个散列函数，它的用处是把任意长度的输入变换成固定长度输出。该输出就是散列值，看下面的代码。
  ```js
  loseHashCode(key) {
    if (typeof key === "number") {
      return key;
    }
    // 把key转换成字符串
    const tableKey = this.toStrFn(key);
    // 字符串数值总和的哈希值
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
  `hashCode`方法用于只是简单的调用了`loseHashCode`方法，把`key`作为参数传给`loseHashCode`方法。

  我们来分析一个`loseHashCode`函数，首先检查传入的`key`是不是一个数。如果是，就直接返回`key`。然后，用`key`的每个字符的**ASCII**码值的和
  得到一个数。要完成这一步，首先把`key`转换成一个字符串，防止`key`是一个对象而不是字符串。还需要一个`hash`变量来存储这个总和，可以用`charCodeAt`方法。
  最后，返回`hash`值。这样做是为了得到比较小的数值，使用`hash`值和一个任意数做除法的余数。从而可以避免操作数超过变量最大表示范围的风险。

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
  位置。

  ### remove方法
  最后一个`remove`方法，看单词就知道它是移除一个值。
  ```js
  remove(key) {
    // 获取hash值
    const hash = this.hashCode(key);
    // 通过hash值获取valuePair
    const valuePair = this.table[hash];
    if (valuePair != null) {
      delete this.table[hash];
      return true;
    }
    return false;
  }
  ```

  ### 使用HashTable类
  下面来测试一下`HashTable`类。
  ```js
  const hashTable = new HashTable();
  hashTable.put("ming", "深圳市南山区");
  hashTable.put("hong", "深圳市福田区");
  hashTable.put("lang", "深圳市光明区");

  console.log(hashTable.hashCode("ming"), "ming"); // 20 ming
  console.log(hashTable.hashCode("hong"), "hong"); // 21 hong
  console.log(hashTable.hashCode("lang"), "lang"); // 11 lang

  // 获取hong
  console.log(hashTable.get("hong")); // 深圳市福田区

  // 获取huang，由于huang不存在，所以返回undefined
  console.log(hashTable.get("huang")); // undefined

  // 移除了lang
  hashTable.remove("lang");
  console.log(hashTable.get("lang")); // undefined
  ```
  下面展示上面三个元素在`HashTable`数据结构的图。
  ![](./images/8-2-2.png)

  ### HashTable类整体代码
  ```js
  class HashTable {
    constructor(toStrFn = defaultToString) {
      this.toStrFn = toStrFn;
      this.table = {};
    }

    // 生成散列值的函数
    loseHashCode(key) {
      if (typeof key === "number") {
        return key;
      }
      // 把key转换成字符串
      const tableKey = this.toStrFn(key);
      // 字符串数值总和的哈希值
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

    remove(key) {
      const hash = this.hashCode(key);
      const valuePair = this.table[hash];
      if (valuePair != null) {
        delete this.table[hash];
        return true;
      }
      return false;
    }

    getTable() {
      return this.table;
    }

    isEmpty() {
      return this.size() === 0;
    }

    size() {
      return Object.keys(this.table).length;
    }

    clear() {
      this.table = {};
    }

    toString() {
      if (this.isEmpty()) {
        return "";
      }

      const keys = Object.keys(this.table);
      let objString = `${keys[0]} => ${this.table[keys[0]].toString()}`;
      for (let i = 1; i < keys.length; i++) {
        objString = `${objString}, ${keys[i]} => ${this.table[
          keys[i]
        ].toString()}`;
      }
      return objString;
    }
  }
  ```

  ### 处理散列表中的冲突
  有时候，一些键会有相同的散列值。不同的值在散列表中对应相同的位置的时候，称为冲突。
  ```js
  const hash = new HashTable();
  hashTable.put("Ygritte", "深圳市光明区");
  hashTable.put("Jonathan", "深圳市宝安区");
  hashTable.put("Jamie", "深圳市龙岗区");
  hashTable.put("Jack", "深圳市南山区");
  hashTable.put("Jasmine", "深圳市罗湖区");
  hashTable.put("Jake", "深圳市福田区");
  hashTable.put("Nathan", "深圳市光明新区");
  hashTable.put("Athelstan", "深圳市盐田区");
  hashTable.put("Sargeras", "深圳市坪山区");

  console.log(hashTable.hashCode("Ygritte"), "Ygritte");
  console.log(hashTable.hashCode("Jonathan"), "Jonathan");
  console.log(hashTable.hashCode("Jamie"), "Jamie");
  console.log(hashTable.hashCode("Jack"), "Jack");
  console.log(hashTable.hashCode("Jasmine"), "Jasmine");
  console.log(hashTable.hashCode("Jake"), "Jake");
  console.log(hashTable.hashCode("Nathan"), "Nathan");
  console.log(hashTable.hashCode("Athelstan"), "Athelstan");
  console.log(hashTable.hashCode("Sargeras"), "Sargeras");
  // 4 Ygritte
  // 5 Jonathan
  // 5 Jamie
  // 7 Jack
  // 8 Jasmine
  // 9 Jake
  // 10 Nathan
  // 7 Athelstan
  // 10 Sargeras
  ```
  注意，Jonathan和Jamie有相同的散列值`10`。Jack和Athelstan有相同的散列值`7`，Jonathan和Jamie有相同的散列值`5`。

  如果执行上面的代码后散列表中会有哪些值呢？我们可以调用`console.log(hashTable.toString())`后，控制台中会输出下面的结果。
  ```js
  console.log(hashTable.toString());
  // 4 => [#Ygritte: 深圳市光明区],
  // 5 => [#Jamie: 深圳市龙岗区],
  // 7 => [#Athelstan: 深圳市盐田区],
  // 8 => [#Jasmine: 深圳市罗湖区],
  // 9 => [#Jake: 深圳市福田区],
  // 10 => [#Sargeras: 深圳市坪山区]
  ```
  如果是相同的散列值，就会被后面相同的散列值覆盖掉。就拿散列值为`5`的两个元素来说。首先，添加的是`Jonathan`，然后
  再添加`Jamie`。就导致`Jamie`覆盖了`Jonathan`的值。这对于其他发生冲突的元素来说也是一样的。

  在使用一个数据结构来保存数据的目的不是丢失这些数据，而是通过某种方法把它们全部保存起来。因此，当出现这种情况的时候就要去解决。处理
  冲突有几种方法：分离链接、线性探查和双散列法。这里就讲前面的两种。

  #### 分离链接
  **分离链接**法就是为散列表的每个位置创建一个链表并且把元素存储在里面。它是解决冲突的最简单的方法，但是除了`HashTable`实例之外
  还需要用链表数据结构来存储元素。

  例如，之前的测试代码中使用分离链表用图表示的话，结果如下。

  ![](./images/8-2-2-4.png)

  在位置`5`、`7`和`10`，都包含了两个元素的链表实例。而在位置`4`、`8`和`9`上，只包含单个元素的链表实例。

  对于分离链接和线性探查来说，只需要重写`put`、`get`和`remove`这三个方法。这三个方法在每种技术实现中都有不同。

  首先，声明`HashTableSeparateChaining`的基本结构。
  ```js
  class HashTableSeparateChaining {
    constructor(toStrFn = defaultToString) {
      this.toStrFn = toStrFn;
      this.table = {};
    }
  }
  ```

  ##### put方法
  先来实现`put`方法。
  ```js
  put(key, val) {
    if (key != null && val != null) {
      const position = this.hashCode(key);
      // 验证加入新元素是否被占据
      if (this.table[position] == null) {
        this.table[position] = new LinkedList();
      }
      this.table[position].push(new ValuePair(key, value));
      return true;
    }
    return false;
  }
  ```
  在这个方法中，先验证要添加的新元素的位置是否为第一次添加。如果是第一次向该位置加入元素，就在该位置上初始化一个`LinkedList`类的实例。然后
  用`LinkedList`实例中的`push`方法添加一个`ValuePair`实例。

  ##### get方法
  下面来实现`get`方法，用于获取给定键的值。
  ```js
  get(key) {
    const position = this.hashCode(key); // 转换成哈希值
    const linkedList = this.table[position]; // 获取链表
    // 检查该位置的链表是否有效
    if (linkedList != null && !linkedList.isEmpty()) {
      // 获取链表头部的引用
      let current = linkedList.getHead();
      // 从头到位迭代链表，找到指定key
      while (current != null) {
        if (current.element.key === key) {
          return current.element.value;
        }
        current = current.next;
      }
    }
    return undefined;
  }
  ```

  #### remove方法
  这里的remove方法和之前的remove方法有所不同。因为现在用的是链表，所以需要从链表中移除一个元素。
  ```js
  remove(key) {
    const position = this.hashCode(key); // 转换成哈希值
    const linkedList = this.table[position]; // 获取链表
    // 检查该位置的链表是否有效
    if (linkedList != null && !linkedList.isEmpty()) {
      let current = linkedList.getHead();
      // 从头开始迭代链表，找到指定的key
      while (current != null) {
        if (current.element.key === key) {
          // 如果链表中的元素是想要找到的元素，就从链表中移除
          linkedList.remove(current.element);

          // 如果是链表为空，就从散列表中删除该位置
          if (linkedList.isEmpty()) {
            delete this.table[position];
          }
          return true;
        }
        current = current.next;
      }
    }
    return false;
  }
  ```

  #### 线性探查
  还有一种解决冲突的方法是线性探索。之所以叫做线性，是因为它处理冲突的方法是将元素直接存储到表中，而不是像分离链接那样要使用链表。

  当想向表中某个位置添加一个新元素时，如果索引`position`的位置已经被占了，就尝试`position + 1`的位置。如果`position + 1`的
  位置也被占了，就尝试`position + 2`的位置，以此类推，直到在散列表中找到一个空闲的位置。

  假设，有一个非空的散列表，想要添加一个新的键和值。计算这个新建的`hash`，并且检查散列表中对应的位置是否被占。如果没有，就把该值添加
  到正确的位置。如果被占了，就迭代散列表，找到一个空闲的位置。
 */
const { LinkedList } = require("../chapter6/6.1");
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

  // 生成散列值的函数
  loseHashCode(key) {
    if (typeof key === "number") {
      return key;
    }
    // 把key转换成字符串
    const tableKey = this.toStrFn(key);
    // 字符串数值总和的哈希值
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

  remove(key) {
    const hash = this.hashCode(key);
    const valuePair = this.table[hash];
    if (valuePair != null) {
      delete this.table[hash];
      return true;
    }
    return false;
  }

  getTable() {
    return this.table;
  }

  isEmpty() {
    return this.size() === 0;
  }

  size() {
    return Object.keys(this.table).length;
  }

  clear() {
    this.table = {};
  }

  toString() {
    if (this.isEmpty()) {
      return "";
    }

    const keys = Object.keys(this.table);
    let objString = `${keys[0]} => ${this.table[keys[0]].toString()}`;
    for (let i = 1; i < keys.length; i++) {
      objString = `${objString}, ${keys[i]} => ${this.table[
        keys[i]
      ].toString()}`;
    }
    return objString;
  }
}

class HashTableSeparateChaining {
  constructor(toStrFn = defaultToString) {
    this.toStrFn = toStrFn;
    this.table = {};
  }

  loseHashCode(key) {
    if (typeof key === "number") {
      return key;
    }
    const tableKey = this.toStrFn(key);
    let hash = 0;
    for (let i = 0; i < tableKey.length; i++) {
      hash += tableKey.charCodeAt(i);
    }
    return hash % 37;
  }

  hashCode(key) {
    return this.loseHashCode(key);
  }

  put(key, val) {
    if (key != null && val != null) {
      const position = this.hashCode(key);
      // 验证加入新元素是否被占据
      if (this.table[position] == null) {
        this.table[position] = new LinkedList();
      }
      this.table[position].push(new ValuePair(key, val));
      return true;
    }
    return false;
  }

  get(key) {
    const position = this.hashCode(key); // 转换成哈希值
    const linkedList = this.table[position]; // 获取链表
    // 检查该位置的链表是否有效
    if (linkedList != null && !linkedList.isEmpty()) {
      // 获取链表头部的引用
      let current = linkedList.getHead();
      // 从头开始迭代链表，找到指定的key
      while (current != null) {
        if (current.element.key === key) {
          return current.element.value;
        }
        current = current.next;
      }
    }
    return undefined;
  }

  remove(key) {
    const position = this.hashCode(key); // 转换成哈希值
    const linkedList = this.table[position]; // 获取链表
    // 检查该位置的链表是否有效
    if (linkedList != null && !linkedList.isEmpty()) {
      let current = linkedList.getHead();
      // 从头开始迭代链表，找到指定的key
      while (current != null) {
        if (current.element.key === key) {
          // 如果链表中的元素是想要找到的元素，就从链表中移除
          linkedList.remove(current.element);

          // 如果是链表为空，就从散列表中删除链表
          if (linkedList.isEmpty()) {
            delete this.table[position];
          }
          return true;
        }
        current = current.next;
      }
    }
    return false;
  }

  getTable() {
    return this.table;
  }

  isEmpty() {
    return this.size() === 0;
  }

  size() {
    return Object.keys(this.table).length;
  }

  clear() {
    this.table = {};
  }

  toString() {
    if (this.isEmpty()) {
      return "";
    }
    let keys = Object.keys(this.table);
    let objString = `${keys[0]} => ${this.table[keys[0]].toString()}`;
    for (let i = 1; i < keys.length; i++) {
      objString = `${objString}, ${keys[i]} => ${this.table[
        keys[i]
      ].toString()}`;
    }
    return objString;
  }
}

const hashTableSeparateChaining = new HashTableSeparateChaining();
hashTableSeparateChaining.put("Ygritte", "深圳市光明区");
hashTableSeparateChaining.put("Jonathan", "深圳市宝安区");
hashTableSeparateChaining.put("Jamie", "深圳市龙岗区");
hashTableSeparateChaining.put("Jack", "深圳市南山区");
hashTableSeparateChaining.put("Jasmine", "深圳市罗湖区");
hashTableSeparateChaining.put("Jake", "深圳市福田区");
hashTableSeparateChaining.put("Nathan", "深圳市光明新区");
hashTableSeparateChaining.put("Athelstan", "深圳市盐田区");
hashTableSeparateChaining.put("Sargeras", "深圳市坪山区");

console.log(hashTableSeparateChaining.get("Jonathan")); // 深圳市宝安区

hashTableSeparateChaining.remove("Jonathan"); // 移除Jonathan

console.log(hashTableSeparateChaining.get("Jonathan")); // undefined

console.log(hashTableSeparateChaining.get("Jamie")); // 深圳市龙岗区

console.log(hashTableSeparateChaining.toString());
// 4 => [#Ygritte: 深圳市光明区], 5 => [#Jonathan: 深圳市宝安区], [#Jamie: 深圳市龙岗区], 7 => [#Jack: 深圳市南山区], [#Athelstan: 深圳市盐田区], 8 => [#Jasmine: 深圳市罗湖区], 9 => [#Jake: 深圳市福田区], 10 => [#Nathan: 深圳市光明新区], [#Sargeras: 深圳市坪山区]
