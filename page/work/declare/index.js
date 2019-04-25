var app = getApp()

Page({
  data: {
    items: [],
    search: '',
    active: false,
    url: '/work/declareBehavior',

    tabs: [{
        title: '行为积分'
      },
      {
        title: '品德积分'
      },
      {
        title: '业绩积分'
    }],

    menuIds: '', // 禁用标题id
  },
  onShow() {
    dd.showLoading({content: '加载中...'})
    dd.httpRequest({
      url: app.globalData.domain + '/userMenu/selectUserIdAndMenuId',
      method: 'POST',
      dataType: 'json',
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}
        console.log('successMenuId----', res)
        var menuIds = res.data.data.split(',')
        console.log(menuIds)
        this.setData({
          menuIds: menuIds
        })
      },
      fail: (res) => {
        console.log("httpRequestFailMenuId----", res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});
      },
      complete: () => {
        dd.httpRequest({
          url: app.globalData.domain + this.data.url,
          method: 'POST',
          dataType: 'json',
          data: {
            pageNum: 1,
            pageSize: 100,
            search: this.data.search
          },
          success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}
            console.log('successDeclare----', res)
            var items = res.data.data.list
            items.forEach((item) => {
              // console.log(this.data.menuIds)
              // console.log(item.menuId)
              if (this.data.menuIds.some((toItem) => toItem == item.behaviorId)) {
                item.checked = true
              } else {
                item.checked = false
              }
            })
            this.setData({
              items: res.data.data.list
            })
          },
          fail: (res) => {
            console.log("httpRequestFailDeclare----", res)
            var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});
          },
          complete: () => {
            dd.hideLoading()
          }
        })
      }
    })
  },

  listShow() {
    dd.showLoading({content: '加载中...'})
    dd.httpRequest({
      url: app.globalData.domain + this.data.url,
      method: 'POST',
      dataType: 'json',
      data: {
        pageNum: 1,
        pageSize: 100,
        search: this.data.search
      },
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

        console.log('successDeclare----', res)
        var items = res.data.data.list
        items.forEach((item) => {
          // console.log(this.data.menuIds)
          // console.log(item.menuId)
          if (this.data.menuIds.some((toItem) => toItem == item.behaviorId)) {
            item.checked = true
          } else {
            item.checked = false
          }
        })
        this.setData({
          items: res.data.data.list
        })
      },
      fail: (res) => {
        console.log("httpRequestFailDeclare----", res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

      },
      complete: () => {
        dd.hideLoading()
      }
    })
  },

  listShow2() { // 没有loading
    // dd.showLoading({content: '加载中...'})
    dd.httpRequest({
      url: app.globalData.domain + this.data.url,
      method: 'POST',
      dataType: 'json',
      data: {
        pageNum: 1,
        pageSize: 100,
        search: this.data.search
      },
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

        console.log('successDeclare----', res)
        var items = res.data.data.list
        items.forEach((item) => {
          // console.log(this.data.menuIds)
          // console.log(item.menuId)
          if (this.data.menuIds.some((toItem) => toItem == item.behaviorId)) {
            item.checked = true
          } else {
            item.checked = false
          }
        })
        this.setData({
          items: res.data.data.list
        })
      },
      fail: (res) => {
        console.log("httpRequestFailDeclare----", res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

      },
      complete: () => {
        // dd.hideLoading()
      }
    })
  },

  handleSearch(e) {
    this.setData({
      search: e.detail.value
    })
    this.listShow2()
  },
  clearSearch() {
    this.setData({
      active: false
    })
    dd.hideKeyboard()
  },
  focusSearch() {
    this.setData({
      active: true
    })
  },
  blurSearch() {
    this.setData({
      active: false
    })
  },
  doneSearch() {
    this.listShow2()
    dd.hideKeyboard()
  },

  onItemClick({ index }) {
    console.log('list点击', index)

    var title = this.data.items[index].behaviorTitle
    var content = this.data.items[index].behaviorContent
    var type = this.data.items[index].typeId
    var max = this.data.items[index].zuiDuoIntegral
    var min = this.data.items[index].zuiShaoIntegral
    var id = this.data.items[index].behaviorId
    var url = `./approve/index?title=${title}&content=${content}&type=${type}&max=${max}&min=${min}&id=${id}`

    dd.navigateTo({
      url: url
    })
  },
  handleTabClick({ index }) {
    switch (index) {
      case 0 :
      this.setData({
        url: '/work/declareBehavior'
      });
      this.listShow();
      break;
      case 1 :
      this.setData({
        url: '/work/declareMoral'
      });
      this.listShow();
      break;
      case 2:
      this.setData({
        url: '/work/declareResults'
      });
      this.listShow();
      break;
    }
  },
  handleTabChange({ index }) {

  }
}) 