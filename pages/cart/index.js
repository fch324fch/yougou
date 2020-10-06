
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    //获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || [];
    //计算全选 every方法 会遍历会接受一个回调函数 要每一个回调函数都返回true ,空数组也返回true
    // const allChecked=cart.length?cart.every(v=>v.checked):false; 节省空间
    this.setData({ address });
    this.setCart(cart);
  },
  //点击收货地址
  async handleChooseAddress() {
    // 获取 权限状态
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      if (scopeAddress === false) {
        await openSetting();
      }
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      //存入到缓存中
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error);
    }
  },
  //商品选中
  handleItemChange(e) {
    //获取被修改的ID
    const goods_id = e.currentTarget.dataset.id;
    //获取购物车数组
    let { cart } = this.data;
    //找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  //设置购物车状态和重新计算购物车
  setCart(cart) {
    let allChecked = true;
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    //判断数据是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    //给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync('cart', cart);
  },
  handleItemAllCheck() {
    //获取data中数据
    let { cart, allChecked } = this.data;
    //修改值
    allChecked = !allChecked;
    //循环修改cart中checked的值
    cart.forEach(v => v.checked = allChecked);
    //把修改的后的值重新回data中和缓存中
    this.setCart(cart);
  },
  async handleItemNumEdit(e) {
    //获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    //获取购物车数组
    let { cart } = this.data;
    //找到需要修改的索引
    const index = cart.findIndex(v => v.goods_id === id);
    //判断是否执行删除
    if (cart[index].num === 1 && operation === -1) {
      //弹出提示
      const res = await showModal({content:"你是否要删除"});
      if(res.confirm){
        cart.splice(index,1);
        this.setCart(cart);
      }
    } else {
      //修改num值
      cart[index].num += operation;
      this.setCart(cart);
    }
  },
  //点击结算功能
  async handlePay(){
    const {address}=this.data;
    if(!address.userName){
      await showToast({title:"收货地址为空"});
      return;
    }
    //跳转支付页面
    wx.navigateTo({
      url: "/pages/pay/index"
    });
  }
})