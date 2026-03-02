import http from "../utils/http";
export const reqGoodsList1 = (c1,page=1)=>{
  return http.get(`/api/goods/list?categoryId=${c1}&page=${page}`)
}

export const reqGoodsList2 = (c2,page=1)=>{
  return http.get(`/api/goods/list?subCategoryId=${c2}&page=${page}`)
}

export const reqGoodInfo = (id) => {
  return http.get(`/api/goods/detail/${id}`)
}