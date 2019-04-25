let app = getApp()

Page({
  data: {
    options: {},
    items: [],
   
    right: [{'type': 'delete', 'text': '撤销'}]
  },
  onLoad(options) {
    console.log(options)

    this.setData({
      options: options
    })
  },
  onShow() {
    this.listShow()
  },
  listShow() {
    dd.showLoading({content: '加载中...'})

    var url = !this.data.options.id ? '/integralGoods/selectIntegralGoodsRecord' : '/integralGoods/selectIntegralGoodsDetailRecord/' + this.data.options.id
    dd.httpRequest({
      url: app.globalData.domain + url,
      method: 'POST',
      // headers: { 'Content-Type': 'application/json' },
      dataType: 'json',
      data: {
        pageSize: 100,
        pageNum: 1
      },
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

        console.log('successLogsList----', res)
       
        this.setData({
          items: res.data.data.list,
          
          
        })


      },
      fail: (res) => {
        console.log("httpRequestFailLogsList----", res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

      },
      complete: () => {
        dd.hideLoading()
      }
    })
  },

  onRightItemClick(e) {
    console.log(e)
  }
})