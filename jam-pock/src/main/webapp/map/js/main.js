/*global $:false, OpenLayers:false,SuperMap:false, console:false */
(function () {
    "use strict";
    var map = null;
    var usingCluster = true;
    var gsize = 0;
    var linesName = "lines-layer";
    var initViewBounds = new OpenLayers.Bounds(73, 4, 135, 54);
    //var clusterQueryUrl = "services/cluster";
    //var dynTilesUrl = "services/dyntiles/tile";
    //var dynThemesUrl = "services/dyntiles/theme";
    var clusterQueryUrl = "service/pock/cluster";
    var dynTilesUrl = "service/pock/tile/img";
    var dynThemesUrl = "service/pock/theme/img";


    var layerName = "";
    var ThemeType = {
        RANGE: "RANGE",
        POCKING: "POCKING"
    };

    $(function () {
        $(window).resize(function () {
            var mapHeight = $(document).height() - 60;
            $("#map-wrapper").height(mapHeight);
        }).resize();
        // 初始化地图
        //initMap();
        initTianDiTu();
        gsize = parseInt($(".gridsize").eq(0).attr("gsize"));
        layerName = $("#layerList").find("a").eq(0).attr("layername");
        // 查询并叠加麻点图
        $("#query").click(addThemeLayer);
        // 查询框响应回车
        $("#keyword").keydown(function (evt) {
            var code = evt.which || evt.keyCode;
            if (code === 13) {
                $("#query").click();
            }
        });
        $("#layerList").find("a").click(function () {
            var text = $(this).text();
            $("#layerName").text(text);
            layerName = $(this).attr("layername");
            $("#keyword").val($(this).attr("defKeyWord"));
        });
        $("#themeList").find("a").click(function () {
            var oType = $("#themeType");
            var type = oType.attr("type");
            oType.text($(this).text())
                .attr("type", $(this).attr("type"));
            if (type !== oType.attr("type")) {
                addThemeLayer();
            }
        });
        $('#clusterSwitch').on('switch-change', function (e, data) {
            usingCluster = data.value;
            addThemeLayer();
        });
        $("#grid-switch").click(switchGrid);
        $("#configList").find(".gridsize").click(changeGridSize);
    });

    function addThemeLayer() {
        var type = $("#themeType").attr("type").toUpperCase();
        switch (type) {
            case ThemeType.RANGE:
                getThemeRange();
                break;
            case ThemeType.POCKING:
                getDynTiles();
                break;
            default:
                break;

        }
    }

    function getDynTiles() {
        var key = $.trim($("#keyword").val());
        var queryConfig = {
            layers: layerName,
            keyword: key,
            filter: "", // "name like '" + key + "'"
            count: 10,			// 每个瓦片上的最大返回数据量，默认值 50
//getjson:false		// 是否返回矢量json数据，默认为true
            cluster: usingCluster,// 设置为false时，对数据不做聚类，默认为true
//maxClusterLevel:6,	// 当层级大于此设定值时，不再执行聚类
            gridSizeWidth: gsize,// 设置网格大小，执行基于网格的聚类算法；
            gridSizeHeight: gsize,
            MAXCLUSTERLEVEL:5
        };
        var hightlisthIconStyle = {
            width: 14,
            height: 17,
            offsetX: -7,
            offsetY: -17,
            url: "map/imgs/markerblue.png"
        };
        var tileLyr = new SuperMap.DFC.ClusterTiles("pntLyr", dynTilesUrl, queryConfig, hightlisthIconStyle);
        var wmdts = tileLyr.appendTo(map, function (mk, imgid) {
            $('#' + imgid).popover({
                animation: true,
                html: true,
                title: mk.name,
                content: 'ID ： ' + mk.id + "<br>名   称：" + mk.name + "<br>X坐标：" + mk.x + "<br>Y坐标：" + mk.y
            });

        });
    }

    function getThemeRange() {
        var key = $.trim($("#keyword").val());
        var queryConfig = {
            themeType: 'RANGE',
            layers: layerName,
            keyword: key,
            filter: "", // "name like '" + key + "'"
            count: 10,			// 每个瓦片上的最大返回数据量，默认值 50
            //getjson:false		// 是否返回矢量json数据，默认为true
            cluster: usingCluster,// 设置为false时，对数据不做聚类，默认为true
            gridSizeWidth: gsize,// 设置网格大小，执行基于网格的聚类算法；
            gridSizeHeight: gsize
        };
        var iconStyle = {
            width: 22,
            height: 22,
            offsetX: -12,
            offsetY: -22,
            url: "map/imgs/pin_red_22.png"
        };
        var tileLyr = new SuperMap.DFC.ClusterTiles("pntLyr", dynThemesUrl, queryConfig, iconStyle);
        var wmdts = tileLyr.appendTo(map, function (mk, imgid) {
            $('#' + imgid).popover({
                animation: true,
                html: true,
                title: mk.name,
                content: 'ID ： ' + mk.id + "<br>名   称：" + mk.name + "<br>X坐标：" + mk.x + "<br>Y坐标：" + mk.y + "<br>级 别 ：" + mk.kv || mk.magnitude
            });
        });
        tileLyr.setLegend("mapLegend");

    }

    function getCluster() {
        var key = $.trim($("#keyword").val());
        var oParams = {
            layers: layerName,
            filter: key,   //"name like '"+ encodeURI(key) +"'",
            bounds: map.getExtent(), // 自定义查询的范围
            count: 10  // 每个瓦片上的最大返回数据量，默认值 50
            //cluster:false // 设置为false时，对数据不做聚类，默认为true
        };
        var url = clusterQueryUrl;
        var clusterQuery = new SuperMap.DFC.ClusterQuery(map, url);
        clusterQuery.query(oParams, function (data) {

        });
    }

    function initMap() {
        map = new OpenLayers.Map("map", {allOverlays: true}); //, projection: "EPSG:0"
        var ol_wms = new OpenLayers.Layer.WMS(
            "OpenLayers WMS",
            "http://vmap0.tiles.osgeo.org/wms/vmap0",
            {layers: "basic"}
        );
        map.addLayers([ol_wms]);
        //var wmts = iserverWmts();
        //map.addLayers([wmts]);
        map.addControl(new OpenLayers.Control.LayerSwitcher());
        map.zoomToExtent(initViewBounds);
        //map.zoomToMaxExtent();
        $("#map").hover(function () {
        }, function () {
            var lyr = map.highlightPockingLayer;
            if (lyr){
                lyr.clearMarkers();
            }
        });
    }

    function initTianDiTu() {
        var baseLayersConfig = {
            TianDiTu: {
                VEC: {
                    name: "tianditu-vec",
                    url: ["http://t0.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                        "http://t1.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                        "http://t2.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                        "http://t3.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                        "http://t4.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                        "http://t5.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                        "http://t6.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                        "http://t7.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31"
                    ],
                    layer: "vec",
                    matrixSet: "c",
                    style: "default",
                    format: "tiles"
                },
                CVA: {
                    name: "tianditu-cva",
                    url: ["http://t0.tianditu.gov.cn/cva_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                        "http://t1.tianditu.gov.cn/cva_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                        "http://t2.tianditu.gov.cn/cva_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                        "http://t3.tianditu.gov.cn/cva_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                        "http://t4.tianditu.gov.cn/cva_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                        "http://t5.tianditu.gov.cn/cva_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                        "http://t6.tianditu.gov.cn/cva_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                        "http://t7.tianditu.gov.cn/cva_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31"
                    ],
                    layer: "cva",
                    matrixSet: "c",
                    style: "default",
                    format: "tiles"
                }
            }
        };

        var baseLayers = [new OpenLayers.Layer.WMTS(baseLayersConfig.TianDiTu.VEC),new OpenLayers.Layer.WMTS(baseLayersConfig.TianDiTu.CVA)
        ];

        // var url = 'http://t0.tianditu.com/DataServer?T=vec_c&x=${x}&y=${y}&l=${z}';
        // var xyzTdt = new OpenLayers.Layer.XYZ("test",url);
        // baseLayers = [xyzTdt];
        // xyzTdt.getXYZ = function (bounds) {
        //
        // };

        map = new OpenLayers.Map({
            div: "map",
            layers: baseLayers,
            allOverlays: true

        });
        map.addControl(new OpenLayers.Control.MousePosition());

        map.zoomToExtent(initViewBounds);
        //map.zoomToMaxExtent();
        $("#map").hover(function () {
        }, function () {
            var lyr = map.highlightPockingLayer;
            if (lyr){
                lyr.clearMarkers();
            }
        });

        map.events.register("zoomend",map,function (e) {
             var resolution =  map.getResolution()
            var level = map.getZoom();


             console.log("level:" + level + "    res:" + resolution );
        });

    }

    // 平面坐标下，验证点位精准度。【朝阳公园:(-76.3156847941524,28.30053387946)】
    function iserverWms(map) {
        var options = {
            projection: "EPSG:0",
            maxExtent: new OpenLayers.Bounds(48.39718933631297, -7668.245292074532, 8958.850874968857, -55.577652310411075),
            center: new OpenLayers.LonLat(4503.624032152584985, -3861.9114721924715375)
        };
        var omap = new OpenLayers.Map("map", options);
        var wms = new OpenLayers.Layer.WMS(
            "OpenLayers WMS",
            "http://localhost:8090/iserver/services/maps/wms130/%E9%95%BF%E6%98%A5%E5%B8%82%E5%8C%BA%E5%9B%BE",
            {layers: "0.28,0.29", version: "1.3.0", CRS: "EPSG:0"},
            {isBaseLayer: true}
        );
        omap.addLayers([wms]);
        return omap;
    }

    // 经纬度坐标下，验证点位精准度。【北京:(116.388038635254,39.906192779541)】
    function iserverWmts() {  // iserver demo 中的 World wmts
        //wmts或许所需要的matrixID信息
        var matrixIds = [];
        for (var i = 0; i < 22; ++i) {
            matrixIds[i] = {identifier: i};
        }
        //当前图层的分辨率数组信息,和matrixIds一样，需要用户从wmts服务获取并明确设置,resolutions数组和matrixIds数组长度相同
        var resolutions = [1.25764139776733, 0.628820698883665, 0.251528279553466,
            0.125764139776733, 0.0628820698883665, 0.0251528279553466,
            0.0125764139776733, 0.00628820698883665, 0.00251528279553466,
            0.00125764139776733, 0.000628820698883665, 0.000251528279553466,
            0.000125764139776733, 0.0000628820698883665, 0.0000251528279553466,
            0.0000125764139776733, 0.00000628820698883665, 0.00000251528279553466,
            0.00000125764139776733, 0.000000628820698883665, 0.000000251528279553466];
        return new OpenLayers.Layer.WMTS({
            name: "map",
            url: "http://localhost:8090/iserver/services/map-world/wmts100",
            layer: "World",
            style: "default",
            matrixSet: "GlobalCRS84Scale_World",
            format: "image/png",
            resolutions: resolutions,
            matrixIds: matrixIds,
            opacity: 0.7,
            isBaseLayer: false
        });
    }

    function showGrid(isShow) {
        var lines = map.getLayersByName(linesName);
        var len = lines.length;
        if (isShow) {
            if (len < 1) {
                lines = new OpenLayers.Layer.LineGrid({
                    name: linesName,
                    isBaseLayer: false, dx: gsize, dy: gsize
                });
                map.addLayer(lines);
                lines.updateGrid();
            } else {
                lines[0].setVisibility(true);
                lines[0].updateGrid();
            }
        } else {
            if (len > 0) {
                lines[0].setVisibility(false);
            }
        }
    }

    function switchGrid(evt) {
        var elem = evt.srcElement || evt.target;
        var icon = $(elem).find("i");
        if (icon.hasClass("icon-")) {
            icon.removeClass("icon-").addClass("icon-ok");
            showGrid(true);
        } else {
            icon.removeClass("icon-ok").addClass("icon-");
            showGrid(false);
        }
    }

    function changeGridSize(evt) {
        var elem = evt.srcElement || evt.target;
        var icon = $(elem).find("i");
        if (!icon.hasClass("icon-ok")) {
            icon.removeClass("icon-").addClass("icon-ok");
            $("#configList").find(".gridsize[gsize=" + gsize + "]").find("i").removeClass("icon-ok").addClass("icon-");
            var lines = map.getLayersByName(linesName);
            var len = lines.length;
            if (len > 0) map.removeLayer(lines[0]);
            gsize = parseInt($.trim($(elem).attr("gsize")));
            if ($("#grid-switch ").find("i").hasClass("icon-ok")) {
                if (len > 0) {
                    lines = new OpenLayers.Layer.LineGrid({
                        name: linesName,
                        isBaseLayer: false, dx: gsize, dy: gsize
                    });
                    map.addLayer(lines);
                    lines.updateGrid();
                }
            }
            addThemeLayer();
        }
    }

    // jquery-free
    var xmlHttp = null;
    function getCluster_nojq() {
        var key = document.getElementById("keyword").value;
        var oParams = {
            layers: layerName,
            filter: key,   //"name like '"+ encodeURI(key) +"'",
            bounds: map.getExtent(), // 自定义查询的范围
            count: 10	// 每个瓦片上的最大返回数据量，默认值 50
            //cluster:false // 设置为false时，对数据不做聚类，默认为true
        };
        var url = clusterQueryUrl;
        var clusterQuery = new SuperMap.DFC.ClusterQuery(map, url);
        clusterQuery.query(oParams, function (data) {

        });
        url += "?" + pars;
        if (xmlHttp === null){
            xmlHttp = Common.getXMLHttpRequest();
        }
        xmlHttp.open("get", url, true);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send(null);
        xmlHttp.onreadystatechange = validate;
    }

    function getXMLHttpRequest() {
        var xmlHttp = null;
        try {
            xmlHttp = new XMLHttpRequest();
        }
        catch (e) {
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        return  xmlHttp;
    }

})();
