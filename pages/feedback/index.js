// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      value: "体验问题",
      isActive: true
    },
    {
      id: 1,
      value: "商品、商家投诉",
      isActive: false
    }
    ],
    //被选中的图片路径数组
    chooseImgs: [],
    //文本域的内容
    textVal: ""
  },
  //外网的图片的路径数组
  UpLoadImgs: [],
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
  handleChooseImg() {
    wx.chooseImage({
      //同时选中的图片数量
      count: 9,
      //图片的格式 原图      压缩
      sizeType: ["original", "compressed"],
      //图片来源
      sourceType: ["album", "camera"],
      success: (result) => {
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        });
      }
    })
  },
  //点击自定义图片组件
  handleRemoveImg(e) {
    //获取被点击组件的索引
    const { index } = e.currentTarget.dataset;
    //获取data中的图片数组
    let { chooseImgs } = this.data;
    //删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  //文本域输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  //提交按钮点击事件
  hanleFormSubmit() {
    //获取文本的内容 图片数组
    let { textVal, chooseImgs } = this.data;
    //合法性的验证
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: "none",
        mask: true
      });
      return;
    }
    //上传图片到专门的图片服务器 上传api不支持多个文件上传 所以要遍历数组挨个上传
    wx.showLoading({
      title: '正在上传中',
      mask: true
    })
    //判断有没有需要上传的图片数组
    if (chooseImgs.length != 0) {
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          //被上传的文件路径
          filePath: v,
          //上传文件的名称 后台来获取文件
          name: 'file',
          //上传到哪里
          url: 'https://imgurl.org/',
          //顺带的文本信息
          formData: {},
          success: (result) => {
            // let url=JSON.parse(url);
            // this.UpLoadImgs.push(url);
            //所有图片都上传完毕才触发
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();
              this.setData({
                textVal: '',
                chooseImgs: []
              });
              wx.navigateBack({
                delta: 1
              });
              wx.showToast({
                title: '提交成功',
              });
            }
          }
        })
      })
    } else {
      wx.hideLoading()
      wx.navigateBack({
        delta:1
      })
      wx.showToast({
        title: '提交成功',
      });
    }
  }
})