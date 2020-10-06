export const getSetting = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}
export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}
export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}
export const showModal = ({ content }) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            cancelText: "我再想想",
            cancelColor: "#eb4450",
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}
export const showToast = ({ title }) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            icon: "none",
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    });
}

export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            success: (result) => {
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            },
            timeout: 10000
        });
    });
}

export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...pay,
            success:(result)=>{
                resolve(result)
            },
            fail:(err)=>{
                reject(err)
            }
        });
    });
}