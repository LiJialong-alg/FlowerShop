# JL花坊 - 微信小程序商城

## 项目简介

JL花坊是一个基于微信小程序开发的在线鲜花商城，提供鲜花浏览、分类查看、购物车管理、订单处理等功能。

## 功能特性

- **首页展示**：轮播图、分类导航、推荐商品、猜你喜欢
- **商品分类**：按类别浏览商品
- **商品详情**：查看商品详细信息、加入购物车
- **购物车**：管理购物车商品、修改数量、删除商品
- **订单管理**：查看订单列表、订单详情
- **个人中心**：用户信息管理、地址管理
- **地址管理**：添加、编辑、删除收货地址

## 技术栈

- **前端框架**：微信小程序原生开发
- **UI组件库**：Vant Weapp
- **API请求**：封装的http请求工具
- **项目结构**：采用分包加载，优化小程序性能

## 项目结构

```
FlowerShop/
├── flowerApp/
│   ├── miniprogram/
│   │   ├── api/            # API接口文件
│   │   ├── assets/         # 静态资源
│   │   ├── components/     # 自定义组件
│   │   ├── libs/           # 第三方库
│   │   ├── miniprogram_npm/ # 小程序npm包
│   │   ├── modules/        # 分包模块
│   │   │   ├── goodModule/      # 商品相关页面
│   │   │   ├── orderPayModule/  # 订单支付相关页面
│   │   │   └── settingModule/   # 设置相关页面
│   │   ├── pages/          # 主包页面
│   │   ├── utils/          # 工具函数
│   │   ├── app.js          # 小程序入口文件
│   │   ├── app.json        # 小程序配置文件
│   │   └── app.scss        # 全局样式文件
```

## 核心页面

- **首页** (`pages/index/index`)：展示轮播图、分类导航、推荐商品
- **分类** (`pages/category/category`)：商品分类列表
- **购物车** (`pages/cart/cart`)：购物车商品管理
- **我的** (`pages/my/my`)：个人中心
- **商品列表** (`modules/goodModule/pages/goods/list/list`)：分类商品列表
- **商品详情** (`modules/goodModule/pages/goods/detail/detail`)：商品详细信息
- **订单列表** (`modules/orderPayModule/pages/order/list/list`)：用户订单列表
- **订单详情** (`modules/orderPayModule/pages/order/detail/detail`)：订单详细信息
- **地址管理** (`modules/settingModule/pages/address/list/index`)：收货地址管理

## API接口

- `reqIndexData()`：获取首页数据（轮播图、分类、广告、猜你喜欢、推荐商品）
- 其他API接口详见 `api` 目录下的文件

## 运行项目

1. 克隆项目到本地
2. 使用微信开发者工具打开 `flowerApp` 目录
3. 配置小程序AppID
4. 点击「编译」按钮运行项目

## 项目亮点

1. **分包加载**：采用分包加载策略，提高小程序启动速度
2. **组件化开发**：使用自定义组件和Vant Weapp组件库，提高代码复用性
3. **模块化设计**：清晰的目录结构，便于维护和扩展
4. **用户体验**：流畅的页面切换和交互效果

## 未来规划

- 添加商品搜索功能
- 实现优惠券系统
- 增加会员积分系统
- 优化支付流程
- 添加更多鲜花种类和分类

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License
