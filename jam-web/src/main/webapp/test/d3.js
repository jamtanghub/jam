/**
 * Created by jinn on 2015/9/29.
 */

var init = function () {
    var dataset = [5,10,34,59,2100,45];
   d3.select("body").selectAll("p").data(dataset)
       .enter()
       .append("p")
       .text(function (d, i) {
           return "第" + i + "个数据是：" + d;
       });
};


init();