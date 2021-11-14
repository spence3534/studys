// TypeScript的函数
// age是形参 形参就是形式上的参数
// function searchXiaoJieJie(age:number):string {
//   return "找到了"+ age+ "岁的小姐姐"
// }
// var age:number = 18;
// var result:string = searchXiaoJieJie(age); // 这里的函数参数就是实参 实参就是真实的参数
// console.log(result); // 找到了18岁的小姐姐
/**
  TypeScript中的函数参数

    有可选参数的函数
    可选参数，就是我们定义形参的时候，可以定义一个可传可不传的参数。这种参数，在定义函数的时
    候通过 ? 标注。请看下面的例子

    function searchXiaoJieJie(age:number, stature ? :string):string {
      let yy:string = "";
      yy = "找到了" + age + "岁"
      if (stature != undefined) {
        yy = yy + stature
      }
      return yy + "的小姐姐"
    }
    var result:string = searchXiaoJieJie(22, "大长腿");
    console.log(result); // 找到了22岁大长腿的小姐姐

  有默认参数的函数
  有默认参数就更好理解了，就是我们不传递的时候，它会给我们一个默认值，而不是undefined了。我
  们改造上边的函数，也是两个参数。

    function searchXiaoJieJie(age:number = 18, stature:string = "大胸"):string {
      let yy:string = ""
      yy = "找到了" + age + "岁"
      if (stature != undefined) {
        yy = yy + stature
      }
      return yy + "的小姐姐";
    }

    var result:string = searchXiaoJieJie();
    console.log(result); // 找到了18岁大胸的小姐姐

  有剩余参数的函数
  在给函数传递参数的个数不确定的时候，就可以通过剩余参数进行传递。说白了就是剩余参数就是形参
  是一个数组，传递几个实参过来都可以直接存在形参的数组中。
*/
function searchXiaoJieJie() {
  var xuqiu = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    xuqiu[_i] = arguments[_i];
  }
  var yy = "找到了";
  for (var i = 0; i < xuqiu.length; i++) {
    yy = yy + xuqiu[i];
    if (i < xuqiu.length) {
      yy = yy + "、";
    }
  }
  yy = yy + "的小姐姐";
  return yy;
}
var result = searchXiaoJieJie("22岁", "大长腿", "瓜子脸", "水蛇腰");
console.log(result);