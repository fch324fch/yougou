//同时发送异步代码次数
let ajaxTimes=0;
export const request=(params)=>{
    //url中是否带有/my/
    let header={...params.header};
    if(params.url.includes("/my/")){
        header["Authorization"]=wx.getStorageSync('token');
    }
    ajaxTimes++;
    //显示一个加载中的效果
    wx.showLoading({
      title: '加载中',
      mask:true
    });
    //定义公共的url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resolve,reject)=>{
        wx.request({
          ...params,
          header:header,
          url:baseUrl+params.url,
          success: (result) => {
              resolve(result.data.message);
          },
          fail:(err)=>{
              reject(err);
          },
          complete:()=>{
              ajaxTimes--;
              if(ajaxTimes===0){
                  wx.hideLoading();
              }     
          }
        })
    })
}
