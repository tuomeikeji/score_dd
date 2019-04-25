var app = getApp()

Component({
  props: {
    options: {},
    steps: true
  },
  data: {
    data: {},
    status: 0,
    passStatus: 0, // 传递状态

    items: [],
    activeIndex: 1,
    failIndex: 0,

    failString: '', // 拒绝理由
    appReason: '', // 申诉理由

    fail: false, // 拒绝理由弹出标识
    reasons: [] // 拒绝理由数组
  },

  didMount() {
    if (this.props.options.status) {
      this.setData({
        status: this.props.options.status
      })
    }

    dd.httpRequest({
      url: app.globalData.domain + '/complaint/groundsRefusal', // 请求拒绝理由数组
      method: 'GET',
      // headers: { 'Content-Type': 'application/json' },
      dataType: 'json',
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

        console.log('successReason----', res)
        this.setData({
          reasons: res.data.data
        })
      },
      fail: (res) => {
        console.log('httpRequestFailReason----', res)
        
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

      },
      complete: () => {
      }
    })

    this.listShow()
  },

  didUpdate() {
    
  },

  methods:{
    listShow() {
      dd.showLoading({ content: '加载中...' })
      var approvalId = this.props.options.approvalId

      dd.httpRequest({
        url: app.globalData.domain + '/approversPel/selectApproversDetail/' + approvalId,
        method: 'GET',
        // headers: { 'Content-Type': 'application/json' },
        dataType: 'json',
        success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

          console.log('successWaitDetail----', res)
          var items = []
          if (res.data.data.integralTypeId == 4) {
            items.push({
              title: `${res.data.data.appName}  管理奖扣`,
              description: `${res.data.data.appDept}  ${res.data.data.sqTime}`
            })
          } else if (res.data.data.integralTypeId == 6) {
            items.push({
              title: `${res.data.data.appName}  点赞`,
              description: `${res.data.data.appDept}  ${res.data.data.sqTime}`
            })
          }
          else {
            items.push({
              title: `${res.data.data.userName}  提交审批`,
              description: `${res.data.data.userDept}  ${res.data.data.sqTime}`
            })

            if (res.data.data.status == 1) {
              items.push({
                title: `${res.data.data.appName}  审批通过`,
                description: `${res.data.data.appDept}  ${res.data.data.spTime}`
              })

              this.setData({
                activeIndex: 2
              })
            } else if (res.data.data.status == 0) {
              items.push({
                title: `${res.data.data.appName}  审批中`,
                description: `${res.data.data.appDept}`
              })
            } else if (res.data.data.status == 2) {
              items.push({
                title: `${res.data.data.appName}  审批不过`,
                description: `${res.data.data.appDept}  ${res.data.data.spTime}`
              })

              this.setData({
                failIndex: 2
              })
            }
          }
          this.setData({
            data: res.data.data,
            items: items,
           // appReason : res.data.data.appReason
          })
          this.setData({
            appReason: res.data.data.appReason
            
          })
        },
        fail: (res) => {
          console.log("httpRequestFailWaitDetail----", res)
          var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});
        },
        complete: () => {
          dd.hideLoading()
        }
      })
    },

    todo(status) {
      var approvalId = this.props.options.approvalId
      var status = this.data.passStatus
      var failString = encodeURI(encodeURI(this.data.failString))
      var appReason = encodeURI(encodeURI(this.data.appReason))
      // var appReason = this.data.appReason
      var url = app.globalData.domain + '/approversPel/approversYesNo/' + approvalId + '/' + status + '?disapproveUndo=' + failString + '&appReason=' + appReason
      dd.showLoading({
        content: '审批中...'
      })
      dd.httpRequest({
        url: url,
        method: 'GET',
        // headers: { 'Content-Type': 'application/json' },
        dataType: 'json',
        success: (res) => {
          if (res.data && res.data.code == 1001) {
            dd.showToast({
              content: res.msg,
              duration: 3000
            });
            dd.reLaunch({
              url: '/page/register/index/index'
            })
          }
          console.log('successWaitDetailYes----', res)
          dd.showToast({
            content: '审批成功',
            duration: 3000
          })
          dd.navigateBack()
        },
        fail: (res) => {
          console.log("httpRequestFailWaitDetailYes----", res)
          var content = JSON.stringify(res);
          switch (res.error) {
            case 13:
              content = '连接超时';
              break;
            case 12:
              content = '网络出错';
              break;
            case 19:
              content = '访问拒绝';
          }
          dd.alert({
            content: content,
            buttonText: '确定'
          });
        },
        complete: () => {
          this.setData({fail: false})
          dd.hideLoading()
        }
      })
    },

    todoPass() {
      // dd.confirm({
      //   title: '提示',
      //   content: '确认通过审批吗？',
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   success: (result) => {
      //     if (result.confirm) {
      //       this.setData({ passStatus: 1 })
      //       this.todo()
      //     }
      //   }
      // })
      this.setData({ passStatus: 1 })
      this.todo()
    },
    todoStop() {
      var _this = this

      var items = []
      var reasons = this.data.reasons
      reasons.forEach((item) => {
        items.push(item.configName)
      })
      items.push('填写拒绝理由')

      dd.showActionSheet({
        title: '选择拒绝理由',
        items: items,
        cancelButtonText: '取消',
        success({ index }) {
          if (index < 0) {
            return
          } else if (index < _this.data.reasons.length) {
            _this.setData({ failString: items[index] })
            _this.setData({ passStatus: 2 })
            _this.todo()
          } else {
            _this.setData({ fail: true })
          }
        }
      })
    },
    failBack() {
      this.setData({ fail: false })
    },
    formSubmit(e) {
      console.log('formSubmit----', e.detail.value)
      this.setData({
        passStatus: 2,
        failString: e.detail.value.title
      })
      this.todo()
    },
    todoBack() {
      // this.setData({
      //   status: 3
      // })

      // this.todo()

      dd.navigateBack()
    },
    fromBack() {
      dd.confirm({
        title: '提示',
        content: '确认撤销吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        success: (result) => {
          if (result.confirm) {
            var approvalId = this.props.options.approvalId
            dd.showLoading({
              content: '提交中...'
            })
            dd.httpRequest({
              url: app.globalData.domain + '/userMenu/selectDelMenu/' + approvalId,
              method: 'GET',
              // headers: { 'Content-Type': 'application/json' },
              dataType: 'json',
              success: (res) => {
                if (res.data && res.data.code == 1001) {
                  dd.showToast({
                    content: res.msg,
                    duration: 3000
                  });
                  dd.reLaunch({
                    url: '/page/register/index/index'
                  })
                }
                console.log('successWaitDetailYes----', res)
                dd.showToast({
                  content: '提交成功',
                  duration: 3000
                })
                dd.navigateBack()
              },
              fail: (res) => {
                console.log("httpRequestFailWaitDetailYes----", res)
                var content = JSON.stringify(res);
                switch (res.error) {
                  case 13:
                    content = '连接超时';
                    break;
                  case 12:
                    content = '网络出错';
                    break;
                  case 19:
                    content = '访问拒绝';
                }
                dd.alert({
                  content: content,
                  buttonText: '确定'
                });
              },
              complete: () => {
                dd.hideLoading()
              }
            })
          }
        }
      })
    },

    preview(e) {
      console.log(e)
      dd.previewImage({
        current: e.target.dataset.index,
        urls: this.data.data.approvalImg
      })
    }
  }
})