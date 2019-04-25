let app = getApp()

Page({
  data: {
    options: {},
    imgs: [],

    data: '0'
  },

  onLoad(options) {
    console.log(options)
    var imgs = options.goodLbImg.split(',')
    this.setData({
      options: options,
      imgs: imgs
    })
  },
  onShow() {
    dd.httpRequest({
      url: app.globalData.domain + '/integralGoods/selectIntegralGoodsDetailRecordCountNum/' + this.data.options.goodId,
      method: 'POST',
      dataType: 'json',
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

        console.log('successMarketDetails----', res)
        this.setData({
          data: res.data.data
        })
      },
      fail: (res) => {
        console.log("httpRequestFailMarketDetails----", res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

      },
      complete: () => {
      }
    })
  },

  change() {
    // dd.alert({ content: '正在测试，敬请期待', buttonText: '确定' })
    if (this.data.options.goodKc == 0) {
      dd.showToast({
        type: 'exception',
        duration: 3000,
        content: '没有存货了',
      })
      return
    }
    if (this.data.options.dhIntegral > this.data.options.data) {
      dd.alert({
        content: '您的积分不足，请赚取积分后再做兑换！'
      })
      return
    }
    dd.confirm({
      title: '温馨提示',
      content: `确定兑换 ${this.data.options.goodName} 吗？`,
      confirmButtonText: '兑换',
      cancelButtonText: '再看看',
      success: (result) => {
        if (result.confirm) {
          dd.showLoading({content: '兑换中...'})
          dd.httpRequest({
            url: app.globalData.domain + '/integralGoods/selectIntegralAddGoods',
            method: 'POST',
            dataType: 'json',
            data: {
              goodId: this.data.options.goodId
            },
            success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

              console.log('successMarketChange----', res)
              dd.showToast({
                type: 'success',
                duration: 3000,
                content: '兑换成功',
              })
              dd.navigateBack()
            },
            fail: (res) => {
              console.log("httpRequestFailMarketChange----", res)
              var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});
            },
            complete: () => {
              dd.hideLoading()
            }
          })
        }
      }
    })
  },
  toDetails() {
    var id = this.data.options.goodId
    dd.navigateTo({ url: `../logs/index?id=${id}` })
  },
})