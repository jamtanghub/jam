/**
 * Created by jinn on 2015/6/14.
 */
define(function (require, exports, module) {

    var Sec = require("sea/sec");
    var sec = require("sea/sec");

    var Third = require("sea/third");


    (function () {
        if(Worker){
            var w = new Worker("");
            console.log("可以用web worker");
        }else{
            console.log("不支持web worker");
        }
    })();




});
