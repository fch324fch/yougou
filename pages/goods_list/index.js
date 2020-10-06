import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      value: "综合",
      isActive: true
    },
    {
      id: 1,
      value: "销量",
      isActive: false
    },
    {
      id: 2,
      value: "价格",
      isActive: false
    },
    ],
    goodsList: []
  },
  //接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  //总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();
  },
  //获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams })
    //获取总条数
    const total = res.total;
    //计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    this.setData({
      goodsList: [...this.data.goodsList,...res.goods]
    })
    //数据请求成功后关闭下拉刷新窗口
    wx.stopPullDownRefresh();
  },
  //标题的点击事件
  handleTabsItemChange(e) {
    const { index } = e.detail;
    //修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    //赋值到data
    this.setData({
      tabs
    })
  },
  //页面上滑滚动条触底事件
  onReachBottom() {
    if(this.QueryParams.pagenum>=this.totalPages){
      //没有下一页数据
      wx.showToast({
        title: '到底啦！'
      })
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList();  
    }
  },
  //下拉刷新数据
  onPullDownRefresh(){
    this.setData({
      goodsList: []
    });
    this.QueryParams.pagenum=1;
    this.getGoodsList();
  }

})