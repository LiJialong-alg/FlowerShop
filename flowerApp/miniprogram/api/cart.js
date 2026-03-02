import http from "../utils/http";

export const reqAddCart = (goodsId,quantity,blessing) =>{
  return http.post('/api/cart/add', {
      goodsId:Number(goodsId),
      quantity:Number(quantity),
      blessing
    })
}

export const reqCartList = () => {
  return http.get('/api/cart/list')
}

export const reqUpdateChecked = (goodsId,checked)=>{
  return http.post('/api/cart/update-checked', {
    goodsId:Number(goodsId),
    checked
  })
}
export const reqSelectAll = () => http.post('/api/cart/select-all', {})
export const reqDeselectAll = () => http.post('/api/cart/deselect-all', {})

export const reqDeleteCartGood = (id)=> 
  http.delete(`/api/cart/remove/${id}`)