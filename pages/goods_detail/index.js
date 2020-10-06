// pages/goods_detail/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    //商品是否被收藏
    isCollect:false
  },
  // 商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages=getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options=currentPage.options;
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },
  //获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
    this.GoodsInfo=goodsObj;
    //获取缓存中商品收藏的数组
    let collect = wx.getStorageSync('collect') || [];
    //判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    });
  },
  //点击轮播图放大预览
  handlePreviewImage(e) {
    //图片数组
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    //接收传递过来的图片url
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      urls,
      current
    })
  },

  //点击加入购物车
  handleCartAdd(){
    //获取缓存中的购物车数组
    let cart=wx.getStorageSync('cart')||[];
    //判断商品对象是否存在于购物车中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      //不存在 第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      //已经存在
      cart[index].num++;
    }
    //把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart);
    //弹窗提示
    wx.showToast({
      title: '加入成功',
      icon:"success",
      //防止用户手抖疯狂点击按钮
      mask:true
    });
  },
  //点击商品收藏
  handleCollect(e){
    let isCollect=false;
    //获取缓存中的商品收藏数组
    let collect=wx.getStorageSync('collect')||[];
    //判断该商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    //当index!==-1表示已经收藏过了
    if(index!==-1){
      //删除收藏的商品
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon:"success",
        mask:true
      });
    }else{
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: "success",
        mask: true
      });
    }
    //把数组存到缓存中
    wx.setStorageSync('collect', collect);
    this.setData({
      isCollect
    })
  }
})