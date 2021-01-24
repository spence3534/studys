/*
  ## 删除元素

  ### 从数组末尾删除元素
  数组的`pop`方法，用于删除数组最靠后的元素。
  ```js
  let arr = [1, 2, 3, 4, 5];
  arr.pop();
  console.log(arr);
  // [ 1, 2, 3, 4 ]
  ```
  通过`push`和`pop`方法可以模拟栈，上面的数组输出的数是`1`到`4`，数组的长度是`4`。

  ### 从数组开头删除元素
  如果移除数组里的第一个元素，可以用下面的代码。
  ```js
  let numbers = [1, 2, 3, 4, 5, 6, 7, 8];
  for (let i = 0; i < numbers.length; i++) {
    numbers[i] = numbers[i + 1];
  }
  console.log(numbers);
  // [ 2, 3, 4, 5, 6, 7, 8, undefined ]
  ```
  上面的代码中，把数组里面的所有元素都左移了一位，但是数组的长度还是`8`，这就意味着数组中有额外的一个元素
  （值为`undefined`）。在最后一次循环里，`i+1`引用了数组里还没初始化的一个位置。

  可以看到，只是把数组第一位的值用第二位覆盖了，并没有删除元素（因为数组的长度和之前的一样的，并且多了个未定义元素）。

  要从数组中移除这个值，可以使用下面的方法。
  ```js
  let numbers = [1, 2, 3, 4, 5, 6, 7, 8];

  Array.prototype.reIndex = function (myArr) {
    const newArr = [];
    for (let i = 0; i < myArr.length; i++) {
      if (myArr[i] !== undefined) {
        newArr.push(myArr[i]);
      }
    }
    return newArr;
  }

  // 手动移除第一个元素并且重新排序
  Array.prototype.removeFirstPosition = function () {
    for (let i = 0; i < this.length; i++) {
      this[i] = this[i + 1];
    }
    return this.reIndex(this);
  }

  numbers = numbers.removeFirstPosition();
  console.log(numbers);
  // [ 2, 3, 4, 5, 6, 7, 8 ]
  ```
  首先，在数组的原型上定义一个`reIndex`方法，在`reIndex`方法里定义一个新数组，将所有不是`undefined`的值从原来的数组复
  制到新数组中，并且将这个新数组返回。然后，再从数组的原型上定义一个`removeFirstPosition`方法，这个方法也就是刚才写过的
  `for`循环。只是把`numbers`改成了`this`，而这个`this`就是数组。下一步从`numbers`上调用这个方法，赋值给`numbers`，就
  得到了删除数组中第一个元素的结果。

  上面的代码只是用来示范而已，在项目中还是使用`shift`方法。

  ### 使用`shift`方法
  要删除数组的第一个元素，可以用`shift`方法实现。
  ```js
  let numbers = [1, 2, 3, 4, 5, 6];
  numbers.shift();
  console.log(numbers);
  // [ 2, 3, 4, 5, 6]
  ```
  假如本来数组中的值是从`1`到`6`，长度为`6`。执行了上面的代码后，数组就只有`2`到`6`了，长度也会减小到`5`。

  使用`shift`和`unshift`方法，就可以用数组来模拟队列的数组结构。
*/