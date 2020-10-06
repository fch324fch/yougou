//导入发送过来的请求
import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数据
    swiperList: [],
    //导航数组
    catesList: [],
    //楼层数组
    floorList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1.发送异步请求获取轮播图 通过es6的promise
    // wx.request({
    //   //轮播图接口
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata ',
    //   success: (result) => {
    //     this.setData({
    //       swiperList:result.data.message
    //     })

    //   },
    // })
    this.getSwierList();
    this.getCateList();
    this.getFloorList();
  },
  //获取轮播图数据
  getSwierList() {
    request({ url: '/home/swiperdata' })
      .then(result => {
        this.setData({
          swiperList: result,
        })
      })
  },
  //获取分类导航数据
  getCateList() {
    request({
      url: '/home/catitems'
    })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },
  //获取楼层数据
  getFloorList() {
    request({
      url: '/home/floordata'
    })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  },

  //下拉刷新数据
  onPullDownRefresh() {
    this.setData({
      //轮播图数据
      swiperList: [],
      //导航数组
      catesList: [],
      //楼层数组
      floorList: []
    })
    this.getSwierList();
    this.getCateList(),
    this.getFloorList();
    wx.stopPullDownRefresh();
  }
})