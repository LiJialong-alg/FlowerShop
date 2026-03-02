// pages/cart/component/cart.js

import { reqAddCart, reqCartList, reqDeleteCartGood, reqDeselectAll, reqSelectAll, reqUpdateChecked } from "@/api/cart";
import { userStore } from "@/stores/userStore";
import { ComponentWithStore } from "mobx-miniprogram-bindings";

ComponentWithStore({
  // 组件的属性列表
  storeBindings: {
    store:userStore,
    fields:['token']

  },

  // 组件的初始数据
  data: {
    allCheck:true,
    cartList: [],
    emptyDes: '',
    totalPrice:0
  },

  // 组件的方法列表
  methods: {
    async changeCount(e){
      const {id, index} = e.target.dataset
      const newcount = e.detail
      const delt = newcount - this.data.cartList[index].quantity
      this.setData({
        [`cartList[${index}].quantity`]: newcount
      });
      const res = await reqAddCart(id,delt)
      this.show()
      // if(res.code===200){
      //   this.setData({
      //     [`cartList[${index}].quantity`] : newcount
      //   })
      // }
    },
    async changeChecked(e){
      const {id, index} = e.target.dataset
      const newChecked = e.detail
      const res = await reqUpdateChecked(id,newChecked)
     
      this.show()
      // if(res.code===200){
      //   this.data.cartList[index].checked = newChecked
      //   const allCheck = this.data.cartList.every(item => item.checked)
      //   this.setData({
      //     [`cartList[${index}].checked`] : newChecked,
      //     allCheck
      //   })
      // }
    },
    async checkAll(){
      if(this.data.allCheck){
        await reqDeselectAll()
        this.show()
      }else{
        await reqSelectAll()
        this.show()
      }
      
    },
    async deleteGood(e){
      const {id} = e.currentTarget.dataset
      const res = await reqDeleteCartGood(id)
      if(res.code===200){
        this.show()
      }
    },
    async show(){
      const {token} = this.data
      if(!token){
        this.setData({
          emptyDes: '您尚未登录，点击登录获取更多权益',
          cartList:[]
        })
        return
      }
      const res=await reqCartList()
      if(res.code===200){
        
        const allCheck = res.data.list.every(item => item.checked)
        let totalPrice =0 
        res.data.list.forEach(element => {
          if(element.checked){
            totalPrice += (element.price * element.quantity)
          }
        });
        this.setData({
          cartList:res.data.list,
          emptyDes:res.data.list.length === 0 && '还没有添加商品，快去添加吧～' ,
          allCheck,
          totalPrice:totalPrice.toFixed(2)
        })
      }
    },
    onShow(){
      this.show()
    },
    toOrder(){
      if(this.data.totalPrice == 0 ){
        wx.toast({
          title:'请选择要购买的商品'
        })
        return 
      }
      let paramsArr = []
      this.data.cartList.forEach(e=>{
        if(e.checked){
          paramsArr.push(e)
        }
      })
      const app =getApp()
      app.globalData.checkedCart = paramsArr
      wx.navigateTo({
        url: `/modules/orderPayModule/pages/order/detail/detail?totalPrice=${this.data.totalPrice}`,
      })
    }
  }
})
