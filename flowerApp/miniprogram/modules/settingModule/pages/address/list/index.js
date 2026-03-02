import { reqAddressList, reqDeleteAddress } from "@/api/address"

// pages/address/list/index.js
Page({
  // 页面的初始数据
  data: {
    addressList: [],
  },
  async getAddList(){
    const res = await reqAddressList()
    if(res.code===200){
      this.setData({
        addressList:res.data
      })
    }
  },
  // 去编辑页面
  toEdit(e) {
    const address=e.currentTarget.dataset.addr
    const addressStr = encodeURIComponent(JSON.stringify(address));
    wx.navigateTo({
      url: `/modules/settingModule/pages/address/add/index?address=${addressStr}`
    })
  },
  async deleteAdd(e){
    // console.log(e.currentTarget.dataset.id)
    const res = await reqDeleteAddress(e.currentTarget.dataset.id)
    if(res.code===200){
      wx.toast({title:'删除地址成功'})
      this.getAddList()
    }
  },
  onShow(){
    this.getAddList()
  },
  onLoad(opts){
    this.flag = opts.flag 
  },
  changeAddr(e){
    if(this.flag!=='1') return
    const item = e.currentTarget.dataset.item
    const app = getApp()
    app.globalData.address = item
    wx.navigateBack()
  }
  
})
