import http from "../utils/http";

export const reqCategoryData = () =>{
  return http.get('/api/category/list')
}