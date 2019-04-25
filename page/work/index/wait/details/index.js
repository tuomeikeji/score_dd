Page({
  data: {
    options: {}
  },

  onLoad(options) {
    console.log(options)

    this.setData({
      options: options
    })
  },
})