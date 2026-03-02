# 花卉小程序后端服务

这是一个简单的 Node.js + Express 后端服务，为花卉电商小程序提供 API 接口支持。

## 快速开始

### 安装依赖
```bash
cd nodeserver
npm install
```

### 启动服务
```bash
npm start
```

服务将在 `http://localhost:3000` 启动。

### 开发模式（自动重启）
```bash
npm run dev
```

需要先安装 nodemon：
```bash
npm install -D nodemon
```

## API 接口文档

### 基础信息
- **基础 URL**: `http://localhost:3000`
- **数据格式**: JSON
- **认证方式**: JWT token (在请求头中传递 `token` 字段)

### 响应格式
所有接口都遵循统一的响应格式：
```json
{
  "code": 200,
  "message": "操作描述",
  "data": {} // 具体数据
}
```

---

## 用户模块

### 1. 用户登录
**请求方式**: POST  
**路由**: `/api/user/login`  
**请求参数**:
```json
{
  "username": "user1",
  "password": "123456"
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "username": "user1",
      "phone": "13800138000",
      "avatar": "https://via.placeholder.com/100"
    }
  }
}
```

**测试账户**:
- username: `user1` | password: `123456`
- username: `user2` | password: `123456`

---

### 2. 用户注册
**请求方式**: POST  
**路由**: `/api/user/register`  
**请求参数**:
```json
{
  "username": "newuser",
  "password": "123456",
  "phone": "13800138002"
}
```

**响应数据**: 同登录接口

---

### 3. 获取用户信息
**请求方式**: GET  
**路由**: `/api/user/info`  
**需要认证**: ✅ 是  
**请求头**:
```
token: <JWT token>
```

**响应数据**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "username": "user1",
    "phone": "13800138000",
    "avatar": "https://via.placeholder.com/100"
  }
}
```

---

## 商品模块

### 4. 获取分类列表
**请求方式**: GET  
**路由**: `/api/category/list`  
**需要认证**: ❌ 否  

**响应数据**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {"id": 1, "name": "玫瑰花", "icon": "rose"},
    {"id": 2, "name": "向日葵", "icon": "sunflower"},
    {"id": 3, "name": "郁金香", "icon": "tulip"},
    {"id": 4, "name": "康乃馨", "icon": "carnation"},
    {"id": 5, "name": "百合", "icon": "lily"}
  ]
}
```

---

### 5. 获取商品列表
**请求方式**: GET  
**路由**: `/api/goods/list`  
**需要认证**: ❌ 否  
**查询参数**:
- `categoryId` (可选): 分类 ID
- `page` (可选): 页码，默认为 1
- `pageSize` (可选): 每页数量，默认为 10

**示例**: `/api/goods/list?categoryId=1&page=1&pageSize=10`

**响应数据**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
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
    ],
    "total": 7,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 6. 获取商品详情
**请求方式**: GET  
**路由**: `/api/goods/detail/:id`  
**需要认证**: ❌ 否  
**路由参数**:
- `id`: 商品 ID

**示例**: `/api/goods/detail/1`

**响应数据**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "name": "红玫瑰花束",
    "categoryId": 1,
    "price": 99,
    "image": "https://via.placeholder.com/200x200?text=Red+Rose",
    "description": "精选11朵红玫瑰，代表爱你一生一世",
    "sales": 1250,
    "rating": 4.8,
    "details": {
      "specifications": [
        {"name": "类型", "value": "鲜切花"},
        {"name": "花材", "value": "精选进口花材"},
        {"name": "包装", "value": "高档精美包装"},
        {"name": "配送", "value": "次日送达"}
      ],
      "images": [
        "https://via.placeholder.com/400x400?text=Flower1",
        "https://via.placeholder.com/400x400?text=Flower2",
        "https://via.placeholder.com/400x400?text=Flower3"
      ]
    }
  }
}
```

---

## 购物车模块

### 7. 获取购物车列表
**请求方式**: GET  
**路由**: `/api/cart/list`  
**需要认证**: ✅ 是  

**响应数据**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": 1,
        "goodsId": 1,
        "name": "红玫瑰花束",
        "price": 99,
        "quantity": 2,
        "image": "https://via.placeholder.com/100x100?text=Rose",
        "checked": true
      }
    ],
    "totalPrice": 198,
    "count": 1
  }
}
```

---

### 8. 添加到购物车
**请求方式**: POST  
**路由**: `/api/cart/add`  
**需要认证**: ✅ 是  
**请求参数**:
```json
{
  "goodsId": 1,
  "quantity": 2
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "添加成功",
  "data": {
    "goodsId": 1,
    "quantity": 2
  }
}
```

---

### 9. 删除购物车项目
**请求方式**: DELETE  
**路由**: `/api/cart/remove/:goodsId`  
**需要认证**: ✅ 是  
**路由参数**:
- `goodsId`: 商品 ID

**示例**: `/api/cart/remove/1`

**响应数据**:
```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 订单模块

### 10. 获取订单列表
**请求方式**: GET  
**路由**: `/api/order/list`  
**需要认证**: ✅ 是  

**响应数据**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
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
  ]
}
```

**订单状态**:
- `pending`: 待处理
- `shipped`: 已发货
- `delivered`: 已交付
- `cancelled`: 已取消

---

### 11. 获取订单详情
**请求方式**: GET  
**路由**: `/api/order/detail/:orderId`  
**需要认证**: ✅ 是  
**路由参数**:
- `orderId`: 订单 ID

**示例**: `/api/order/detail/1001`

**响应数据**: 同获取订单列表中的单个订单

---

### 12. 创建订单
**请求方式**: POST  
**路由**: `/api/order/create`  
**需要认证**: ✅ 是  
**请求参数**:
```json
{
  "items": [
    {
      "goodsId": 1,
      "name": "红玫瑰花束",
      "price": 99,
      "quantity": 1
    }
  ],
  "totalPrice": 99,
  "addressId": 1,
  "blessing": "祝你快乐"
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "id": 1003,
    "userId": 1,
    "items": [...],
    "totalPrice": 99,
    "addressId": 1,
    "status": "pending",
    "createdTime": "2024-01-29 12:00:00",
    "blessing": "祝你快乐"
  }
}
```

---

## 微信支付模块

### 13. 获取支付参数（统一下单）
**请求方式**: POST  
**路由**: `/api/payment/prepay`  
**需要认证**: ✅ 是  

**请求参数**:
```json
{
  "orderId": 1001
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "获取支付参数成功",
  "data": {
    "appId": "wxf435d4b400e57b1a",
    "timeStamp": "1704067200",
    "nonceStr": "abc123def456",
    "package": "prepay_id=wx12345678901234567890123456",
    "signType": "RSA",
    "paySign": "A1B2C3D4E5F6...",
    "outTradeNo": "ORDER10011704067200000"
  }
}
```

**说明**:
- 此接口用于从服务端获取微信支付所需的参数
- 返回的参数需要传递给小程序端的 `wx.requestPayment()` 方法
- `outTradeNo` 是商户订单号，需要保存用于后续查询支付状态

---

### 14. 查询支付状态
**请求方式**: GET  
**路由**: `/api/payment/query/:outTradeNo`  
**需要认证**: ✅ 是  

**路由参数**:
- `outTradeNo`: 商户订单号（从获取支付参数接口返回）

**示例**: `/api/payment/query/ORDER10011704067200000`

**响应数据**:
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "id": "ORDER10011704067200000",
    "orderId": 1001,
    "userId": 1,
    "totalAmount": 99,
    "prepayId": "wx12345678901234567890123456",
    "status": "success",
    "createdTime": "2024-01-29 12:00:00",
    "transactionId": "1234567890"
  }
}
```

**支付状态说明**:
- `pending`: 待支付
- `success`: 支付成功
- `failed`: 支付失败

---

### 15. 支付回调通知（服务器回调）
**请求方式**: POST  
**路由**: `/api/payment/notify`  
**需要认证**: ❌ 否  

此接口用于接收微信服务器的支付结果通知，**无需在小程序中主动调用**。

**微信回调流程**:
1. 用户完成支付
2. 微信服务器发送支付结果通知到此接口
3. 服务器验证签名，更新订单状态
4. 返回成功确认给微信

---

## 小程序端集成指南

### 完整的支付流程

#### 第一步：创建订单
```javascript
// 在小程序中创建订单
async function createOrder() {
  const res = await wx.request({
    url: 'http://your-server:3000/api/order/create',
    method: 'POST',
    header: {
      'token': wx.getStorageSync('token')
    },
    data: {
      items: cartItems, // 购物车商品
      totalPrice: totalPrice, // 总价格
      addressId: selectedAddressId, // 收货地址ID
      blessing: blessingMessage // 祝福语（可选）
    }
  });
  
  if (res.statusCode === 200 && res.data.code === 200) {
    const order = res.data.data;
    console.log('订单创建成功:', order);
    return order;
  }
}
```

#### 第二步：获取支付参数
```javascript
// 获取支付参数
async function getPaymentParams(orderId) {
  const res = await wx.request({
    url: 'http://your-server:3000/api/payment/prepay',
    method: 'POST',
    header: {
      'token': wx.getStorageSync('token')
    },
    data: {
      orderId: orderId
    }
  });
  
  if (res.statusCode === 200 && res.data.code === 200) {
    const paymentData = res.data.data;
    console.log('获取支付参数成功:', paymentData);
    return paymentData;
  } else {
    wx.showToast({
      title: '获取支付参数失败',
      icon: 'error'
    });
  }
}
```

#### 第三步：拉起微信支付
```javascript
// 拉起微信支付
async function launchWechatPay(paymentData) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: paymentData.timeStamp,
      nonceStr: paymentData.nonceStr,
      package: paymentData.package,
      signType: paymentData.signType,
      paySign: paymentData.paySign,
      success(res) {
        console.log('支付成功:', res);
        // 支付成功后，查询订单状态确认
        resolve({
          success: true,
          outTradeNo: paymentData.outTradeNo
        });
      },
      fail(err) {
        console.log('支付失败:', err);
        reject({
          success: false,
          error: err
        });
      }
    });
  });
}
```

#### 第四步：确认支付结果
```javascript
// 查询支付状态并确认
async function confirmPayment(outTradeNo) {
  const res = await wx.request({
    url: `http://your-server:3000/api/payment/query/${outTradeNo}`,
    method: 'GET',
    header: {
      'token': wx.getStorageSync('token')
    }
  });
  
  if (res.statusCode === 200 && res.data.code === 200) {
    const paymentOrder = res.data.data;
    if (paymentOrder.status === 'success') {
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      });
      // 返回首页或订单列表
      wx.switchTab({
        url: '/pages/index/index'
      });
    } else if (paymentOrder.status === 'pending') {
      wx.showToast({
        title: '支付处理中，请稍候',
        icon: 'loading'
      });
    } else {
      wx.showToast({
        title: '支付失败',
        icon: 'error'
      });
    }
  }
}
```

#### 完整的支付流程函数
```javascript
// 综合函数：从创建订单到支付完成
async function handlePayment(cartItems, totalPrice, selectedAddressId, blessing) {
  try {
    // 第一步：创建订单
    const order = await createOrder();
    if (!order) throw new Error('订单创建失败');
    
    // 第二步：获取支付参数
    const paymentData = await getPaymentParams(order.id);
    if (!paymentData) throw new Error('获取支付参数失败');
    
    // 第三步：拉起微信支付
    const result = await launchWechatPay(paymentData);
    if (!result.success) throw new Error('支付被用户取消或失败');
    
    // 第四步：确认支付结果
    await confirmPayment(result.outTradeNo);
    
  } catch (error) {
    console.error('支付流程错误:', error);
    wx.showToast({
      title: error.message || '支付出错',
      icon: 'error'
    });
  }
}
```

#### 在支付页面使用
```javascript
// 页面中的支付按钮点击事件
Page({
  data: {
    cartItems: [],
    totalPrice: 0,
    selectedAddressId: null,
    blessing: ''
  },

  async onPaymentButtonTap() {
    if (!this.data.selectedAddressId) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'error'
      });
      return;
    }

    wx.showLoading({ title: '处理中...' });
    
    try {
      await handlePayment(
        this.data.cartItems,
        this.data.totalPrice,
        this.data.selectedAddressId,
        this.data.blessing
      );
    } finally {
      wx.hideLoading();
    }
  }
});
```

---

### 重要提示

#### 1. 配置说明
- 请将代码中的 `http://your-server:3000` 替换为实际的服务器地址
- 确保小程序已正确配置合法域名，添加服务器地址到微信小程序的"业务域名"配置中

#### 2. 线上环境配置
在生产环境部署前，需要完成以下配置：

**服务端配置** (在 `index.js` 中修改):
```javascript
const WECHAT_PAY_CONFIG = {
    appId: 'wxf435d4b400e57b1a', // 替换为真实的小程序AppID
    mchId: '1234567890', // 替换为真实的商户ID
    apiKey: 'your_api_key_32_characters', // 替换为真实的API密钥（32字符）
    notifyUrl: 'https://your-domain.com/api/payment/notify', // 替换为真实的回调URL（必须是HTTPS）
    // V3版本使用
    privateKey: '', // 需要从微信商户平台下载的私钥
    serialNo: '' // 证书序列号
};
```

#### 3. 获取配置参数
- **AppID**: 在微信小程序后台获取
- **商户ID (mchId)**: 在微信支付商户平台获取
- **API密钥**: 在微信支付商户平台 → 账户设置 → API安全 → 设置密钥
- **私钥和证书**: 在微信支付商户平台下载

#### 4. 调试建议
```javascript
// 在创建订单前打印数据
console.log('购物车商品:', cartItems);
console.log('总价:', totalPrice);
console.log('收货地址ID:', selectedAddressId);

// 在支付前打印支付参数
console.log('支付参数:', paymentData);

// 在支付后检查返回状态
console.log('微信返回：', res);
```

#### 5. 错误处理
```javascript
// 捕获所有可能的错误
async function safePayment() {
  try {
    await handlePayment(...);
  } catch (error) {
    if (error.errMsg.includes('cancel')) {
      // 用户取消支付
      console.log('用户取消了支付');
    } else if (error.errMsg.includes('fail')) {
      // 支付失败
      console.log('支付失败:', error.errMsg);
    } else {
      // 其他错误
      console.log('未知错误:', error);
    }
  }
}
```

---

## 地址模块

### 16. 获取地址列表
**请求方式**: GET  
**路由**: `/api/address/list`  
**需要认证**: ✅ 是  

**响应数据**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
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
  ]
}
```

---

### 17. 添加地址
**请求方式**: POST  
**路由**: `/api/address/add`  
**需要认证**: ✅ 是  
**请求参数**:
```json
{
  "name": "李四",
  "phone": "13800138001",
  "province": "上海市",
  "city": "上海市",
  "district": "浦东新区",
  "address": "某某路456号",
  "isDefault": false
}
```

**响应数据**: 返回新创建的地址对象

---

### 18. 更新地址
**请求方式**: PUT  
**路由**: `/api/address/update/:addressId`  
**需要认证**: ✅ 是  
**路由参数**:
- `addressId`: 地址 ID

**示例**: `/api/address/update/1`

**请求参数**: 同添加地址接口

**响应数据**: 返回更新后的地址对象

---

### 19. 删除地址
**请求方式**: DELETE  
**路由**: `/api/address/delete/:addressId`  
**需要认证**: ✅ 是  
**路由参数**:
- `addressId`: 地址 ID

**示例**: `/api/address/delete/1`

**响应数据**:
```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 首页模块

### 17. 获取首页轮播图
**请求方式**: GET  
**路由**: `/api/home/banners`  
**需要认证**: ❌ 否  

**响应数据**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "image": "https://via.placeholder.com/750x400?text=Banner1",
      "link": "/pages/goods/list/list"
    }
  ]
}
```

---

### 18. 获取推荐商品
**请求方式**: GET  
**路由**: `/api/home/recommend`  
**需要认证**: ❌ 否  

**响应数据**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
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
  ]
}
```

---

## 工具接口

### 19. 健康检查
**请求方式**: GET  
**路由**: `/health`  
**需要认证**: ❌ 否  

**响应数据**:
```json
{
  "status": "ok",
  "message": "服务正常运行"
}
```

---

## 数据统计

### 模拟数据包含：
- **商品**: 7 种花卉商品
- **分类**: 5 个分类（玫瑰、向日葵、郁金香、康乃馨、百合）
- **订单**: 2 个示例订单
- **地址**: 1 个默认地址
- **用户**: 2 个测试账户

### 商品列表：
1. 红玫瑰花束 - ¥99
2. 向日葵花束 - ¥79
3. 郁金香混合花束 - ¥119
4. 康乃馨花束 - ¥69
5. 白百合花束 - ¥89
6. 粉玫瑰花束 - ¥109
7. 混合花束 - ¥129

---

## 注意事项

1. **JWT Token**: 登录或注册后会获得一个 token，有效期为 7 天
2. **数据持久化**: 当前数据存储在内存中，服务重启后会重置
3. **CORS**: 已启用 CORS，可以跨域访问
4. **端口**: 默认运行在 3000 端口，可根据需要修改

---

## 前端配置

将 HTTP 工具中的 baseURL 改为：
```javascript
baseURL: 'http://localhost:3000'
```

或者如果在真实设备上测试，使用电脑 IP 地址：
```javascript
baseURL: 'http://192.168.x.x:3000'
```

---

## 常见问题

Q: 如何获取 token？  
A: 调用 `/api/user/login` 或 `/api/user/register` 接口，会在响应中返回 token。

Q: 如何使用 token 进行认证？  
A: 在请求头中添加 `token: <你的token值>`

Q: 数据会保存吗？  
A: 不会，当前所有数据都存储在内存中，服务重启后会重置。如需持久化，可以添加数据库。

Q: 如何修改端口？  
A: 修改 index.js 中的 `const PORT = 3000;` 这一行。

---

## 后续扩展建议

1. 集成真实数据库（MongoDB 或 MySQL）
2. 添加更复杂的业务逻辑（库存管理、支付等）
3. 添加日志系统
4. 添加错误处理和验证
5. 添加速率限制和安全措施
6. 使用环境变量管理配置

---
