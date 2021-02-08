/*
  ## ES6Set类的运算

  下面用ES6的`Set`类来模拟**并集、交集、差集、子集**。

  下面的例子会用到这两个集合。
  ```js
  const setA = new Set();
  setA.add(1);
  setA.add(2);
  setA.add(3);

  const setB = new Set();
  setB.add(2);
  setB.add(3);
  setB.add(4);
  ```

  ### 模拟并集
  ```js
  const union = (setA, setB) => {
    const union = new Set();
    setA.forEach((value) => union.add(value));
    setB.forEach((value) => union.add(value));
    return union;
  };
  console.log(union(setA, setB));
  // { 1, 2, 3, 4 }
  ```

  ### 模拟交集
  ```js
  const intersection = (setA, setB) => {
    const intersection = new Set();
    setA.forEach((value) => {
      if (setB.has(value)) {
        intersection.add(value);
      }
    });
    return intersection;
  };
  console.log(intersection(setA, setB));
  // { 2, 3 }
  ```

  ### 模拟差集
  ```js
  const difference = (setA, setB) => {
    const difference = new Set();
    setA.forEach((value) => {
      if (!setB.has(value)) {
        difference.add(value);
      }
    });
    return difference;
  };
  console.log(difference(setA, setB));
  // { 1 }
  ```

  ### 模拟子集
  ```js
  const isSubsetOf = (setA, setB) => {
    if (setA.size > setB.size) {
      return false;
    }
    let isSubset = true;
    let arr = [...setA];
    arr.every((value) => {
      if (!setB.has(value)) {
        isSubset = false;
        return false;
      }
      return true;
    });
    return isSubset;
  };

  console.log(isSubsetOf(setA, setB));
  // false
  ```
 */
const setA = new Set();
setA.add(1);
setA.add(2);
setA.add(3);

const setB = new Set();
setB.add(2);
setB.add(3);
setB.add(4);

const union = (setA, setB) => {
  const union = new Set();
  setA.forEach((value) => union.add(value));
  setB.forEach((value) => union.add(value));
  return union;
};
console.log(union(setA, setB));
// { 1, 2, 3, 4 }

const intersection = (setA, setB) => {
  const intersection = new Set();
  setA.forEach((value) => {
    if (setB.has(value)) {
      intersection.add(value);
    }
  });
  return intersection;
};
console.log(intersection(setA, setB));
// { 2, 3 }

const difference = (setA, setB) => {
  const difference = new Set();
  setA.forEach((value) => {
    if (!setB.has(value)) {
      difference.add(value);
    }
  });
  return difference;
};
console.log(difference(setA, setB));
// { 1 }

const isSubsetOf = (setA, setB) => {
  if (setA.size > setB.size) {
    return false;
  }
  let isSubset = true;
  let arr = [...setA];
  arr.every((value) => {
    if (!setB.has(value)) {
      isSubset = false;
      return false;
    }
    return true;
  });
  return isSubset;
};

console.log(isSubsetOf(setA, setB));
// false
