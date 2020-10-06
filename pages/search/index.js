import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from '../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    //取消的按钮是否显示
    isFoucs: false,
    //输入框的值
    inpValue:""
  },
  TimeId: -1,
  //输入框的值改变就触发该事件
  handleInput(e) {
    //获取输入框的值
    const { value } = e.detail;
    //检测合法性
    if (!value.trim()) {
      this.setData({
        isFoucs: false,
        goods: []
      })
      return;
    }
    //发送请求获取数据
    this.setData({
      isFoucs: true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000)
  },
  //发送请求获取搜索建议数据
  async qsearch(query) {
    const res = await request({ url: '/goods/qsearch', data: { query } });
    this.setData({
      goods: res
    })
  },
  handleCancel(e) {
    let goods = [];
    this.setData({
      inpValue:"",
      goods,
      isFoucs: false
    })
  }
})