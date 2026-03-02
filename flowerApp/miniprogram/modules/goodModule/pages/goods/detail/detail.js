import { reqAddCart, reqCartList } from "@/api/cart"
import { reqGoodInfo } from "@/api/goods"
import { userStore } from "@/stores/userStore"
import { createStoreBindings } from "mobx-miniprogram-bindings"

// pages/goods/detail/index.js
Page({
  // 页面的初始数据
  data: {
    goodsInfo: {}, // 商品详情
    show: false, // 控制加入购物车和立即购买弹框的显示
    count: 1, // 商品购买数量，默认是 1
    blessing: '' ,// 祝福语
    isBuyNow:false,
    allCount:''
  },

  previewImage(){
    wx.previewImage({
      urls:this.data.goodsInfo.details.images
    })
  },
  // 加入购物车
  handleAddcart() {
    this.setData({
      show: true,
      isBuyNow:false
    })


  },

  // 立即购买
  handeGotoBuy() {
    this.setData({
      show: true,
      isBuyNow:true
    })
  },
  async confirm(){
    const {token,count,blessing,isBuyNow} = this.data
    if(!token){
      wx.navigateTo({
        url:'/pages/login/login'
      })
      return 
    }
    if(isBuyNow){
      const app = getApp()
      app.globalData.checkedCart = [this.data.goodsInfo]
      wx.navigateTo({
        url:`/modules/orderPayModule/pages/order/detail/detail?totalPrice=${this.data.goodsInfo.price}&&blessing=${blessing}`
      })
    }else{
      const res=await reqAddCart(this.id,count,blessing)
      if(res.code===200){
        wx.toast({
          title:'加入购物车成功'
        })
        this.setData({
          show:false
        })
        this.getCartCount()
      }
      else{
        wx.toast({
          title:'请重试'
        })
      }
    }
  },
  // 点击关闭弹框时触发的回调
  onClose() {
    this.setData({ show: false })
  },

  // 监听是否更改了购买数量
  onChangeGoodsCount(event) {
    // console.log(event.detail)
    this.setData({
      count:Number(event.detail)
    })

  },
  async getGoodInfo(){
    const {data:goodsInfo}=await reqGoodInfo(this.id)
    this.setData({
      goodsInfo:goodsInfo
    })
  },
  async getCartCount(){
    if(!userStore.token){
      // wx.navigateTo({
      //   url:'/pages/login/login'
      // })
      return 
    }
    const res=await reqCartList()
    if(res.data.list.length){
      let allCount = 0
      res.data.list.forEach(element => {
        allCount+=element.quantity
      });
      this.setData({
        allCount:allCount>99? '99+' : allCount+''
      })
    }
  },
  onLoad(opts){
    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: ['token','userInfo'],       
      actions: ['setToken','setUserInfo'],
  
    })
    this.id=opts.goodsId
    this.getGoodInfo()
    this.getCartCount()
  }
})
