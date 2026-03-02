import { reqIndexData } from "../../api/index"

Page({
  data:{
    bannerList:[],
    categoryList:[],
    activeList:[],
    hotList:[],
    guessList:[],
    loading:true
  },
  async getIndexData(){
    //按接口调用顺序返回
   const res=await reqIndexData()
   this.setData({
    bannerList:res[0].data,
    categoryList:res[1].data,
    activeList:res[2].data,
    guessList:res[3].data,
    hotList:res[4].data,
    loading:false
   })
  },
  onLoad(){
    this.getIndexData()
  }
})
