import { reqOrderList } from "@/api/order"

// pages/order/list/index.js
Page({
  // 页面的初始数据
  data: {
    orderList: []
  },
  onLoad(){
    this.getOrderList()
  },
  async getOrderList(){
    const res = await reqOrderList()
    this.setData({
      orderList:res.data.reverse()
    })
  }
})
