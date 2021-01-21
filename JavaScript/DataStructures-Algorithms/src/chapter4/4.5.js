/*
  ## 用栈解决问题

  栈的实际应用非常广泛。在回溯问题中，它可以存储访问过的任何或路径、撤销的操作。

  ### 从十进制到二进制
  在生活中，我们主要使用十进制。但在计算机科学中，二进制非常重要，因为计算机的所有内容都是用二进制
  数字表示的（`0`和`1`）。

  要把十进制转成二进制，可以将该十进制数除以`2`（二进制是满二进一）并对商取整，直到结果是`0`为止。
  举个例子，把十进制的数`10`转成二进制的数字，下面是对应的算法。
  ```js
  function decimal(num) {
    const remStack = []; // 存储二进制的栈
    let number = num; // 需要转成二进制的数
    let rem = ""; // 余数
    let binaryString = ""; // 存储推出栈的元素

    // 当参数不为0时，进入while语句
    while (number > 0) {
      rem = Math.floor(number % 2);
      remStack.push(rem); // 把余数添加到remStack数组中
      number = Math.floor(number / 2); // number除以2，得到下次要取余数的值，此时的number的值已经不是传入的参数了。
    }

    while (remStack.length !== 0) {
      // 用pop方法把栈中的元素移除，将移除栈的元素连成字符串
      binaryString += remStack.pop().toString();
    }
    return binaryString;
  }

  console.log(decimal(10)); // 1010
  console.log(decimal(100)); // 1100100
  ```
  在上面这段代码里，当参数不是`0`时，进入`while`语句。就得到一个余数赋值给`rem`，并放入栈里。然后让`number`除以`2`，
  就得到了下次进入`while语句`取余数的值。要注意的是，此时的`number`的值已经不是传入参数的值了。最后，用`pop`方法把
  栈中的元素移除，将移除的元素连成字符串。

  ### 进制转换算法
  修改之前的算法，可以将十进制转成计数为`2~36`的任何进制。除了把十进制除以`2`转成二进制数外，还可以传入其他任何禁止的基数为参数。
  ```js
  function baseConverter(num, base) {
    const remStack = [];
    const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let number = num;
    let rem = "";
    let baseString = "";

    if (!(base >= 2 && base <= 36)) {
      return '';
    }

    while (number > 0) {
      rem = Math.floor(number % base);
      remStack.push(rem);
      number = Math.floor(number / base);
    }
    
    while (remStack.length !== 0) {
      baseString += digits[remStack.pop()];
    }
    return baseString;
  }

  console.log(baseConverter(10000, 2)); // 10011100010000
  console.log(baseConverter(10000, 8)); // 23420
  console.log(baseConverter(10000, 16)); // 64
  console.log(baseConverter(10000, 36)); // 7PS
  ```
  上面的代码只需要改一个地方，把十进制转成二进制的时候，余数是`0`和`1`，再把十进制转八进制的时候，余数是`0~7`；但是把十进制转十六进制
  时，余数是`0~9`再加上`A、B、C、D、E、F`（对应10、11、12、13、14、15）。所以需要对栈中的数组做一个转换才行（`baseString += digits[remStack.pop()]`这段代码）。
  从十一进制开始，字母表中的每个字母都对应一个基数，`A`就代表基数`11`，`B`就代表基数`12`，以此类推。
 */