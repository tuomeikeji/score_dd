let app = getApp()

Page({
  data: {
    authCode: '',

    phone: '',
    password: ''
  },
  // onLoad() {
  //   dd.showLoading({content: '加载中...'})
  //   dd.getAuthCode({
  //     success: (res) => {
  //       console.log(res.authCode)
  //       dd.httpRequest({
  //         url: app.globalData.domain + '/empp/login',
  //         method: 'POST',
  //         // headers: { 'Content-Type': 'application/json' },
  //         data: {
  //           authCode: res.authCode
  //           // authCode: '5dea735df7c33578966feb95d394d444'
  //         },
  //         dataType: 'json',
  //         success: (res) => {
  //           console.log('successAuto----', res)
  //           if (res.data.stringCode || res.data.code) {
  //             dd.alert({
  //               content: res.data.msg,
  //               buttonText: '确定'
  //             })
  //           } else {
  //             dd.httpRequest({
  //               url: app.globalData.domain + '/empp/selectRole',
  //               method: 'POST',
  //               // headers: { 'Content-Type': 'application/json' },
  //               dataType: 'json',
  //               success: (res) => {
  //                 console.log('successAutoRole----', res)
  //                 app.globalData.level = res.data.msg
  //                 dd.switchTab({
  //                   url: '/page/home/index/index'
  //                 })
  //               },
  //               fail: (res) => {
  //                 console.log("httpRequestFailAutoRole----", res)
  //                 dd.alert({
  //                   content: JSON.stringify(res),
  //                   buttonText: '确定'
  //                 })
  //               },
  //               complete: () => {
  //                 dd.hideLoading()
  //               }
  //             })
  //           }
  //         },
  //         fail: (res) => {
  //           console.log("httpRequestFailAuto----", res)
  //           dd.alert({
  //             content: JSON.stringify(res),
  //             buttonText: '确定'
  //           })
  //         },
  //         complete: () => {
  //           dd.hideLoading()
  //         }
  //       })

        
  //     },
  //     fail: (err) => {
  //       console.log("getAuthCodeFailAuto----", err)
  //       // dd.alert({
  //       //   content: JSON.stringify(err),
  //       //   buttonText: '确定'
  //       // })
  //       console.log(err)
        
  //       const _this = this
  //       dd.getStorage({
  //         key: 'login',
  //         success(res) {
  //           console.log("storage----", res)
  //           if (res.data) {
  //             dd.showLoading({ content: '登陆中...' })
  //             dd.httpRequest({
  //               url: app.globalData.domain + '/user/login',
  //               method: 'POST',
  //               data: {
  //                 phone: res.data.phone,
  //                 password: res.data.password
  //               },
  //               dataType: 'json',
  //               success: (res) => {
  //                 console.log('success----', res)

  //                 if (res.data.code == 0) {
  //                   app.globalData.level = res.data.msg
  //                   dd.switchTab({
  //                     url: '/page/home/index/index'
  //                   })
  //                 } else {
  //                   _this.setData({
  //                     hideList: false
  //                   })
  //                   dd.alert({
  //                     content: res.data.msg,
  //                     buttonText: '确定'
  //                   })
  //                 }
  //               },
  //               fail: (res) => {
  //                 console.log("httpRequestFail----", res)
  //                 dd.alert({
  //                   content: JSON.stringify(res),
  //                   buttonText: '确定'
  //                 })
  //               },
  //               complete: () => {
  //                 dd.hideLoading()
  //               }
  //             })
  //           } else {
  //             _this.setData({
  //               hideList: false
  //             })
  //           }
  //         },
  //         fail(res) {
  //           dd.alert({
  //             content: JSON.stringify(res),
  //             buttonText: '确定'
  //           })
  //         }
  //       })
  //       // this.setData({
  //       //   hideList: false
  //       // })
  //     },
  //     complete: () => {
  //       dd.hideLoading()
  //     }
  //   })
  // },
  onShow() {
    const _this = this
    dd.getStorage({
      key: 'login',
      success(res) {
        console.log("storage----", res)
        if (res.data) {
          _this.setData({
            phone: res.data.phone,
            password: res.data.password
          })
          dd.showLoading({ content: '登陆中...' })
          dd.httpRequest({
            url: app.globalData.domain + '/user/login',
            method: 'POST',
            data: {
              phone: res.data.phone,
              password: res.data.password
            },
            dataType: 'json',
            success: (res) => {
              console.log('success----', res)
              console.log(res.data.code == 0 && !res.data.stringCode)
              if (res.data.code == 0 && !res.data.stringCode) {
                
                var level = res.data.msg.split('=')[0]
                var id = res.data.msg.split('=')[1]
                app.globalData.level = level
                app.globalData.id = id

                dd.switchTab({
                // dd.reLaunch({
                  url: '/page/home/index/index'
                })
              } else {
                dd.alert({
                  content: res.data.msg,
                  buttonText: '确定'
                })
              }
            },
            fail: (res) => {
              console.log("httpRequestFail----", res)
              var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});
            },
            complete: () => {
              dd.hideLoading()
            }
          })
        }
      },
      fail(res) {
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});
      }
    })
  },
  formSubmit(e) {
    console.log('formSubmit----', e.detail.value)

    dd.showLoading({content: '登陆中...'})
    dd.httpRequest({
      url: app.globalData.domain + '/user/login',
      method: 'POST',
      data: {
        phone: e.detail.value.phone,
        password: e.detail.value.password
      },
      dataType: 'json',
      success: (res) => {
        console.log('success----', res)
        if (res.data.code == 0 && !res.data.stringCode) {
          
          var level = res.data.msg.split('=')[0]
          var id = res.data.msg.split('=')[1]
          app.globalData.level = level
          app.globalData.id = id

          dd.setStorage({
            key: 'login',
            data: {
              phone: e.detail.value.phone,
              password: e.detail.value.password
            },
            success() {
              dd.switchTab({
              // dd.reLaunch({
                url: '/page/home/index/index'
              })
            }
          })
        } else {
          dd.alert({
            content: res.data.msg,
            buttonText: '确定'
          })
        }
      },
      fail: (res) => {
        console.log("httpRequestFail----", res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});
      },
      complete: () => {
        dd.hideLoading()
      }
    })
  }
})