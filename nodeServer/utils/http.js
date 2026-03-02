/**
 * HTTP请求工具类
 * 用于处理与后端API的通信
 */

// 获取基础URL（根据环境自动适配）
const getBaseUrl = () => {
    // 获取当前host
    const host = wx.getStorageSync('serverHost') || 'localhost:3000';
    return `https://${host}`;
};

/**
 * 发送HTTP请求
 * @param {string} method - 请求方法 (GET, POST, PUT, DELETE)
 * @param {string} url - 请求URL
 * @param {object} data - 请求数据
 * @returns {Promise}
 */
const request = (method, url, data = {}) => {
    return new Promise((resolve, reject) => {
        const token = wx.getStorageSync('token');
        const baseUrl = getBaseUrl();

        const header = {
            'Content-Type': 'application/json'
        };

        // 如果有token，添加到请求头
        if (token) {
            header['token'] = token;
        }

        wx.request({
            url: baseUrl + url,
            method: method,
            data: data,
            header: header,
            timeout: 10000,
            success: (response) => {
                const { statusCode, data: responseData } = response;

                // 检查HTTP状态码
                if (statusCode >= 200 && statusCode < 300) {
                    resolve(responseData);
                } else if (statusCode === 401) {
                    // token过期或无效
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('userInfo');
                    wx.reLaunch({
                        url: '/pages/login/login'
                    });
                    reject({
                        code: 401,
                        message: '登录已过期，请重新登录'
                    });
                } else {
                    reject(responseData || {
                        code: statusCode,
                        message: '请求失败'
                    });
                }
            },
            fail: (error) => {
                console.error('请求失败:', error);
                reject({
                    code: -1,
                    message: error.errMsg || '网络请求失败，请检查网络连接'
                });
            }
        });
    });
};

/**
 * 导出request对象，包含GET、POST、PUT、DELETE方法
 */
export const http = {
    /**
     * GET请求
     * @param {string} url - 请求URL
     * @param {object} data - 请求参数
     */
    get: (url, data = {}) => request('GET', url, data),

    /**
     * POST请求
     * @param {string} url - 请求URL
     * @param {object} data - 请求数据
     */
    post: (url, data = {}) => request('POST', url, data),

    /**
     * PUT请求
     * @param {string} url - 请求URL
     * @param {object} data - 请求数据
     */
    put: (url, data = {}) => request('PUT', url, data),

    /**
     * DELETE请求
     * @param {string} url - 请求URL
     * @param {object} data - 请求数据
     */
    delete: (url, data = {}) => request('DELETE', url, data),

    /**
     * 获取当前的基础URL
     */
    getBaseUrl: getBaseUrl,

    /**
     * 设置服务器地址
     * @param {string} host - 服务器地址 (例如: 192.168.1.100:3000)
     */
    setServerHost: (host) => {
        wx.setStorageSync('serverHost', host);
    },

    /**
     * 获取当前保存的服务器地址
     */
    getServerHost: () => {
        return wx.getStorageSync('serverHost') || 'localhost:3000';
    },

    /**
     * 清除token和用户信息
     */
    clearAuth: () => {
        wx.removeStorageSync('token');
        wx.removeStorageSync('userInfo');
    },

    /**
     * 获取当前token
     */
    getToken: () => {
        return wx.getStorageSync('token');
    }
};

// 默认导出
export default http;
