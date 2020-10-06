import { request } from "../../request/index.js";
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
/* 
微信支付需要企业账号
企业账号的小程序后台中必须给开发者添加上白名单
*/
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    //获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || [];
    //计算全选 every方法 会遍历会接受一个回调函数 要每一个回调函数都返回true ,空数组也返回true
    // const allChecked=cart.length?cart.every(v=>v.checked):false; 节省空间
    //获取选中要支付的购物车数组
    cart = cart.filter(v => v.checked);
    this.setData({ address });
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    //给data赋值
    this.setData({
      address,
      cart,
      totalPrice,
      totalNum
    });
  },


  //点击支付功能
  async handleOrderPay() {
    try {
      //判断缓存中有没有token
      const token = wx.getStorageSync('token');
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }
      //创建订单
      //准备请求头参数
      // const header = { Authorization: token };
      //请求体参数
      const order_price = this.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods };
      //准备发送请求创建订单 获取订单编号
      const { order_number } = await request({ url: "/my/orders/create", method: 'POST', data: orderParams});
      //发起预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
      //发起微信支付
      await requestPayment(pay);
      //查询订单状态
      const res = await request({ url: "/my/orders/chkOrder", method: 'POST', data: { order_number }})
      await showToast({ title: "支付成功" });
      //手动删除缓存中已支付的数据
      let newCart=wx.getStorageSync('cart');
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync('cart', newCart);
      //支付成功跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      })
    } catch (error) {
      await showToast({ title: "支付失败" })
      console.log(error);
    }
  }
})

