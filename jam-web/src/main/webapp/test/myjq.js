/**
 * Created by jinn on 2015/6/5.
 */


//函数与立即执行
(function (arg) {
    console.log( "1:" +  typeof arg);
})(window);


//函数立即执行
(function (arg) {

    console.log( "2:" + typeof arg);

}(window));


