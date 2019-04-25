let app = getApp()

Page({
  data: {
    items: [],
    data: {},
    first: {},

    num: 1, // 分页
  },
  onShow() {
    dd.httpRequest({
      url: app.globalData.domain + '/home/index',
      method: 'POST',
      // headers: { 'Content-Type': 'application/json' },
      dataType: 'json',
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

        console.log('successHome----', res)
        this.setData({
          data: res.data.data,
          first: res.data.data
        })
      },
      fail: (res) => {
        console.log('httpRequestFailHome----', res)
        
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

      },
      complete: () => {
      }
    })

    // dd.httpRequest({
    //   url: app.globalData.domain + '/home/indexFirst',
    //   method: 'POST',
    //   // headers: { 'Content-Type': 'application/json' },
    //   dataType: 'json',
    //   success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

    //     console.log('successHomeFirst----', res)
    //     this.setData({
    //       first: res.data.data
    //     })
    //   },
    //   fail: (res) => {
    //     console.log('httpRequestFailHomeFirst----', res)
    //     var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

    //   },
    //   complete: () => {
    //   }
    // })

    this.listShow()
  },
  // onReachBottom() {
  //   this.listShow()
  // },

  listShow() {
    dd.showLoading({content: '加载中...'})

    dd.httpRequest({
      url: app.globalData.domain + '/home/list',
      method: 'POST',
      // headers: { 'Content-Type': 'application/json' },
      dataType: 'json',
      data: {
        pageNum: this.data.num,
        pageSize: 100,
        userId: ''
      },
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

        console.log('successHomeList----', res)
        // res.data.data.list.forEach((item) => {
        //     if(item.approvalImg1 != null || item.approvalImg1 != undefined || item.approvalImg1 != ""){
        //       if(item.approvalImg1.length > 0 ){
        //         item.approvalImg1 = item.approvalImg1.split(',')
        //       }
        //     }else{
        //         item.approvalImg1 = [""]
        //     }
        // })

        this.setData({
          items: res.data.data.list
        })
      },
      fail: (res) => {
        console.log('httpRequestFailHomeList---', res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

      },
      complete: () => {
        dd.hideLoading()
      }
    })
  },

  rankTo() {
    dd.switchTab({
      url: '/page/rank/index/index'
    })
  },
  likeTo() {
    dd.navigateTo({
      url: '/page/work/like/index'
    })
  },
  onItemClick({index}) {
    console.log('list点击', index)

    var approvalId = this.data.items[index].approvalId
    dd.navigateTo({ url: `/page/work/index/logs/details/index?approvalId=${approvalId}` })

    // if (this.data.items[index].approvalImg1) {
    //   dd.previewImage({
    //     urls: this.data.items[index].approvalImg1 // 无法获取图片排序
    //   })
    // }
  },

  preview(e) {
    console.log(e)
    dd.previewImage({
      current: e.target.dataset.index,
      urls: this.data.items.approvalImg1
    })
  }
})
