"use strict";
/*
  js给出错误信息是在真正运行时，而ts是在输入代码的过程中，编辑器就会给出错误信息。

  ## 编译器
  程序都是由文件所构成，这些文件由一个特殊的程序解析，也就是编译器。转换成抽象语法树（`AST`）。`AST`是去掉了空白、注释和缩进用的
  进制符或空格之后的数据结构。编译器把`AST`转换成一种叫做字节码的底层表示。字节码再传给运行时计算，得到最终结果。也就是说，运行程序
  就是让运行时计算由编译器从源码解析得来的`AST`生成的字节码。

  步骤如下：
  1. 把程序解析为`AST`（抽象语法树）。
  2. 把`AST`编译成字节码。
  3. 运行时计算字节码。

  `TS`并不是直接编译成字节码，而是先编译成`JS`代码。那么`TS`又是如何保证代码变得更安全的呢？

  `TS`编译器生成`AST`之后，真正运行代码前，`TS`会对代码做类型检查。如果加入类型检查和运行`JS`代码，`TS`的编译过程大致如下图。
  ![]("../images/1.png");

  `TSC`把`TS`编译成`JS`代码时，是不会考虑类型。类型只在类型检查这步使用。

  ### 类型系统
  类型系统有两种：一种通过显式句法告诉编译器所有值的类型，另一种自动推导值的类型。`TS`具备这两种类型系统，可以显式注解类型，也可以让`TS`推导多数类型。
  ```js
  // 显式注解类型
  let num: number = 1
  let isBoolean: boolean = false
  let str: string = "1"

  // 推导多数类型
  let num = 1
  let isBoolean = false
  let str = "1"

  ### 类型字面量
  类型字面量仅表示一个值的类型，例如：
  ```js
  let num: 123 = 235
  let bool: true = false
  ```


  ### 明确赋值
  在`TS`中声明一个变量时，需要给这个变量赋上明确的值。不然就会出现报错。`TS`会检测在使用该变量时是否已经明确的为该变量赋值了。例如：
  ```js
  let num: number
  let j = num + 1  // 抛出错误 Variable 'num' is used before being assigned
  ```
  这种情况在`JS`中是完全允许的，但在`TS`中不能这么操作。即便`num`没有显式注解类型，`TS`也会抛出错误。

  ### 可选属性
  当一个对象中有个类型为`number`的属性`num`，`TS`将预期对象有这一个属性，并且只有这个属性。如果缺少了`num`属性，或者多出其他的属性，`TS`会出现报错。
  这时，**可选属性**就派上用场了。下面来展示可选属性的用法。
  ```js
  let a: {
    num: number,
    str?: string,
  }

  // a = { num: 1 }
  // a = { num: 2, str: undefined }
  // a = { num: 3, str: 'tutu' }
  ```
  在对象的键和`:`之间加一个`?`就表示该属性是可选的，这里的`str`属性是可传可不传，如果传了它的值为`undefined`。**可选属性**的好处是可以对有可能存在的属性进行预定义，还可以捕获引用了不存在的属性时的错误。

  ### 索引签名
  `[prop: T]: U`语法叫做索引签名，通过这种方式可以告诉`TS`这个对象中会有多个键。
  ```js
  let a: {
    num: number,
    str: string,
    [prop: number]: boolean
  }

  // a = { num: 1 }
  // a = { num: 1, str: undefined, 10: true}
  // a = { num: 1, 10: true }
  // a = { num: 1, 10: 'tutu' } Type 'string' is not assignable to type 'boolean'
  ```
  索引签名只支持两种类型：字符串和数字。可以同时使用这两种类型的索引。另外，索引签名中的键名可以是任何词，不一定是`prop`。

  ### readonly
  当我们声明对象类型时，除了使用可选符号（`?`）之外，还可以用`readonly`修饰符将字段设置为只读（类似`const`效果）。
  ```js
  let info: {
    readonly myName: string
  } = {
    myName: 'tutu'
  }

  info.myName = 'xiaomei'; // Cannot assign to 'myName' because it is a read-only property.
  ```

  ### 类型别名
  使用`type`关键字可以为类型声明别名，下面来看看它的用法。
  ```js
  type Height = number

  type Person = {
    name: string,
    height: Height
  }
  ```
  `Height`就是一个`number`，这样定义类型别名更容易让人理解。但要注意的是，`TS`是没办法推导类型别名的，所以必须显式注解。
  ```js
  type Height = number

  let height: Height = 170;

  type Person = {
    name: string,
    height: Height
  }

  let person: Person = {
    name: 'tutu',
    height: height
  }
  ```
  我们将`number`类型声明别名为`Height`，因此可以把值赋给`number`。我们把上面的代码改成这样：
  ```js
  type Height = number

  let height = 170;  // 改动

  type Person = {
    name: string,
    height: Height
  }

  let person: Person = {
    name: 'tutu',
    height: height
  }
  ```
  `type`关键字跟用`let`和`const`变量声明一样，同一类型不能声明两次。而且也是采用块级作用域。每个代码块和每个函数都有自己的作用域，
  内部的类型别名会覆盖外部的类型别名。

  ### 并集类型和交集类型
  `TS`提供了两个类型运算符用来处理类型的并集和交集。并集用`|`符号表示（类似`||`），交集使用`&`（类似`&&`）。
  ```js
  type Man = { name: string, height: number }
  type Girl = { name: string, hobby: string, age: number }

  type ManOrGirl = Man | Girl
  type ManAndGirl = Man & Girl

  let person: ManOrGirl = {
    name: 'tutu',
    height: 170,
  }

  person = {
    name: 'xiaomei',
    height: 165,
    hobby: 'code',
    age: 20
  }
  ``
  上面的代码中，当某个值是`ManOrGirl`类型时。我们只需要知道该值有一个字符串类型的`name`属性就好了。可以是`Man`类型的值，也可以是
  `Girl`类型的值，甚至两者兼具。

  ### 数组
  初始化空数组时，`TS`并不知道数组中元素的类型，所以推导出`any`类型。往数组中添加元素之后，`TS`开始拼凑数组的类型。当数组离开定义
  时所在的作用域后，`TS`最终才会确定一个类型，不再扩张。看下面的代码：
  ```js
  function addElement() {
    let arr = [] // any
    arr.push('a') // number[]
    arr.push(1) // (string | number)[]
    return arr
  }

  let myEle = addElement() // (string | number)[]

  myEle.push(true) // Argument of type 'boolean' is not assignable to parameter of type 'string | number'.
  ```

  ### 元组
  元组是`array`的子类型，用来定义数组的一种特殊方式，长度固定，索引位置上的值具有固定的已知类型。声明元组时必须显式注解类型。因为创建元组用的句法
  和数组一样，都是用方括号。`TS`遇到方括号，都会认为是数组类型。
  ```js
  let tuple:[string, string, number] = ['tutu', 'code', 23]

  tuple = ['tutu', 'code', 23, 1998]
  // Type '[string, string, number, number]' is not assignable to type '[string, string, number]'.
  ```
  元组也是支持可选的元素和剩余元素的，和对象中的可选元素一样。`?`表示可选。
  ```js
  let nums: [number, string?][] = [
    [1],
    [2, '2'],
    [3]
  ]

  // 字符串列表，至少有一个元素
  let names: [string, ...string[]] = ['图图', '小美', '牛爷爷', '图爸爸']

  // 元素类型不同的列表
  let list: [number, boolean, ...Object[]] = [1, true, { type: 'Object' }, { name: '图图' } ]
  ```

  #### 只读数组和元组
  通常，数组都是可变的（使用`push、splice`方法添加或更新数组）。有时候会遇到不可变的数组，修改后得到一个新数组，而原数组保持不变。
  `TS`支持只读数组类型，用于创建不可变数组。只读数组和普通数组没什么差别，只是不能就地修改。如果创建只读数组，要显式注解类型；如果
  要更改只读数组，只能用非变型方法，比如`concat`、`slice`，不能用可变型方法：`push`、`splice`。
  ```js
  let num1: readonly number[] = [1, 2, 3]
  let num2: readonly number[] = num1.concat(4)

  let item = num2[2]

  num1[4] = 5
  // Index signature in type 'readonly number[]' only permits reading.

  num1.push(6)
  // Property 'push' does not exist on type 'readonly number[]'.
  ```
  声明只读数组和元组可以使用长格式句法：
  ```js
  type NumArr = readonly number[]
  type StrArr = ReadonlyArray<string>
  type ObjArr = Readonly<Object[]>

  type NumAndStr = readonly [number, string]
  type NumAndStr1 = Readonly<[number, string]>
  ```
  以上代码中，有两种只读数组写法。哪一种都是一样的，看自己的喜好。

  ### 枚举
  枚举用于列出该类型中的所有值，把`key`（键）映射到`value`（值）中。枚举分两种形式：字符串到字符串之间的映射和字符串到数字之间的映射。
  ```js
  enum Fruits {
    Apple,
    Banana,
    Orange
  }
  ```
  `TS`会自动推算枚举中各个成员对应的数字，也可以自己手动设置。
  ```js
  enum Fruits {
    Apple = 0,
    Banana = 1,
    Orange = 2
  }
  ```
  如果要访问枚举中的值有两种形式，一种像访问数组的形式，另一种就是访问对象的形式。
  ```js
  enum Fruits {
    Apple = 0,
    Banana = 1,
    Orange = 2
  }

  console.log(Fruits.Apple);
  console.log(Fruits['Banana'])
  console.log(Fruits[1])
  ```
  一个枚举还可以分几次声明，`TS`会自动把每部分合并在一起。
  ```js
  enum Fruits {
    Apple = 0,
    Banana = 1,
    Orange = 2
  }

  enum Fruits {
    Watermelon = 3
  }
  ```
  但是要注意，分开声明枚举`TS`只会推导出其中一部分的值，最好给枚举中的每个键都显示赋值。如果把上面`Watermelon`键的值去掉，
  它的值就为`0`。

  键的值还可以经过计算得出，而且不必给所有的键都赋值。`TS`会推导出缺少的值。
  ```js
  enum Fruits {
    Apple = 10,
    Banana = 10 + 1,
    Orange
  }

  console.log(Fruits)
  {
    '10': 'Apple',
    '11': 'Banana',
    '12': 'Orange',
    Apple: 10,
    Banana: 11,
    Orange: 12
  }
  ```
  上面代码中，`Orange`键没有赋值。`TS`自动推导出`Orange`的值为`12`。因为它的前一个键的值为`11`，但这种行为只能是值为数字类型的情况下才会出现。
*/
/* let num: unknown = 1 // unknown
let isNum = num === 2 // boolean
let addNum = num + 100 // Error: Object is of type 'unknown'


if (typeof num === 'number') {
  let d = num + 100 // number
  console.log(d) // 101
} */
/* let value: boolean = true
let isHide = false
const hasKey = true
let isShow = true
let disable: false = true // Error: Type 'true' is not assignable to type 'false'.
let isDisable: true = true

let big1 = 1234n
let big2: bigint = 5678n */
/* let names: symbol = Symbol('美美')
let height = Symbol('180')
const weight: unique symbol = Symbol('55') // typeof weight
let g: unique symbol = Symbol('55') // Error A variable whose type is a 'unique symbol' type must be 'const' */
/* let a: undefined = undefined
let b: null = null */
// 返回void的函数
/* function addNum() {
  let a = 1 + 1
  let b = a * a
}

function a() {
  throw TypeError('总是报错')
}

function b() {
  while (true) {
    console.log('我在无限循环')
  }
} */
/* let nums: [number] = [1]
let person: [string, number, string] = ['图图', 24, '1998'] */
// 
/* enum Fruits {
  Apple,
  Banana,
  Orange
}

console.log(Fruits.Apple) // Apple
console.log(Fruits['Orange']) // 2

enum Car {
  Audi = 1,
  Honda = 2,
  ToYoTa = 3
}

console.log(Car[1]) // Audi
console.log(Car.ToYoTa) // 3 */
/* enum Fruits {
  Apple = 0,
  Banana = 1,
  Orange = 2
}

enum Fruits {
  Watermelon = 3
}
console.log(Fruits) */
// ts-node在控制台输出的结果
// {
//   '0': 'Apple',
//   '1': 'Banana',
//   '2': 'Orange',
//   '3': 'Watermelon',
//   Apple: 0,
//   Banana: 1,
//   Orange: 2,
//   Watermelon: 3
// }
/* enum Fruits {
  Apple = 10,
  Banana = 10 + 1,
  Orange
}

console.log(Fruits) */
// {
//   '10': 'Apple',
//   '11': 'Banana',
//   '12': 'Orange',
//   Apple: 10,
//   Banana: 11,
//   Orange: 12
// }
/* let nums = [1, 2, 3]
let names: string[] = ['图图', '牛爷爷', '图妈妈']
let fruits: Array<string> = ['apple', 'banana', 'orange'] */
/* let person: { name: string, age: number } = {
  name: '图图',
  age: 24
}
person.height = 175 */
// Error Property 'height' does not exist on type '{ name: string; age: number; }'
// person: {
//   name: string;
//   age: number;
// }
/* let show: true = true
let disable: false = true */
// Error Type 'true' is not assignable to type 'false'.
/* let person: {
  name: string,
  age: number,
  height?: number,
}


person = {
  name: '小美',
  age: 18
}

console.log(person)
// { name: '小美', age: 18 }

person = {
  name: '图图',
  age: 18,
  height: 175
}

console.log(person) */
// { name: '图图', age: 18, height: 175 }
/* let person: {
  [key: string]: any
} = {
  name: '牛爷爷',
  age: 60,
}

person.height = 160
person.weight = 100
person.sex = '男' */
/* type Height = number
type Person = {
  name: string,
  height: Height
}

let person: Person = {
  name: '图爸爸',
  height: 180
} */
/* type Name = '图图'

let n = Math.random() < 0.5
if (n) {
  type Name = '小美' // 覆盖上面声明的Name
  let name: Name = '小美'
  console.log('name=', name)
} else {
  let name: Name = '图图'
  console.log('name=', name)
} */
/* type Bad = { name: string, isBad: boolean }
type Good = { name: string, isGood: boolean, clever: boolean }

type BadAndGood = Bad & Good

let person: BadAndGood = {
  name: '蟑螂恶霸',
  isBad: true,
  isGood: false,
  clever: false
} */
var height = 175;
height = '180';
height = 190;
//# sourceMappingURL=01.js.map