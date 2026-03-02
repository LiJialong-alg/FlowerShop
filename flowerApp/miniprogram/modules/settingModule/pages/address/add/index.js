import QQmapWx from '@/libs/qqmap-wx-jssdk'
import { reqAddAddress, reqUpdateAddress } from "@/api/address"
//用于表单验证：
import Schema from "async-validator"

Page({
  // 页面的初始数据
  data: {
      id:'',
      name: '',//name: '李四',
      phone: '',//  phone: '13800138001',
      province: '',//  province: '上海市',
      city: '',//  city: '上海市',
      district: '',//  district: '浦东新区',
      address: '',//  address: '某某路456号',
      isDefault: false//  isDefault: false
  },
  // 保存收货地址
  async saveAddrssForm(event) {
    const valid = await this.validatorAdd(this.data)
    if(!valid) return
    if(!this.data.id){
      const res = await reqAddAddress(this.data)
      if(res.code===200){
        wx.navigateBack()
        wx.toast({title:'新增收货地址成功'})
      }
    }else{
      const res = await reqUpdateAddress(this.data.id,this.data)
      if(res.code===200){
        wx.navigateBack()
        wx.toast({title:'更新收货地址成功'})
      }
    }

  },
  //验证
// 验证函数
validatorAdd(data) {
  // 1. 定义校验规则
  const rules = {
    name: { type: 'string', required: true, message: '请输入收货人姓名' },
    phone: [
      { required: true, message: '请输入手机号码' },
      { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
    ],
    province: { type: 'string', required: true, message: '请选择所在地区' },
    address: { type: 'string', required: true, message: '请输入详细地址' }
  }

  // 2. 实例化校验器
  const validator = new Schema(rules)

  // 3. 返回 Promise 结果
  return new Promise((resolve) => {
    validator.validate(data, (errors) => {
      if (errors) {
        // 如果有错误，取第一个错误消息并提示
        wx.toast({
          title: errors[0].message,
          icon: 'none'
        })
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
},
  // 省市区选择
  onAddressChange(event) {
    this.setData({
      province:event.detail.value[0],
      city:event.detail.value[1],
      district:event.detail.value[2]
    })
  },
  async getAddr(){
    const {latitude,longitude,name} = await wx.chooseLocation()
    this.qqmapwx.reverseGeocoder({
      location:{
        longitude,
        latitude
      },
      success : res => {
        const {province,city,district} = res.result.address_component

        this.setData({
          province,
          city,
          district,
          address:name
        })
      },
      fail : res => {
        console.error(res)
      }

    })
  },
  onLoad(opts){
    this.qqmapwx = new QQmapWx({
      key:'PL3BZ-Q2CC5-JT7IK-IFACL-TEYAV-EXB4L'
    })
    if (opts.address) {
      const address = JSON.parse(decodeURIComponent(opts.address));
      // console.log(address)
      this.setData({ ...address });
    }else{
      this.setData({
        id:''
      })
    }
  }
})
