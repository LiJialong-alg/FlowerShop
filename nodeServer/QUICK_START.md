# 🌸 花卉小程序 - 后端接口总结

## 项目启动

```bash
cd nodeserver
npm install
npm start
```

服务运行在 `http://localhost:3000`

---

## 核心接口概览

### 用户认证（3个接口）
| 接口                 | 方法 | 认证 | 说明         |
| -------------------- | ---- | ---- | ------------ |
| `/api/user/login`    | POST | ❌    | 用户登录     |
| `/api/user/register` | POST | ❌    | 用户注册     |
| `/api/user/info`     | GET  | ✅    | 获取用户信息 |

**测试账号**: `user1` / `123456` 或 `user2` / `123456`

---

### 商品相关（3个接口）
| 接口                    | 方法 | 认证 | 说明                           |
| ----------------------- | ---- | ---- | ------------------------------ |
| `/api/category/list`    | GET  | ❌    | 获取分类列表                   |
| `/api/goods/list`       | GET  | ❌    | 获取商品列表（支持分页、筛选） |
| `/api/goods/detail/:id` | GET  | ❌    | 获取商品详情                   |

**分类**: 玫瑰、向日葵、郁金香、康乃馨、百合  
**商品数量**: 7件（价格¥69-¥129）

---

### 购物车（3个接口）
| 接口                        | 方法   | 认证 | 说明           |
| --------------------------- | ------ | ---- | -------------- |
| `/api/cart/list`            | GET    | ✅    | 获取购物车列表 |
| `/api/cart/add`             | POST   | ✅    | 添加到购物车   |
| `/api/cart/remove/:goodsId` | DELETE | ✅    | 删除购物车项   |

---

### 订单（3个接口）
| 接口                         | 方法 | 认证 | 说明         |
| ---------------------------- | ---- | ---- | ------------ |
| `/api/order/list`            | GET  | ✅    | 获取订单列表 |
| `/api/order/detail/:orderId` | GET  | ✅    | 获取订单详情 |
| `/api/order/create`          | POST | ✅    | 创建订单     |

**订单状态**: pending（待处理）、shipped（已发货）、delivered（已交付）

---

### 地址管理（4个接口）
| 接口                             | 方法   | 认证 | 说明         |
| -------------------------------- | ------ | ---- | ------------ |
| `/api/address/list`              | GET    | ✅    | 获取地址列表 |
| `/api/address/add`               | POST   | ✅    | 添加地址     |
| `/api/address/update/:addressId` | PUT    | ✅    | 更新地址     |
| `/api/address/delete/:addressId` | DELETE | ✅    | 删除地址     |

---

### 首页数据（2个接口）
| 接口                  | 方法 | 认证 | 说明           |
| --------------------- | ---- | ---- | -------------- |
| `/api/home/banners`   | GET  | ❌    | 获取首页轮播图 |
| `/api/home/recommend` | GET  | ❌    | 获取推荐商品   |

---

## 数据示例

### 商品信息
```json
{
  "id": 1,
  "name": "红玫瑰花束",
  "categoryId": 1,
  "price": 99,
  "image": "https://via.placeholder.com/200x200?text=Red+Rose",
  "description": "精选11朵红玫瑰，代表爱你一生一世",
  "sales": 1250,
  "rating": 4.8
}
```

### 分类信息
```json
[
  {"id": 1, "name": "玫瑰花", "icon": "rose"},
  {"id": 2, "name": "向日葵", "icon": "sunflower"},
  {"id": 3, "name": "郁金香", "icon": "tulip"},
  {"id": 4, "name": "康乃馨", "icon": "carnation"},
  {"id": 5, "name": "百合", "icon": "lily"}
]
```

### 订单信息
```json
{
  "id": 1001,
  "userId": 1,
  "items": [
    {
      "goodsId": 1,
      "name": "红玫瑰花束",
      "price": 99,
      "quantity": 1,
      "blessing": "祝你生日快乐"
    }
  ],
  "totalPrice": 99,
  "status": "delivered",
  "createdTime": "2024-01-20 14:30:00",
  "deliveryTime": "2024-01-22 10:00:00"
}
```

### 地址信息
```json
{
  "id": 1,
  "userId": 1,
  "name": "张三",
  "phone": "13800138000",
  "province": "北京市",
  "city": "北京市",
  "district": "朝阳区",
  "address": "某某街道123号",
  "isDefault": true
}
```

---

## 请求/响应格式

### 成功响应（HTTP 200）
```json
{
  "code": 200,
  "message": "成功",
  "data": {}
}
```

### 错误响应（HTTP 4xx/5xx）
```json
{
  "code": 401,
  "message": "缺少认证令牌"
}
```

---

## 认证说明

需要认证的接口需要在请求头中传递：
```
headers: {
  "token": "eyJhbGc..."
}
```

登录/注册后会获得 token，有效期 7 天。

---

## 快速测试

使用 curl 测试登录：
```bash
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"123456"}'
```

获取商品列表：
```bash
curl http://localhost:3000/api/goods/list
```

获取商品详情：
```bash
curl http://localhost:3000/api/goods/detail/1
```

---

## 文件说明

- **index.js** - 主服务文件，包含所有接口实现
- **package.json** - 项目依赖配置
- **README.md** - 完整的接口文档
- **API_USAGE.md** - 前端调用示例

---

## 注意事项

✅ 所有数据都是模拟数据，存储在内存中  
✅ 服务重启后数据会重置  
✅ 支持 CORS 跨域请求  
✅ 所有请求/响应格式都是 JSON  
✅ Token 采用 JWT 认证，有效期 7 天  

---

希望这个后端服务对你的小程序开发有帮助！🎉
