/*
  ## 二维和多维数组
  下面是一个用平均气温测量的例子，实现一个矩阵（二维数组，或数组的数组）。
  ```js
  let averageTemp = [];
  averageTemp[0] = [72, 75, 79, 79, 81, 81];
  averageTemp[1] = [81, 79, 75, 75, 73, 73];
  ```
  js只支持一维数组，并不支持矩阵。但是，可以像上面的代码一样，用数组套数组，实现矩阵或者任一多维数组。看下面的例子：
  ```js
  let averageTemp = [];
  averageTemp[0] = [72, 75, 79, 79, 81, 81];
  averageTemp[1] = [81, 79, 75, 75, 73, 73];

  averageTemp[0][0] = 72;
  averageTemp[0][1] = 75;
  averageTemp[0][2] = 79;
  averageTemp[0][3] = 79;
  averageTemp[0][4] = 81;
  averageTemp[0][5] = 81;

  averageTemp[1][0] = 81;
  averageTemp[1][1] = 79;
  averageTemp[1][2] = 75;
  averageTemp[1][3] = 75;
  averageTemp[1][4] = 73;
  averageTemp[1][5] = 73;

  console.log(averageTemp);
  // [ [ 72, 75, 79, 79, 81, 81 ], [ 81, 79, 75, 75, 73, 73 ] ]
  ```
  上面的代码里，分别制定了每天和每小时的数据。数组中的内容如下图所示。
  ![](./images/7-1.png)
  每行就是每天的数据，每列是当天不同时段的气温。

  ### 迭代二维数组的元素
  如果想看这个矩阵的输出，使用下面的函数，专门输出其中的值。
  ```js
  let averageTemp = [];
  averageTemp[0] = [72, 75, 79, 79, 81, 81];
  averageTemp[1] = [81, 79, 75, 75, 73, 73];

  function printMatrix(arr) {
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      console.log(arr[i]);
      for (let j = 0; j < arr[i].length; j++) {
        console.log(arr[i][j]);
      }
    }
  }

  printMatrix(averageTemp);
  ```
*/