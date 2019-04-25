var app = getApp()

Page({
  data: {
    items: [],
    status: 2,

    users: [],

    tabs: [{
      title: '抢单任务'
    },
    {
      title: '挑战任务'
    },
    {
      title: '日常任务'
    }]
  },
  onShow() {
    this.listShow()
  },
  listShow() {
    dd.showLoading({content: '加载中...'})

    dd.httpRequest({
      url: app.globalData.domain + '/task/allTask',
      method: 'POST',
      dataType: 'json',
      data: {
        pageNum: 1,
        pageSize: 100,
        times: this.data.status, // tab栏审批未审批
      },
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}
        console.log('successBounty----', res)

        var items = res.data.data.list
        items.forEach((item) => {
          var state = '0'
          if (item.taskAndUserList) {
            item.taskAndUserList.forEach((task) => {
              if (task.userId == app.globalData.id) {
                state = task.state
                return
              }
            })
          }
          item.userState = state
        })
        
        this.setData({
          items: items
        })
      },
      fail: (res) => {
        console.log('httpRequestFailBounty----', res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});
      },
      complete: () => {
        dd.hideLoading()
      }
    })
  },

  onItemClick({ index }) {
    console.log('list点击', index)
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
          status: 3
        });
        this.listShow();
        break;
      case 2:
        this.setData({
          status: 1
        });
        this.listShow();
        break;
    }
  },
  handleTabChange({ index }) {

  },

  change(e) {
    console.log(e.target.dataset.index)

    var index = e.target.dataset.index
    if (!(this.data.status == 1 || this.data.items[index].peopleNum > 0)) {
      dd.alert({
        content: '名额已被抢完',
        buttonText: '确定'
      })
      return
    }

    dd.showLoading({content: '申请中...'})
    dd.httpRequest({
      url: app.globalData.domain + '/task/updateUserAndTaskStatus'+ `/${this.data.items[index].rtId}/${this.data.items[index].userState}`,
      method: 'GET',
      dataType: 'json',
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}
        console.log('successChange----', res)
        dd.showToast({
          content: '申请成功',
          duration: 3000
        })
        this.listShow()
      },
      fail: (res) => {
        console.log('httpRequestFailChange----', res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});
      },
      complete: () => {
        dd.hideLoading()
      }
    })
  },
  commit(e) {
    var index = e.target.dataset.index
    var title = this.data.items[index].title
    var content = this.data.items[index].content
    var points = this.data.items[index].taskIntegral
    var id = this.data.items[index].rtId
    var typeId = this.data.items[index].taskTypeId
    var url = `./commit/index?title=${title}&content=${content}&points=${points}&id=${id}&typeId=${typeId}`

    dd.navigateTo({
      url: url
    })
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