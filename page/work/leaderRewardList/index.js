let app = getApp()

Page({
  data: {
    items: [],
    hasNextPage:true,
    pageSize:10,
    dataArray: [],
    scrollTop:0,
    // topIconShow:false,
    noData:false
  },
  onShow() {
    this.getSystemInfoPage()
    this.loadInitData()
  },
  onPullDownRefresh(){
    this.loadInitData()
  },
  // onReachBottom() {
  //   this.loadMoreData()
  // },
  loadInitData() {
    dd.showLoading({content: '加载中...'})

    var currentPage = 0; 
    console.log("load page 第" + (currentPage + 1) +"页");

     // 刷新时，清空dataArray，防止新数据与原数据冲突
    this.setData({
      dataArray: [],
      hasNextPage:true
    })

    dd.httpRequest({
      url: app.globalData.domain + '/Award/AwardController',
      method: 'POST',
      dataType: 'json',
      data: {
        pageSize: this.data.pageSize,
        pageNum: currentPage + 1
      },
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}
        console.log('successAwardController----', res)

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
            noData : true
          })
        }
        
      },
      fail: (res) => {
        console.log('httpRequestFailController----', res)
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
      url: app.globalData.domain + '/Award/AwardController',
      method: 'POST',
      dataType: 'json',
      data: {
        pageSize: this.data.pageSize,
        pageNum: currentPage + 1
      },
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}
        console.log('successAwardController----', res)
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
            articles: articles
          })
        }

        //是否有下一页数据
        var hasNextPage = res.data.data.hasNextPage;
        
        if(!hasNextPage){
          console.log("没有下一页=====",hasNextPage)
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
          winH: res.windowHeight
        });
      }
    })
  }
})
