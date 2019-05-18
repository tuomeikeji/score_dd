
var app = getApp()

Page({
   data: {
      awardsConfig: {
        chance: true, //是否有抽奖机会
        lists: [], //奖品列表 
      },
      awardsList: {},
      animationData: {},
      btnDisabled: '',
      thanksarr: [], //存储谢谢参与的索引
      chishu: 0,
      mold: 1,
      r_flg: 0,
      myPrizelist:[],
      initCanvas : {
          code: 200,
          msg: "获取成功",
          data: {
              lists: [
                  {
                      id: 1,
                      mold: 1,        //1 积分转盘抽奖     2现金转盘抽奖
                      type: 1,        //1积分  2经验   3现金
                      name: "积分1点",       // 名称
                      amount: "1.00",        //数额
                      scale: "0.60",        //中奖比例
                      createtime: 1553651400
                  },
            {
                      id: 1,
                      mold: 1,        //1 积分转盘抽奖     2现金转盘抽奖
                      type: 1,        //1积分  2经验   3现金
                      name: "积分1点",       // 名称
                      amount: "1.00",        //数额
                      scale: "0.60",        //中奖比例
                      createtime: 1553651400
                  },
              ],
              luckdraw: 10   //用户剩余抽奖次数
          },
      },
   },
  onShow(e) {
   // 获取奖品列表
			this.initdata(this)
  },
  initdata(that){
				//let initCanvasJson = this.initCanvas;
				that.data.awardsConfig.lists = this.data.initCanvas.data.lists;
				that.data.chishu = this.data.initCanvas.luckdraw;
				// 获取奖品的个数
				let awarrlength = that.data.awardsConfig.lists.length
				// push 谢谢参与奖项
				for (var i = 0; i <= 3 * 2; i++) {
					if (i % 3 == 0) {
						that.data.thanksarr.push(i)
						that.data.awardsConfig.lists.splice(i, 0, {
							name: '谢谢参与',
							type: 0
						});
					}
				}
				// 为每一项追加index属性
				that.data.awardsConfig.lists.forEach(function(element, index) {
					element.index = index
				})
			
				// 画转盘
				that.drawAwardRoundel();
			},
      //画抽奖圆盘  
			drawAwardRoundel () {
				// 拿到奖品列表
				var awards = this.data.awardsConfig.lists;
				var awardsList = [];
				// 每份奖品所占角度
				var turnNum = 1 / awards.length * 360; // 文字旋转 turn 值  
				// 奖项列表  
				for (var i = 0; i < awards.length; i++) {
					awardsList.push({
						turn: i * turnNum + 'deg', //每个奖品块旋转的角度
						lineTurn: i * turnNum + turnNum / 2 + 'deg', //奖品分割线的旋转角度
						award: awards[i].name, //奖品的名字,
						type: awards[i].type,
						id:awards[i].type,
					});
				}
				this.data.btnDisabled = this.data.chishu ? '' : 'disabled';
				this.data.awardsList = awardsList;
			},

})