import http from "../utils/http";
export const reqIndexData = ()=>{
  return Promise.all([
    http.get('/api/home/banners'),
    http.get('/api/category/list'),
    http.get('/api/home/advertise'),
    http.get('/api/home/guess'),
    http.get('/api/home/recommend')
  ])
}

