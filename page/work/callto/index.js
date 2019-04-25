var app = getApp()

Page({
  data: {
    items: [],
    search: '',
    status: 2,
    active: false,

    tabs: [{
      title: '审批拒绝'
    },
    {
      title: '审批通过'
    }]
  },
  onShow() {
    this.listShow()
  },
  listShow() {
    dd.showLoading({content: '加载中...'})

    dd.httpRequest({
      url: app.globalData.domain + '/complaint/selectComplaintList',
      method: 'POST',
      dataType: 'json',
      data: {
        pageNum: 1,
        pageSize: 100,
        time: this.data.status, // tab栏
        search: this.data.search
      },
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

        console.log('successWait----123456777777777777777777777777777', res)
        this.setData({
          items: res.data.data.list
        })
      },
      fail: (res) => {
        console.log('httpRequestFailWait----', res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

      },
      complete: () => {
        dd.hideLoading()
      }
    })
  },

  handleSearch(e) {
    this.setData({
      search: e.detail.value
    })
    // this.listShow()
  },
  clearSearch() {
    this.setData({
      search: '',
      active: false
    })
    this.listShow()
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
    this.listShow()
    dd.hideKeyboard()
  },

  onItemClick({ index }) {
    var approvalId = this.data.items[index].approvalId
    var title = this.data.items[index].approvalTitle
    var content = this.data.items[index].approvalContent
    var remark = this.data.items[index].spRemark
    var points = this.data.items[index].sqIntegral
    var type = this.data.items[index].type
    //var appPelId = this.items[index].
    dd.navigateTo({ url: `./reapprove/index?approvalId=${approvalId}&title=${title}&content=${content}&remark=${remark}&points=${points}&type=${type}` })
  },

  handleTabClick({ index }) {
    switch (index) {
      case 0:
        this.setData({
          status: 2
        });
        this.listShow();
        break;
      case 1:
        this.setData({
          status: 1
        });
        this.listShow();
        break;
    }
  },
  handleTabChange({ index }) {

  }
})