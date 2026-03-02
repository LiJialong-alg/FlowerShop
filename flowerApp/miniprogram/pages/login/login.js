// pages/login/login.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { reqLogin, reqRegister, reqUserInfo } from '../../api/user';
import { userStore } from '../../stores/userStore';


Page({
  data: {
    // 界面切换
    showRegister: false,
    loading: false,
    loginLoading: false,
    registerLoading: false,

    // 登录表单
    username: '',
    password: '',

    // 注册表单
    regUsername: '',
    regPassword: '',
    regPasswordConfirm: '',
  },
  login(){
    wx.login({
      success: ({ code }) => {
        if (code) {
          // 2. 将 code 发送给后端接口
          wx.request({
            url: 'http://localhost:3000/api/user/wechat-login',
            method: 'POST',
            data: {
              code: code
            },
            success: (res) => {
              console.log(res)
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
  },

  onLoad() {
    // 绑定 store

    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: ['token','userInfo'],       
      actions: ['setToken','setUserInfo']    
    })
  },

  onUnload() {
    // 销毁绑定（防内存泄漏）
    this.storeBindings.destroyStoreBindings()
  },




  /**
   * 登录表单 - 用户名输入
   */
  onUsernameChange(event) {
    this.setData({
      username: event.detail
    });
  },

  /**
   * 登录表单 - 密码输入
   */
  onPasswordChange(event) {
    this.setData({
      password: event.detail
    });
  },

  /**
   * 注册表单 - 用户名输入
   */
  onRegUsernameChange(event) {
    this.setData({
      regUsername: event.detail
    });
  },

  /**
   * 注册表单 - 密码输入
   */
  onRegPasswordChange(event) {
    this.setData({
      regPassword: event.detail
    });
  },

  /**
   * 注册表单 - 确认密码输入
   */
  onRegPasswordConfirmChange(event) {
    this.setData({
      regPasswordConfirm: event.detail
    });
  },


  /**
   * 切换到注册界面
   */
  switchToRegister() {
    this.setData({
      showRegister: true,
      regUsername: '',
      regPassword: '',
      regPasswordConfirm: '',
      username: '',
      password: ''
    });
  },

  /**
   * 切换到登录界面
   */
  switchToLogin() {
    this.setData({
      showRegister: false,
      username: '',
      password: '',
      regUsername: '',
      regPassword: '',
      regPasswordConfirm: '',
    });
  },
  //获取用户信息
  async getUserInfo(Token){
    const res= await reqUserInfo(Token)
    wx.setStorageSync('userInfo', res.data)
    this.setUserInfo(res.data)

  },
  /**
   * 处理登录
   * 请求示例：

   */
  async handleLogin() {
    const { username, password } = this.data;

    // 验证输入
    if (!username || !password) {
      wx.toast({
        title: '请输入完整信息',
        icon: 'error',
        duration: 1000
      });
      return;
    }

    if (username.length < 3) {
      wx.toast({
        title: '用户名至少3位',
        icon: 'error',
        duration: 1000
      });
      return;
    }

    if (password.length < 6) {
      wx.toast({
        title: '密码至少6位',
        icon: 'error',
        duration: 1000
      });
      return;
    }

    // 设置加载状态
    this.setData({
      loginLoading: true
    });

    try {
      // 发送登录请求
      const response = await reqLogin(username,password)

      if (response.code === 200) {
        // 登录成功
        wx.toast({
          title: response.message || '登录成功',
          icon: 'success',
          duration: 1000
        });

        // 保存token和用户信息
        const { token } = response.data;
        wx.setStorageSync('token', token);
        this.setToken(token)
        this.getUserInfo(token)
        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      } else {
        // 登录失败
        wx.toast({
          title: response.message || '登录失败',
          icon: 'error',
          duration: 1000
        });
      }
    } catch (error) {
      console.error('登录错误:', error);
      wx.toast({
        title: error.message || '账号/密码错误',
        icon: 'error',
        duration: 1000
      });
    } finally {
      // 关闭加载状态
      this.setData({
        loginLoading: false
      });
    }
  },

  /**
   * 处理注册
   * 请求示例：

   */
  async handleRegister() {
    const { regUsername, regPassword, regPasswordConfirm} = this.data;

    // 验证输入
    if (!regUsername || !regPassword || !regPasswordConfirm) {
      wx.toast({
        title: '请填写完整',
        icon: 'error',
        duration: 1000
      });
      return;
    }

    if (regUsername.length < 3) {
      wx.toast({
        title: '用户名至少3位',
        icon: 'error',
        duration: 1000
      });
      return;
    }

    if (regPassword.length < 6) {
      wx.toast({
        title: '密码至少6位',
        icon: 'error',
        duration: 1000
      });
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      wx.toast({
        title: '两次密码不一致',
        icon: 'error',
        duration: 1000
      });
      return;
    }


    // 设置加载状态
    this.setData({
      registerLoading: true
    });

    try {
      // 发送注册请求
      const response = await reqRegister( regUsername, regPassword)
      if (response.code === 200) {
        // 注册成功
        wx.toast({
          title: response.message || '注册成功',
          icon: 'success',
          duration: 1000
        });

        // 保存token和用户信息
        const { token} = response.data;
        wx.setStorageSync('token', token);
        this.setToken(token)
        this.getUserInfo(token)
        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      } else {
        // 注册失败
        wx.toast({
          title: response.message || '用户名已存在',
          icon: 'error',
          duration: 1000
        });
      }
    } catch (error) {
      console.error('注册错误:', error);
      wx.toast({
        title: error.message || '用户名已存在',
        icon: 'error',
        duration: 1000
      });
    } finally {
      // 关闭加载状态
      this.setData({
        registerLoading: false
      });
    }
  }
});
