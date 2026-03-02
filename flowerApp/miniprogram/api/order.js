import http from "../utils/http";

export const reqOrderList = () => http.get('/api/order/list')

export const reqOrderInfo = (id) => http.get(`/api/order/detail/${id} `)

export const reqCreateOrder = ({goodsList,totalPrice,blessing,addressId}) => http.post('/api/order/create',{
  items: goodsList,
  totalPrice,
  addressId,
  blessing,
})