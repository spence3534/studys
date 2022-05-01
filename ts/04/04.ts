/* type ExistingUser = {
  id: number,
  name: string
}

type NewUser = {
  name: string
}

function deleteUser(user: { id?: number, name: string }) {
  delete user.id
}

let existingUser: ExistingUser = {
  id: 123456,
  name: '图图'
}

deleteUser(existingUser)

console.log(existingUser.id) */

/* type LegacyUser = {
  id?: number | string,
  name: string
}

let legacyUser: LegacyUser = {
  id: '793331',
  name: '小美'
}

deleteUser(legacyUser)

function deleteUser(user: { id?: number, name: string }) {
  delete user.id
} */


/* type Person = {
  name: string,
  age: number
}

let info: Person = {
  name: '图图',
  age: 18
}

let otherInfo = {
  name: '小美',
  age: 17,
  height: 170
}

function getPerson(params: { name: string, age?: number | string}) {
  console.log(params)
}


getPerson(info)

type isBoolean = boolean

let bool: string | number = 10

let bool1: boolean | number = 0

bool1 = bool

console.log(bool1)

type GirlInfo = {
  name: string,
  height: number,
  age: number
}

type ManInfo = {
  name: string,
  height: number | string,
  age: number | null
}

let girl: GirlInfo = {
  name: '小美',
  height: 180,
  age: 18
}

let manInfo = {
  name: '图图',
  height: 185,
  age: 18
} as const


const options = {
  baseUrl: ''
} */


/* type Options = {
  url: string,
  env?: 'prod' | 'dev',
  time?: number
}

function get(options: Options) {
  console.log(options);
}


get({
  url: 'http://www.baidu.com',
  env: 'dev',
  time: 1000
})

get({
  url: 'http://www.taobao.com',
  envv: 'prod' // Argument of type '{ url: string; envv: string; }' is not assignable to parameter of type 'Options'.
})

get({
  url: 'http://www.jd.com',
  envv: 'dev'
} as Options)

let otherOptions = {
  url: 'http://weibo.com',
  envv: 'dev'
}

get(otherOptions)


let options: Options = {
  url: 'http://weibo.com',
  envv: 'dev' // Type '{ url: string; envv: string; }' is not assignable to type 'Options'
}

get(options) */

/* function get<O extends object, K extends keyof O>(o: O, k: K): O[K] {
  return o[k]
}

type Active = {
  lastEvent: Date,
  events: {
    id: string,
    timestamp: Date,
    type: 'Read' | 'Write'
  }[]
}

let active: Active = {
  lastEvent: new Date,
  events: [
    {
      id: '1',
      timestamp: new Date,
      type: 'Read'
    }
  ]
}

let lastEvent = get(active, 'events')
console.log(lastEvent) */

/* type Active = {
  lastEvent: Date,
  events: {
    id: string,
    timestamp: Date,
    type: 'Read' | 'Write'
  }[]
}

let active: Active = {
  lastEvent: new Date,
  events: [
    {
      id: '1',
      timestamp: new Date,
      type: 'Read'
    }
  ]
}

type Get = {
  <
    O extends object,
    K1 extends keyof O
    >(o: O, k1: K1): O[K1],
  <
    O extends object,
    K1 extends keyof O,
    K2 extends keyof O[K1]
    >(o: O, k1: K1, k2: K2): O[K1][K2],
  <
    O extends object,
    K1 extends keyof O,
    K2 extends keyof O[K1],
    K3 extends keyof O[K1][K2]
    >(o: O, k1: K1, k2: K2, k3: K3): O[K1][K2][K3]
}

let get: Get = (object: any, ...keys: string[]) => {
  let result = object
  keys.forEach(k => result = result[k]);
  return result
}

const data = get(active, 'events', 1)
console.log(data) */

/* interface Person {
  name: string,
  age: number,
  height: number
}

type Values = '牛爷爷' | 60 | 160

let person: Record<keyof Person, Values> = {
  name: '牛爷爷',
  age: 60,
  height: 160
} */
/* type Account = {
  id: number,
  isEmployee: boolean,
  notes: string[]
}


let options1: Partial<Account> = {
  id: 1,
  isEmployee: true,
}

let options2: Required<Account> = {
  id: 1,
  isEmployee: false,
}
// Property 'notes' is missing in type '{ id: number; isEmployee: false; }' but required in type 'Required<Account>'

let options3 = {
  id: 1,
  isEmployee: true,
  notes: []
}

// 只读
function setValues(params: Readonly<Account>) {
  params.id = 1
  // Cannot assign to 'id' because it is a read-only property.
}
setValues(options3)

//
type OtherAccount = Pick<Account, 'id'>
let options4: OtherAccount = {
  id: 1,
  notes: []
}
 */

/* interface Account {
  id: number,
  isCheck: boolean,
  notes: string[]
}

type Notes = Pick<Account, 'notes'>

let notes: Notes = {
  notes: [],
} */
// Type '{ notes: never[]; id: number; }' is not assignable to type 'Notes'.
// Object literal may only specify known properties, and 'id' does not exist in type 'Notes'

/* type isNumber <T> = T extends number ? true : false

type A = isNumber<string>
type B = isNumber<number>

let string: A = false */


// type Without<T, U> = T extends U ? never : T

// type A = Without<boolean | number | string, boolean>

// const strOrnum: A = '图图' || 1111

/* type ElementType<T> = T extends Array<infer U> ? U : T

type strArr = ElementType<number[]>

const strs: strArr = 1 */

/* type ElementType<T> = T extends Array<infer U> ? U : T

type Num = ElementType<number[]>

const num: Num = 1 */

/* type StrOrNum = number | string
type Str = string

type Num = Exclude<StrOrNum, Str>

const num : Num = 1 */

/* type StrOrBool = string | boolean
type NumOrBool = number | boolean

type Value = Extract<StrOrBool, NumOrBool> // boolean

let val: Value = false */

/* type ObjectOrNull = Object | null

type Value = NonNullable<ObjectOrNull> // Object

let obj: Value = {
  a: 1
} */

/* type Person = { name: string, age: number }
type NewObj = { new(): Person }

type ObjectType = InstanceType<NewObj> // { name: string; age: number; }
const person: ObjectType = {
  name: 'xxx',
  age: 24
} */

/* function formatDate(date: any) {
  if (typeof date === 'string') {
    return new Date(date)
  }
  return new Date(date).getFullYear()
}


function getDate(): string | Date {
  return '2022-01-01 11:35:00'
}

let date = getDate()

formatDate(date as string)
formatDate(<Date>date) */
