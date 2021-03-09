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

  当从散列表删除一个键值对的时候，使用之前的移除元素的方法是不够的。如果只是移除一个元素，就可能在查找有相同`hash`值的其他元素时找到
  一个空位置。这就导致算法出问题。

  线性探查分两种。第一种是软删除方法。用一个特殊的值标记表示键值对已经被删除了，并不是真正的删除它。可以理解为惰性删除或软删除。散列表
  被操作过后，就会得到一个标记了若干删除位置的散列表。不过这会降低散列表的效率。

  第二种方法需要检查是否有必要将一个或多个元素移动到之前的位置。当搜索一个键时，这种方法可以避免找到一个空位置。如果移动元素是必要的，就
  需要在散列表中挪动键值对。

  下面我们来实现第二种方法，移动一个或者多个元素到之前的位置。

  #### put方法
  ```js
  put(key, val) {
    if (key != null && val != null) {
      const position = this.hashCode(key);
      if (this.table[position] == null) {
        this.table[position] = new ValuePair(key, val);
      } else {
        let index = position + 1;
        // 检查该位置是否为空，不为空就往下找，直到有空位为止
        while (this.table[index] != null) {
          index++;
        }
        this.table[index] = new ValuePair(key, val);
      }
      return true;
    }
    return false;
  }
  ```
  `put`方法的核心思想在于，如果位置已经被占了，就往下找没有被占的位置，也就是`position`的值为`null`或者`undefined`时。所以
  声明了`index`并赋值为`position + 1`。然后验证该位置是否被占，如果被占了，就继续递增`index`，直到找到一个没有被占据的位置。
  最后，把值分配到该位置上。

  来测试一下`put`方法。
  ```js
  const hash = new HashTableLinearProbing();

  hash.put("Ygritte", "深圳市光明区");
  hash.put("Jonathan", "深圳市宝安区");
  hash.put("Jamie", "深圳市龙岗区");
  console.log(hash.toString());
  // 4 => [#Ygritte: 深圳市光明区], 5 => [#Jonathan: 深圳市宝安区], 6 => [#Jamie: 深圳市龙岗区]
  ```
  可以看到，插入Ygritte时，它的散列值为`4`，由于散列表刚被创建，位置`4`还是空的，就在这里插入数据。然后在位置`5`插入Jonathan。
  它是空的，所以插入这个元素。最后在位置`5`上插入`Jamie`，由于它的散列值也是`5`。位置`5`已经被Jonathan占了，所以检查索引值为
  `position + 1`的位置（`6`），位置`6`为空。所以就在位置`6`上插入`Jamie`。

  #### get方法
  现在已经有插入所有的元素方法，下面来实现`get`方法。
  ```js
  get(key) {
    const position = this.hashCode(key);
    // 确认该键是否存在
    if (this.table[position] != null) {

      // 如果存在，就检查要找的值是否是原始位置上的值
      if (this.table[position].key === key) {
        return this.table[position].value;
      }

      let index = position + 1;
      
      // 寻找空余位置
      while (this.table[index] != null && this.table[index].key !== key) {
        index++;
      }

      // 当跳出while循环时，验证元素的键是否是要找的键
      if (this.table[index] != null && this.table[index].key === key) {
        return this.table[index].value;
      }
    }
    
    // 如果迭代完整个散列表而且index位置上是null或着undefined，说明要找的键不存在，返回undefined。
    return undefined;
  }
  ```
  `get`方法的核心是，如果这个键存在，就检查要找的值是否为原始位置上的值。如果是，就返回这个值。如果不是，就在下一个位置继续找，
  递增`index`查找散列表上的元素一直到要找的元素，或者找到一个空位置。当从`while`循环跳出的时候，就验证元素的键是否是要找
  的键，如果是，就返回它的值。如果迭代完整个散列表而且`index`的位置上是`null`或`undefined`的话，说明键不存在，就返回`undefined`。

  #### remove方法
  `remove`方法和`get`基本上相同。
  ```js
  remove(key) {
    const position = this.hashCode(key);
    if (this.table[position] != null) {
      delete this.table[position];
      this.verifyRemoveSideEffect(key, position);
      return true;
    }
    let index = position + 1;
    while (this.table[index] != null && this.table[index].key != key) {
      index++;
    }
    if (this.table[index] != null && this.table[index].key === key) {
      delete this.table[index];
      this.verifyRemoveSideEffect(key, index);
      return true;
    }
    return false;
  }
  ```
  在`remove`方法中，从散列表中删除元素。可以直接从原始`hash`位置找到元素，如果有冲突并处理了，就可以在另外一个位置找到元素。
  由于我们并不知道在散列表的不同位置上是否存在具有相同`hash`的元素，需要验证删除操作是否有副作用。如果有，就需要把冲突的元素
  移动到一个之前的位置，这样就不会产生空位置。要完成这个操作就需要用到下面的方法。
  ```js
  verifyRemoveSideEffect(key, removePosition) {
    // 获取被删除的key的哈希值
    const hash = this.hashCode(key);

    // 被删除的key的下一个位置
    let index = removePosition + 1;

    while (this.table[index] != null) {
      // 计算当前位置的key的哈希值
      const posHash = this.hashCode(this.table[index].key);

      // 如果当前元素的hash值小于等于它原始的`hash`值或者当前元素的hash小于等于被删除的key的位置的值
      // 就把当前元素移动到被删除的key的位置上，并且删除当前元素，最后把删除的key的位置更新成当前的index
      if (posHash <= hash || posHash <= removePosition) {
        this.table[removePosition] = this.table[index];
        delete this.table[index];
        removePosition = index;
      }
      index++;
    }
  }
  ```
  `verifyRemoveSideEffect`方法接收两个参数：被删除的`key`和`key`被删除的位置。首先，要获取被删除的`key`的`hash`值。
  然后，从被删除的`key`的下一个位置开始迭代直到找到一个空位置。当空位置被找到后，表示元素都在合适的位置上，不需要进行移动。当
  迭代后面的元素时，就需要计算当前位置上元素的`hash`值。如果元素的`hash`值小于等于它原始的`hash`值或当前元素的`hash`值小于
  等于`removePosition`（也就是被删除的`key`的`hash`值），就说明需要把当前元素移动到被删除的`key`的位置上。移动完成之后，
  可以删除当前的元素，因为它已经被复制到被删除的`key`的位置上了。还需要将`removedPosition`更新为当前的`index`，重复这个过程。

  下面来测试一下删除操作。
  ```js
  const hash = new HashTableLinearProbing();

  hash.put("Ygritte", "深圳市光明区");
  hash.put("Jonathan", "深圳市宝安区");
  hash.put("Jamie", "深圳市龙岗区");
  console.log(hash.toString());
  // 4 => [#Ygritte: 深圳市光明区], 5 => [#Jonathan: 深圳市宝安区], 6 => [#Jamie: 深圳市龙岗区]

  hash.remove("Jonathan");
  console.log(hash.toString());
  // 4 => [#Ygritte: 深圳市光明区], {5 => [#Jamie: 深圳市龙岗区]}
  ```
  这里删除了位置`5`的`Jonathan，位置`5`现在空闲了。验证一下是否有副作用。然后来到存储Jamie的位置`6`，当前的散列值为`5`，它的
  散列值小于等于散列值`5`，所以要把Jamie复制到位置`5`并且删除`Jamie`。位置`6`空闲了。而下一个位置也是空闲的，本次执行完成了。

  #### HashTableLinearProbing整体代码
  ```js
  class HashTableLinearProbing {
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
        if (this.table[position] == null) {
          this.table[position] = new ValuePair(key, val);
        } else {
          let index = position + 1;
          // 检查该位置是否为空，不为空就往下找，直到有空位为止
          while (this.table[index] != null) {
            index++;
          }
          this.table[index] = new ValuePair(key, val);
        }
        return true;
      }
      return false;
    }

    get(key) {
      const position = this.hashCode(key);
      // 确认该键是否存在
      if (this.table[position] != null) {

        // 如果存在，就检查要找的值是否是原始位置上的值
        if (this.table[position].key === key) {
          return this.table[position].value;
        }

        let index = position + 1;
        
        // 寻找空余位置
        while (this.table[index] != null && this.table[index].key !== key) {
          index++;
        }

        // 当跳出while循环时，验证元素的键是否是要找的键
        if (this.table[index] != null && this.table[index].key === key) {
          return this.table[index].value;
        }
      }
      
      // 如果迭代完整个散列表而且index位置上是null或着undefined，说明要找的键不存在，返回undefined。
      return undefined;
    }

    remove(key) {
      const position = this.hashCode(key);
      if (this.table[position] != null) {
        delete this.table[position];
        this.verifyRemoveSideEffect(key, position);
        return true;
      }
      let index = position + 1;
      while (this.table[index] != null && this.table[index].key != key) {
        index++;
      }
      if (this.table[index] != null && this.table[index].key === key) {
        delete this.table[index];
        this.verifyRemoveSideEffect(key, index);
        return true;
      }
      return false;
    }

    // 验证副作用函数
    verifyRemoveSideEffect(key, removePosition) {
      // 获取被删除的key的哈希值
      const hash = this.hashCode(key);

      // 被删除的key的下一个位置
      let index = removePosition + 1;

      while (this.table[index] != null) {
        // 计算当前位置的key的哈希值
        const posHash = this.hashCode(this.table[index].key);

        // 如果当前元素的hash值小于等于被删除的key的hash值或者当前元素的hash小于等于被删除的key的位置的值
        // 就把当前元素移动到被删除的key的位置上，并且删除当前元素，最后把删除的key的位置更新成当前的index
        if (posHash <= hash || posHash <= removePosition) {
          this.table[removePosition] = this.table[index];
          delete this.table[index];
          removePosition = index;
        }
        index++;
      }
    }

    size() {
      return Object.keys(this.table).length;
    }

    isEmpty() {
      return this.size() === 0;
    }

    toString() {
      if (this.isEmpty()) {
        return "";
      }

      const keys = Object.keys(this.table);
      let objString = `${keys[0]} => ${this.table[keys[0]].toString()}`;
      for (let i = 1; i < keys.length; i++) {
        objString = `${objString}, {${keys[i]} => ${this.table[
          keys[i]
        ].toString()}}`;
      }

      return objString;
    }
  }

  const hash = new HashTableLinearProbing();

  hash.put("Ygritte", "深圳市光明区");
  hash.put("Jonathan", "深圳市宝安区");
  hash.put("Jamie", "深圳市龙岗区");
  console.log(hash.toString());
  // 4 => [#Ygritte: 深圳市光明区], 5 => [#Jonathan: 深圳市宝安区], 6 => [#Jamie: 深圳市龙岗区]

  hash.remove("Jonathan");
  console.log(hash.toString());
  // 4 => [#Ygritte: 深圳市光明区], {5 => [#Jamie: 深圳市龙岗区]}
  ```

  ### 创建更好的散列函数
  上面的`loseHashCode`散列函数并不是一个好的散列函数，因为它产生的冲突太多了。一个好的散列函数是有几方面构成的：插入和检索元素的
  时间，也就是性能。以及较低的冲突可能性。大家可以在网上找一些不同的实现方法，也可以实现自己的散列函数。

  另一个可以实现的、比之前用的`loseHashCode`更好的散列函数是`djb2`。
  ```js
  djb2HashCode(key) {
    const tableKey = this.toStrFn(key);
    let hash = 5381;
    for (let i = 0; i < tableKey.length; i++) {
      hash = (hash * 33) + tableKey.charCodeAt(i);
    }
    return hash % 1013
  }
  ```
  在把键转化为字符串之后，`djb2HashCode`方法包括初始化一个`hash`变量并赋值为一个质数，大多数都是使用`5381`，然后迭代参数`key`，
  把`hash`和`33`相乘，并和当前迭代到的字符串的ASCII码值相加。最后用相加的和跟另一个随机质数相除的余数。

  下面用之前插入数据的代码验证一下是否会产生冲突。
  ```js
  hash.put("Ygritte", "深圳市光明区");
  hash.put("Jonathan", "深圳市宝安区");
  hash.put("Jamie", "深圳市龙岗区");
  hash.put("Jack", "深圳市南山区");
  hash.put("Jasmine", "深圳市罗湖区");
  hash.put("Jake", "深圳市福田区");
  hash.put("Nathan", "深圳市光明新区");
  hash.put("Athelstan", "深圳市盐田区");
  hash.put("Sargeras", "深圳市坪山区");
  console.log(hash.toString());
  // {223 => [#Nathan: 深圳市光明新区]},
  // {275 => [#Jasmine: 深圳市罗湖区]},
  // {288 => [#Jonathan: 深圳市宝安区]},
  // {619 => [#Jack: 深圳市南山区]},
  // {711 => [#Sargeras: 深圳市坪山区]},
  // {807 => [#Ygritte: 深圳市光明区]},
  // {877 => [#Jake: 深圳市福田区]},
  // {925 => [#Athelstan: 深圳市盐田区]},
  // {962 => [#Jamie: 深圳市龙岗区]}
  ```
  然而并没有冲突。这并不是最好的散列函数，但是是最推崇的散列函数之一。
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

class HashTableLinearProbing {
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
    return this.djb2HashCode(key);
  }

  put(key, val) {
    if (key != null && val != null) {
      const position = this.hashCode(key);
      if (this.table[position] == null) {
        this.table[position] = new ValuePair(key, val);
      } else {
        let index = position + 1;
        // 检查该位置是否为空，不为空就往下找，直到有空位为止
        while (this.table[index] != null) {
          index++;
        }
        this.table[index] = new ValuePair(key, val);
      }
      return true;
    }
    return false;
  }

  get(key) {
    const position = this.hashCode(key);
    if (this.table[position] != null) {
      if (this.table[position].key === key) {
        return this.table[position].value;
      }

      let index = position + 1;
      while (this.table[index] != null && this.table[index].key !== key) {
        index++;
      }
      if (this.table[index] != null && this.table[index].key === key) {
        return this.table[index].value;
      }
    }
    return undefined;
  }

  remove(key) {
    const position = this.hashCode(key);
    if (this.table[position] != null) {
      delete this.table[position];
      this.verifyRemoveSideEffect(key, position);
      return true;
    }
    let index = position + 1;
    while (this.table[index] != null && this.table[index].key != key) {
      index++;
    }
    if (this.table[index] != null && this.table[index].key === key) {
      delete this.table[index];
      this.verifyRemoveSideEffect(key, index);
      return true;
    }
    return false;
  }

  // 验证副作用函数
  verifyRemoveSideEffect(key, removePosition) {
    // 获取被删除的key的哈希值
    const hash = this.hashCode(key);

    // 被删除的key的下一个位置
    let index = removePosition + 1;

    while (this.table[index] != null) {
      // 计算当前位置的key的哈希值
      const posHash = this.hashCode(this.table[index].key);

      // 如果当前元素的hash值小于等于被删除的key的hash值或者当前元素的hash小于等于被删除的key的位置的值
      // 就把当前元素移动到被删除的key的位置上，并且删除当前元素，最后把删除的key的位置更新成当前的index
      if (posHash <= hash || posHash <= removePosition) {
        this.table[removePosition] = this.table[index];
        delete this.table[index];
        removePosition = index;
      }
      index++;
    }
  }

  size() {
    return Object.keys(this.table).length;
  }

  isEmpty() {
    return this.size() === 0;
  }

  toString() {
    if (this.isEmpty()) {
      return "";
    }

    const keys = Object.keys(this.table);
    let objString = `{${keys[0]} => ${this.table[keys[0]].toString()}}`;
    for (let i = 1; i < keys.length; i++) {
      objString = `${objString},\n{${keys[i]} => ${this.table[
        keys[i]
      ].toString()}}`;
    }

    return objString;
  }

  djb2HashCode(key) {
    const tableKey = this.toStrFn(key);
    let hash = 5381;
    for (let i = 0; i < tableKey.length; i++) {
      hash = hash * 33 + tableKey.charCodeAt(i);
    }
    return hash % 1013;
  }
}

const hash = new HashTableLinearProbing();
