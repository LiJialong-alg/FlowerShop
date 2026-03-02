//observable 创建被监测的对象，对象中的属性被转换成响应式数据
//action用于显示定义action方法
import { action, observable } from "mobx-miniprogram";
import { getStorage } from "../utils/storage";

export const userStore = observable({
  token:getStorage('token')||'',
  userInfo:getStorage('userInfo')||'',
  setToken:action(function (token) {
    this.token=token
  }),
  setUserInfo:action(function (userInfo) {
    this.userInfo=userInfo
  })
})