//参数可传可不传，只能传对象
//消息提示框，dialog
export const toast=({title = '数据加载中...',icon='none',duration=1000,mask=true}={})=>{
  wx.showToast({
    title,
    icon,
    duration,
    mask
  })
}

//消息确认对话框 
export const modal=(options={})=>{
  //要返回Promise对象
  return new Promise(resolve=>{
    const defaultOpts={
      title:'提示',
      content:'您确认执行该操作吗？',
      confirmColor:'#f35114' 
    }
    const opts=Object.assign({},defaultOpts,options)
    wx.showModal({
      ...opts,
      complete({confirm,cancel}){
        confirm&&resolve(true)
        cancel&&resolve(false)
      }
    })
  })
}
wx.toast=toast
wx.modal=modal
