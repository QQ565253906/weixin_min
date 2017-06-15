//  /** 
//      * 转化为弧度(rad) 
//      * */ 
var EARTH_RADIUS = 6378137;
function rad(d) {
  return d * Math.PI / 180.0;
}
// /** 
//  * 基于googleMap中的算法得到两经纬度之间的距离,计算精度与谷歌地图的距离精度差不多，相差范围在0.2米以下 
//  * @param lon1 第一点的精度 
//  * @param lat1 第一点的纬度 
//  * @param lon2 第二点的精度 
//  * @param lat3 第二点的纬度 
//  * @return 返回的距离，单位km 
//  * */  
function GetDistance(lon1, lat1, lon2, lat2) {
  var radLat1 = rad(lat1);
  var radLat2 = rad(lat2);
  var a = radLat1 - radLat2;
  var b = rad(lon1) - rad(lon2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * EARTH_RADIUS;
  //s = Math.round(s * 10000) / 10000;  
  return s;
}

function getSum(total, num) {
  return total + num;
}
module.exports = {
  GetDistance: GetDistance,
  getSum: getSum
}
