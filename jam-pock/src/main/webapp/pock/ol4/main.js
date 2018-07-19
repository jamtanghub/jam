/**
 * Created by Tangjin on 2018/6/25.
 */

(function () {

    var dynTilesUrl = "/pock/service/pock/tile/img";
    var themeTileUrl = "/pock/service/pock/theme/img";

    var map= null;
    var hlLayer = null;

    var proCode = "EPSG:4326";
    var projection = new ol.proj.Projection({
        code:proCode,
        units:"degrees"
    });


    var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: proCode,
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
    });

    var init = function () {
         initMap();
    };

    var UI = (function () {
        $('.dropdown-toggle').dropdown();
        $(".dropdown-menu a").click(function (e) {
            var tar = e.target;
            var text = tar.text;
            var val = $(tar).attr("value");
            var def = $(tar).attr("def");
            $(tar).closest("div").find("a span:first").text(text).attr("value",val);

            $("#inp-key").val(def);
        });

        //查询
        $("#btn-search").click(function () {
            var key = $("#inp-key").val().trim();
            var layer = $("#drop4 span:first").attr("value");

            var type = $("input[name='ltype']:checked").val();


            addPockLayer({
                keyword:key,
                layers:layer
                ,type:type
            });
        });
    })();

    var initMap = function () {

        var baseLayer = new ol.layer.Tile({
            title:"天地图矢量地图",
            source:new ol.source.Tianditu({
                projection:proCode
            })
        });

        map = new ol.Map({
            target:'map',
            layers:[baseLayer],
            controls: ol.control.defaults({
                attributionOptions: {
                    collapsible: false
                }
            }),
            view: new ol.View({
                center: [108, 34],
                zoom: 4,
                projection:projection
            })
        });

        map.controls.push(mousePositionControl);



        var hlSource = new ol.source.Vector({
            features: []
        });
        //矢量图层  用于显示高亮麻点
        hlLayer = new ol.layer.Vector({
            zindex: 10,
            source:hlSource
        });
        hlLayer.setZIndex(1000);

        map.addLayer(hlLayer);

        //弹出气泡
        var element = document.getElementById('popup');
        var popup = new ol.Overlay({
            element: element,
            positioning: 'bottom-center',
            stopEvent: false,
            offset: [0, -5]
        });
        map.addOverlay(popup);



       map.on("click",function (evt) {
           var feature = map.forEachFeatureAtPixel(evt.pixel,function (feature) {
               return feature;
           });
           if (feature) {
               var coordinates = feature.getGeometry().getCoordinates();
               popup.setPosition(coordinates);
               $(element).popover({
                   placement: 'top',
                   html: true,
                   content: feature.get('name')
               });
               $(element).popover('show');
           } else {
               $(element).popover('destroy');
           }

       });


        map.on("pointermove",function (evt) {
            var coordinate = evt.coordinate;
            var pixel = evt.pixel;

            var hdms = ol.coordinate.toStringHDMS(coordinate);


            var z = map.getView().getZoom();
            var currFlag = "z_" + z;
            if(!map.pockfea){
                return ;
            }
            var features = map.pockfea[currFlag];
            if(!features || features.length==0){
                return ;
            }

            var config = this.tileMarkerConfig;
            var iconStyle = config.iconStyle;
            if(iconStyle === undefined || iconStyle===null) return;
            var iconW = iconStyle.iconWidth;
            var iconH = iconStyle.iconHeight;
            var iconOffX = iconStyle.iconOffsetX;
            var iconOffY = iconStyle.iconOffsetY;
            var hIconStyle = config.hIconStyle;
            var hIconW = hIconStyle.width;
            var hIconH = hIconStyle.height;
            var hIconOffX = hIconStyle.offsetX;
            var hIconOffY = hIconStyle.offsetY;
            var highlightIconUrl = hIconStyle.url;


            var boxLeft = 0, boxRight = 0, boxBottom = 0, boxTop = 0;
            if(boxLeft <= pixel[0] && pixel[0] < boxRight && boxBottom < pixel[1] && pixel[1] <= boxTop) return;
            for(var i =0;i<features.length;i++){
                var fea = features[i];
                var feaPx = map.getPixelFromCoordinate([fea.x,fea.y]);

                boxLeft = feaPx[0] + iconOffX;
                boxRight = feaPx[0] + iconW + iconOffX;
                boxTop = feaPx[1] + iconH + iconOffY;
                boxBottom = feaPx[1] + iconOffY;

                // console.log("box:" + boxLeft + "," + boxBottom + "," + boxRight + "," + boxTop);

                var inx = boxLeft <= pixel[0] && pixel[0] < boxRight;
                var iny = boxBottom < pixel[1] && pixel[1] <= boxTop;

                var hlSource  = hlLayer.getSource();
                hlSource.clear();
                if(inx && iny){
                    var hliconStyle = new ol.style.Style({
                        image: new ol.style.Icon(({
                            src: '../../assets/image/markerblue.png',
                            offset:[-6,-4],
                            size:[hIconW*2,hIconH*2]
                        }))
                    });

                    var f = new ol.Feature({
                        geometry: new ol.geom.Point([fea.x, fea.y]),
                        name:fea.name||""
                    });
                    f.setStyle(hliconStyle);
                    hlSource.addFeature(f);
                    break;
                }
            }


            // var mouse = this.events.getMousePosition(evt);
        });
    };


    var addPockLayer = function (par) {
        var url = "";
        var type = par.type;
        if(type == "1"){
            url = dynTilesUrl;
            par.themetype = "";
        }else if(type == "2"){
            url = themeTileUrl;
            par.themetype = "RANGE";
        }

        map.getLayers().forEach(function (ly, o) {
            if(ly.get("title") == "pock"){
                $("#pock-legend").empty();
                map.removeLayer(ly);
            }
        });


        var hightlisthIconStyle = {
            width: 14,
            height: 17,
            offsetX: -7,
            offsetY: -17,
            url: "map/imgs/markerblue.png"
        };


        var options = {
            url:url,
            params:{
                themeType: par.themetype,
                serverType:"",
                layers: par.layers,
                keyword: par.keyword,
                filter: "", // "name like '" + key + "'"
                count: 50,			// 每个瓦片上的最大返回数据量，默认值 50
                //getjson:false		// 是否返回矢量json数据，默认为true
                cluster: true,// 设置为false时，对数据不做聚类，默认为true
                maxClusterLevel:6,	// 当层级大于此设定值时，不再执行聚类
                gridSizeWidth: 16,// 设置网格大小，执行基于网格的聚类算法；
                gridSizeHeight: 16,
                maxextent:[-180,-90,180,90],
                map:map
            }
        };

        var pockSource =  new ol.source.PockWMS(options);
        pockSource.on("tileloadend",function (evt) {
            if(!map.tileMarkerConfig){
                map.tileMarkerConfig = {};
            }

            if(!map.pockfea){
                map.pockfea = {};
            }

            var tile = evt.tile;
            var strUrl = tile.getKey("src").replace("img","feature");
            $.ajax({
                url: strUrl, type: "get", dataType:"json",
                success: function(result, status, detail){
                    var tileCoord = tile.tileCoord;
                    var z = tileCoord[0];
                    var currFlag = "z_" + z;
                    for(var k in map.pockfea){
                        if(k != currFlag){
                            delete map.pockfea[k];
                        }
                    }

                    if(map.tileMarkerConfig!==undefined && map.tileMarkerConfig!==null){
                        if(result.style) map.tileMarkerConfig['iconStyle']  = result.style.iconStyle;
                    }

                    if(result.data!=null && result.data instanceof Array && result.data.length>0){
                        if(!map.pockfea[currFlag]){
                            map.pockfea[currFlag] = result.data;
                        }else{
                            var old = map.pockfea[currFlag];
                            map.pockfea[currFlag] =  old.concat(result.data);
                        }
                    }




                    // var image = tile.getImage();
                    // if(status=="success"){
                    //     image.features = result.data;
                    // }else{
                    //     image.features = [];
                    // }
                },error:function(){
                    var image = tile.getImage();
                    image.features = [];
                }
            });

            map.tileMarkerConfig['hIconStyle'] = hightlisthIconStyle;
        });

        if(par.type == "2"){
            pockSource.setLegend("pock-legend"); //专题图图例
        }

        var layer = new ol.layer.Tile({
            title:"pock",
            extent: [-180, -90, 180, 90],
            source:pockSource
        });

        map.addLayer(layer);
        

    };


    $(function () {
         init();
    });
})();