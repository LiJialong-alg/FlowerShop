import http from "../utils/http";

export const reqLogin = (username,password)=>{
  return http.post('/api/user/login', {
    username,
    password
  });
}

export const reqRegister = (username,password)=>{
  return http.post('/api/user/register', {
    username,
    password
  });
}

export const reqUserInfo = (token)=>{
  return http.get('/api/user/info',token)
}