/*
  # 数组
  
  ## 为什么使用数组

  假如有一个这样的需求：保存班级上的同学的分数。可以这样做：
  ```js
  const xiaoming = 90;
  const xiaohong = 85;
  const xiaohuang = 75;
  const xiaolan = 80;
  ```
  但是这并不是最好的方案，如果按照这种方式，只存部分同学的成绩，要创建几个到十几个变量，如果说存全班同学的成绩就要创建很多变量。
  显然这样是行不通的，那么我们就可以用数组来解决这个问题，更加简洁的呈现同样的信息。
  ```js
  const fractions = [];

  fractions[0] = 90;
  fractions[1] = 85;
  fractions[2] = 75;
  fractions[3] = 80;
  console.log(fractions);
  // 数组fraction的内容展示如下：
  // [ 90, 85, 75, 80 ]
  ```
*/