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

  console.log(averageTemp);
  // [ [ 72, 75, 79, 79, 81, 81 ], [ 81, 79, 75, 75, 73, 73 ] ]
  ```
  上面的代码里，分别制定了每天和每小时的数据。数组中的内容如下图所示。
  ![](./images/3-6-1.png)
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
  需要迭代所有的行和列。因此，使用一个嵌套的`for`循环来处理，其中变量`i`为行，`j`为列。每个`myMatrix[i]`
  代表一个数组，因此需要在嵌套的`for`循环中迭代`myMatrix[i]`的每个位置。

  :::success
  如果是在浏览器中打印二维数组，可以使用`console.table(averageTemp)`语句。这样会显示一个更加友好的输出结果。
  :::

  ### 多维数组
  假设要创建一个`3 x 3 x 3`的矩阵，每一格里包含矩阵的`i`（行）、`j`（列）及`z`（深度）之和。
  ```js
  const matrix3x3x3 = [];
  for (let i = 0; i < 3; i++) {
    matrix3x3x3[i] = []; // 需要初始化每个数组
    for (let j = 0; j < 3; j++) {
      matrix3x3x3[i][j] = [];
      for (let z = 0; z < 3; z++) {
        matrix3x3x3[i][j][z] = i + j + z;
      }
    }
  }
  console.table(matrix3x3x3); // 使用table打印以表格的方式展示matrix3x3x3数组
  console.log(matrix3x3x3); // 打印matrix3x3x3数组
  ```
  数据结构中有几个维度没关系，可以用循环迭代每个维度来访问所有格子。3 x 3 x 3`的矩阵如下。
  ![](./images/3-6-2.png)
  用下面的代码可以输出这个矩阵的内容。
  ```js
  for (let i = 0; i < matrix3x3x3.length; i++) {
    for (let j = 0; j < matrix3x3x3[i].length; j++) {
      for (let z = 0; z < matrix3x3x3[i][j].length; z++) {
        console.log(matrix3x3x3[i][j][z]); // 这里输出z的结果
      }
    }
  }
  ```
  如果是一个`3 x 3 x 3 x 3`的矩阵，就要用到四层嵌套的`for`语句，以此类推。但是在开发当中很少会用到四维
  数组，二维数组最常见的。
*/