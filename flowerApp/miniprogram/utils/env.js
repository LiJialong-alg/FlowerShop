const {miniProgram} = wx.getAccountInfoSync()
const {envVersion}=miniProgram
let env={
  baseURL:'https://localhost:3000'
}
switch(envVersion){
  //开发版
  case'develop':
    env.baseURL='http://localhost:3000'
    break
  //体验版
  case'trial':
    env.baseURL='http://localhost:3000'
    break
  //正式版
  case'release':
    env.baseURL='http://localhost:3000'
    break
  default:
    env.baseURL='http://localhost:3000'
    break
}

export {env}