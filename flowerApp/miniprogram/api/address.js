import http from "../utils/http";

export const reqAddAddress = 
({name,phone,province,city,district,address,isDefault}) => 
http.post('/api/address/add', {
  name,
  phone,
  province,
  city,
  district,
  address,
  isDefault
})

export const reqAddressList = () => http.get('/api/address/list')

export const reqUpdateAddress = 
(id,{name,phone,province,city,district,address,isDefault}) => 
http.put(`/api/address/update/${id}`, {
  name,
  phone,
  province,
  city,
  district,
  address,
  isDefault
})

export const reqDeleteAddress = (id) => http.delete(`/api/address/delete/${id}`)