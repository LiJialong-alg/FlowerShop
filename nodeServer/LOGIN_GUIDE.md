# 登录注册组件使用指南

## 📋 概览

完整的登录注册功能已集成到项目中，包括：
- ✅ 登录功能（用户名+密码）
- ✅ 注册功能（用户名+密码+确认密码+手机号）
- ✅ 表单验证
- ✅ 错误提示
- ✅ Token自动保存
- ✅ 用户信息本地存储

---

## 📁 文件结构

```
/login
├── login.wxml          # 页面模板（包含登录和注册两个表单）
├── login.js            # 页面逻辑（核心功能代码）
├── login.json          # 页面配置
└── login.scss          # 页面样式

/utils
└── http.js             # HTTP请求工具类（用于与后端通信）
```

---

## 🔧 核心功能说明

### 1. 登录功能

#### 请求示例
```javascript
// 请求URL: POST /api/user/login
// 请求参数:
{
  username: 'user1',
  password: '123456'
}

// 成功响应 (200):
{
  code: 200,
  message: '登录成功',
  data: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: {
      id: 1,
      username: 'user1',
      phone: '13800138000',
      avatar: 'https://via.placeholder.com/100'
    }
  }
}

// 失败响应 (400):
{
  code: 400,
  message: '用户名或密码错误'
}
```

#### 登录流程
1. 用户输入用户名和密码
2. 点击"登录"按钮
3. 前端验证输入内容
4. 发送POST请求到 `/api/user/login`
5. 后端验证用户身份
6. 成功后，保存token和用户信息到本地存储
7. 跳转到首页

#### 验证规则
- 用户名：必填，至少3个字符
- 密码：必填，至少6个字符

---

### 2. 注册功能

#### 请求示例
```javascript
// 请求URL: POST /api/user/register
// 请求参数:
{
  username: 'newuser',
  password: '123456',
  phone: '13800138000'  // 可选
}

// 成功响应 (200):
{
  code: 200,
  message: '注册成功',
  data: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: {
      id: 2,
      username: 'newuser',
      phone: '13800138000',
      avatar: 'https://via.placeholder.com/100'
    }
  }
}

// 失败响应 (400):
{
  code: 400,
  message: '用户名已存在'
}
```

#### 注册流程
1. 用户点击"立即注册"链接
2. 切换到注册表单
3. 输入用户名、密码、确认密码、手机号（可选）
4. 点击"立即注册"按钮
5. 前端验证表单数据
6. 发送POST请求到 `/api/user/register`
7. 后端创建新用户
8. 成功后，自动登录并保存token
9. 跳转到首页

#### 验证规则
- 用户名：必填，至少3个字符
- 密码：必填，至少6个字符
- 确认密码：必填，必须与密码一致
- 手机号：选填，格式为中国手机号 (1[3-9]开头的11位数字)

---

## 🎨 UI组件

使用Vant Weapp组件库的以下组件：

| 组件             | 用途                   |
| ---------------- | ---------------------- |
| `van-field`      | 输入框                 |
| `van-cell-group` | 单元格组（组织输入框） |
| `van-button`     | 按钮                   |
| `van-loading`    | 加载动画               |
| `van-toast`      | 提示消息               |

---

## 💾 本地存储

### 保存数据

登录/注册成功后，自动保存以下数据到本地存储：

```javascript
// token - 用于后续API请求的认证
wx.setStorageSync('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

// 用户信息 - 包含用户的基本信息
wx.setStorageSync('userInfo', {
  id: 1,
  username: 'user1',
  phone: '13800138000',
  avatar: 'https://via.placeholder.com/100'
});

// 服务器地址 - 用于连接到不同的服务器
wx.setStorageSync('serverHost', '192.168.1.100:3000');
```

### 读取数据

在其他页面中读取已保存的信息：

```javascript
// 获取token（用于API请求认证）
const token = wx.getStorageSync('token');

// 获取用户信息
const userInfo = wx.getStorageSync('userInfo');

// 获取服务器地址
const serverHost = wx.getStorageSync('serverHost');
```

### 清除数据（退出登录）

```javascript
wx.removeStorageSync('token');
wx.removeStorageSync('userInfo');
wx.reLaunch({
  url: '/pages/login/login'
});
```

---

## 🌐 HTTP请求工具使用

### 基本用法

```javascript
import { http } from '../../utils/http';

// GET请求
const result = await http.get('/api/category/list');

// POST请求
const result = await http.post('/api/order/create', {
  items: [...],
  totalPrice: 100,
  addressId: 1
});

// PUT请求
const result = await http.put('/api/address/update/1', {
  name: '新地址名',
  phone: '13800138000'
});

// DELETE请求
const result = await http.delete('/api/cart/remove/1');
```

### 自动附加Token

所有请求都会自动在请求头中附加token：

```javascript
header: {
  'Content-Type': 'application/json',
  'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

### 错误处理

```javascript
try {
  const response = await http.post('/api/user/login', {
    username: 'user1',
    password: '123456'
  });
  console.log('登录成功:', response);
} catch (error) {
  console.error('登录失败:', error.message);
}
```

### Token过期处理

当收到401响应时，http工具会自动：
1. 清除本地的token和userInfo
2. 跳转到登录页面
3. 提示用户重新登录

---

## 📱 测试账户

后端提供的测试账户：

| 用户名 | 密码   | 手机号      |
| ------ | ------ | ----------- |
| user1  | 123456 | 13800138000 |
| user2  | 123456 | 13800138001 |

### 快速测试步骤：

1. 打开小程序，进入登录页面
2. 输入用户名：`user1`
3. 输入密码：`123456`
4. 点击"登录"按钮
5. 成功登录后自动跳转到首页

---

## 🔒 安全特性

1. **密码验证**：密码至少6个字符
2. **Token保存**：使用wx.setStorageSync安全保存token
3. **Token自动清除**：401错误时自动清除无效token
4. **HTTPS连接**：确保通信安全（服务器已配置HTTPS）
5. **请求超时**：设置10秒请求超时

---

## 🎯 使用流程图

```
┌─────────────────┐
│  进入登录页面    │
└────────┬────────┘
         │
         ├──→ 已登录 → 自动跳转首页
         │
         └──→ 未登录 → 显示登录表单
                      │
                      ├─→ 登录 → 输入用户名密码 → 验证 → 请求API → 成功 → 保存token → 跳转首页
                      │
                      └─→ 注册 → 输入注册信息 → 验证 → 请求API → 成功 → 自动登录 → 跳转首页
```

---

## 🐛 常见问题

### Q: 登录失败，显示"网络请求失败"

**A:** 检查以下几点：
1. 服务器是否正常运行？(`npm start`)
2. 手机/模拟器是否能访问服务器地址？
3. 防火墙是否阻止了3000端口？
4. 确保使用的是HTTPS连接

### Q: 刷新页面后登录信息丢失

**A:** 检查浏览器的本地存储是否开启，token应该保存在wx.storage中

### Q: Token过期提示

**A:** 这是正常的。Token有效期为7天，过期后需要重新登录

### Q: 如何在不同的服务器间切换？

**A:** 使用http工具的方法：
```javascript
import { http } from '../../utils/http';

// 设置新的服务器地址
http.setServerHost('192.168.1.100:3000');

// 获取当前服务器地址
const host = http.getServerHost();
```

---

## 📚 相关接口

### 用户相关接口

| 接口                 | 方法 | 说明         | 认证 |
| -------------------- | ---- | ------------ | ---- |
| `/api/user/login`    | POST | 用户登录     | 否   |
| `/api/user/register` | POST | 用户注册     | 否   |
| `/api/user/info`     | GET  | 获取用户信息 | 是   |

### 其他常用接口

- `/api/category/list` - 获取分类列表
- `/api/goods/list` - 获取商品列表
- `/api/cart/list` - 获取购物车
- `/api/order/create` - 创建订单
- `/api/address/list` - 获取地址列表

---

## 📝 修改说明

如需修改验证规则、样式或功能，主要修改文件：

1. **login.js** - 修改验证逻辑、请求逻辑
2. **login.wxml** - 修改页面UI
3. **login.scss** - 修改页面样式
4. **utils/http.js** - 修改请求配置、超时时间等

---

希望这个登录注册组件能满足您的需求！如有问题，欢迎反馈 😊
