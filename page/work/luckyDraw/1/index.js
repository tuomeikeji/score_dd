var app = getApp()

Page({
   data: {
   
  },
  onShow(e) {
    this.getData()
    this.webViewContext = dd.createWebViewContext('web-view-1');
  },
  test(e){
    //E应用接收webview发来的数据后执行的函数
    dd.alert({
      content:JSON.stringify(e.detail),
    });  
    this.webViewContext.postMessage({'sendToWebView': '1'});
  },
 getData() {
    dd.showLoading({ content: '加载中...' })

    dd.httpRequest({
      url: app.globalData.domain + '/integralDraw/find',
      method: 'POST',
      dataType: 'json',
      success: (res) => {
        if (res.data && res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }) }
        console.log('integralDraw----', res)
       
      },
      fail: (res) => {
        console.log('httpRequestFailLike----', res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

      },
      complete: () => {
        dd.hideLoading()
      }
    })
  },

})