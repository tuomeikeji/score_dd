let app = getApp()

Page({
  data: {
    data: '',
    items: [],

    width: '',
    height: '',
    windowHeight: '',
    bottomHeight: '',

    goods: [],
    sum: 0,

    date: ''
  },
  onReady() {
    
  },
  onLoad() {
    var date = this.format(Date.now(), 'yyyy-MM-dd')
    this.setData({
      date: date
    })
  },
  onShow() {
    dd.getSystemInfo({
      success: (res) => {

        var width = res.windowWidth / 2 - 21
        var height = width / 2 * 3
        var windowHeight = res.windowHeight

        this.setData({
          width: width,
          height: height,
          windowHeight: windowHeight
        })
      }
    })

    this.showList()
  },

  showList() {
    dd.showLoading({content: '加载中...'})

    dd.httpRequest({
      url: app.globalData.domain + '/integralGoods/selectIntegralGoodsKYIntegral',
      method: 'POST',
      dataType: 'json',
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

        console.log('successMarket----', res)
        this.setData({
          data: res.data.data
        })
      },
      fail: (res) => {
        console.log("httpRequestFailMarket----", res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

      },
      complete: () => {
      }
    })

    dd.httpRequest({
      url: app.globalData.domain + '/integralGoods/selectIntegralGoodsList',
      method: 'POST',
      dataType: 'json',
      data: {
        pageSize: 100,
        pageNum: 1
      },
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

        console.log('successMarketList----', res)
        
        var items = res.data.data.list
        items.forEach((item) => {
          item.goodImg = item.goodLbImg.split(',')[0]
          if (item.goodKc == 0) {
            item.active = true
          } else {
            items.active = false
          }
        })
        this.setData({
          items: items
        })
        // dd.createSelectorQuery().select('#bottom').boundingClientRect().exec((ret) => {
        //   var bottomHeight = this.data.goods.length == 0 ? '' : ret[0].height
        //   console.log('botttomHeight', bottomHeight)
        //   this.setData({
        //     bottomHeight: bottomHeight
        //   })
        // })
      },
      fail: (res) => {
        console.log("httpRequestFailMarketList----", res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

      },
      complete: () => {
        dd.hideLoading()
      }
    })
  },
  
  logs() {
    dd.navigateTo({ url: './logs/index' })
  },
  change(e) {
    // dd.alert({ content: '正在测试，敬请期待', buttonText: '确定' })
    if (e.currentTarget.dataset.item.goodKc == 0) {
      dd.showToast({
        type: 'exception',
        content: '没有存货了',
      })
      return
    }
    if (e.currentTarget.dataset.item.dhIntegral > this.data.data) {
      dd.alert({
        content: '您的积分不足，请赚取积分后再做兑换！',
        buttonText: '确定'
      })
      return
    }
    if (false) {
      dd.datePicker({
        startDate: this.data.date,
        success: (res) => {
          console.log(res)
          this.setData({
            date: res.date
          })
          dd.confirm({
            title: '温馨提示',
            content: `确定兑换 ${this.data.date} 这天吗？`,
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
                    goodId: e.currentTarget.dataset.item.goodId
                  },
                  success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

                    console.log('successMarketChange----', res)
                    dd.showToast({
                      type: 'success',
                      duration: 3000,
                      content: '兑换成功',
                    })
                  },
                  fail: (res) => {
                    console.log("httpRequestFailMarketChange----", res)
                    dd.alert({
                      content: JSON.stringify(res),
                      buttonText: '确定'
                    })
                  },
                  complete: () => {
                    dd.hideLoading()
                    this.showList()
                  }
                })
              }
            }
          })
        },
        fail: () => {
          dd.showToast({
            content: '取消选择'
          })
        }
      });
      return
    }
    dd.confirm({
      title: '温馨提示',
      content: `确定兑换 ${e.currentTarget.dataset.item.goodName} 吗？`,
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
              goodId: e.currentTarget.dataset.item.goodId
            },
            success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

              console.log('successMarketChange----', res)
              dd.navigateTo({ url: './success/index' })
            },
            fail: (res) => {
              console.log("httpRequestFailMarketChange----", res)
              var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});
            },
            complete: () => {
              dd.hideLoading()
              this.showList()
            }
          })
        }
      }
    })
  },
  toDetails(e) {
    var goodId = e.currentTarget.dataset.item.goodId
    var goodName = e.currentTarget.dataset.item.goodName
    var goodKc = e.currentTarget.dataset.item.goodKc
    var ydhNum = e.currentTarget.dataset.item.ydhNum ? e.currentTarget.dataset.item.ydhNum : 0
    var goodLbImg = e.currentTarget.dataset.item.goodLbImg
    var dhIntegral = e.currentTarget.dataset.item.dhIntegral
    var data = this.data.data
    dd.navigateTo({ url: `./details/index?goodId=${goodId}&goodName=${goodName}&goodKc=${goodKc}&ydhNum=${ydhNum}&goodLbImg=${goodLbImg}&dhIntegral=${dhIntegral}&data=${data}` })
  },

  choose(e) {
    console.log(e)
    // var items = this.data.items
    // items.forEach((value) => {
    //   if (value.goodId == item.goodId) {
    //     value.active = true
    //   }
    // })
    var item = e.currentTarget.dataset.item
    var goods = this.data.goods
    if (item.active) {
      dd.showToast({
        type: 'exception',
        content: '您已经选择了一个了',
      })
      return
    }
    goods.push(item)

    var sum = 0
    goods.forEach((good) => {
      sum += good.dhIntegral
    })

    this.setData({
      goods: goods,
      sum: sum
    })
    this.showList()
  },
  delete(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    var goods = this.data.goods

    var index = goods.findIndex((good) => good.goodId == id)
    goods.splice(index, 1)
    var sum = 0
    goods.forEach((good) => {
      sum += good.dhIntegral
    })

    this.setData({
      goods: goods,
      sum: sum
    })
    this.showList()
  },

  // 时间格式
  format(time, fmt) {
    var date = new Date(time)
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
})