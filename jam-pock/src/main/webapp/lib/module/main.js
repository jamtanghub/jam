/**
 * Created by jinn on 2015/7/23.
 */
define(function (require, exports, module) {
    var Map = require("map/map");



    var init = function () {
    };

    var resize = function () {
        var maxH = $("body").height() - $("header").height()-1;
        $("#map-container").css("max-height",maxH);
    };


    $(function () {
        $(window).resize(function () {
            //resize();
        }).resize();

        Map.initMap();
    });

    return{
        init:init
    }

});