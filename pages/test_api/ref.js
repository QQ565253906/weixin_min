function sum(tot, num) {
  var sum=tot+num;
  Number(sum.toFixed(2));
  return sum;
}
function parse(arr, ave) {
  var parse_p = [];
  // console.log("arr:"+arr+" ave:"+ave);
  for (var i = 0; i < arr.length; i++) {
    if (10 * ave >= arr[i] >= 0.1 * ave) {
      parse_p.push(arr[i]);
    }
    else {
      console.log("err point:" + arr[i]);
    }
  }
  // console.log(parse_p);
  return parse_p;
}

function refine(p1) {
  var ave;
  var p2=[];
  var p3=[];
  for (var j = 0; j < p1.length; j++) {
    // console.log("p1:"+p1);
    if (p1.length == 1)
      p2 = p1;
    else
      p2 = p1.slice(-5, -1);
    // console.log("p2:" + p2);
    ave = p2.reduce(sum) / p2.length;
    // console.log("ave:" + ave);
    // p3 = parse(p1, ave);
    // console.log("p1:" + p1);
    if(p1[p1.length-1]> 5*ave) {
      console.log("err_p:"+ p1[p1.length - 1]+" ave:"+ave);
      // console.log("p1 B4 pop:"+p1.length)
      p1.pop(); 
      // getApp().setData({
      //   ave_p:ave
      // })     
      // console.log("p1 Af pop:" + p1.length)
    }
    else {
      getApp().data.ave_p = ave;
    }
  }
  p3 = p1;
  // console.log("p3.len:" + p3.length + " p3.sum:" + Number(p3.reduce(sum).toFixed(4)) + " ave:" + ave);
  // console.log("p3:\t"+p3)
  return p3;
}

// var p1 = [1, 1, 1, 1, 1];
// refine(p1);
module.exports = {
  refine: refine,
  sum: sum
}
