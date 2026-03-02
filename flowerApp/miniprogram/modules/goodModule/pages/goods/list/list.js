// pages/goods/list/index.js

import { reqGoodsList1, reqGoodsList2 } from "../../../../../api/goods"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], // 商品列表数据
    total:0,
    isLoading:false,
    isFinish: false ,// 判断数据是否加载完毕
    requestData:{
      category1Id:'',
      page:1,
      category2Id:''
    }
  },
  async getGoodsList(){
    this.setData({
      isLoading:true
    })
    if(this.data.requestData.category1Id){
      const {category1Id,page}=this.data.requestData
      const res = await reqGoodsList1(category1Id,page)
      this.setData({
        goodsList:[...this.data.goodsList,...res.data.list],
        total:res.data.total
      })
    }else if(this.data.requestData.category2Id){
      const {category2Id,page}=this.data.requestData
      const res = await reqGoodsList2(category2Id,page)
      this.setData({
        goodsList:[...this.data.goodsList,...res.data.list],
        total:res.data.total
      })

    }else{
      console.error('没带一二级分类的参数')
    }
    this.setData({
      isLoading:false
    })
  },

  onReachBottom(){
    if(this.data.isLoading){
      return
    }
    const {page} = this.data.requestData
    if(this.data.goodsList.length===this.data.total){
      this.setData({
        isFinish:true
      })
      return
    }
    this.setData({
      requestData:{
        ...this.data.requestData,
        page:page+1
      }
    })
    this.getGoodsList() 
  },
  async onPullDownRefresh(){
    if (this.data.isLoading) return
    this.setData({
      goodsList:[],
      total:0,
      isFinish:false,
      requestData:{
        page:1,
        ...this.data.requestData
      }
    })
    await this.getGoodsList()
    wx.stopPullDownRefresh()
  },
  onLoad(options){
    Object.assign(this.data.requestData,options)
    this.getGoodsList()
  }
})
