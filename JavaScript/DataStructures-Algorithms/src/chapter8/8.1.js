/*
 * @Author: mikey.zhaopeng
 * @Date: 2021-03-02 14:42:39
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-03-03 16:43:59
 */

/*
  # 字典和散列表

  现在已经知道集合是一组不可重复的元素。在字典中，存储的是`[键，值]`对，键名是用来查询特定元素的。字典和集合很相似，集合是
  以`[值，值]`的形式存储元素，而字典是以`[键，值]`的形式来存储元素。字典也叫做**映射、符号表**或**关联数组**。

  在计算机中，字典常用于保存对象的引用地址。例如，打开谷歌浏览器开发者工具中的**Memory**标签页，执行快照功能，就可以看到
  内存中的一些对象和它们对应的地址（@<数>表示）。看下面的截图。
  ![](./images/8-1-1.jpg)

  ## 创建字典类
  ES6中增加了`Map`数据结构，也就是我们所说的字典。没有学过`Map`数据结构的同学可以去看看阮一峰老师的ES6。

  这里实现的类就以ES6中的`Map`类的实现为基础，它和`Set`类很相似，不同之处在于存储元素的形式不一样。

  以下是`Dictionary`的骨架。
  ```js
  class Dictionary {
    constructor(toStrFn = defaultToString) {
      this.toStrFn = toStrFn;
      this.table = {};
    }
  }
  ```
  和`Set`类类似，用一个`Object`的实例存储字典中的元素（`table`属性）。我们会将`[键，值]`对保存为`table[key] = {key, value}`。

  :::tip
  使用方括号（[]）获取对象的属性 ，把属性名作为“**位置**”传入即可。这也是称它为关联数组的原因。
  :::

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
  ```
  在字典中，最好是用字符串作为键名，值可以是任何类型。但是，js不是强类型的语言，我们不能保证键一定是字符串。我们需要把所有作为键名的对象
  转为字符串，这样从`Dictionary`类中搜索和获取值更简单。要实现这个功能，就需要一个将`key`转为字符串的函数（也就是`this.toStrFn`）。

  :::warning
  要注意的是，如果`item`变量是一个对象的话，就需要实现`toString`方法，否则会导致出现`[object Object]`这种异常输出的情况。
  :::

  如果键时一个字符串，就直接返回它，否则要调用`item`的`toString`方法。

  下面声明一些映射/字典所能使用的方法。
  * `set(key, value)`：向字典中添加新元素，如果`key`已存在，就把已存在的`value`覆盖掉。
  * `remove(key)`：通过使用键值作为参数来从字典中移除键值对应的数据值。
  * `hasKey(key)`：如果某个键值存在该字典中，返回`true`，否则返回`false`。
  * `get(key)`：通过键值作为参数查找特定的数值并且返回。
  * `clear()`：删除字典中的所有值。
  * `size()`：返回字典所包含值的数量。与数组的`length`属性类似。
  * `isEmpty()`：在`size`等于`0`的时候返回`true`，否则返回`false`。
  * `keys()`：把字典所包含的所有数值以数组形式返回。
  * `keyValues()`：把字典中所有`[键，值]`对返回。
  * `forEach(callbackFn)`迭代字典中所有的键值对。`callbackFn`有两个参数：`key`和`value`这个方法可以在回调函数返回`false`的时候被中止（和数组中的`every`方法相似）。
  
  ### hasKey方法
  先来实现`hasKey(key)`方法，该方法用于检查一个键是否存在字典中。
  ```js
  hasKey(key) {
    return this.table[this.toStrFn(key)] != null;
  }
  ```
  js只允许我们使用字符串作为对象的键名或属性名。如果传入一个复杂对象作为键，需要把它转为一个字符串。因此需要调用`toStrFn`函数。如果已经
  存在一个给定键名的键值对（表中的位置不是`null`或`undefined`），就返回`true`，否则返回`false`。

  ### set方法
  下面来实现`set`方法，该方法用于设置字典中的键和值。
  ```js
  set(key, val) {
    if (key != null && value != null) {
      const tableKey = this.toStrFn(key);
      this.table[tableKey] = new ValuePair(key, val);
      return true;
    }
    return false;
  }
  ```
  该方法接收`key`和`value`作为参数。如果`key`和`value`不是`undefined`或`null`，就获取表示`key`的字符串，创建一个新的键值对并把它
  赋值给`table`对象上的`key`属性。如果`key`和`value`合法，就返回`true`，表示字典可以把`key`和`value`保存下来，否则返回`false`。

  该方法可以用于添加新的值和更新已有的值。

  在`set`方法中实例化了一个`ValuePair`类。`ValuePair`定义如下。
  ```js
  class ValuePair {
    constructor(key, value) {
      this.key = key;
      this.value = value;
    }

    toString() {
      return `[#${this.key}: ${this.value}]`;
    }
  }
  ```
  为了在字典中保存`value`，把`key`转成了字符串，而为了保存信息的需要，同样要保存原始的`key`。因此，不是只把`value`保存在字典中，而是
  要保存两个值：原始的`key`和`value`。为了字典能更简单地通过`toString`方法输出结果，同样要为`ValuePair`类创建`toString`方法。

  ### remove方法
  接下来，实现`remove`方法，该方法用于从字典中移除一个值。它跟`Set`类中的`delete`方法很相似，唯一的不同是用`key`搜索（而不是`value`）。
  ```js
  remove(key) {
    if (this.hasKey(key)) {
      delete this.table[this.toStrFn(key)];
      return true;
    }
    return false;
  }
  ```
  
  ### get方法
  如果要从字典中查询一个特定的`key`，并获取它的`value`，可以使用`get`方法。
  ```js
  get(key) {
    const valuePair = this.table[this.toStrFn(key)];
    return valuePair == null ? undefined : valuePair.value;
  }
  ```
  `get`方法首先检索存储在给定`key`属性中对象。如果`valuePair`对象存在，就返回该值，否则返回一个`undefined`。

  ### keys、values和valuePairs方法
  首先是`valuePair`方法，该方法用于获取字典中所有`valuePair`的值，以数组形式返回。下面有两个版本。
  ```js
  keyValues() {
    return Object.values(this.table);
  }

  otherKeyValues() {  
    const valuePairs = [];
    for (let k in this.table) {
      if (this.hasKey(k)) {
        valuePairs.push(this.table[k]);
      }
    }
    return valuePairs;
  }
  ```
  第一个版本简单的用了`Object`内置的`values`方法。第二个版考虑到可能有些浏览器不支持`Object.values`方法，
  和之前讲的`Set`集合类中的`valuesLegacy`方法性质一样。

  下面是`keys`方法，该方法返回字典中的所有原始键名。有两个版本。
  ```js
  keys() {
    return this.keyValues().map((valuePair) => valuePair.key);
  }
  ```
  这里调用了`keyValues`方法，返回一个包含`valuePair`实例的数组，然后迭代每个`valuePair`。由于我们只想要`valuePair`的`key`，
  所以就只返回它的`key`。

  `keys`方法的第二个版本。
  ```js
  anotherKeys() {
    const keys = [];
    const valuePair = this.keyValues().length;
    for (let i = 0; i < valuePair.length; i++) {
      keys.push(valuePair[i].key);
    }
    return keys;
  }
  ```

  跟`keys`方法相似，还有一个`values`方法。`values`方法返回一个字典中的所有值，并以数组的形式返回。它的代码跟`keys`方法相似，只不过
  返回的是`ValuePair`类的`value`属性。
  ```js
  values() {
    return this.keyValues().map((valuePair) => valuePair.value);
  }
  ```
  #### 用`forEach`迭代字典中的每个键值对
  ```js
  forEach(callbackFn) {
    const valuePairs = this.keyValues();
    for (let i = 0; i < valuePairs.length; i++) {
      const result = callbackFn(valuePairs[i].key, valuePairs[i].value);

      if (result === false) {
        break;
      }
    }
  }
  ```
  首先，获取字典中所有`ValuePairs`构成的数组，然后迭代每个`valuePair`并执行以参数形式传入`forEach`方法的`callbackFn`函数，保存它的结果。
  如果回调函数返回了`false`，就中断`forEach`方法的执行，打断正在迭代`valuePairs`的`for`循环。

  ### clear、size、isEmpty和toString方法
  `size`方法返回字典中的值的个数。可以用`Object.keys`方法获取`table`对象中的所有键名。也可以调用`keyValues`方法并返回它所返回的数组长度。
  ```js
  size() {
    return Object.keys(this.table).length;
  }

  anotherSize() {
    return this.keyValues().length;
  }
  ```

  要检查字典是否为空，直接获取它的`size`看看是否为零就可以了。
  ```js
  isEmpty() {
    return this.size() === 0;
  }
  ```

  要清空字典内容，直接把一个新对象赋值给`table`就行了。
  ```js
  clear() {
    this.table = {};
  }
  ```

  最后来实现`toString`方法。
  ```js
  toString() {
    if (this.isEmpty()) {
      return "";
    }

    const valuePairs = this.keyValues();
    let objString = `${valuePairs[0].toString()}`;
    for (let i = 0; i < valuePairs.length; i++) {
      objString = `${objString}, ${valuePairs[i].toString()}`;
    }
    return objString;
  }
  ```
  `toString`方法的实现其实和之前所讲过的数据结构的`toString`方法并没有什么差异。

  ### 使用Dictionary类
  下面用`Dictionary`类实现一个地址目录。
  ```js
  const dictionary = new Dictionary();

  dictionary.set("ming", "深圳市宝安区");
  dictionary.set("hong", "深圳市南山区");
  dictionary.set("lang", "深圳市龙岗区");

  console.log(dictionary.hasKey("hong"));
  // true

  console.log(dictionary.size());
  // 3

  console.log(dictionary.keys());
  // [ 'ming', 'hong', 'lang' ]

  console.log(dictionary.values());
  // [ '深圳市宝安区', '深圳市南山区', '深圳市龙岗区' ]

  console.log(dictionary.get("hong"));
  // 深圳市南山区

  // 移除一个元素
  dictionary.remove("ming");

  console.log(dictionary.keyValues());
  // [
  //   { key: "hong", value: "深圳市南山区" },
  //   { key: "lang", value: "深圳市龙岗区" },
  // ];

  dictionary.forEach((key, val) => {
    console.log(`key: ${key},  value: ${val}`);
  });
  // key: hong,  value: 深圳市南山区
  // key: lang,  value: 深圳市龙岗区
  ```

  ### Dictionary整体代码
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

  class ValuePair {
    constructor(key, value) {
      this.key = key;
      this.value = value;
    }

    toString() {
      return `[#${this.key}: ${this.value}]`;
    }
  }

  class Dictionary {
    constructor(toStrFn = defaultToString) {
      this.toStrFn = toStrFn;
      this.table = {};
    }

    hasKey(key) {
      return this.table[this.toStrFn(key)] != null;
    }

    set(key, val) {
      if (key != null && val != null) {
        const tableKey = this.toStrFn(key);
        this.table[tableKey] = new ValuePair(key, val);
        return true;
      }
      return false;
    }

    remove(key) {
      if (this.hasKey(key)) {
        delete this.table[this.toStrFn(key)];
        return true;
      }
      return false;
    }

    get(key) {
      const valuePair = this.table[this.toStrFn(key)];
      return valuePair == null ? undefined : valuePair.value;
    }

    keyValues() {
      return Object.values(this.table);
    }

    anotherKeyValues() {
      const valuePairs = [];
      for (let k in this.table) {
        if (this.hasKey(k)) {
          valuePairs.push(this.table[k]);
        }
      }
      return valuePairs;
    }

    keys() {
      return this.keyValues().map((valuePair) => valuePair.key);
    }

    anotherKeys() {
      const keys = [];
      const valuePair = this.keyValues().length;
      for (let i = 0; i < valuePair.length; i++) {
        keys.push(valuePair[i].key);
      }
      return keys;
    }

    values() {
      return this.keyValues().map((valuePair) => valuePair.value);
    }

    forEach(callbackFn) {
      const valuePairs = this.keyValues();
      for (let i = 0; i < valuePairs.length; i++) {
        const result = callbackFn(valuePairs[i].key, valuePairs[i].value);

        if (result === false) {
          break;
        }
      }
    }

    size() {
      return Object.keys(this.table).length;
    }

    anotherSize() {
      return this.keyValues().length;
    }

    isEmpty() {
      return this.size() === 0;
    }

    clear() {
      this.table = {};
    }

    toString() {
      if (this.isEmpty()) {
        return "";
      }

      const valuePairs = this.keyValues();
      let objString = `${valuePairs[0].toString()}`;
      for (let i = 0; i < valuePairs.length; i++) {
        objString = `${objString}, ${valuePairs[i].toString()}`;
      }
      return objString;
    }
  }
  ```
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

class Dictionary {
  constructor(toStrFn = defaultToString) {
    this.toStrFn = toStrFn;
    this.table = {};
  }

  hasKey(key) {
    return this.table[this.toStrFn(key)] != null;
  }

  set(key, val) {
    if (key != null && val != null) {
      const tableKey = this.toStrFn(key);
      this.table[tableKey] = new ValuePair(key, val);
      return true;
    }
    return false;
  }

  remove(key) {
    if (this.hasKey(key)) {
      delete this.table[this.toStrFn(key)];
      return true;
    }
    return false;
  }

  get(key) {
    const valuePair = this.table[this.toStrFn(key)];
    return valuePair == null ? undefined : valuePair.value;
  }

  keyValues() {
    return Object.values(this.table);
  }

  anotherKeyValues() {
    const valuePairs = [];
    for (let k in this.table) {
      if (this.hasKey(k)) {
        valuePairs.push(this.table[k]);
      }
    }
    return valuePairs;
  }

  keys() {
    return this.keyValues().map((valuePair) => valuePair.key);
  }

  anotherKeys() {
    const keys = [];
    const valuePair = this.keyValues().length;
    for (let i = 0; i < valuePair.length; i++) {
      keys.push(valuePair[i].key);
    }
    return keys;
  }

  values() {
    return this.keyValues().map((valuePair) => valuePair.value);
  }

  forEach(callbackFn) {
    const valuePairs = this.keyValues();
    for (let i = 0; i < valuePairs.length; i++) {
      const result = callbackFn(valuePairs[i].key, valuePairs[i].value);

      if (result === false) {
        break;
      }
    }
  }

  size() {
    return Object.keys(this.table).length;
  }

  anotherSize() {
    return this.keyValues().length;
  }

  isEmpty() {
    return this.size() === 0;
  }

  clear() {
    this.table = {};
  }

  toString() {
    if (this.isEmpty()) {
      return "";
    }

    const valuePairs = this.keyValues();
    let objString = `${valuePairs[0].toString()}`;
    for (let i = 0; i < valuePairs.length; i++) {
      objString = `${objString}, ${valuePairs[i].toString()}`;
    }
    return objString;
  }
}

const dictionary = new Dictionary();

dictionary.set("ming", "深圳市宝安区");
dictionary.set("hong", "深圳市南山区");
dictionary.set("lang", "深圳市龙岗区");

console.log(dictionary.hasKey("hong"));
// true

console.log(dictionary.size());
// 3

console.log(dictionary.keys());
// [ 'ming', 'hong', 'lang' ]

console.log(dictionary.values());
// [ '深圳市宝安区', '深圳市南山区', '深圳市龙岗区' ]

console.log(dictionary.get("hong"));
// 深圳市南山区

// 移除一个元素
dictionary.remove("ming");

console.log(dictionary.keyValues());
// [
//   { key: "hong", value: "深圳市南山区" },
//   { key: "lang", value: "深圳市龙岗区" },
// ];

dictionary.forEach((key, val) => {
  console.log(`key: ${key},  value: ${val}`);
});
// key: hong,  value: 深圳市南山区
// key: lang,  value: 深圳市龙岗区
