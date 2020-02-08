// 云函数入口文件
const cloud = require('wx-server-sdk')
const request= require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var result = await request.get(encodeURI('https://oss.mapmiao.com/others/ncov/data.json'))
  return result
}