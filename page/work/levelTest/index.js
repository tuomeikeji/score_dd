var app = getApp()

Page({
  data: {
    items: [],
    checkedIds: [], // 已考核过的大题id集合
  },
  onShow() {
    dd.showLoading({content: '加载中...'})
    dd.httpRequest({
      url: app.globalData.domain + '/AssessmentState/AssessmentStateController', //已考核过的题目id集合
      method: 'POST',
      dataType: 'json',
      data: {
            pageNum: 1,
            pageSize: 100
      },
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}
        console.log('已考核过的题目----', res)
        var checkedList = res.data.data.list
        var checkedIdArr = []
        for(var i in checkedList){
            checkedIdArr.push(checkedList[i].levelId)
            this.setData({
              checkedIds: checkedIdArr
            })
        }
        console.log('000----', this.data.checkedIds)
      },
      fail: (res) => {
        console.log("httpRequestFailMenuId----", res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});
      },
      complete: () => {
        dd.httpRequest({
          url: app.globalData.domain + '/Levelass/LevelAssController', //正常列表
          method: 'POST',
          dataType: 'json',
          data: {
            pageNum: 1,
            pageSize: 100
          },
          success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}
            console.log('所有题目列表----', res)
            console.log('111----', this.data.checkedIds)
            var items = res.data.data.list
            items.forEach((item) => {
              if (this.data.checkedIds.some((toItem) => toItem == item.levelId)) {
                item.checked = true
                item.testStatus = "1"
              } else {
                item.checked = false
                item.testStatus = "0"
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

  onItemClick({ index }) {
    console.log('list点击', index)

    var testStatus = this.data.items[index].testStatus //是否考核过
    var shenQingFangShi = this.data.items[index].shenQingFangShi //申请方式
    var assName = this.data.items[index].assName //题目
    var levelId = this.data.items[index].levelId //題id
  
    var url = `./levelTestDetail/index?levelId=${levelId}&assName=${assName}&shenQingFangShi=${shenQingFangShi}&testStatus=${testStatus}`

    dd.navigateTo({
      url: url
    })
  }
}) 