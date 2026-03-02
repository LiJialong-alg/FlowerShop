import {  reqAddressList } from "@/api/address"
import { reqCreateOrder } from "@/api/order"
import { formatTime } from "@/utils/formatTime"
const app = getApp()
Page({
  data: {
    goodId:'',
    buyName: '', // 订购人姓名
    buyPhone: '', // 订购人手机号
    deliveryDate: '选择送达日期', // 期望送达日期
    blessing: '', // 祝福语
    show: false, // 期望送达日期弹框
    minDate: new Date().getTime(),
    currentDate: new Date().getTime(),
    addressId:'',
    orderAddr:'',
    checkedCart:'',
    totalPrice:''
  },
  onLoad(opts){
    let {totalPrice = '',goodId = '',blessing = ''} = opts
    // if(!blessing)
    //   blessing = (app.globalData.checkedCart.find( e => e.blessing !== '')).blessing||''
    this.getAddrs()
    this.setData({
      checkedCart:app.globalData.checkedCart,
      totalPrice,
      blessing,
      goodId
    })
  },
  onShow(){
  
    
  },
  onUnload(){
    app.globalData.address = ''
  },
  async getAddrs(){
    if(app.globalData.address.city){
      this.setData({
        orderAddr:app.globalData.address
      })
      return
    }

    const {data} = await reqAddressList()
    data.forEach(element => {
      if(element.isDefault){
        this.setData({
          orderAddr:element
        })
        return
      }
    });
  },
  // 选择期望送达日期
  onShowDateTimerPopUp() {
    this.setData({
      show: true
    })
  },

  // 期望送达日期确定按钮
  onConfirmTimerPicker(event) {
    const time = formatTime(new Date(event.detail))
    this.setData({
      show: false,
      deliveryDate:time
    })
  },

  // 期望送达日期取消按钮 以及 关闭弹框时触发
  onCancelTimePicker() {
    this.setData({
      show: false,
      minDate: new Date().getTime(),
      currentDate: new Date().getTime()
    })
  },

  // 跳转到收货地址
  toAddress() {
    wx.navigateTo({
      url: '/modules/settingModule/pages/address/list/index'
    })
  },
  async submitOrder() {
    const { orderAddr, buyName, buyPhone, deliveryDate, checkedCart } = this.data;

    // 1. 校验收货地址
    if (!orderAddr || !orderAddr.id) {
      return wx.showToast({ title: '请选择收货地址', icon: 'none' });
    }

    // 2. 校验订购人姓名
    if (!buyName.trim()) {
      return wx.showToast({ title: '请输入订购人姓名', icon: 'none' });
    }

    // 3. 校验手机号（增加简单的正则校验）
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(buyPhone)) {
      return wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
    }

    // 4. 校验期望送达日期
    if (deliveryDate === '选择送达日期') {
      return wx.showToast({ title: '请选择期望送达日期', icon: 'none' });
    }

    // 5. 校验购物车商品（防止空订单）
    if (!checkedCart || checkedCart.length === 0) {
      return wx.showToast({ title: '订单商品不能为空', icon: 'none' });
    }

    try {
      // 显示加载中，防止重复点击
      wx.showLoading({ title: '正在提交订单...', mask: true });

      // 构造后端需要的参数（通常不需要把整个 this.data 传过去，建议只传必要字段）
      const params = {
        addressId: orderAddr.id,
        buyName,
        buyPhone,
        deliveryDate,
        blessing: this.data.blessing,
        goodsList: checkedCart, // 或者传 id 数组，根据你后端接口定义来
        totalPrice: this.data.totalPrice
      };

      const res = await reqCreateOrder(params);

      wx.hideLoading();

      if (res.code === 200) {
        wx.toast({ title: '下单成功', icon: 'success' });
        // 下单成功后的逻辑，例如跳转到订单列表或支付页
        setTimeout(() => {
          wx.switchTab({ url: '/pages/index/index' })
        }, 1500);
      } else {
        wx.toast({ title: res.message || '下单失败', icon: 'none' });
      }
    } catch (error) {
      wx.hideLoading();
      console.error('提交订单出错:', error);
      wx.toast({ title: '网络繁忙，请稍后再试', icon: 'none' });
    }
  }
})
