// createMapContext.js
Page({

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('myMap')
    console.log(this)
  },

  bt_getCenterLocation: function () {
    console.log(this)
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },

  regionchange : function (res) {
    console.log("reginchage begin")
    console.log(this)
    var that = this;
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log("reginchage OK") 
        var y = res.longitude;
        var x = res.latitude;
        console.log(res.longitude)
        console.log(res.latitude)
        that.setData({
          locationLongitude: y,
          locationLatitude: x
        })
      },
      fail:function(res){
        console.log("reginchage fail") 
        console.log(res) 
      }
    })
    // this.mapCtx.moveToLocation()
    // console.log("movetolocation OK") 
  }

})