/*
  ## 函数

  ### 函数声明
  函数一共有以下五种方式。
  ```js
  // 具名函数
  function Person(name: string) {
    return `hello ${name}`
  }

  // 函数表达式
  let person2 = function (name: string) {
    return `hello ${name}`
  }

  // 箭头函数表达式
  let person3 = (name: string) => {
    return `hello ${name}`
  }

  // 箭头函数表达式简写
  let person4 = (name: string) => `hello ${name}`

  // 函数构造方法

  let person5 = new Function('name', "return `hello ${name}`")
  ```

  ### 形参和实参
  **形参**：声明函数时指定的运行函数所需的数据。
  **实参**：调用函数时传给函数的数据。

  ### 可选和默认参数
  函数也是可以用`?`将参数标记为可选的，最好是把必要参数放在前，可选放在后。
  ```js
  function Person(name: string, age?: number) {
    return `大家好，我是${name}, 今年${age}岁`
  }

  Person('图图', 23);
  Person('小美')
  ```
  默认参数和`JS`中一样。不过，`TS`会自动推导默认参数的类型是什么。
  ```js
  function Person(name: string, age = 23) {
    return `大家好，我是${name}, 今年${age}岁`
  }

  Person('图图', 23);
  Person('小美', '20')
  // Argument of type '"20"' is not assignable to parameter of type 'number | undefined'
  ```
  当然你也可以显示注解默认参数的类型，就像没有默认值的参数一样。
  ```js
  type Info = {
    name?: string,
    age?: number
  }

  function person(info: Info = {}) {
    return `大家好，我是${info.name}, 今年${info.age}岁`
  }

  person()
  person({ name: '图图', age: 23 })
  ```

  ### 剩余参数
  在`TS`中的剩余参数以`...`表示，和ES6里面三点运算符一样的。
  ```js
  function sum(...numbers: number[]): number {
    return numbers.reduce((total, a) => total + a, 0)
  }

  sum(1, 2, 3)
  ```

  ### 注解this的类型
  在`TS`中，如果函数使用`this`，就要在函数的第一个参数中声明`this`的类型（放在其他参数之前），这样每次调用
  函数时，`TS`将确保`this`是你想要的类型。
  ```js
  function getDate(this: Date) {
    return `${this.getDate()}/${this.getMonth()}/${this.getFullYear()}`
  }
  ```

  ### 调用签名
  学习调用签名之前，先来给一个例子大家看：
  ```js
  function info(name: string, age: number): string {
    return `我是${name}, 今年${age}岁`
  }
  ```
  上面的`info`是一个函数，大家都知道它的类型是一个`Function`。但大多数情况下`Function`类型并不是我们想要的。它并不能体现出函数的具体类型。

  那么，`info`的类型要怎么表示呢？`info`接受一个`string`和一个`number`参数并返回一个`string`的函数。在`TS`中可以像下面这样来表示该函数
  的类型：
  ```js
  (name: string, age: number) => string
  ```
  这就是`TS`表示函数类型的句法，也叫做**调用签名**（或叫类型签名）。它和箭头函数非常相似。如果把函数当作参数传递给另一个函数，或作为其他函数
  的返回值，就要使用这样的句法注解类型。

  函数的调用签名只包含类型层面的代码。也就是说，只有类型，没有值。因此，函数的调用签名可以表示参数的类型、`this`的类型、返回值的类型、剩余参数
  的类型和可选参数的类型。但无法表示默认值，因为默认值是值，而不是类型。调用签名没有函数的定义体，无法推导出返回类型，所以必须显式注解。

  #### 类型层面和值层面代码
  类型层面表示只有类型和类型运算符的代码，其他都是“值层面代码”。看下面的例子。
  ```js
  function add(num: number): number | null { // 函数的参数、返回值类型、并集类型运算符|都是类型层面
    if (num < 0) {
      return null
    }
    num++
    return num
  }

  let num: number = 1 // 类型层面
  let total = add(num)
  if (total !== null) {
    console.log(total)
  }
  ```

  下面我们来用几个函数，使用调用签名表示函数的类型，然后绑定给类型别名：
  ```js
  // function Person(name, age)
  type Person = (name: string, age: number) => string

  // function add(num, n)
  type add = (num: number, n: number) => number

  // function getItem(index)
  type getItem = (index: number) => object
  ```

  那我们怎么使用调用签名呢？只需要把调用签名和实现签名的函数表达式合在一起就可以了。看下面的例子：
  ```js
  type Person = (name: string, age: number) => string

  let person: Person = (name, age = 23): string => {
    return `我是${name}, 今年${age}岁`
  }

  ```
  上面的例子中，声明一个函数表达式`person`，并注解它类型为`Person`。参数的类型不用再次注解，因为在
  定义`Person`类型时已经注解过了（`TS`会从`Person`中推导出来）。给`age`设置一个默认值，类型则从`Person`
  的签名中获取，但默认值是不知道的，因为`Person`是类型，不包含值。最后无需再次注解返回类型，因为在`Person`类型中已经声明为`string`。

  ### 上下文类型推导
  **上下文类型推导**是`TS`中的一个强大特性。下面来看个例子。
  ```js
  function times(f: (index: number) => void, n: number) {
    for (let i = 0; i < n; i++) {
      f(i)
    }
  }

  times(n => console.log(n), 10);
  ```
  上面声明一个`times`函数，它调用`n`次回调`f`，每次把当前索引传给`f`。如果传给`times`的函数是在行内声明的话，就不用显示注解函数的类型。

  `TS`能从上下文推导出`n`是一个数字，因为在`times`的签名中，声明`f`的参数`index`是一个数字。`TS`足够聪明，能推导出`n`就是那个参数。

  如果`f`不是在行内声明，那么`TS`就没有办法推导出它的类型。
  ```js
  function times(f: (index: number) => void, n: number) {
    for (let i = 0; i < n; i++) {
      f(i);
    }
  }

  function f(n) { // Parameter 'n' implicitly has an 'any' type.
    console.log(n)
  }

  times(f, 10)
  ```
  ### 函数类型重载
  函数类型句法有两种，刚才我们学的是**简写型类型签名**。还有一种是**完整型类型签名***。
  ```js
  type Person = {
    (name: string, age: number): void
  }
  ```
  对于比较复杂的函数时，用完整型类型签名好处更多。首先是重载函数类型，那什么是“重载函数”呢？

  **重载函数表示有多个类型签名的函数。**，看下面的例子。
  ```js
  type Info = {
    (name: string, age: string): string,
    (name: string, age: number, height: number): string,
  }

  let info: Info = (name, age, height?: number) => {
    if (typeof age === 'number' && height !== undefined) {
      return `大家好，我叫${name}, 今年${age}岁, 身高${height}`
    }
    return `大家好，我叫${name}, 今年${age}岁`
  }

  console.log(info('图图', '23'))
  console.log(info('图图', 23, 175))
  ```
  以上就是重载函数的实例，根据传入的参数不同，函数体内所做的事情就不同。

  声明重载函数还有另一种方式，下面改写以上的例子。
  ```js
  function info(name: string, age: string): string
  function info(name: string, age: number, height: number): string
  function info(name: string, age: string | number, height?: number) {
    if (typeof age === 'number' && height !== undefined) {
      return `大家好，我叫${name}, 今年${age}岁, 身高${height}`
    }
    return `大家好，我叫${name}, 今年${age}岁`
  }

  info('图图', '23')
  info('小美', 20, 165)
  ```

  多数情况下，`TS`会先把字面量重载放到非字面量重载前面，然后按顺序解析。在定义重载时，
  一定要把最精确的定义放在最前面。
*/




