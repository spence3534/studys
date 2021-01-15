/*
  ## JavaScript的数组方法
  下面表述一下数组的一些核心方法，其中一些之前提过了。
  * `concat`：连接`2`个或更多数组，并返回结果。（通常用于合并数组）
  * `every`：对数组中的每个元素运行给定函数，如果该函数对每个元素都返回`true`，则返回`true`。（检查数组的元素是否符合条件，我几乎没用过）
  * `filter`：对数组中的每个元素运行给定函数，返回该函数会返回`true`的元素组成的数组。（用于筛选某些数据）
  * `forEach`：对数组中的每个元素运行给定函数，这个方法没有返回值。（遍历数组）
  * `join`：将所有的数组元素连接成一个字符串。（把数组转成字符串拼接后的字符串）
  * `indexOf`：返回第一个与给定参数相等的数组元素的索引，没有找到则返回`-1`。（从数组头部开始查找传入相应的值，如没有找到该值则返回`-1`）
  * `lastIndexOf`：返回在数组中搜索到的与给定参数相等的元素的索引里最大的值。（从数组尾部开始查找传入相应的值，如没有找到该值则返回`-1`）
  * `map`：对数组中的每个元素运行给定函数，返回每次函数调用的结果组成的数组。（一般用于修改数组元素中的值，并返回该元素）
  * `reverse`：颠倒数组中元素的顺序，第一个元素变成最后一个，最后一个元素变成第一个。
  * `slice`：传入索引值，将数组里对应索引范围内的元素作为新数组返回。（一般用于切割数组）
  * `some`：对数组中的每个元素运行给定函数，如果任一元素返回`true`，则返回`true`。（检测数组的每个元素是否符合添加，如果其中一个元素符合条件，则返回true）
  * `sort`：按照字母顺序对数组排序，支持传入指定排序方法的函数作为参数。（一般用于去重）。
  * `toString`：将数组作为字符串返回。（把数组转成以逗号分隔的字符串）
  * `valueOf`：和`toString`类似，将数组作为字符串返回。
  在前面已经讲过`push`、`pop`、`shift`、`unshift`和`splice`方法，下面讲表格中的数组方法，这些方法在开发当中都会大量用到，
  这其中的一些方法在函数式编程中是很有用的。

  ### 数组和并
  如果有多个数组，想要合并成一个数组的话，可以使用`concat`方法。
  ```js
  const zero = 0;
  const positiveNumbers = [1, 2, 3];
  const negativeNumbers = [-3, -2, -1];

  let numbers = negativeNumbers.concat(zero, positiveNumbers);
  console.log(numbers);
  // [-3, -2, -1, 0, 1, 2, 3];
  ```
  `concat`方法可以向一个数组传递数组、对象或者是元素。数组会按照该方法传入的参数顺序合并成指定数组。以上的例子中，
  `zero`将被合并到`negativeNumbers`中，然后`positiveNumbers`也被合并。最后输出结果是`-3, -2, -1, 0, 1, 2, 3`。

  ### 迭代函数
  除了`for`语句之外，js还内置了很多迭代数组的方法。我们需要一个数组和一个函数：假设数组中的值是从`1`到`10`; 如果数组里的
  元素可以被`2`整除（偶数），函数则返回`true`，否则返回`false`。
  ```js
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  function isEven(x) {
    // 如果x是2的倍数，就返回true
    console.log(x);
    return x % 2 === 0 ? true : false;
  }
  ```

  #### 用`every`方法迭代
  首先使用`every`方法。`every`方法会迭代数组中的每个元素，直到返回`false`。
  ```js
  console.log(arr.every(isEven));
  // 1
  // false
  ```
  上面的例子中，数组`arr`的第一个元素是`1`，它不是`2`的倍数（`1`是奇数），所以`isEven`函数返回`false`，然后`every`就执行结束了。

  #### 使用`some`方法迭代
  来看`some`方法，它跟`every`的行为相反，会迭代数组的每个元素，直到函数返回`true`为止。
  ```js
  console.log(arr.some(isEven));
  // 1
  // 2
  // true
  ```
  在上面的例子中，`arr`数组中的第一个偶数是`2`。第一个被迭代的元素是`1`，`isEven`会返回`false`。第二个被迭代的元素是`2`，`isEven`
  返回`true`，然后迭代就结束了。

  #### 用`forEach`迭代
  如果想迭代整个数组，可以用`forEach`方法。它和使用`for`循环的结果相同。切记！`forEach`是没有返回值的。
  ```js
  arr.forEach((x) => console.log(x % 2 === 0));
  // false
  // true
  // false
  // true
  // false
  // true
  // false
  // true
  // false
  // true
  ```

  ####使用`map`和`filter`方法
  js还有两个会返回新数组的迭代方法。第一个是`map`。
  ```js
  const myMap = arr.map(isEven);
  console.log(myMap);
  // [false, true, false, true, false, true, false, true, false, true]
  ```
  数组`myMap`里的值是：`[false, true, false, true, false, true, false, true, false, true]`。它保存了传入`map`方法的
  `isEven`函数的运行结果。这样就容易知道一个元素是否是偶数了。比如，`myMap[0]`是`false`，因为`1`不是偶数；

  `filter`方法，它返回的新数组是由`isEven`函数返回`true`的元素组成。
  ```js
  const evenNumbers = arr.filter(isEven);
  console.log(evenNumbers);
  // [ 2, 4, 6, 8, 10 ]
  ```
  这个例子中，`evenNumbers`数组中的元素都是偶数：[ 2, 4, 6, 8, 10 ]

  #### 使用`reduce`方法
  `reduce`方法接收四个参数的函数：`previousValue`（初始值）、`currentValue`（当前元素）、`index`（当前索引）和`array`（当前元素所属的数组对象）。
  `index`和`array`是可选的参数，用不到的话，可以不传。这个函数会返回一个将被叠加到累加器的值，`reduce`方法停止执行后会返回这个累加器。如果要对一个数组
  的所有元素求和，这个方法就很有用了。看下面的例子。
  ```js
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const myReduce = arr.reduce((pre, curr) => pre + curr);
  console.log(myReduce); // 55
  ```
  这个例子输出的值是`55`。

  ### ES6和数组的新功能
  :::warning
  不熟悉ES6的同学，去恶补ES6。
  :::
  * `@@iterator`：返回一个包含数组键值对的迭代器对象，可以通过同步调用得到数组元素的键值对。
  * `copyWithin`：复制数组中一系列元素到同一数组指定的起始位置。
  * `entries`：返回包含数组所有键值对的`@@iterator`。
  * `includes`：如果数组中存在某个元素则返回`true`，否则返回`false`。
  * `find`：根据回调函数给定的条件从数组中查找元素，如果找到则返回该元素。
  * `findIndex`：根据回调函数给定的条件从数组中查找元素，如果找到则返回该元素在数组中的索引。
  * `fill`：用静态值填充数组。
  * `from`：根据已有数组创建一个新数组。
  * `keys`：返回包含数组所有索引的`@@iterator`。
  * `of`：根据传入的参数创建一个新数组。
  * `values`：返回包含数组中所有值的`@@iterator`。
  
  #### 使用`for...of`循环迭代
  ES6还引入了迭代数组值的`for...of`循环，来看看它的用法。
  ```js
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  for (let n of arr) {
    // n就是arr中的元素
    console.log(n % 2 === 0 ? true : false);
  }
  ```
  #### 使用`@@iterator`对象
  ES6还为`Array`增加了一个`@@iterator`属性，需要通过`Symbol.iterator`来访问。看下面的例子。
  ```js
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let iterator = arr[Symbol.iterator]();
  console.log(iterator.next().value); // 1
  console.log(iterator.next().value); // 2
  console.log(iterator.next().value); // 3
  console.log(iterator.next().value); // 4
  ```
  然后，不断调用迭代器的`next`方法，就能依次得到数组中的值。`arr`数组中有`10`个值，那么就要调用`10`次。
  这显然不实际，但是我们可以使用`for...of`循环来输出这些值。
  ```js
  let iterator = arr[Symbol.iterator]();
  for (const n of iterator) {
    console.log(n);
  }
  ```
  数组中的值被迭代完之后，再次调用`iterator.next().value`则会返回`undefined`。看下面的例子：
  ```js
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let iterator = arr[Symbol.iterator]();
  for (const n of iterator) {
    console.log(n);
  }
  console.log(iterator.next().value); // undefined
  ```

  #### 数组的`entries`、`keys`和`values`方法
  ES6还增加了三种从数组中得到迭代器的方法。先来看一下`entries`方法。
  ```js
  let aEntries = arr.entries(); // 这里得到键值对的迭代器
  console.log(aEntries.next().value); // [0, 1] 位置0的值为1
  console.log(aEntries.next().value); // [1, 2] 位置1的值为2
  console.log(aEntries.next().value); // [2, 3] 位置2的值为3
  ```
  `arr`数组中都是数，`key`是数组中的位置，`value`是保存在数组索引的值。也可以使用`for...of`循环对`aEntries`进行迭代。

  使用集合、字典、散列表等数据结构时，能够取出键值是很有用的。

  `key`方法返回包含数组索引的`@@iterator`，看下面的例子。
  ```js
  let aKeys = arr.keys(); // 得到数组索引的迭代器
  console.log(aKeys.next()); // { value: 0, done: false }
  console.log(aKeys.next()); // { value: 1, done: false }
  console.log(aKeys.next()); // { value: 2, done: false }
  ```
  `keys`方法会返回`arr`数组的索引。如果没有可迭代的值，`aKeys.next()`就返回一个`value`属性为`undefined`、`done`属性
  为`true`的对象。如果`done`属性的值为`false`，就说明还有可迭代的值。

  `values`方法返回`@@iterator`则包含数组的值。看下面的例子。
  ```js
  let aValues = arr.values();
  console.log(aValues.next()); // { value: 1, done: false }
  console.log(aValues.next()); // { value: 2, done: false }
  console.log(aValues.next()); // { value: 3, done: false }
  ```

  #### 使用`form`方法
  `Array.form`方法用于把可遍历的对象、类数组的对象转为真正的数组（包括`Set`和`Map`数据结构）。也可以根据已有的数组创建一个
  新的数组。比如，要复制`arr`数组，看下面的例子。
  ```js
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let arr2 = Array.from(arr);
  console.log(arr2);
  // [0, 2, 3, 4,  5, 6, 7, 8, 9, 10]

  // 可遍历对象转数组
  let obj = {
    0: "1",
    1: "2",
    2: "3",
    length: 3,
  };
  console.log(Array.from(obj));
  // [ '1', '2', '3' ]

  // 类数组的对象转为真正的数组，arguments就是类数组的对象
  function args() {
    console.log(Array.from(arguments));
  }

  args(1, 2); // [ 1, 2 ]
  ```
  还可以传入一个用来过滤值的函数，例子如下。
  ```js
  let evens = Array.from(arr, (x) => x % 2 === 0);
  console.log(evens);
  // [false, true, false, true, false, true, false, true, false, true]
  ```
  上面的代码会创建一个`evens`数组，以及值`true`（在原数组中为偶数）或`false`（在原数组中为奇数）。

  #### 使用`Array.of`方法
  `Array.of`方法根据传入的参数创建一个新数组，看下面的代码。
  ```js
  let arr2 = Array.of(1);
  let arr3 = Array.of(2, 3, 4, 5, 6, 7, 8);
  console.log(arr2); // [ 1 ]
  console.log(arr3); // [2, 3, 4, 5, 6, 7, 8]
  ```
  也可以用这个方法复制已有的数组，如下。
  ```js
  let arrCopy = Array.of(...arr3);
  console.log(arrCopy); // [2, 3, 4, 5, 6, 7, 8];
  ```
  上面的代码和`Array.form(arr3)`的效果是一样的。
  
  #### 使用`fill`方法
  `fill`方法用静态值填充数组。看下面的代码。
  ```js
  let arrCopy = Array.of(1, 2, 3, 4, 5, 6);
  ```
  `arrCopy`数组的`length`是6，证明有`6`个位置，再看一下下面的代码。
  ```js
  let arrCopy = Array.of(1, 2, 3, 4, 5, 6);
  arrCopy.fill(0);
  console.log(arrCopy);
  // [ 0, 0, 0, 0, 0, 0 ]
  ```
  `arrCopy`数组所有位置上的值都会变成`0`。还可以指定开始填充的索引，如下所示。
  ```js
  arrCopy.fill(2, 1);
  console.log(arrCopy);
  // [ 1, 2, 2, 2, 2, 2 ]
  ```
  上面的例子，数组中从`1`开始的所有位置上的值都是`2`。

  也可以指定结束填充的索引。
  ```js
  arrCopy.fill(1, 3, 5);
  console.log(arrCopy);
  // [ 1, 2, 3, 1, 1, 6 ]
  ```
  上面的例子中，会把`1`填充到数组索引`3`到`5`的位置（不包括`3`和`5`）。

  想创建数组并初始化值的时候，`fill`方法非常好用，像下面这样。
  ```js
  let ones = Array(6).fill(1);
  console.log(ones); // [ 1, 1, 1, 1, 1, 1 ]
  ```
  上面的代码中，创建了一个长度为`6`、所有值都是`1`的数组。

  #### 使用`copyWithin`方法
  `copyWithin`方法复制数组中的一系列元素到同一数组指定的位置。来看看下面的例子。
  ```js
  let copyArray = [1, 2, 3, 4, 5, 6];
  ```
  假设想把`4、5、6`三个值复制到数组前三个位置，得到`[4, 5, 6, 4, 5, 6]`这个数组，可以用下面的代码。
  ```js
  copyArray.copyWithin(0, 3);
  console.log(copyArray);
  // [ 4, 5, 6, 4, 5, 6 ]
  ```
  假设想把`4、5`这个两个值（在位置`3`和`4`上）复制到位置`1`和`2`。可以这样做：
  ```js
  copyArray.copyWithin(1, 3, 5);
  console.log(copyArray);
  // [ 1, 4, 5, 4, 5, 6 ]
  ```
  这种情况下，会把位置`3`开始到位置`5`结束（不包括`3`和`5`）的元素复制到位置`1`。

  ### 排序元素
  下面展示最常用的搜索和排序方法。js也提供了一个排序方法和一组搜索方法。

  首先是反序输出数组`arr`。要实现这样的功能，可以使用`reverse`方法，把数组内的元素反序。
  ```js
  arr.reverse();
  console.log(arr);
  // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  ```
  现在就可以看到，输出`arr`之后得到的结果是`[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]`。

  下面来看`sort`方法。
  ```js
  arr.sort();
  console.log(arr);
  // [1, 10, 2, 3, 4, 5, 6, 7, 8, 9];
  ```
  然而，输出数组，结果是`[1, 10, 2, 3, 4, 5, 6, 7, 8, 9]`。看起来不太对劲，这是因为`sort`方法在对数组做排序时，把
  元素默认成字符串进行相互比较了。

  可以传入自己写的比较函数。因为数组里都是数，可以像下面这样写。
  ```js
  arr.sort((a, b) => a - b);
  console.log(arr);
  // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  ```
  在`b`大于`a`时，这段代码会返回负数，反之则返回正数。如果相等的话，就会返回`0`。也就是说返回的是负数，就说明`a`比`b`小，
  这样`sort`就能根据返回值的情况对数组进行排序了。

  之前的代码也可以表示像下面这样。
  ```js
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  arr.sort();
  console.log(arr);
  // [1, 10, 2, 3, 4, 5, 6, 7, 8, 9];
  function compare(a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    // a等于b就返回0
    return 0;
  }
  arr.sort(compare);
  console.log(arr);
  // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  ```
  这是因为js的`sort`方法接收`compareFunction`作为参数，然后`sort`会用它排序数组。在这个例子里，声明了一个用来比较数组元素
  的函数，使数组升序排序。

  #### 自定义排序
  可以对任何对象类型的数组进行排序，也可以创建`compareFunction`来比较元素。例如，对象`Person`有名字和年龄属性，我们想根据
  年龄排序，可以像下面这样写。
  ```js
  const friends = [
    { name: "xiaohong", age: 20 },
    { name: "xiaoming", age: 19 },
    { name: "xiaojia", age: 23 },
  ];

  function compare(a, b) {
    if (a.age < b.age) {
      return -1;
    }

    if (a.age > b.age) {
      return 1;
    }
    return 0;
  }

  console.log(friends.sort(compare));
  // [
  //   { name: 'xiaoming', age: 19 },
  //   { name: 'xiaohong', age: 20 },
  //   { name: 'xiaojia', age: 23 }
  // ]
  ```
  在这个例子里，输出结果如上。

  #### 字符串排序
  假如有这样一个数组。
  ```js
  let names = ["Ana", "ana", "john", "John"];
  ```
  使用`sort`方法排序之后如下所示。
  ```js
  console.log(names.sort());
  // [ 'Ana', 'John', 'ana', 'john' ]
  ```
  既然`a`在字母表里排第一位，为何`ana`却排在了`John`之后呢？这是因为js在做字符比较的时候，是根据字符对应
  的ASCII值来比较的。例如，`A、J、a、j`对应的ASCII值分别是`65、74、97、106`。

  虽然`a`在字母表里是最靠前的，但`J`的ASCII值比`a`的小，所以排在了`a`前面。
  :::warning
  想了解ASCII表的信息，可以访问http://www.asciitable.com/。
  :::

  如果给`sort`传入一个忽略大小写的比较函数，将输出`["Ana", "ana", "John", "john"]`。
  ```js
  let names = ["Ana", "ana", "john", "John"];
  console.log(
    names.sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      }
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      }
      return 0;
    })
  );
  ```
  在这种情况下，`sort`函数不会有任何作用。它会按照现在的大小写字母顺序排序。

  如果希望小写字母排在前面，就需要使用`localeCompare`方法。
  ```js
  let names = ["Ana", "ana", "john", "John"];
  names.sort((a, b) => a.localeCompare(b));
  console.log(names);
  // [ 'ana', 'Ana', 'john', 'John' ]
  ```
  结果输出如上。

  假如对带有重音符号的字符做排序的话，也可以用`localeCompare`来实现。
  ```js
  const name2 = ["Maève", "Maeve"];
  console.log(name2.sort((a, b) => a.localeCompare(b)));
  // [ 'Maeve', 'Maève' ]
  ```
  最后结果输出如上。
*/
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
