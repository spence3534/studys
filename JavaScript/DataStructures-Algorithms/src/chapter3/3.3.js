/*
  ## 添加元素
  在数组中添加和删除元素也很容易，假如我们有一个数组`numbers`，初始化成了`0`到`9`；
  ```js
  let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  ```
  ### 在数组末尾插入元素
  如果想要给数组添加一个元素（比如`10`），只要把值赋给数组中最后一个空位上的元素就可以了。
  ```js
  numbers[numbers.length] = 10;
  ```
  :::warning
  在js中，数组是一个可修改的对象。如果添加元素，它就会自动增长。
  在C和Java等其他语言中，要决定数组的大小，想添加元素就要创建一个全新的数组，不能简单地往其中添加所需的元素。
  :::

  #### 使用push方法
  另外，有一个`push`方法，能把元素添加到数组的末尾。通过`push`方法，能添加任意个元素。
  ```js
  let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  numbers[numbers.length] = 10;
  numbers.push(11);
  numbers.push(12, 13);
  console.log(numbers);
  // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  ```
  在最后打印`numbers`就得到了从`0`到`13`的值。

  #### 在数组开头插入元素
  在数组中插入一个新元素（数`-1`），不像之前那样在末尾插入，而是放到数组的开头。实现这个需求，首先腾出数组里第一个
  元素的位置，把所有的元素向右移动一位。我们可以循环数组中的元素，从最后一位（长度就是数组的末尾位置）开始，将对应的
  前一个元素（`i-1`）的值赋给它（`i`），依次处理，最后把我们想要的赋给第一个位置（索引`0`）上。我们可以把这段逻辑
  写成一个函数，甚至将这个方法直接挂在`Array`的原型上，使所有数组的实例都可以访问到这个方法。来看下面的代码。
  ```js
  let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  Array.prototype.insertFirstPosition = function (value) {
    for (let i = this.length; i >= 0; i--) {
      this[i] = this[i - 1];
    }
    this[0] = value;
  }
  numbers.insertFirstPosition(-1);
  console.log(numbers);
  // [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  ```
  #### 使用unshift方法
  在js里，数组有一个方法叫`unshift`，可以直接把数值插入数组的开头（这个方法的逻辑和`insertFirstPosition`方法）
  的行为是一模一样的。
  ```js
  let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  numbers.unshift(-1, -2);
  numbers.unshift(-3, -4);
  console.log(numbers);
  // [-3, -4, -1, -2, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  ```
  用`unshift`方法，就可以在数组的开始处添加值了。
*/