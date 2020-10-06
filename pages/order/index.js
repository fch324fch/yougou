import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [{
      id: 0,
      value: "全部",
      isActive: true
    },
    {
      id: 1,
      value: "待付款",
      isActive: false
    },
    {
      id: 2,
      value: "待发货",
      isActive: false
    },
    {
      id: 3,
      value: "退款/退货",
      isActive: false
    }
    ],
  },
  onShow(options) {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return;
    }
    //获取当前的小程序的页面栈-数组 长度最大是10个页面
    let pages = getCurrentPages();
    //数组中索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    //获取url的type参数|
    const { type } = currentPage.options;
    //激活选中页面标题
    this.changeTitleByIndex(type - 1);
    this.getOrders(type);
  },
  //获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: '/my/orders/all', data: { type } });
    this.setData({
      orders: res.orders.map(v => ({ ...v, create_time_cn: new Date(v.create_time * 1000).toLocaleString}))
    });
  },
  changeTitleByIndex(index) {
    //修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //赋值到data
    this.setData({
      tabs
    });
  },
  //标题的点击事件
  handleTabsItemChange(e) {
    const { index } = e.detail;
    //修改原数组
    this.changeTitleByIndex(index);
    this.getOrders(index + 1);
  }

})