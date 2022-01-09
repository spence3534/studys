type ClassConstructor<T> = new (...args: any[]) => T

function withEZDebug<C extends ClassConstructor<{ getDebugValue(): object }>>(Class: C) {
  return class extends Class {

    debug() {
      console.log(Class.constructor)
      let Name = Class.constructor
      let value = this.getDebugValue()
      return Name + `( ${JSON.stringify(value)} )`
    }
  }
}


class HardToDebugUser {
  constructor(
    private id: number,
    private firstName: string,
    private lastName: string
  ) { }

  getDebugValue() {
    return {
      id: this.id,
      name: `${this.firstName}  ${this.lastName}`
    }
  }
}

let User = withEZDebug(HardToDebugUser)
let user = new User(3, 'emma', 'gluzman')
console.log(user.debug())