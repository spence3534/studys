
interface Person {
  name: string
}
// Subsequent property declarations must have the same type.  Property 'name' must be of type 'string', but here has type 'number'

class Cat implements Person {
  name: string = '图图'
}