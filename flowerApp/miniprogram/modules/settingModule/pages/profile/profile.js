// pages/profile/profile.js

import { createStoreBindings } from "mobx-miniprogram-bindings"
import { userStore } from "../../../../stores/userStore"

Page({
  // 页面的初始数据
  data: {
    isShowPopup: false // 控制更新用户昵称的弹框显示与否
  },
  onLoad() {
    // 绑定 store

    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: ['token','userInfo'],       
      actions: ['setToken','setUserInfo']    
    })
  },
  onUnload() {
    // 销毁绑定（防内存泄漏）
    this.storeBindings.destroyStoreBindings()
  },
  // 显示修改昵称弹框
  onUpdateNickName() {
    this.setData({
      isShowPopup: true,
      'userInfo.username':this.data.userInfo.username
    })
  },
  chooseAvatar(e){
    //头像临时路径
    const {avatarUrl}=e.detail
    // this.setData({
    //   'userInfo.avatar':avatarUrl
    // })
  },
  // 弹框取消按钮
  cancelForm() {
    this.setData({
      isShowPopup: false
    })
  },

  getName(e){
    const {nickname} = e.detail.value
    this.setData({
      'userInfo.username':nickname,
      isShowPopup: false
    })
    
  }
})
