/**
 * Created by jinn on 2015/6/14.
 */
define(function (require, exports, module) {

    var c = 0;

    var a = function () {
        console.log("我是模块sec");
    }

    var plus = function () {
        return ++c;
    }

    return {
        a: a,
        plus: plus
    }
});
