/**
 * Typescript中的数据类型有：
 * undefined类型
 * number：数值类型
 * Boolean：布尔类型
 * string：字符串类型
 * enum：枚举类型
 * any：任意类型 一个牛X的类型
 * void：空类型
 * Array：数组类型
 * Tuple：元祖类型
 * Null：空类型
 */
// number 数值类型 支持小数点
var age: number = 18
var stature: number = 178.5
console.log(age) // 18
console.log(stature) // 178.5

console.log(`-------------------------`)

// string 字符串类型
var fullname: string = 'xiaohong'
console.log(fullname) // xiaohong

console.log(`-------------------------`)

// boolean 布尔类型 在typescript中不像在JavaScript里的0和null都可以为布尔类型，在typescript中是没有的。只有true和false
var b: boolean = true
var c: boolean = false
console.log(b) // true
console.log(c) // false

console.log(`-------------------------`)

/*
  Array 数组类型 TypeScript有两种方式可以定义数组。第一种，可以在元素类型后面接上[]，
  表示由此类型元素组成一个数组。
*/
var arr: number[] = [1, 2, 3]
console.log(arr) // [ 1, 2, 3 ]

// 第二种定义数组
var arr1: Array<number> = [1, 2, 3]
console.log(arr1) // [ 1, 2, 3 ]

console.log(`-------------------------`)

/*
  Tuple 元组类型
  元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。比如，你可以定义
  一对值分别为string和number类型的元组。
*/
var x: [string, number]
x = ['hello', 10]
console.log(x) // [ 'hello', 10 ]

/*
  还可以改变元素，但是在初始化定义元组的类型是什么类型，只能是什么类型的元素，比如上面
  定义的是string和number。只能是string和number类型的元素，否则会发生异常的报错
*/
x[0] = 'world'
console.log(x)

/*
  还有要提醒的一点是，元组类型里面是要按照定义的类型的顺序去添加元素的。像下面这样去添加元素
  是一个错误的。
  x = [10, "hello"]
*/
console.log(`-------------------------`)

/*
  enum 枚举类型  类似对象 一个个列举出来 比如：世界上人的类型：男人、女人、中性
  enum REN{nan, nv, yao}
  console.log(REN.yao); // 2 下标索引
  再来个例子
*/
enum REN {
  nan = '男人',
  nv = '女人',
  yao = '妖',
}
console.log(REN.yao) // 妖

// 枚举还可以这样用
var man: REN = REN.nan
console.log(man) // 男人

console.log(`-------------------------`)

// any 任意类型 可以不断变化的类型
var t: any = 10 // 首先是数值类型
t = 'xiaoming' // 然后变成字符串类型
t = true // 最后变成布尔类型
console.log(t) // true

console.log(`-------------------------`)

// void 空类型 当一个函数没有返回值时，你通常会见到其返回值类型是void：
function warnUser(): void {
  console.log('这只是一条消息而已')
}
warnUser()
// 声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null
var unusable: void = undefined

