var app = getApp()

Page({
  data: {
    search: '',
    status: 0,
    active: false,

    tabs: [{
      title: '待审批'
    },
    {
      title: '已审批'
    }],
    articles: [],
    hasNextPage:true,
    pageSize:7,
    dataArray: [],
    noData:false
  },
  onShow() {
    this.loadInitData()
    this.getSystemInfoPage()
  },
  onPullDownRefresh(){
    this.loadInitData()
  },
  loadInitData() {
    dd.showLoading({content: '加载中...'});

    var currentPage = 0; 
    console.log("load page 第" + (currentPage + 1) +"页");

     // 刷新时，清空dataArray，防止新数据与原数据冲突
    this.setData({
      dataArray: [],
      hasNextPage:true
    });
    dd.httpRequest({
      url: app.globalData.domain + '/approversPel/selectApproversList',
      method: 'POST',
      dataType: 'json',
      data: {
        pageSize: this.data.pageSize,
        pageNum: currentPage + 1,
        status: this.data.status, // tab栏审批未审批
        search: this.data.search
      },
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

        console.log('successWait----', res)
        res.data.data.list.forEach((item) => {
          item.sqTime = this.format(item.sqTime, 'yyyy-MM-dd hh:mm:ss')
        })
        var articles =  res.data.data.list; // 接口中的data对应了一个数组，这里取名为 articles
        var totalDataCount = articles.length;

        console.log("totalDataCount:"+totalDataCount);
        if(totalDataCount > 0){
            this.setData({
              ["dataArray["+currentPage+"]"]: articles, //第一页数据放到dataArray[0]中
              currentPage: currentPage,
              totalDataCount: totalDataCount,
              articles: articles
            })
          
            //是否有下一页数据
            var hasNextPage = res.data.data.hasNextPage;
            if(!hasNextPage){
              this.setData({
                hasNextPage: hasNextPage
              })
            }
        }else{
          this.setData({
            noData:true,
            hasNextPage: true
          })
        }
      },
      fail: (res) => {
        console.log('httpRequestFailWait----', res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});

      },
      complete: () => {
        dd.hideLoading();
        dd.stopPullDownRefresh();
      }
    })
  },
  loadMoreData() {
    dd.showLoading({content: '加载中...'})

    var currentPage = this.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    console.log("load page 第" + (currentPage + 1) +"页");

    dd.httpRequest({
      url: app.globalData.domain + '/approversPel/selectApproversList',
      method: 'POST',
      dataType: 'json',
      data: {
        pageSize: this.data.pageSize,
        pageNum: currentPage + 1,
        status: this.data.status, // tab栏审批未审批
        search: this.data.search
      },
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}
        console.log('successSelectApproversList----', res)
        res.data.data.list.forEach((item) => {
          item.sqTime = this.format(item.sqTime, 'yyyy-MM-dd hh:mm:ss')
        })

        var articles = res.data.data.list; // 接口中的data对应了一个数组，这里取名为 articles
        // 计算当前共加载了多少条数据，来证明这种方式可以加载更多数据
        var totalDataCount = this.data.totalDataCount;
        totalDataCount = totalDataCount + articles.length;
        console.log("totalDataCount:" + totalDataCount);
        
        // 直接将新一页的数据添加到数组里
        if(articles.length > 0){
          this.setData({
            ["dataArray[" + currentPage + "]"]: articles,
            currentPage: currentPage,
            totalDataCount: totalDataCount,
            articles: articles,
            noData:false
          })
        }

        //是否有下一页数据
        var hasNextPage = res.data.data.hasNextPage;
        
        if(!hasNextPage){
          console.log("有没有下一页=====",hasNextPage)
          dd.showToast({
            content:"无更多数据",
            type: 'none',
            duration: 2500
          });
          
          this.setData({
            hasNextPage: hasNextPage
          })
        }

      },
      fail: (res) => {
        console.log('httpRequestFailController----', res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});
      },
      complete: () => {
        dd.hideLoading()
      }
    })
  },
  getSystemInfoPage() {
    dd.getSystemInfo({
      success: (res) => {
        this.setData({
          winH: res.windowHeight-80
        });
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
    this.loadInitData()
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
    this.loadInitData()
    dd.hideKeyboard()
  },

  onItemClick({ index }) {
    var approvalId = this.data.articles[index].approvalId
    var status = this.data.articles[index].status
    dd.navigateTo({ url: `./details/index?approvalId=${approvalId}&status=${status}` })
  },

  handleTabClick({ index }) {
    switch (index) {
      case 0:
        this.setData({
          status: 0
        });
        this.loadInitData();
        break;
      case 1:
        this.setData({
          status: 1
        });
        this.loadInitData();
        break;
    }
  },
  handleTabChange({ index }) {

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