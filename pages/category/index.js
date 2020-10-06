import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧菜单数据
    leftMenuList: [],
    //右侧商品数据
    rightContent: [],
    //被点击左侧菜单
    currentIndex: 0,
    //右侧内容滚动条顶部距离
    scrollTOP: 0
  },
  //接口的返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //缓存技术 判断本地存储中有没有旧数据 没有旧数据直接发送请求，有旧的数据同时旧的数据还没有过期就使用本地存储中的旧数据即可 存数据格式{time:Date.now(),data:[...]}
    //获取本地存储中的数据
    const Cates = wx.getStorageSync('cates');
    //判断
    if (!Cates) {
      this.getCates();
    } else {
      //定义过期时间
      if (Date.now() - Cates.time > 1000 * 300) {
        //如果过期了 重新发送请求
        this.getCates();
      } else {
        //使用旧数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //构造右侧数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  //获取分类数据
  async getCates() {
    // request({
    //   url: "/categories"
    // })
    // .then(res => {
    //   this.Cates = res.data.message
    //   //把接口的数据存到本地存储中
    //   wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
    //   //构造左侧数据
    //   let leftMenuList = this.Cates.map(v => v.cat_name);
    //   //构造右侧数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })

    //小程序中使用es7的 async await来发送请求
    const res = await request({ url: "/categories" });
      this.Cates = res;
      //把接口的数据存到本地存储中
      wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
      //构造左侧数据
      let leftMenuList = this.Cates.map(v => v.cat_name);
      //构造右侧数据
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
},
  //左侧菜单点击事件
  handleItemTap(e) {
  //获取被点击的标题的索引
  const { index } = e.currentTarget.dataset;
  let rightContent = this.Cates[index].children;
  //重新设置右侧内容滚动条顶部距离
  this.setData({
    currentIndex: index,
    rightContent,
    scrollTop: 0
  })
}
})