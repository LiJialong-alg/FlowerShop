const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const os = require('os');
const crypto = require('crypto');
const xml2js = require('xml2js');
const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use('/static', express.static('public'))


const PORT = 3000;
const SECRET_KEY = 'flower_secret_key_2024';

// 微信小程序配置
const WECHAT_CONFIG = {
    appId: 'wxf435d4b400e57b1a', // 替换为你的微信小程序 AppID
    appSecret: 'e42a19da06674b9d1b6dcf3a85568d29', // 替换为你的微信小程序 AppSecret
    authUrl: 'https://api.weixin.qq.com/sns/jscode2session'
};

// 微信支付配置（需要实际配置）
const WECHAT_PAY_CONFIG = {
    appId: 'wxf435d4b400e57b1a', // 需要替换为真实的AppID
    mchId: '1234567890', // 需要替换为真实的商户ID
    apiKey: 'your_api_key_32_characters', // 需要替换为真实的API密钥（32字符）
    notifyUrl: 'http://localhost:3000/api/payment/notify', // 支付回调URL
    // V3版本使用
    privateKey: '', // 需要替换为真实的私钥
    serialNo: '' // 证书序列号
};

// 模拟数据库
const users = [

];

// 购物车数据 - 按userId存储
const userCarts = {};

const categories = [
    {
        id: 1,
        name: '玫瑰花',
        children: [
            { id: 1, name: '红玫瑰' },
            { id: 2, name: '白玫瑰' },
            { id: 3, name: '粉玫瑰' },
            { id: 23, name: '香槟玫瑰' } // 新增二级分类
        ]
    },
    {
        id: 2,
        name: '向日葵',
        children: [
            { id: 4, name: '普通向日葵' },
            { id: 5, name: '矮生向日葵' },
            { id: 24, name: '间色向日葵' }
        ]
    },
    {
        id: 3,
        name: '郁金香',
        children: [
            { id: 6, name: '红色郁金香' },
            { id: 7, name: '黄色郁金香' },
            { id: 8, name: '紫色郁金香' },
            { id: 25, name: '黑色郁金香' }
        ]
    },
    {
        id: 4,
        name: '康乃馨',
        children: [
            { id: 9, name: '粉康乃馨' },
            { id: 10, name: '红康乃馨' },
            { id: 26, name: '双色康乃馨' }
        ]
    },
    {
        id: 5,
        name: '百合',
        children: [
            { id: 11, name: '白百合' },
            { id: 12, name: '香水百合' },
            { id: 27, name: '大花百合' }
        ]
    },
    {
        id: 6,
        name: '樱花',
        children: [
            { id: 13, name: '染井吉野' },
            { id: 14, name: '八重樱' },
            { id: 28, name: '山樱花' }
        ]
    },
    {
        id: 7,
        name: '雏菊',
        children: [
            { id: 15, name: '白雏菊' },
            { id: 16, name: '小雏菊' },
            { id: 29, name: '黄色雏菊' }
        ]
    },
    {
        id: 8,
        name: '牡丹',
        children: [
            { id: 17, name: '洛阳红' },
            { id: 18, name: '魏紫' },
            { id: 30, name: '粉瓣牡丹' }
        ]
    },
    {
        id: 9,
        name: '兰花',
        children: [
            { id: 19, name: '蝴蝶兰' },
            { id: 20, name: '建兰' },
            { id: 31, name: '墨兰' }
        ]
    },
    {
        id: 10,
        name: '紫罗兰',
        children: [
            { id: 21, name: '蓝紫罗兰' },
            { id: 22, name: '白紫罗兰' },
            { id: 32, name: '迷你紫罗兰' }
        ]
    }
];

const goods = [
    {
        id: 1,
        name: '红玫瑰花束',
        categoryId: 1,
        subCategoryId: 1,
        price: 99,
        image: 'http://localhost:3000/static/assets/images/love.jpg',
        description: '精选11朵红玫瑰，代表爱你一生一世',
        sales: 1250,
        rating: 4.8
    },
    {
        id: 2,
        name: '白玫瑰花束',
        categoryId: 1,
        subCategoryId: 2,
        price: 89,
        image: 'http://localhost:3000/static/assets/images/elder.jpg',
        description: '9朵白玫瑰，纯洁爱情',
        sales: 750,
        rating: 4.7
    },
    {
        id: 3,
        name: '粉玫瑰花束',
        categoryId: 1,
        subCategoryId: 3,
        price: 99,
        image: 'http://localhost:3000/static/assets/images/friend.jpg',
        description: '12朵粉玫瑰，温柔甜蜜',
        sales: 680,
        rating: 4.8
    },
    {
        id: 4,
        name: '普通向日葵花束',
        categoryId: 2,
        subCategoryId: 4,
        price: 79,
        image: 'https://picsum.photos/300?id=2305772039',
        description: '9朵向日葵，阳光般灿烂',
        sales: 890,
        rating: 4.6
    },
    {
        id: 5,
        name: '矮生向日葵花束',
        categoryId: 2,
        subCategoryId: 5,
        price: 69,
        image: 'https://picsum.photos/300?id=2305772040',
        description: '矮生向日葵，可爱迷你',
        sales: 450,
        rating: 4.7
    },
    {
        id: 6,
        name: '红色郁金香花束',
        categoryId: 3,
        subCategoryId: 6,
        price: 119,
        image: 'https://picsum.photos/300?id=2305772041',
        description: '15朵红色郁金香，优雅高贵',
        sales: 560,
        rating: 4.9
    },
    {
        id: 7,
        name: '黄色郁金香花束',
        categoryId: 3,
        subCategoryId: 7,
        price: 119,
        image: 'https://picsum.photos/300?id=2305772042',
        description: '15朵黄色郁金香，明媚灿烂',
        sales: 420,
        rating: 4.8
    },
    {
        id: 8,
        name: '紫色郁金香花束',
        categoryId: 3,
        subCategoryId: 8,
        price: 119,
        image: 'https://picsum.photos/300?id=2305772043',
        description: '15朵紫色郁金香，神秘优雅',
        sales: 380,
        rating: 4.9
    },
    {
        id: 9,
        name: '粉康乃馨花束',
        categoryId: 4,
        subCategoryId: 9,
        price: 69,
        image: 'https://picsum.photos/300?id=2305772044',
        description: '19朵粉康乃馨，温暖感恩',
        sales: 1200,
        rating: 4.7
    },
    {
        id: 10,
        name: '红康乃馨花束',
        categoryId: 4,
        subCategoryId: 10,
        price: 69,
        image: 'https://picsum.photos/300?id=2305772045',
        description: '19朵红康乃馨，感恩有你',
        sales: 2100,
        rating: 4.7
    },
    {
        id: 11,
        name: '白百合花束',
        categoryId: 5,
        subCategoryId: 11,
        price: 89,
        image: 'https://picsum.photos/300?id=2305772046',
        description: '6朵白百合，纯洁优雅',
        sales: 720,
        rating: 4.8
    },
    {
        id: 12,
        name: '香水百合花束',
        categoryId: 5,
        subCategoryId: 12,
        price: 99,
        image: 'https://picsum.photos/300?id=2305772047',
        description: '5朵香水百合，芬芳高雅',
        sales: 580,
        rating: 4.9
    },
    {
        id: 13,
        name: '染井吉野樱花束',
        categoryId: 6,
        subCategoryId: 13,
        price: 75,
        image: 'https://picsum.photos/300?id=2305772048',
        description: '21朵染井吉野樱花，温柔甜蜜',
        sales: 1200,
        rating: 4.9
    },
    {
        id: 14,
        name: '八重樱花束',
        categoryId: 6,
        subCategoryId: 14,
        price: 85,
        image: 'https://picsum.photos/300?id=2305772049',
        description: '18朵八重樱花，富贵典雅',
        sales: 580,
        rating: 4.8
    },
    {
        id: 15,
        name: '白雏菊花束',
        categoryId: 7,
        subCategoryId: 15,
        price: 56,
        image: 'https://picsum.photos/300?id=2305772050',
        description: '多种白雏菊混合，清新可爱',
        sales: 650,
        rating: 4.8
    },
    {
        id: 16,
        name: '小雏菊花束',
        categoryId: 7,
        subCategoryId: 16,
        price: 46,
        image: 'https://picsum.photos/300?id=2305772051',
        description: '小雏菊混合，娇小可人',
        sales: 756,
        rating: 4.8
    },
    {
        id: 17,
        name: '洛阳红牡丹花束',
        categoryId: 8,
        subCategoryId: 17,
        price: 129,
        image: 'https://picsum.photos/300?id=2305772052',
        description: '洛阳红牡丹花束，富贵吉祥',
        sales: 420,
        rating: 4.8
    },
    {
        id: 18,
        name: '魏紫牡丹花束',
        categoryId: 8,
        subCategoryId: 18,
        price: 139,
        image: 'https://picsum.photos/300?id=2305772053',
        description: '魏紫牡丹花束，高贵雍容',
        sales: 380,
        rating: 4.8
    },
    {
        id: 19,
        name: '蝴蝶兰花束',
        categoryId: 9,
        subCategoryId: 19,
        price: 110,
        image: 'https://picsum.photos/300?id=2305772054',
        description: '蝴蝶兰混合花束，典雅高贵',
        sales: 720,
        rating: 4.6
    },
    {
        id: 20,
        name: '建兰花束',
        categoryId: 9,
        subCategoryId: 20,
        price: 120,
        image: 'https://picsum.photos/300?id=2305772055',
        description: '建兰花束，幽香沁人',
        sales: 580,
        rating: 4.6
    },
    {
        id: 21,
        name: '蓝紫罗兰花束',
        categoryId: 10,
        subCategoryId: 21,
        price: 156,
        image: 'https://picsum.photos/300?id=2305772056',
        description: '蓝紫罗兰花束，神秘优雅',
        sales: 680,
        rating: 4.8
    },
    {
        id: 22,
        name: '白紫罗兰花束',
        categoryId: 10,
        subCategoryId: 22,
        price: 146,
        image: 'https://picsum.photos/300?id=2305772057',
        description: '白紫罗兰花束，纯洁清新',
        sales: 580,
        rating: 4.8
    },

    // —— 新增商品（对应新增的二级分类，每个二级分类至少一个商品）
    {
        id: 23,
        name: '香槟玫瑰礼盒',
        categoryId: 1,
        subCategoryId: 23,
        price: 169,
        image: 'https://picsum.photos/300?id=2305772058',
        description: '12朵香槟玫瑰，带礼盒与丝带，优雅特别',
        sales: 320,
        rating: 4.9
    },
    {
        id: 24,
        name: '间色向日葵花束',
        categoryId: 2,
        subCategoryId: 24,
        price: 88,
        image: 'https://picsum.photos/300?id=2305772059',
        description: '混色向日葵与绿植搭配，清新可爱',
        sales: 210,
        rating: 4.7
    },
    {
        id: 25,
        name: '黑郁金香尊贵款',
        categoryId: 3,
        subCategoryId: 25,
        price: 199,
        image: 'https://picsum.photos/300?id=2305772060',
        description: '稀有黑色郁金香，神秘高雅的选择',
        sales: 95,
        rating: 4.9
    },
    {
        id: 26,
        name: '双色康乃馨花束',
        categoryId: 4,
        subCategoryId: 26,
        price: 78,
        image: 'https://picsum.photos/300?id=2305772061',
        description: '双色康乃馨混搭，适合节日赠送',
        sales: 410,
        rating: 4.6
    },
    {
        id: 27,
        name: '大花百合典藏',
        categoryId: 5,
        subCategoryId: 27,
        price: 129,
        image: 'https://picsum.photos/300?id=2305772062',
        description: '大花百合搭配尤加利叶，气质端庄',
        sales: 160,
        rating: 4.8
    },
    {
        id: 28,
        name: '山樱花清新束',
        categoryId: 6,
        subCategoryId: 28,
        price: 92,
        image: 'https://picsum.photos/300?id=2305772063',
        description: '野趣山樱花，轻盈自然的浪漫',
        sales: 270,
        rating: 4.9
    },
    {
        id: 29,
        name: '黄色雏菊小束',
        categoryId: 7,
        subCategoryId: 29,
        price: 52,
        image: 'https://picsum.photos/300?id=2305772064',
        description: '明亮黄色雏菊，活泼俏皮',
        sales: 340,
        rating: 4.7
    },
    {
        id: 30,
        name: '粉瓣牡丹珍藏',
        categoryId: 8,
        subCategoryId: 30,
        price: 159,
        image: 'https://picsum.photos/300?id=2305772065',
        description: '粉瓣牡丹，层次丰富，适合重要场合',
        sales: 110,
        rating: 4.8
    },
    {
        id: 31,
        name: '墨兰雅致花束',
        categoryId: 9,
        subCategoryId: 31,
        price: 138,
        image: 'https://picsum.photos/300?id=2305772066',
        description: '墨兰与绿叶搭配，古朴淡雅',
        sales: 145,
        rating: 4.6
    },
    {
        id: 32,
        name: '迷你紫罗兰礼盒',
        categoryId: 10,
        subCategoryId: 32,
        price: 66,
        image: 'https://picsum.photos/300?id=2305772067',
        description: '小巧迷你紫罗兰，适合桌面摆放与小礼物',
        sales: 500,
        rating: 4.8
    },
    {
        id: 34,
        name: '迷你紫罗兰礼盒',
        categoryId: 10,
        subCategoryId: 32,
        price: 66,
        image: 'https://picsum.photos/300?id=2305772069',
        description: '小巧迷你紫罗兰，适合桌面摆放与小礼物',
        sales: 500,
        rating: 4.8
    },
    {
        id: 35,
        name: '迷你紫罗兰礼盒',
        categoryId: 10,
        subCategoryId: 32,
        price: 66,
        image: 'https://picsum.photos/300?id=2305772060',
        description: '小巧迷你紫罗兰，适合桌面摆放与小礼物',
        sales: 500,
        rating: 4.8
    },
    {
        id: 36,
        name: '迷你紫罗兰礼盒',
        categoryId: 10,
        subCategoryId: 32,
        price: 66,
        image: 'https://picsum.photos/300?id=230577201',
        description: '小巧迷你紫罗兰，适合桌面摆放与小礼物',
        sales: 500,
        rating: 4.8
    },
    {
        id: 37,
        name: '迷你紫罗兰礼盒',
        categoryId: 10,
        subCategoryId: 32,
        price: 66,
        image: 'https://picsum.photos/300?id=2305772062',
        description: '小巧迷你紫罗兰，适合桌面摆放与小礼物',
        sales: 500,
        rating: 4.8
    },
    {
        id: 38,
        name: '迷你紫罗兰礼盒',
        categoryId: 10,
        subCategoryId: 32,
        price: 66,
        image: 'https://picsum.photos/300?id=2305772063',
        description: '小巧迷你紫罗兰，适合桌面摆放与小礼物',
        sales: 500,
        rating: 4.8
    },
    {
        id: 39,
        name: '迷你紫罗兰礼盒',
        categoryId: 10,
        subCategoryId: 32,
        price: 66,
        image: 'https://picsum.photos/300?id=2305772064',
        description: '小巧迷你紫罗兰，适合桌面摆放与小礼物',
        sales: 500,
        rating: 4.8
    },
    {
        id: 40,
        name: '迷你紫罗兰礼盒',
        categoryId: 10,
        subCategoryId: 32,
        price: 66,
        image: 'https://picsum.photos/300?id=2305772065',
        description: '小巧迷你紫罗兰，适合桌面摆放与小礼物',
        sales: 500,
        rating: 4.8
    },
    {
        id: 41,
        name: '迷你紫罗兰礼盒',
        categoryId: 10,
        subCategoryId: 32,
        price: 66,
        image: 'https://picsum.photos/300?id=2305772066',
        description: '小巧迷你紫罗兰，适合桌面摆放与小礼物',
        sales: 500,
        rating: 4.8
    },
    {
        id: 42,
        name: '迷你紫罗兰礼盒',
        categoryId: 10,
        subCategoryId: 32,
        price: 66,
        image: 'https://picsum.photos/300?id=2305772067',
        description: '小巧迷你紫罗兰，适合桌面摆放与小礼物',
        sales: 500,
        rating: 4.8
    }
];

const orders = [
    // {
    //     id: 1001,
    //     userId: 1,
    //     items: [
    //         { goodsId: 1, name: '红玫瑰花束', price: 99, quantity: 1, blessing: '祝你生日快乐' }
    //     ],
    //     totalPrice: 99,
    //     status: 'delivered',
    //     createdTime: '2024-01-20 14:30:00',
    //     deliveryTime: '2024-01-22 10:00:00'
    // },
    // {
    //     id: 1002,
    //     userId: 1,
    //     items: [
    //         { goodsId: 2, name: '向日葵花束', price: 79, quantity: 2, blessing: '' }
    //     ],
    //     totalPrice: 158,
    //     status: 'pending',
    //     createdTime: '2024-01-25 16:45:00'
    // }
];

// 支付订单数据 - 用于存储待支付和已支付的订单
const paymentOrders = [];

const addresses = [
    {
        id: 1,
        userId: 1,
        name: '张三',
        phone: '18139189811',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        address: '某某街道123号',
        isDefault: true
    }
];

// 验证 token 中间件
const authenticateToken = (req, res, next) => {
    const token = req.headers['token'];

    if (!token) {
        return res.status(401).json({ code: 401, message: '缺少认证令牌' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ code: 401, message: '令牌无效或已过期' });
    }
};

// ==================== 登录相关接口 ====================

// 微信登录
app.post('/api/user/wechat-login', async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ code: 400, message: '缺少登录凭证 code' });
        }

        // 发送请求给微信服务器获取 openid 和 session_key
        const response = await axios.get(WECHAT_CONFIG.authUrl, {
            params: {
                appid: WECHAT_CONFIG.appId,
                secret: WECHAT_CONFIG.appSecret,
                js_code: code,
                grant_type: 'authorization_code'
            }
        });

        if (response.data.errcode) {
            return res.status(400).json({
                code: 400,
                message: `微信认证失败: ${response.data.errmsg}`
            });
        }

        const { openid, session_key } = response.data;

        // 检查是否存在该微信用户，如果不存在则自动创建
        let user = users.find(u => u.openid === openid);

        if (!user) {
            // 创建新用户
            user = {
                id: users.length + 1,
                username: `wechat_${openid.substring(0, 8)}`,
                openid: openid,
                sessionKey: session_key,
                avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
                isWechatUser: true,
                createdAt: new Date().toISOString()
            };
            users.push(user);
        } else {
            // 更新现有用户的 session_key
            user.sessionKey = session_key;
        }

        // 生成 JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, openid: user.openid },
            SECRET_KEY,
            { expiresIn: '7d' }
        );

        res.json({
            code: 200,
            message: '微信登录成功',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    openid: openid,
                    avatar: user.avatar
                }
            }
        });
    } catch (error) {
        console.error('微信登录错误:', error.message);
        res.status(500).json({
            code: 500,
            message: '服务器错误: ' + error.message
        });
    }
});

// 登录
app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(400).json({ code: 400, message: '用户名或密码错误' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '7d' });
    res.json({
        code: 200,
        message: '登录成功',
        data: {
            token,
            user: {
                id: user.id,
                username: user.username,
                avatar: user.avatar
            }
        }
    });
});

// 注册
app.post('/api/user/register', (req, res) => {
    const { username, password } = req.body;

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ code: 400, message: '用户名已存在' });
    }

    const newUser = {
        id: users.length + 1,
        username,
        password,
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    };
    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, SECRET_KEY, { expiresIn: '7d' });
    res.json({
        code: 200,
        message: '注册成功',
        data: {
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                avatar: newUser.avatar
            }
        }
    });
});

// 获取用户信息
app.get('/api/user/info', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ code: 404, message: '用户不存在' });
    }

    res.json({
        code: 200,
        message: '获取成功',
        data: {
            id: user.id,
            username: user.username,
            avatar: user.avatar
        }
    });
});

// ==================== 商品相关接口 ====================

// 获取分类列表
app.get('/api/category/list', (req, res) => {
    res.json({
        code: 200,
        message: '获取成功',
        data: categories
    });
});

// 获取商品列表
app.get('/api/goods/list', (req, res) => {
    const { categoryId, subCategoryId, page = 1, pageSize = 10 } = req.query;
    // console.log(categoryId, subCategoryId)
    let goodsList = goods;

    // 按一级分类筛选
    if (categoryId) {
        goodsList = goodsList.filter(g => g.categoryId === parseInt(categoryId));
    }
    // console.log(goodsList)
    // 按二级分类筛选
    if (subCategoryId) {
        goodsList = goodsList.filter(g => g.subCategoryId === parseInt(subCategoryId));
    }
    // console.log(goodsList)
    const total = goodsList.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedList = goodsList.slice(startIndex, startIndex + pageSize);

    res.json({
        code: 200,
        message: '获取成功',
        data: {
            list: paginatedList,
            total,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        }
    });
});

// 获取商品详情
app.get('/api/goods/detail/:id', (req, res) => {
    const { id } = req.params;
    const goodsDetail = goods.find(g => g.id === parseInt(id));

    if (!goodsDetail) {
        return res.status(404).json({ code: 404, message: '商品不存在' });
    }

    // 获取一级分类信息
    const category = categories.find(c => c.id === goodsDetail.categoryId);
    // 获取二级分类信息
    const subCategory = category?.children?.find(sc => sc.id === goodsDetail.subCategoryId);

    res.json({
        code: 200,
        message: '获取成功',
        data: {
            ...goodsDetail,
            categoryName: category?.name || '',
            subCategoryName: subCategory?.name || '',
            beforePrice: goodsDetail.price * 2,
            details: {
                specifications: [
                    { name: '类型', value: '鲜切花' },
                    { name: '花材', value: '精选进口花材' },
                    { name: '包装', value: '高档精美包装' },
                    { name: '配送', value: '次日送达' }
                ],
                images: [
                    'https://picsum.photos/300?id=2305772075',
                    'https://picsum.photos/300?id=2305772074',
                    'http://localhost:3000/static/assets/images/statement.png'
                ]
            }
        }
    });
});

// ==================== 购物车相关接口 ====================

// 获取购物车列表
app.get('/api/cart/list', authenticateToken, (req, res) => {
    const userId = req.user.id;

    // 初始化购物车（如果不存在）
    if (!userCarts[userId]) {
        userCarts[userId] = [];
    }

    const cartList = userCarts[userId];
    const totalPrice = cartList.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const checkedCount = cartList.filter(item => item.checked).length;

    res.json({
        code: 200,
        message: '获取成功',
        data: {
            list: cartList,
            totalPrice,
            count: cartList.length,
            checkedCount
        }
    });
});

// 添加到购物车
app.post('/api/cart/add', authenticateToken, (req, res) => {
    const { goodsId, quantity = 1, blessing = '' } = req.body;
    const userId = req.user.id;
    const goodsItem = goods.find(g => g.id === goodsId);
    if (!goodsItem) {
        return res.status(404).json({ code: 404, message: '商品不存在' });
    }

    // 初始化购物车（如果不存在）
    if (!userCarts[userId]) {
        userCarts[userId] = [];
    }

    // 检查是否已存在该商品
    const existingItem = userCarts[userId].find(item => item.goodsId === goodsId);

    if (existingItem) {
        // 如果已存在，增加数量
        existingItem.quantity += quantity;
    } else {
        // 如果不存在，添加新项目
        const newItem = {
            id: userCarts[userId].length + 1,
            goodsId: goodsId,
            name: goodsItem.name,
            price: goodsItem.price,
            image: goodsItem.image,
            quantity: quantity,
            checked: true,
            blessing: blessing
        };
        userCarts[userId].push(newItem);
    }

    res.json({
        code: 200,
        message: '添加成功',
        data: userCarts[userId]
    });
});

// 删除购物车项目
app.delete('/api/cart/remove/:goodsId', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const goodsId = parseInt(req.params.goodsId);
    if (!userCarts[userId]) {
        return res.status(404).json({ code: 404, message: '购物车为空' });
    }

    userCarts[userId] = userCarts[userId].filter(item => item.goodsId !== goodsId);
    res.json({
        code: 200,
        message: '删除成功',
        data: userCarts[userId]
    });
});

// 更新商品选中状态
app.post('/api/cart/update-checked', authenticateToken, (req, res) => {
    const { goodsId, checked } = req.body;
    const userId = req.user.id;

    if (!userCarts[userId]) {
        return res.status(404).json({ code: 404, message: '购物车为空' });
    }

    const cartItem = userCarts[userId].find(item => item.goodsId === goodsId);
    if (!cartItem) {
        return res.status(404).json({ code: 404, message: '购物车项不存在' });
    }

    cartItem.checked = checked;

    res.json({
        code: 200,
        message: '更新成功',
        data: userCarts[userId]
    });
});

// 全选购物车
app.post('/api/cart/select-all', authenticateToken, (req, res) => {
    const userId = req.user.id;

    if (!userCarts[userId]) {
        userCarts[userId] = [];
    }

    userCarts[userId].forEach(item => {
        item.checked = true;
    });

    res.json({
        code: 200,
        message: '全选成功',
        data: userCarts[userId]
    });
});

// 全不选购物车
app.post('/api/cart/deselect-all', authenticateToken, (req, res) => {
    const userId = req.user.id;

    if (!userCarts[userId]) {
        userCarts[userId] = [];
    }

    userCarts[userId].forEach(item => {
        item.checked = false;
    });

    res.json({
        code: 200,
        message: '全不选成功',
        data: userCarts[userId]
    });
});

// ==================== 订单相关接口 ====================

// 获取订单列表
app.get('/api/order/list', authenticateToken, (req, res) => {
    const userOrders = orders.filter(o => o.userId === req.user.id);

    res.json({
        code: 200,
        message: '获取成功',
        data: userOrders
    });
});

// 获取订单详情
app.get('/api/order/detail/:orderId', authenticateToken, (req, res) => {
    const { orderId } = req.params;
    const order = orders.find(o => o.id === parseInt(orderId) && o.userId === req.user.id);

    if (!order) {
        return res.status(404).json({ code: 404, message: '订单不存在' });
    }

    res.json({
        code: 200,
        message: '获取成功',
        data: order
    });
});

// 创建订单
app.post('/api/order/create', authenticateToken, (req, res) => {
    const { items, totalPrice, addressId, blessing } = req.body;

    const newOrder = {
        id: 1000 + orders.length + 1,
        userId: req.user.id,
        items,
        totalPrice,
        addressId,
        status: 'pending',
        createdTime: new Date().toLocaleString('zh-CN'),
        blessing: blessing || ''
    };

    orders.push(newOrder);

    res.json({
        code: 200,
        message: '订单创建成功',
        data: newOrder
    });
});

// ==================== 微信支付相关接口 ====================

// 生成随机字符串
function generateNonce(length = 32) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// 生成MD5签名（V2 API用）
function generateSignature(params, apiKey) {
    const keys = Object.keys(params).sort();
    let stringA = keys.map(key => `${key}=${params[key]}`).join('&');
    stringA += `&key=${apiKey}`;
    return crypto.createHash('md5').update(stringA, 'utf8').digest('hex').toUpperCase();
}

// 获取当前时间戳
function getCurrentTimestamp() {
    return Math.floor(Date.now() / 1000);
}

// API：统一下单 - 获取prepayId
app.post('/api/payment/prepay', authenticateToken, async (req, res) => {
    try {
        const { orderId } = req.body;

        // 验证订单
        const order = orders.find(o => o.id === parseInt(orderId) && o.userId === req.user.id);
        if (!order) {
            return res.status(404).json({ code: 404, message: '订单不存在' });
        }

        // 生成商户订单号
        const outTradeNo = `ORDER${order.id}${Date.now()}`;
        const nonceStr = generateNonce();
        const timestamp = getCurrentTimestamp();

        // 微信统一下单参数（示例参数，实际线上需要调用真实微信API）
        const prepayParams = {
            appid: WECHAT_PAY_CONFIG.appId,
            mchid: WECHAT_PAY_CONFIG.mchId,
            description: `花卉商品订单${order.id}`, // 商品描述
            out_trade_no: outTradeNo, // 商户订单号
            notify_url: WECHAT_PAY_CONFIG.notifyUrl,
            amount: {
                total: Math.round(order.totalPrice * 100), // 金额（单位：分）
                currency: 'CNY'
            },
            payer: {
                openid: req.user.openid || 'test_openid' // 需要从用户信息中获取
            }
        };

        // 保存支付订单信息
        const paymentOrder = {
            id: outTradeNo,
            orderId: order.id,
            userId: req.user.id,
            totalAmount: order.totalPrice,
            prepayId: '', // 实际调用微信API后会得到
            status: 'pending', // pending, success, failed
            createdTime: new Date().toLocaleString('zh-CN'),
            nonceStr: nonceStr,
            timestamp: timestamp
        };

        // 模拟微信返回的prepayId（实际环境需要调用真实的微信API）
        const mockPrepayId = `wx${generateNonce(28)}`;
        paymentOrder.prepayId = mockPrepayId;

        paymentOrders.push(paymentOrder);

        // 生成支付签名（用于客户端调用wx.requestPayment）
        const signParams = {
            appId: WECHAT_PAY_CONFIG.appId,
            timeStamp: timestamp.toString(),
            nonceStr: nonceStr,
            package: `prepay_id=${mockPrepayId}`,
            signType: 'RSA' // 或 'MD5'
        };

        // 生成签名字符串（实际生产环境需要使用私钥生成RSA签名）
        const signString = generateSignature(signParams, WECHAT_PAY_CONFIG.apiKey);

        res.json({
            code: 200,
            message: '获取支付参数成功',
            data: {
                appId: signParams.appId,
                timeStamp: signParams.timeStamp,
                nonceStr: signParams.nonceStr,
                package: signParams.package,
                signType: signParams.signType,
                paySign: signString,
                outTradeNo: outTradeNo
            }
        });

    } catch (error) {
        console.error('获取支付参数失败:', error);
        res.status(500).json({
            code: 500,
            message: '获取支付参数失败',
            error: error.message
        });
    }
});

// API：查询支付状态
app.get('/api/payment/query/:outTradeNo', authenticateToken, (req, res) => {
    try {
        const { outTradeNo } = req.params;

        const paymentOrder = paymentOrders.find(p => p.id === outTradeNo);
        if (!paymentOrder) {
            return res.status(404).json({ code: 404, message: '支付订单不存在' });
        }

        if (paymentOrder.userId !== req.user.id) {
            return res.status(403).json({ code: 403, message: '无权查看此订单' });
        }

        res.json({
            code: 200,
            message: '查询成功',
            data: paymentOrder
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: '查询失败',
            error: error.message
        });
    }
});

// API：微信支付回调（此接口不需要token验证）
app.post('/api/payment/notify', async (req, res) => {
    try {
        // 解析微信回调数据
        const xml = req.body;
        const parser = new xml2js.Parser();

        // 如果是重复提交XML格式，需要解析
        // 如果已经是JSON格式（根据HTTP头Content-Type）
        let data;

        if (typeof xml === 'string') {
            data = await parser.parseStringPromise(xml);
            data = data.xml;
        } else {
            data = xml;
        }

        // 提取关键信息
        const outTradeNo = data.out_trade_no?.[0] || data.out_trade_no;
        const transactionId = data.transaction_id?.[0] || data.transaction_id;
        const resultCode = data.result_code?.[0] || data.result_code;

        console.log('收到微信支付回调:', { outTradeNo, transactionId, resultCode });

        // 查找支付订单
        const paymentOrder = paymentOrders.find(p => p.id === outTradeNo);
        if (!paymentOrder) {
            // 返回微信格式的失败响应
            return res.status(200).send(`
                <xml>
                    <return_code><![CDATA[FAIL]]></return_code>
                    <return_msg><![CDATA[订单不存在]]></return_msg>
                </xml>
            `);
        }

        // 验证签名（生产环境必须验证）
        // ... 实施签名验证逻辑 ...

        if (resultCode === 'SUCCESS') {
            // 支付成功
            paymentOrder.status = 'success';
            paymentOrder.transactionId = transactionId;

            // 更新订单状态为已支付
            const order = orders.find(o => o.id === paymentOrder.orderId);
            if (order) {
                order.status = 'paid';
            }

            console.log('支付成功，订单ID:', paymentOrder.orderId);

            // 返回微信格式的成功响应
            res.status(200).send(`
                <xml>
                    <return_code><![CDATA[SUCCESS]]></return_code>
                    <return_msg><![CDATA[OK]]></return_msg>
                </xml>
            `);
        } else {
            // 支付失败
            paymentOrder.status = 'failed';

            res.status(200).send(`
                <xml>
                    <return_code><![CDATA[FAIL]]></return_code>
                    <return_msg><![CDATA[支付失败]]></return_msg>
                </xml>
            `);
        }

    } catch (error) {
        console.error('处理微信回调失败:', error);
        res.status(200).send(`
            <xml>
                <return_code><![CDATA[FAIL]]></return_code>
                <return_msg><![CDATA[系统错误]]></return_msg>
            </xml>
        `);
    }
});

// ==================== 地址相关接口 ====================

// 获取地址列表
app.get('/api/address/list', authenticateToken, (req, res) => {
    const userAddresses = addresses.filter(a => a.userId === req.user.id);

    res.json({
        code: 200,
        message: '获取成功',
        data: userAddresses
    });
});

// 添加地址
app.post('/api/address/add', authenticateToken, (req, res) => {
    const { name, phone, province, city, district, address, isDefault } = req.body;

    const newAddress = {
        id: Math.max(...addresses.map(a => a.id), 0) + 1,
        userId: req.user.id,
        name,
        phone,
        province,
        city,
        district,
        address,
        isDefault: isDefault || false
    };
    if (newAddress.isDefault) {
        addresses.forEach(addr => {
            if (addr.isDefault === true) {
                addr.isDefault = false;
            }
        });
    }
    addresses.push(newAddress);

    res.json({
        code: 200,
        message: '添加成功',
        data: newAddress
    });
});

// 更新地址
app.put('/api/address/update/:addressId', authenticateToken, (req, res) => {
    const { addressId } = req.params;
    const addressIndex = addresses.findIndex(a => a.id === parseInt(addressId) && a.userId === req.user.id);

    if (addressIndex === -1) {
        return res.status(404).json({ code: 404, message: '地址不存在' });
    }
    if (req.body.isDefault) {
        addresses.forEach(addr => {
            if (addr.isDefault === true) {
                addr.isDefault = false;
            }
        });
    }
    addresses[addressIndex] = {
        ...addresses[addressIndex],
        ...req.body
    };

    res.json({
        code: 200,
        message: '更新成功',
        data: addresses[addressIndex]
    });
});

// 删除地址
app.delete('/api/address/delete/:addressId', authenticateToken, (req, res) => {
    const { addressId } = req.params;
    const index = addresses.findIndex(a => a.id === parseInt(addressId) && a.userId === req.user.id);

    if (index === -1) {
        return res.status(404).json({ code: 404, message: '地址不存在' });
    }

    addresses.splice(index, 1);

    res.json({
        code: 200,
        message: '删除成功'
    });
});

// ==================== 首页接口 ====================

// 获取首页数据（轮播、推荐等）
app.get('/api/home/banners', (req, res) => {
    const banners = [
        {
            id: 1,
            image: 'http://localhost:3000/static/assets/banner/banner-1.jpg',
            link: '/pages/goods/list/list'
        },
        {
            id: 2,
            image: 'http://localhost:3000/static/assets/banner/banner-2.jpg',
            link: '/pages/goods/list/list'
        },
        {
            id: 3,
            image: 'http://localhost:3000/static/assets/banner/banner-3.jpg',
            link: '/pages/goods/list/list'
        }
    ];

    res.json({
        code: 200,
        message: '获取成功',
        data: banners
    });
});
//广告位
app.get('/api/home/advertise', (req, res) => {
    const advertise = goods.slice(0, 3);

    res.json({
        code: 200,
        message: '获取成功',
        data: advertise
    });
});
// 猜你喜欢
app.get('/api/home/guess', (req, res) => {
    const recommend = goods.slice(4, 8);

    res.json({
        code: 200,
        message: '获取成功',
        data: recommend
    });
});
// 获取首页推荐商品
app.get('/api/home/recommend', (req, res) => {
    const recommend = goods.slice(0, 4);

    res.json({
        code: 200,
        message: '获取成功',
        data: recommend
    });
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: '服务正常运行' });
});

// 获取本机IP地址
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // 跳过内部和非IPv4地址
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const localIP = getLocalIP();

// 启动服务
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🌸 花卉小程序服务器运行成功！`);
    console.log(`\n📱 本地访问: http://localhost:${PORT}`);
    console.log(`📱 局域网访问: http://${localIP}:${PORT}`);
    console.log(`\n请在手机浏览器中访问: http://${localIP}:${PORT}\n`);
    console.log('可用接口：');
    console.log('- POST /api/user/login          - 用户登录');
    console.log('- POST /api/user/register       - 用户注册');
    console.log('- POST /api/user/wechat-login   - 微信登录 (使用 wx.login 获取的 code)');
    console.log('- GET  /api/user/info           - 获取用户信息 (需要token)');
    console.log('- GET  /api/category/list       - 获取分类列表');
    console.log('- GET  /api/goods/list          - 获取商品列表');
    console.log('- GET  /api/goods/detail/:id    - 获取商品详情');
    console.log('- GET  /api/cart/list           - 获取购物车 (需要token)');
    console.log('- POST /api/cart/add            - 添加到购物车 (需要token)');
    console.log('- DELETE /api/cart/remove/:goodsId - 删除购物车项 (需要token)');
    console.log('- POST /api/cart/update-checked - 更新商品选中状态 (需要token)');
    console.log('- POST /api/cart/select-all     - 全选购物车 (需要token)');
    console.log('- POST /api/cart/deselect-all   - 全不选购物车 (需要token)');
    console.log('- GET  /api/order/list          - 获取订单列表 (需要token)');
    console.log('- GET  /api/order/detail/:orderId - 获取订单详情 (需要token)');
    console.log('- POST /api/order/create        - 创建订单 (需要token)');
    console.log('- POST /api/payment/prepay      - 获取支付参数 (需要token)');
    console.log('- GET  /api/payment/query/:outTradeNo - 查询支付状态 (需要token)');
    console.log('- POST /api/payment/notify      - 微信支付回调通知');
    console.log('- GET  /api/address/list        - 获取地址列表 (需要token)');
    console.log('- POST /api/address/add         - 添加地址 (需要token)');
    console.log('- PUT  /api/address/update/:addressId - 更新地址 (需要token)');
    console.log('- DELETE /api/address/delete/:addressId - 删除地址 (需要token)');
    console.log('- GET  /api/home/banners        - 获取首页轮播图');
    console.log('- GET  /api/home/recommend      - 获取推荐商品');
    console.log('- GET  /api/home/advertise      - 获取广告商品');
    console.log('- GET  /api/home/guess          - 获取猜你喜欢');
});
