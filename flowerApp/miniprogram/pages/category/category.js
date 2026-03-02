import { reqCategoryData } from "../../api/category"

Page({
  data:{
    categoryList:[],
    activeIndex:0
  },
  updateActive(e){
    this.setData({
      activeIndex:e.currentTarget.dataset.index
    })
    
  },
  async getCategoryData(){
    const res=await reqCategoryData()
    if(res.code===200){
      this.setData({
        categoryList:res.data
      })
    }
  },
  onLoad(){
    this.getCategoryData()
  }
})
