// test_api.js
var com = require('./com.js')
var ref = require('./ref.js')
var dist_tot = 0
var dist_a = []
var dist_refine = []
var tP = []
var EtP = []
var start_t = 0
var during_t = 0
var during_m = 0
var during_s = 0
var tempPolyline = [{
  "points": tP,
  "color": "#ff0000",
  "width": 3,
  "dottedLine": true
}];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    polyline: tempPolyline,
    latitude: 31.820587,
    longitude: 117.227239,
    scale: 15,
    startPolyline: true,
    markers: [],
    status: "NA",
    munual_draw: 0,
    en_munual: "En munual",
    dist: "cal_dist",
    time: "cal_time",
    inc_points: tP,
    hgt: "65vh"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  maptap: function (res) {
    var that = this;
    console.log(that.data.startPolyline)
    if (that.data.startPolyline) {
      wx.chooseLocation({
        success: function (res) {
          that.createMarks(that, res.latitude, res.longitude, res.name);
          that.setData({
            markers: that.data.markers
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap2')
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
    console.log(this.mapCtx)
  },
  cal_time: function () {
    var t = new Date();
    console.log("t:" + t)
    if (start_t == 0) {
      start_t = t
    }
    else {
      console.log("t-start_t:" + (t - start_t)) //ms
    }
  },
  cal_dist: function () {
    var dis = com.GetDistance(117.1375, 31.8500, 117.1375, 31.8501) / 1000
    var dis_3 = Number(dis.toFixed(3))
    var dis_2 = Number(dis.toFixed(2))
    console.log("dis:" + dis + " dis_3f:" + dis_3 + " dis_2f:" + dis_2)

    this.setData({
      dist: dis_3 + "Km"
    })
  },
  en_munual: function () {
    if (this.data.munual_draw) {
      this.setData({
        munual_draw: 0,
        en_munual: "Disabled"
      })
    }
    else {
      this.setData({
        munual_draw: 1,
        en_munual: "Enabled"
      })
    }
  },
  clear_points: function () {
    console.log("Begin clear: tP.length=" + tP.length)
    tP = [];
    dist_tot = 0;
    start_t = new Date();
    during_t = 0;
    dist_a =[];
    dist_refine = [];
    EtP = [];
    getApp().data.ave_p = 0.0001;
    console.log("After clear: tP.length=" + tP.length)
    tempPolyline = [{
      "points": tP,
      "color": "#ff0000",
      "width": 3,
      "dottedLine": true
    }];
    this.setData({
      polyline: tempPolyline,
      dist: dist_tot + "Km",
      time: during_t + "s",
      hgt: "65vh"

    })
  },

  start_getLocation: function (res) {
    var that = this;
    if (that.time_fun2) {
      console.log("stop_getlocation..." + "fun:" + that.time_fun2)
      clearInterval(that.time_fun2);
      that.time_fun2 = null
      console.log("fun:" + that.time_fun2)
      that.setData({
        status: "stoped"
      })
    }
    else {
      that.setData({
        status: "started...",
        hgt: "65vh"
      });
      start_t = new Date();
      // console.log("start_t:" + start_t)

      that.time_fun2 = setInterval(function () {
        var t = new Date();
        during_t = (t - start_t) / 1000; //s
        during_m = Math.floor(during_t / 60); //min
        during_s = Math.round(during_t % 60); //remain s
        // console.log("0--during_m:" + during_m+" during_s:" + during_s);
        // during_t = Number(during_t.toFixed(1))
        // during_m = Number(during_m.toFixed(1))
        // console.log("1--during_m:" + during_m + " during_s:" + during_s);
        // console.log("start_getlocation......" + "fun:" + that.time_fun2)

        wx.getLocation({
          type: 'gcj02',
          // type: 'wgs84',
          success: function (res) {
            // console.log("getLocation:" + res.latitude + " " + res.longitude + " tP.length:" + tP.length)
            if (tP.length) {
              if (that.data.munual_draw) {
                tP.push({
                  latitude: tP[tP.length - 1].latitude + 0.0001,
                  longitude: tP[tP.length - 1].longitude + 0.0001
                });
              }
              else {
                tP.push({
                  latitude: res.latitude,
                  longitude: res.longitude
                });
              }
            }
            else {
              tP.push({
                latitude: res.latitude,
                longitude: res.longitude
              })
            }
            if (tP.length >= 2) {
              var cur_dis = com.GetDistance(tP[tP.length - 2].longitude, tP[tP.length - 2].latitude, tP[tP.length - 1].longitude, tP[tP.length - 1].latitude) / 1000
              cur_dis = Number(cur_dis.toFixed(4))
              if (cur_dis > 0.5*getApp().data.ave_p){dist_a.push(cur_dis);}
              if (dist_a.length > 0) { 
                var B4_ref = dist_a.length
                dist_refine = ref.refine(dist_a)
                if(B4_ref > dist_refine.length)
                {
                  
                  var eP = tP.pop();
                  // console.log("eP:"+eP)
                  EtP.push(eP);
                }  
                else {
                  // console.log(dist_a.length+"<="+dist_refine.length)
                }   
                dist_a = dist_refine;
                dist_tot = dist_refine.reduce(ref.sum)
              }
              // dist_tot += cur_dis
              dist_tot = Number(dist_tot.toFixed(4))
            }
            // console.log("tP[" + (tP.length - 1) + "]:" + tP[tP.length - 1].latitude + " " + tP[tP.length - 1].longitude)
            tempPolyline = [{
              "points": tP,
              "color": "#ff0000",
              "width": 3,
              "dottedLine": true
            }];
            that.setData({
              polyline: tempPolyline,
              //lin20170606:mark for this map is shakeing when moving
              // latitude: res.latitude,
              // longitude: res.longitude,
              dist: dist_tot + "Km",
              // time: during_t + "s",
              time: during_m + "m " + during_s + "s",
              // inc_points: tP
            })
            if (tP.length % 6 == 0) {
              console.log("tP.len:" + tP.length + " EtP.len:" + EtP.length + " ave_p:" + getApp().data.ave_p)
              that.setData({
                inc_points: tP
              })
            }
          },
          fail: function (res) {
            console.log("fail:" + res)
          }
        })
      }, 1000)

    }
  },
  start_setLocation: function (res) {
    console.log("0 :")
    console.log(this)
    //this.data.polyline[0].points.push({
    tP.push({
      latitude: 31.850077,
      longitude: 117.137503
    });
    this.setData({
      polyline: tempPolyline
    })
    this.setData({
      startPolyline: true
    })
    console.log("1 ")
    console.log(this)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})