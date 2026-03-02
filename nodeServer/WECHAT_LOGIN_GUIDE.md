# 微信登录接口使用指南

## 后端配置

### 1. 安装依赖
```bash
npm install
```

### 2. 配置微信小程序信息

编辑 `index.js` 文件，找到 `WECHAT_CONFIG` 配置部分：

```javascript
const WECHAT_CONFIG = {
    appId: 'YOUR_WECHAT_APP_ID',          // 替换为你的微信小程序 AppID
    appSecret: 'YOUR_WECHAT_APP_SECRET',  // 替换为你的微信小程序 AppSecret
    authUrl: 'https://api.weixin.qq.com/sns/jscode2session'
};
```

- `appId`: 在微信公众平台获取的小程序 AppID
- `appSecret`: 在微信公众平台获取的小程序 AppSecret

### 3. 启动服务
```bash
npm start
```

## 前端小程序调用

### 调用流程

```javascript
// 1. 使用 wx.login 获取 code
wx.login({
  success: ({ code }) => {
    if (code) {
      // 2. 将 code 发送给后端接口
      wx.request({
        url: 'http://your-server-ip:3000/api/user/wechat-login',
        method: 'POST',
        data: {
          code: code
        },
        success: (res) => {
          if (res.data.code === 200) {
            // 3. 登录成功，保存 token 和用户信息
            wx.setStorage({
              key: 'token',
              data: res.data.data.token
            });
            wx.setStorage({
              key: 'user',
              data: res.data.data.user
            });
            // 跳转到首页或其他页面
            wx.navigateTo({
              url: '/pages/index/index'
            });
          } else {
            wx.showToast({
              title: res.data.message || '登录失败',
              icon: 'error'
            });
          }
        },
        fail: (error) => {
          wx.showToast({
            title: '网络请求失败',
            icon: 'error'
          });
        }
      });
    } else {
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'error'
      });
    }
  },
  fail: () => {
    wx.showToast({
      title: '获取登录凭证失败',
      icon: 'error'
    });
  }
});
```

## API 接口说明

### 微信登录接口

**请求方式**: `POST /api/user/wechat-login`

**请求参数**:
```json
{
  "code": "微信小程序 wx.login() 返回的 code"
}
```

**成功响应** (code 200):
```json
{
  "code": 200,
  "message": "微信登录成功",
  "data": {
    "token": "JWT token 用于后续认证",
    "user": {
      "id": 1,
      "username": "wechat_xxxxx",
      "openid": "用户的微信 openid",
      "avatar": "用户头像"
    }
  }
}
```

**失败响应** (code 400):
```json
{
  "code": 400,
  "message": "具体错误信息"
}
```

## 工作原理

1. 小程序调用 `wx.login()` 获取临时登录凭证 `code`
2. 小程序将 `code` 发送给后端接口
3. 后端使用 `code`、`appId` 和 `appSecret` 向微信服务器请求用户标识
4. 微信服务器返回 `openid` (用户唯一标识) 和 `session_key`
5. 后端检查该 `openid` 的用户是否存在：
   - 存在：更新 `session_key`，返回登录成功
   - 不存在：创建新用户，返回登录成功
6. 小程序获得 `token`，后续请求使用该 token 进行身份认证

## 注意事项

- **AppID 和 AppSecret 不能泄露**，生产环境不要硬编码在代码中
- **session_key** 用于解密用户信息（如昵称、头像等），如需要可进一步开发
- **openid** 是用户在该小程序下的唯一标识
- 原有的用户名/密码登录和注册功能保持不变，可与微信登录共存
- 该接口会自动为新的微信用户创建账户

## 获取微信小程序 AppID 和 AppSecret

1. 访问微信公众平台：https://mp.weixin.qq.com
2. 登录微信小程序账号
3. 进入设置 → 开发设置
4. 复制 AppID 和 AppSecret
5. 填入后端配置中的 `WECHAT_CONFIG`

## 联系支持

如有问题，请检查：
1. AppID 和 AppSecret 是否正确
2. 后端服务是否正常运行
3. 小程序请求的 URL 是否正确（包括 IP 地址和端口号）
