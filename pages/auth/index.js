import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login } from '../../utils/asyncWx';
Page({

  //获取用户信息
  async handleGetUserInfo(e) {
    try {
      //获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      //获取小程序登录成功后的code
      const { code } = await login();
      const loginParams = { encryptedData, rawData, iv, signature, code };
      //发送请求获取用户token 不是企业账号获取不到
      const { token } = await request({ url: "/users/wxlogin", data: loginParams, method: 'post' });
      //把token存入缓存中 同时跳回上一个页面
      wx.setStorageSync('token', token);
      wx.navigateTo({
        delta: 1
      });
    }catch(error){
      console.log(error);
    }
  }
})