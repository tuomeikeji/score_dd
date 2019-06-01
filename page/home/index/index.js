let app = getApp()

Page({
  data: {
    items: [],
    data: {},
    first: {},

    articles: [],
    hasNextPage:true,
    hasInitData:true,
    pageSize:10,
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

    // this.listShow()
    this.loadInitData()
  },
  
  loadInitData() {
   //初次加载，刷新，查询
    dd.showLoading({content: '加载中...'});

    var currentPage = 0; 
    console.log("load page 第" + (currentPage + 1) +"页");

    dd.httpRequest({
      url: app.globalData.domain + '/home/list',
      method: 'POST',
      // headers: { 'Content-Type': 'application/json' },
      dataType: 'json',
      data: {
        pageSize: this.data.pageSize,
        pageNum: currentPage + 1,
        userId: ''
      },
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}

        console.log('successHomeList----', res)
        var articles =  res.data.data.list; // 接口中的data对应了一个数组，这里取名为 articles
        var totalDataCount = articles.length;

        console.log("totalDataCount:"+totalDataCount);

        //是否有下一页数据
        var hasNextPage = res.data.data.hasNextPage;
        console.log("是否有下一页:"+hasNextPage);

        if(totalDataCount > 0){
            this.setData({
              articles: articles, 
              currentPage: currentPage,
              totalDataCount: totalDataCount,
              hasNextPage: hasNextPage,
              hasInitData:true
            })
        }else{
          this.setData({
              hasNextPage: true,
              hasInitData:false
          })
        }
        // this.setData({
        //   items: res.data.data.list
        // })
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
  loadMoreData() {
    // dd.showLoading({content: '加载中...'})

    var currentPage = this.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    console.log("load page 第" + (currentPage + 1) +"页");

    dd.httpRequest({
      url: app.globalData.domain + '/home/list',
      method: 'POST',
      dataType: 'json',
      data: {
        pageSize: this.data.pageSize,
        pageNum: currentPage + 1,
        userId: ''
      },
      success: (res) => {if ((res.data.code != 0 && !res.data.code ) || res.data.code == 1001) { dd.showToast({ content: res.msg, duration: 3000 }); dd.reLaunch({ url: '/page/register/index/index' }); return}
        console.log('successSelectApproversList----', res)
        // res.data.data.list.forEach((item) => {
        //   item.sqTime = this.format(item.sqTime, 'yyyy-MM-dd hh:mm:ss')
        // })
      
        // 将新一页的数据添加到原数据后面
        var articles = res.data.data.list; // 接口中的data对应了一个数组，这里取名为 articles
        var originArticles = this.data.articles;
        var newArticles = originArticles.concat(articles); // 直接将新一页的数据添加到数组里

        // 计算当前共加载了多少条数据，来证明这种方式可以加载更多数据
        var totalDataCount = this.data.totalDataCount;
        totalDataCount = totalDataCount + articles.length;
        console.log("totalDataCount:" + totalDataCount);

        //是否有下一页数据
        var hasNextPage = res.data.data.hasNextPage;
        console.log("有没有下一页=====",hasNextPage)
        
        if(articles.length > 0){
          this.setData({
            articles: newArticles,
            currentPage: currentPage,
            totalDataCount: totalDataCount
          })
        }else{
          dd.showToast({
            content:"无更多数据",
            type: 'none',
            duration: 2500
          });
        }
        this.setData({
          hasNextPage: hasNextPage
        })

      },
      fail: (res) => {
        console.log('httpRequestFailController----', res)
        var content = JSON.stringify(res); switch (res.error) {case 13: content = '连接超时'; break; case 12: content = '网络出错'; break; case 19: content = '访问拒绝'; } dd.alert({content: content, buttonText: '确定'});
      },
      complete: () => {
        // dd.hideLoading()
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

    var approvalId = this.data.articles[index].approvalId
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
