let app = getApp()

Page({
  data: {
    data: {},

    height: ''
  },
  onShow() {
    dd.getSystemInfo({
      success: (res) => {

        var height = res.windowHeight
        this.setData({
          height: height
        })
      }
    })

    dd.showLoading({content: '加载中...'})
    dd.httpRequest({
      url: app.globalData.domain + '/personal/indexHead',
      method: 'POST',
      dataType: 'json',
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

        console.log('successPersonal----', res)
        this.setData({
          data: res.data.data
        })
      },
      fail: (res) => {
        console.log("httpRequestFailPersonal----", res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

      },
      complete: () => {
        dd.hideLoading()
      }
    })
  },

  onDraw(ddChart, F2) {
    //dd-charts组件内部会回调此方法，返回图表实例ddChart
    //提示：可以把异步获取数据及渲染图表逻辑放onDraw回调里面
    var chartDataNew = []
    ddChart.clear()
    dd.httpRequest({
      url: app.globalData.domain + '/personal/indexEcharts',
      method: 'POST',
      dataType: 'json',
      data: {
        userId: ''
      },
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

        console.log('successEcharts----', res)
        
        chartDataNew.push({
          title: '扣除积分',
          points: res.data.data.delIntegral
        })
        chartDataNew.push({
          title: '奖励积分',
          points: res.data.data.addIntegral
        })
        chartDataNew.push({
          title: '基础积分',
          points: res.data.data.baseIntegral
        })
        chartDataNew.push({
          title: '总积分',
          points: res.data.data.countIntegral
        })
      },
      fail: (res) => {
        console.log("httpRequestFailEcharts----", res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

      },
      complete: () => {
        ddChart.source(chartDataNew, {
          population: {
            tickCount: 5
          }
        })
        ddChart.coord({
          transposed: true
        })
        ddChart.axis('title', {
          line: F2.Global._defaultAxis.line,
          grid: null
        })
        ddChart.axis('points', {
          line: null,
          grid: F2.Global._defaultAxis.grid,
          label: function label(text, index, total) {
            var textCfg = {};
            if (index === 0) {
              textCfg.textAlign = 'left';
            } else if (index === total - 1) {
              textCfg.textAlign = 'right';
            }
            return textCfg;
          }
        })
        ddChart.interval().position('title*points')
        ddChart.render()
      }
    })

    // console.log(chartDataNew)
    // ddChart.source(chartDataNew, {
    //   population: {
    //     tickCount: 5
    //   }
    // })
    // ddChart.coord({
    //   transposed: true
    // })
    // ddChart.axis('title', {
    //   line: F2.Global._defaultAxis.line,
    //   grid: null
    // })
    // ddChart.axis('points', {
    //   line: null,
    //   grid: F2.Global._defaultAxis.grid,
    //   label: function label(text, index, total) {
    //     var textCfg = {};
    //     if (index === 0) {
    //       textCfg.textAlign = 'left';
    //     } else if (index === total - 1) {
    //       textCfg.textAlign = 'right';
    //     }
    //     return textCfg;
    //   }
    // })
    // ddChart.interval().position('title*points')
    // ddChart.render()
  },

  logout() {
    dd.showLoading({ content: '退出中...' })
    dd.httpRequest({
      url: app.globalData.domain + '/user/logout',
      method: 'GET',
      dataType: 'json',
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

        console.log('successPersonalLogout----', res)
        dd.removeStorage({
          key: 'login',
          success: function() {
            console.log(1)
            dd.hideLoading()
            dd.reLaunch({
              url: '/page/register/index/index'
            })
          }
        })
      },
      fail: (res) => {
        console.log("httpRequestFailPersonalLogout----", res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

        dd.hideLoading()
      },
      complete: () => {
        dd.hideLoading()
      }
    })
  }
})