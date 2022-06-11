import { Request } from './get'
async function getList() {
  const res = await Request.Get.get('http://baidu.com')
  console.log(res)
}

async function saveForm() {
  const data = {
    userName: '小美',
    password: '123456'
  }
  const res = await Request.Post.post('http://baidu.com', data)
}

import get = Request.Get.get

getList()
saveForm()
