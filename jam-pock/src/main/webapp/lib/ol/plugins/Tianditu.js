/**
 * Created by Tangjin on 2018/4/19.
 */


/**
 * 天地图数据库
 * @param opt_options
 * @constructor
 */
ol.source.Tianditu = function (opt_options) {


    ol.source.Tianditu.layerLabelMap = {
        "vec": "cva",
        "ter": "cta",
        "img": "cia"
    };
    ol.source.Tianditu.layerZoomMap = {
        "vec": 18,
        "ter": 14,
        "img": 18
    };


    var options = opt_options || {};
    var attributions = options.attributions || new ol.Attribution({
            html: "Map Data <a href='http://www.tianditu.com' target='_blank'><img style='background-color:transparent;bottom:2px;opacity:1;' " +
            "src='http://api.tianditu.com/img/map/logo.png' width='53px' height='22px' opacity='0'></a>"
        });
    options.layerType = options.layerType || "vec";
    options.layerType = options.isLabel ? ol.source.Tianditu.layerLabelMap[options.layerType] : options.layerType;
    options.matrixSet = (options.projection === 'EPSG:4326' || options.projection === 'EPSG:4490') ? "c" : "w";
    if (!options.url && !options.urls) {
        options.url = "http://t{0-7}.tianditu.com/{layer}_{proj}/wmts?"
    }
    options.url = options.url.replace("{layer}", options.layerType).replace("{proj}", options.matrixSet);
    var tileGrid = options.tileGrid || ol.source.Tianditu.getTileGrid(options.projection || 'EPSG:3857');

    var superOptions = {
        version: options.version || '1.0.0',
        format: options.format || 'tiles',
        dimensions: options.dimensions || {},
        layer: options.layerType,
        matrixSet: options.matrixSet,
        tileGrid: tileGrid,
        style: options.style || 'default',
        attributions: attributions,
        cacheSize: options.cacheSize,
        crossOrigin: options.crossOrigin,
        opaque: options.opaque === undefined ? true : options.opaque,
        maxZoom: ol.source.Tianditu.layerZoomMap[options.layerType],
        reprojectionErrorThreshold: options.reprojectionErrorThreshold,
        url: options.url,
        urls: options.urls,
        projection: options.projection || 'EPSG:3857',
        wrapX: options.wrapX
    };
    //需要代理时走自定义 tileLoadFunction，否则走默认的tileLoadFunction
    if (options.tileProxy) {
        superOptions.tileLoadFunction = tileLoadFunction;
    }


    if (options.tileProxy) {
        this.tileProxy = options.tileProxy;
    }
    //需要代理时，走以下代码
    var me = this;
    function tileLoadFunction(imageTile, src) {
        //支持代理
        imageTile.getImage().src = me.tileProxy + encodeURIComponent(src);
    }

    ol.source.WMTS.call(this,superOptions);
};
ol.inherits(ol.source.Tianditu, ol.source.WMTS);

ol.source.Tianditu.getTileGrid = function (projection) {
    if (projection === "EPSG:4326" || projection === "EPSG:4490") {
        return ol.source.Tianditu.default4326TileGrid();
    }
    return ol.source.Tianditu.default3857TileGrid();
};

ol.source.Tianditu.default4326TileGrid = function () {
    var tdt_WGS84_resolutions = [];
    var matrixIds = [];
    for (var i = 1; i < 19; i++) {
        tdt_WGS84_resolutions.push(0.703125 * 2 / (Math.pow(2, i)));
        matrixIds.push(i);
    }
    var tileGird = new ol.tilegrid.WMTS({
        extent: [-180, -90, 180, 90],
        resolutions: tdt_WGS84_resolutions,
        origin: [-180, 90],
        matrixIds: matrixIds,
        minZoom: 1
    });
    return tileGird;
};

ol.source.Tianditu.default3857TileGrid = function () {
    var tdt_Mercator_resolutions = [];
    var matrixIds = [];
    for (var i = 1; i < 19; i++) {
        tdt_Mercator_resolutions.push(78271.5169640203125 * 2 / (Math.pow(2, i)));
        matrixIds.push(i);
    }
    var tileGird = new ol.tilegrid.WMTS({
        extent: [-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892],
        resolutions: tdt_Mercator_resolutions,
        matrixIds: matrixIds,
        origin: [-20037508.3427892, 20037508.3427892],
        minZoom: 1
    });
    return tileGird;
};