/**
 * Created by Augustine on 2015/4/25.
 */

(function () {

    /**
     * 数字Number 部分
     *
     */

    /**
     * 定义Number的double属性       defineProperty方法
     */
    Number.prototype =  Object.defineProperty(Number.prototype,"double",{
          get: function () {
              return (this+this);
          }
    });
    /**
     * 定义Number的square属性
     *
     */
    Number.prototype =  Object.defineProperty(Number.prototype,"square",{
        get: function () {
            return (this*this);
        }
    });

    /**
     * 数字格式化显示
     * @returns {string}
     * 原数字123456789  运算后结果：123,456,789
     */
    Number.prototype.format = function () {
        var num = this.valueOf() + "";
        var numStr = "";
        var _len = num.length;
        var flag = 0;
        for(var i = _len-1;i>=0;i--){
            var tempStr = num[i] + "";
            numStr =  tempStr + numStr;
            if(i!=0 && (flag+1)%3 === 0){
               numStr = "," + numStr;
            }
            flag ++;
        }
        return numStr;
    };


    /**
     * 数组Array 部分
     */

    /**
     * 数组去重
     * 利用的JavaScrip的Oject特性
     */
    Array.prototype.unique = function () {
        var arr = this;
        var obj = {};
        for(var i = 0,len = arr.length;i<len;i++){
            var e = arr[i];
            obj.e = e;
        }

        arr.length = 0;
        for(var o in obj){
           arr.push(o);
        }

        return arr;
    };


    /**
     * 遍历数组元素 兼容多维数组
     * @param handler对每个元素的处理的方法
     */
    Array.prototype.each = function (handler) {

    }
    

})();
