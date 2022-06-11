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

  ### 泛型
  在了解泛型之前，我们先来看个例子：
  ```js
  function merge(arr1: string[], arr2: string[]): string[]
  function merge(arr1: number[], arr2: number[]): number[]
  function merge(arr1: object[], arr2: object[]): object[]

  function merge(arr1: any, arr2: any) {
    return [...arr1.concat(arr2)]
  }

  let strings = merge(['1', '2'], ['3', '4'])
  let numbers = merge([1, 2], [3, 4])
  let objects = merge([{ name: '图图' }], [{ name: '小美' }])
  console.log(strings[0])
  console.log(numbers[0])
  console.log(objects[0].name)
  // Property 'name' does not exist on type 'object'
  ```
  上面代码中，我们使用函数重载实现了一个可以合并字符串数组、数字数组、对象数组的`merge`函数。访问`strings`和`numbers`第一个元素都没有问题，但是当想在控制台输入`objects`变量第一个元素中的属性时，`TS`抛出错误了。这是因为`object`无法描述对象的结构，所以抛出了错误。而且没有指明对象的具体结构。

  在实际开发中，有时候，并不知道函数中需要什么类型。但又不想限制函数只接收某个类型，而且还兼容未来的某种类型。那么**泛型***就派上用场了，泛型也是`TS`中最难懂的一个部分。

  > 泛型参数：在类型层面施加约束的占位类型，也叫多态类型参数。

  下面我们来改造一下上面的例子：
  ```js
  function merge<T>(arr1: T[], arr2: T[]): T[]

  function merge<T>(arr1: T[], arr2: T[]) {
    return [...arr1.concat(arr2)]
  }
  let strings = merge(['1', '2'], ['3', '4'])
  let numbers = merge([1, 2], [3, 4])
  let objects = merge([{ name: '图图' }], [{ name: '小美' }])
  console.log(objects[0].name)
  ```
  上面代码中，`merge`函数使用一个泛型参数`T`，但我们并不知道具体类型是什么；`TS`从传入的`arr1`和`arr2`中推导`T`的类型。调用`merge`函数时，`TS`推导出`T`的具体类型之后，会把`T`出现的每个地方都替换成推导出的类型。`T`就像一个占位类型，类型检查器会根据上下文填充具体的类型。

  泛型使用尖括号`<>`来声明（你可以把尖括号理解成`type`关键字，只不过声明的是泛型）。尖括号的位置限定泛型的作用域（只有少数几个地方可以用尖括号），`TS`将确保当前作用域中相同的泛型参数最终都绑定同一个具体类型。鉴于上面的例子中括号的位置，`TS`将在调用`merge`函数时为泛型`T`绑定具体类型。而为`T`绑定哪一个具体类型，就取决于调用`merge`函数时传入的参数。

  > `T`是一个类型名称，也可以使用任何名称，比如`Name`、`Person`、`Value`等。

  泛型还可以是多个，在尖括号中以逗号分隔开。来看下面的例子。
  ```js
  function Person<T, U>(name: T, age: U): [T, U] {
    return [name, age]
  }

  const person = Person('图图', 18)
  ```
  上面代码中，有两个泛型：表示人名的`T`和年龄的`U`，最后返回一个具备这两个值的数组。

  #### 绑定泛型
  声明泛型的位置不仅限制了泛型的作用域，还决定`TS`啥时候给泛型绑定具体类型。以上面的代码为例。
  ```js
  type Person = {
    <T, U>(name: T, age: U): [T, U]
  }

  let person: Person = (name, age) => [name, age]
  ```
  `<T, U>在类型签名中声明，`TS`会在调用`Person`类型的函数时给`T`绑定具体的类型。

  如果把`<T, U>`的作用域限定在类型别名`Person`中，`TS`将要求在使用`Person`时显示绑定类型。
  ```js
  type Person<T, U> = {
    (name: T, age: U): [T, U]
  }


  let person: Person = (name, age) => [name, age]
  // Generic type 'Person' requires 2 type argument(s).

  type otherPerson = Person
  // Generic type 'Person' requires 2 type argument(s).

  let person1: Person<string, number> = (name, age) => [name, age]

  type arrPerson = Person<string, number>
  ```
  在使用泛型时，给泛型绑定具体类型。对函数来说，在调用函数时。对于类，在实例化时。对于类型别名和接口，在使用别名和实现接口时。

  ### 泛型推导
  上面的所有泛型例子，我们都是让`TS`自动推导出泛型。也可以显式注解泛型。在显式注解泛型时，要么把所有的泛型都加上注解，要么都不注解。
  ```js
  function Person<T, U>(name: T, age: U): [T, U] {
    return [name, age]
  }

  let person = Person<string, number>('图图', 23)
  ```
  ### 泛型别名
  我们可以使用`type`关键字给泛型声明别名，看下面的例子。
  ```js
  type DomEvent<T> = {
    target: T,
    type: string
  }

  type DivEvent = DomEvent<HTMLDivElement | null>

  let myDiv: DivEvent = {
    target: document.querySelector("#myDiv"),
    type: "click"
  }
  // 或者
  let myDiv: DomEvent<HTMLDivElement | null> = {
    target: document.querySelector('#myDiv'),
    type: 'click'
  }
  ```
  大家要注意的是，在使用`DomEvent`泛型时。必须显式注解类型参数，在这种情况下，`TS`是无法自行推导的。

  泛型别名还可以在函数的签名中使用。`TS`给`T`绑定类型时，还会给`DomEvent`绑定。
  ```js
  type DomEvent<T> = {
    target: T,
    type: string
  }

  function myClick<T>(e: DomEvent<T>): void {
    console.log('click me');
  }

  myClick({ // T 为 Element 或 null
    target: document.querySelector("#myDiv"),
    type: "click"
  })
  ```

  ### 泛型默认类型
  函数的参数可以指定默认值，而泛型可以指定默认类型。
  ```js
  type Person<T = string> = {
    name: T,
    age: number
  }

  let person: Person = {
    name: '图图',
    age: 10
  }
  ```
  要注意的是，泛型默认类型和函数的可选参数一样的，有默认类型的泛型要放到没有默认类型的泛型后面。
*/

/* type Sum = {
  (a: number, b: number): number,
  (a: number, b: number, c:number): number
}

let sum: Sum = (a:number, b:number, c?:number) => {
  if (c !== undefined) {
    return a + b +c
  }
  return a + b
}

console.log(sum(2, 3)) // 5

console.log(sum(2, 3, 5)) // 10 */

/* type Person<T, U> = {
  (name: T, age: U): {}
}

let person: Person<string, number> = (name, age) => {
  return { name, age }
}

type OtherPerson = Person<string, number> */
// Error Generic type 'Person' requires 2 type argument(s)

/* type Person<T, U> = {
  (name: T, age: U): [T, U];
};

let person: Person = (name, age) => [name, age];
// Generic type 'Person' requires 2 type argument(s).

type otherPerson = Person;
// Generic type 'Person' requires 2 type argument(s).

let person1: Person<string, number> = (name, age) => [name, age];

type arrPerson = Person<string, number>; */

// Error Required type parameters may not follow optional type parameters

