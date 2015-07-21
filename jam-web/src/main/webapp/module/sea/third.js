/**
 * Created by jinn on 2015/6/14.
 */
define(function (require, exports, module) {
    var sec = require("sea/sec");
    //
    var c = sec.plus();

    var a = function () {
        console.log("我是模块third");
    }

    var getC = function () {
        return c;
    }

    return{
        a:a,
        getC:getC
    }
});
