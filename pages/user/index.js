// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{},
    //被收藏的商品的数量
    collectNums:0
  },
  onShow(){
    const userinfo = wx.getStorageSync('userinfo');
    const collectNums = wx.getStorageSync('collect').length;
    this.setData({
      userinfo,
      collectNums
    });
  }
  
})