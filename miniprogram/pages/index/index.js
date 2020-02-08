//index.js
const app = getApp()
const fillColor = "#FF0000AA"
const strokeWidth = 5

Page({
  data: {
    longitude: 113.324661,
    latitude: 23.151093,
    scale: 12,
    circles: [],
    polylines: [],
    polygons: []
  },

  onLoad: function() {
    // 获取数据
    var that = this
    wx.cloud.callFunction({
      name: "getData",
      success: res => {
        if (res.result.length > 0){
          var data = JSON.parse(res.result)
          that.initData(data)
        }
      },
      fail: err => {
        wx.showToast({
          title: "网络请求失败",
          icon: "none"
        })
        console.log("接口调用失败", err)
      }
    })  
    // 定位
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          scale: 14
        })
      }
    })
  },

  initData: function(data){
    var circles = []
    var polylines = []
    var polygons = []
    data.forEach(city => {
      city.pois.forEach(poi => {
        var geometry = poi.geometry
        switch (geometry.type){
          case "Point":
            circles.push({
              longitude: geometry.coordinates[0],
              latitude: geometry.coordinates[1],
              color: fillColor,
              fillColor: fillColor,
              radius: 20,
              strokeWidth: strokeWidth
            })
          break
          case "LineString":
            var polyline = {
              points: [],
              color: fillColor,
              width: strokeWidth
            }
            geometry.coordinates.forEach(coordinate => {
              polyline.points.push({
                longitude: coordinate[0],
                latitude: coordinate[1]
              })
            })
            polylines.push(polyline)
          break
          case "Polygon":
            geometry.coordinates.forEach(coordinate => {
              var polygon = {
                points: [],
                strokeWidth: strokeWidth,
                strokeColor: fillColor,
                fillColor: fillColor
              }
              coordinate.forEach(latlng => {
                polygon.points.push({
                  longitude: latlng[0],
                  latitude: latlng[1]
                })
              })
              polygons.push(polygon)
            })
          break
        }
      })
    })
    this.setData({
      circles: circles,
      polylines: polylines,
      polygons: polygons
    })
  }
})
