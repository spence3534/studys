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


