/**
 * Created by jinn on 2015/6/12.
 */
define(function (require, exports, module) {
    //var  $ = require("common/jquery");

    var uri = module.uri;



    var map1,map2,map3,map4;


    var createMap  = function (container,obj) {
        obj = new SuperMap.Map(container,{
            controls:[
                new SuperMap.Control.MousePosition(),
                new SuperMap.Control.LayerSwitcher(),
                new SuperMap.Control.ScaleLine(),
                new SuperMap.Control.Navigation({
                    dragPanOptions: {
                        enableKinetic: true
                    }
                })
            ]
            //设置地图的投影方式
            ,projection:""
            //设置MousePosition控件的鼠标位置的需要进行的投影方式
            ,displayProjection:""
        });
    };

    var initMaps = function () {
        createMap("map-container1",map1);
        createMap("map-container2",map2);
        createMap("map-container3",map3);
        createMap("map-container4",map4);
    };

    $(function () {
        initMaps();
    });

});
