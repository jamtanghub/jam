/**
 * Created by jinn on 2015/7/23.
 */
define(function (require, exports, module) {


    var map = null;

    var initMap = function () {
        //var layers = [
        //    new ol.layer.Tile({
        //        //extent: extent,
        //        source: new ol.source.pockWMS({
        //            url: 'http://localhost:8090/iserver/services/map-SGIS_SJP3/wms130/china',
        //            //crossOrigin: 'anonymous',
        //            attributions: [],
        //            params: {
        //                'LAYERS': 'china',
        //                'FORMAT': 'image/jpeg'
        //            },
        //            serverType: 'mapserver'
        //        })
        //    })
        //]

        var mousePositionControl = new ol.control.MousePosition();
        map = new ol.Map({
            controls: [mousePositionControl],
            target: "map-container",
            layers:LayerFactory.Tianditu(), // [new Baidu()],//LayerFactory.Tianditu(),
            view: new ol.View({
                projection: 'EPSG:4326',
                center: [100, 35],
                zoom: 4
            })
        });

        $("#map").hover(function () {
        }, function () {
            var lyr = map.highlightPockingLayer;
            if (lyr) {
                lyr.clearMarkers();
            }
        });
    };

    var getMap = function () {
        return map;
    };

    var LayerFactory = (function () {

        /**
         * 创建天地图图层
         * @param type 图层类型  vec img 默认vec
         * @param pro  地图投影  默认 EPSG:4326
         * @param label 是否添加标注图层 默认添加  Boolean
         * @returns {Array} 图层数组
         * @constructor
         */
        var Tianditu = function (type, pro, label) {

            var vecUrls = ["http://t0.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                "http://t1.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                "http://t2.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                "http://t3.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                "http://t4.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                "http://t5.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                "http://t6.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31",
                "http://t7.tianditu.gov.cn/vec_c/wmts?tk=706c9c914f9583f9ea9e8acc7f7c0a31"];

            var labelVecUrls = ["http://t0.tianditu.gov.cn/cva_c/wmts",
                "http://t1.tianditu.gov.cn/cva_c/wmts",
                "http://t2.tianditu.gov.cn/cva_c/wmts",
                "http://t3.tianditu.gov.cn/cva_c/wmts",
                "http://t4.tianditu.gov.cn/cva_c/wmts",
                "http://t5.tianditu.gov.cn/cva_c/wmts",
                "http://t6.tianditu.gov.cn/cva_c/wmts",
                "http://t7.tianditu.gov.cn/cva_c/wmts"];

            var imgUrls = ["http://t0.tianditu.com/img_w/wmts",
                "http://t1.tianditu.com/img_w/wmts",
                "http://t2.tianditu.com/img_w/wmts",
                "http://t3.tianditu.com/img_w/wmts",
                "http://t4.tianditu.com/img_w/wmts",
                "http://t5.tianditu.com/img_w/wmts",
                "http://t6.tianditu.com/img_w/wmts",
                "http://t7.tianditu.com/img_w/wmts"];

            var labelImgUrls = ["http://t0.tianditu.com/cia_w/wmts",
                "http://t1.tianditu.com/cia_w/wmts",
                "http://t2.tianditu.com/cia_w/wmts",
                "http://t3.tianditu.com/cia_w/wmts",
                "http://t4.tianditu.com/cia_w/wmts",
                "http://t5.tianditu.com/cia_w/wmts",
                "http://t6.tianditu.com/cia_w/wmts",
                "http://t7.tianditu.com/cia_w/wmts"
            ];

            var projection = ol.proj.get(pro ? pro : "EPSG:4326");
            var projectionExtent = projection.getExtent();
            var size = ol.extent.getWidth(projectionExtent) / 256;
            var resolutions = new Array(14);
            var matrixIds = new Array(14);
            for (var z = 0; z < 14; ++z) {
                resolutions[z] = size / Math.pow(2, z);
                matrixIds[z] = z;
            }

            //矢量
            var vecLayer = new ol.layer.Tile({
                opacity: 1,
                source: new ol.source.WMTS({
                    //attributions: [attribution],
                    urls: vecUrls,
                    layer: 'vec',
                    matrixSet: 'c',
                    format: 'tiles',
                    projection: projection,
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions,
                        matrixIds: matrixIds
                    }),
                    style: 'default',
                    wrapX: true
                })
            });

            //影像
            var imgLayer = new ol.layer.Tile({
                opacity: 1,
                source: new ol.source.WMTS({
                    //attributions: [attribution],
                    urls: imgUrls,
                    layer: 'img',
                    matrixSet: 'w',
                    format: 'tiles',
                    projection: projection,
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions,
                        matrixIds: matrixIds
                    }),
                    style: 'default',
                    wrapX: true
                })
            });

            //矢量标注
            var vecLabelLayer = new ol.layer.Tile({
                opacity: 1,
                source: new ol.source.WMTS({
                    //attributions: [attribution],
                    urls: labelVecUrls,
                    layer: 'cva',
                    matrixSet: 'c',
                    format: 'tiles',
                    projection: projection,
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions,
                        matrixIds: matrixIds
                    }),
                    style: 'default',
                    wrapX: true
                })
            });

            //影像标注
            var imgLabelLayer = new ol.layer.Tile({
                opacity: 1,
                source: new ol.source.WMTS({
                    //attributions: [attribution],
                    urls: labelImgUrls,
                    layer: 'cia',
                    matrixSet: 'w',
                    format: 'tiles',
                    projection: projection,
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projectionExtent),
                        resolutions: resolutions,
                        matrixIds: matrixIds
                    }),
                    style: 'default',
                    wrapX: true
                })
            });


            var layers = [];
            if (type == "img") {
                layers.push(imgLayer);
                if (label === undefined || label === true) {
                    layers.push(imgLabelLayer);
                }
            } else {
                layers.push(vecLayer);
                if (label === undefined || label === true) {
                    layers.push(vecLabelLayer);
                }
            }
            return layers;
        };


        return {
            Tianditu: Tianditu
        }

    })();

    /**
     *
     * @param type
     * @param pro
     * @param showlb 是否显示标签层
     * @constructor
     */
    var Tianditu = function (type,pro,showlb) {
        this.type = type?type:"";
        this.pro = pro?pro:"EPSG:4326";
        if(showlb===undefined || showlb === true){
            this.showlb = true;
        }else{
            this.showlb = false;
        }
        return this.init();
    };
    Tianditu.prototype.init = function () {
        //天地图服务地址
        var urls = {
            vec:["http://t0.tianditu.gov.cn/vec_c/wmts",
                "http://t1.tianditu.gov.cn/vec_c/wmts",
                "http://t2.tianditu.gov.cn/vec_c/wmts",
                "http://t3.tianditu.gov.cn/vec_c/wmts",
                "http://t4.tianditu.gov.cn/vec_c/wmts",
                "http://t5.tianditu.gov.cn/vec_c/wmts",
                "http://t6.tianditu.gov.cn/vec_c/wmts",
                "http://t7.tianditu.gov.cn/vec_c/wmts"],
            vec_lb:["http://t0.tianditu.gov.cn/cva_c/wmts",
                "http://t1.tianditu.gov.cn/cva_c/wmts",
                "http://t2.tianditu.gov.cn/cva_c/wmts",
                "http://t3.tianditu.gov.cn/cva_c/wmts",
                "http://t4.tianditu.gov.cn/cva_c/wmts",
                "http://t5.tianditu.gov.cn/cva_c/wmts",
                "http://t6.tianditu.gov.cn/cva_c/wmts",
                "http://t7.tianditu.gov.cn/cva_c/wmts"],
            img:["http://t0.tianditu.com/img_w/wmts",
                "http://t1.tianditu.com/img_w/wmts",
                "http://t2.tianditu.com/img_w/wmts",
                "http://t3.tianditu.com/img_w/wmts",
                "http://t4.tianditu.com/img_w/wmts",
                "http://t5.tianditu.com/img_w/wmts",
                "http://t6.tianditu.com/img_w/wmts",
                "http://t7.tianditu.com/img_w/wmts"],
            img_lb:["http://t0.tianditu.com/cia_w/wmts",
                "http://t1.tianditu.com/cia_w/wmts",
                "http://t2.tianditu.com/cia_w/wmts",
                "http://t3.tianditu.com/cia_w/wmts",
                "http://t4.tianditu.com/cia_w/wmts",
                "http://t5.tianditu.com/cia_w/wmts",
                "http://t6.tianditu.com/cia_w/wmts",
                "http://t7.tianditu.com/cia_w/wmts"]
        };

        //计算分辨率
        var projection = ol.proj.get(this.pro);
        var projectionExtent = projection.getExtent();
        var size = ol.extent.getWidth(projectionExtent) / 256;
        var resolutions = new Array(14);  //计算分辨率
        var matrixIds = new Array(14);
        for (var z = 0; z < 14; ++z) {
            resolutions[z] = size / Math.pow(2, z);
            matrixIds[z] = z;
        }

        var layer = new ol.layer.Tile({
            opacity:1,
            source:new ol.source.WMTS({
                urls:urls[0],
                layer: 'cia',
                matrixSet: 'w',
                format: 'tiles',
                projection: projection,
                tileGrid: new ol.tilegrid.WMTS({
                    origin: ol.extent.getTopLeft(projectionExtent),
                    resolutions: resolutions,
                    matrixIds: matrixIds
                }),
                style: 'default',
                wrapX: true

            })
        });

        return layer;
    };


    var Baidu = function () {
       return  this.init();
    };
    Baidu.prototype.init = function () {

        http://online9.map.bdimg.com/onlinelabel/?qt=tile&x=1575&y=587&z=13&styles=pl&scaler=1&p=0
        var urls = ["http://online0.map.bdimg.com/onlinelabel",
            "http://online0.map.bdimg.com/onlinelabel",
            "http://online1.map.bdimg.com/onlinelabel",
            "http://online2.map.bdimg.com/onlinelabel",
            "http://online3.map.bdimg.com/onlinelabel",
            "http://online4.map.bdimg.com/onlinelabel",
            "http://online5.map.bdimg.com/onlinelabel",
            "http://online6.map.bdimg.com/onlinelabel",
            "http://online7.map.bdimg.com/onlinelabel"];

        //计算分辨率
        //var projection = ol.proj.get(this.pro);
        //var projectionExtent = projection.getExtent();
        //var size = ol.extent.getWidth(projectionExtent) / 256;
        //var resolutions = new Array(14);
        //var matrixIds = new Array(14);
        //for (var z = 0; z < 14; ++z) {
        //    resolutions[z] = size / Math.pow(2, z);
        //    matrixIds[z] = z;
        //}


        var resolutions = [];
        var tileSize = 256;
        var projection = ol.proj.get("EPSG:3857");
        for (var i = 0; i < 19; i++) {
            resolutions[i] = Math.pow(2, 18 - i);
        }
        var projectionExtent = projection.getExtent();// [-tileSize*resolusions[1],-tileSize*resolusions[1],tileSize*resolusions[1],tileSize*resolusions[1]];//projection.getExtent();



        var layer = new ol.layer.Tile({
            opacity:1,
            source:new ol.source.TileImage({
                projection: projection,
                tileGrid: ol.tilegrid.TileGrid({
                    origin: [0,0],
                    resolutions: resolutions
                }),
                tileUrlFunction: function (xyz, obj1, obj2) {
                    if (!xyz) {
                        return "";
                    }
                    var z = xyz[0];
                    var x = xyz[1];
                    var y = xyz[2];
//            y = -y - 1;  默认轴方向是右下的，但是百度的轴方向是右上。 所以y值 应该变的，但是为何没有 ？
                    if (x < 0) {
                        x = "M" + (-x);
                    }
                    if (y < 0) {
                        y = "M" + (-y);
                    }
                    return "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" + x + "&y=" + y + "&z=" + z + "&styles=pl&udt=20160112&scaler=1&p=0";
                }
            })
        });

        return layer;
    };

    return {
        initMap: initMap,
        getMap: getMap
    }
})
