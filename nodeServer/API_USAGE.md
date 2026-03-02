# API 使用指南

## 前端配置

前端需要修改配置文件：`miniprogram/utils/http.js`

### 本地开发配置
```javascript
baseURL: 'http://localhost:3000'
```

### 真实设备测试配置
```javascript
// 替换 192.168.1.100 为你的电脑 IP
baseURL: 'http://192.168.1.100:3000'
```

---

## API 接口列表

### 用户模块

#### 1. 用户登录
- **URL**: `POST /api/user/login`
- **是否需要token**: 否
- **请求示例**:
```javascript
http.post('/api/user/login', {
  username: 'user1',
  password: '123456'
})
```

#### 2. 用户注册
- **URL**: `POST /api/user/register`
- **是否需要token**: 否
- **请求示例**:
```javascript
http.post('/api/user/register', {
  username: 'newuser',
  password: '123456',
  phone: '13800138000'
})
```

#### 3. 微信登录
- **URL**: `POST /api/user/wechat-login`
- **是否需要token**: 否
- **请求示例**:
```javascript
http.post('/api/user/wechat-login', {
  code: 'wx.login() 返回的 code'
})
```

#### 4. 获取用户信息
- **URL**: `GET /api/user/info`
- **是否需要token**: 是
- **请求示例**:
```javascript
http.get('/api/user/info')
```

---

### 分类模块

#### 5. 获取分类列表
- **URL**: `GET /api/category/list`
- **是否需要token**: 否
- **请求示例**:
```javascript
http.get('/api/category/list')
```

---

### 商品模块

#### 6. 获取商品列表
- **URL**: `GET /api/goods/list?categoryId=1&page=1&pageSize=10`
- **是否需要token**: 否
- **请求示例**:
```javascript
http.get('/api/goods/list', { 
  categoryId: 1, 
  page: 1, 
  pageSize: 10 
})
```

#### 7. 获取商品详情
- **URL**: `GET /api/goods/detail/:id`
- **是否需要token**: 否
- **请求示例**:
```javascript
http.get('/api/goods/detail/1')
```

---

### 购物车模块

#### 8. 获取购物车列表
- **URL**: `GET /api/cart/list`
- **是否需要token**: 是
- **请求示例**:
```javascript
http.get('/api/cart/list')
```
- **返回数据**:
```javascript
{
  code: 200,
  message: '获取成功',
  data: {
    list: [
      {
        id: 1,
        goodsId: 1,
        name: '红玫瑰花束',
        price: 99,
        quantity: 2,
        image: 'http://...',
        checked: true
      }
    ],
    totalPrice: 198,      // 已选中商品的总价
    count: 1,             // 购物车总项数
    checkedCount: 1       // 已选中商品数
  }
}
```

#### 9. 添加到购物车
- **URL**: `POST /api/cart/add`
- **是否需要token**: 是
- **请求示例**:
```javascript
http.post('/api/cart/add', {
  goodsId: 1,
  quantity: 2
})
```
- **说明**: 如果商品已存在，则增加数量；否则添加新商品

#### 10. 删除购物车项
- **URL**: `DELETE /api/cart/remove/:goodsId`
- **是否需要token**: 是
- **请求示例**:
```javascript
http.delete('/api/cart/remove/1')
```

#### 11. 更新商品选中状态
- **URL**: `POST /api/cart/update-checked`
- **是否需要token**: 是
- **请求示例**:
```javascript
http.post('/api/cart/update-checked', {
  goodsId: 1,
  checked: true    // true 表示选中，false 表示未选中
})
```

#### 12. 全选购物车
- **URL**: `POST /api/cart/select-all`
- **是否需要token**: 是
- **请求示例**:
```javascript
http.post('/api/cart/select-all', {})
```

#### 13. 全不选购物车
- **URL**: `POST /api/cart/deselect-all`
- **是否需要token**: 是
- **请求示例**:
```javascript
http.post('/api/cart/deselect-all', {})
```

---

### 订单模块

#### 14. 获取订单列表
- **URL**: `GET /api/order/list`
- **是否需要token**: 是
- **请求示例**:
```javascript
http.get('/api/order/list')
```

#### 15. 获取订单详情
- **URL**: `GET /api/order/detail/:orderId`
- **是否需要token**: 是
- **请求示例**:
```javascript
http.get('/api/order/detail/1001')
```

#### 16. 创建订单
- **URL**: `POST /api/order/create`
- **是否需要token**: 是
- **请求示例**:
```javascript
http.post('/api/order/create', {
  items: [{
    goodsId: 1,
    name: '红玫瑰花束',
    price: 99,
    quantity: 1
  }],
  totalPrice: 99,
  addressId: 1,
  blessing: '祝你快乐'
})
```

---

### 地址模块

#### 17. 获取地址列表
- **URL**: `GET /api/address/list`
- **是否需要token**: 是
- **请求示例**:
```javascript
http.get('/api/address/list')
```

#### 18. 添加地址
- **URL**: `POST /api/address/add`
- **是否需要token**: 是
- **请求示例**:
```javascript
http.post('/api/address/add', {
  name: '李四',
  phone: '13800138001',
  province: '上海市',
  city: '上海市',
  district: '浦东新区',
  address: '某某路456号',
  isDefault: false
})
```

#### 19. 更新地址
- **URL**: `PUT /api/address/update/:addressId`
- **是否需要token**: 是
- **请求示例**:
```javascript
http.put('/api/address/update/1', {
  name: '李四',
  phone: '13800138001',
  province: '上海市',
  city: '上海市',
  district: '浦东新区',
  address: '某某路456号',
  isDefault: true
})
```

#### 20. 删除地址
- **URL**: `DELETE /api/address/delete/:addressId`
- **是否需要token**: 是
- **请求示例**:
```javascript
http.delete('/api/address/delete/1')
```

---

### 首页模块

#### 21. 获取首页轮播图
- **URL**: `GET /api/home/banners`
- **是否需要token**: 否
- **请求示例**:
```javascript
http.get('/api/home/banners')
```

#### 22. 获取首页推荐商品
- **URL**: `GET /api/home/recommend`
- **是否需要token**: 否
- **请求示例**:
```javascript
http.get('/api/home/recommend')
```

#### 23. 获取首页广告商品
- **URL**: `GET /api/home/advertise`
- **是否需要token**: 否
- **请求示例**:
```javascript
http.get('/api/home/advertise')
```

#### 24. 获取猜你喜欢
- **URL**: `GET /api/home/guess`
- **是否需要token**: 否
- **请求示例**:
```javascript
http.get('/api/home/guess')
```

---

## 常见问题

### 如何获取 token？
登录或注册成功后，后端会返回 token。将其保存到本地存储，每次请求时在请求头中传递。

### 如何在请求头中传递 token？
在 `utils/http.js` 中配置拦截器，添加：
```javascript
config.headers.token = wx.getStorageSync('token')
```

### 购物车中的 checked 字段是什么？
- `checked: true` - 商品已选中，结算时会计入总价
- `checked: false` - 商品未选中，结算时不计入总价
