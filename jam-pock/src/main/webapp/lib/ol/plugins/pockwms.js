/**
 * Created by Tangjin on 2018/6/25.
 */

/**
 * 麻点图层
 * @param opt_options
 * @constructor
 */
ol.source.PockWMS = function (opt_options) {

    var  DEFAULT_PARAMS =  {
            service: "TiledLayer",
            version: "1.0.0",
            //request: "GetTile",
            styles: "",
            format: "image/png",
            transparent: true,
            cluster:true,
            count:50
    };
    this.options = $.extend(DEFAULT_PARAMS,opt_options);

    ol.source.TileWMS.call(this,this.options);

};

ol.inherits(ol.source.PockWMS,ol.source.TileWMS);


ol.source.PockWMS.prototype.getRequestUrl_ = function (tileCoord, tileSize, tileExtent,
                                                       pixelRatio, projection, params) {
    var urls = this.urls;
    if (!urls) {
        return undefined;
    }

    var map = params.map;
    var view = map.getView();

    var L = tileCoord[0];
    // var RESOLUTION = view.getResolution(); //这个获取到的不对 可能是个临时状态
    var RESOLUTION = view.getResolutionForZoom(L);

    if(params.MAXCLUSTERLEVEL===undefined){
        params.MAXCLUSTERLEVEL = (L<5)?L:(L-3);
    }

    params['L'] = L+"";
    params['RESOLUTION'] = RESOLUTION;


    params['WIDTH'] = tileSize[0];
    params['HEIGHT'] = tileSize[1];

    params[this.v13_ ? 'CRS' : 'SRS'] = projection.getCode();

    if (!('STYLES' in this.params_)) {
        params['STYLES'] = '';
    }

    if (pixelRatio != 1) {
        switch (this.serverType_) {
            case ol.source.WMSServerType.GEOSERVER:
                var dpi = (90 * pixelRatio + 0.5) | 0;
                if ('FORMAT_OPTIONS' in params) {
                    params['FORMAT_OPTIONS'] += ';dpi:' + dpi;
                } else {
                    params['FORMAT_OPTIONS'] = 'dpi:' + dpi;
                }
                break;
            case ol.source.WMSServerType.MAPSERVER:
                params['MAP_RESOLUTION'] = 90 * pixelRatio;
                break;
            case ol.source.WMSServerType.CARMENTA_SERVER:
            case ol.source.WMSServerType.QGIS:
                params['DPI'] = 90 * pixelRatio;
                break;
            default:
                ol.asserts.assert(false, 52); // Unknown `serverType` configured
                break;
        }
    }

    var axisOrientation = projection.getAxisOrientation();
    var bbox = tileExtent;
    if (this.v13_ && axisOrientation.substr(0, 2) == 'ne') {
        var tmp;
        tmp = tileExtent[0];
        bbox[0] = tileExtent[1];
        bbox[1] = tmp;
        tmp = tileExtent[2];
        bbox[2] = tileExtent[3];
        bbox[3] = tmp;
    }
    params['BBOX'] = bbox.join(',');

    var url;
    if (urls.length == 1) {
        url = urls[0];
    } else {
        var index = ol.math.modulo(ol.tilecoord.hash(tileCoord), urls.length);
        url = urls[index];
    }
    return ol.uri.appendParams(url, params);

};



ol.source.PockWMS.prototype.setLegend = function (id) {
    var url = this.urls[0].replace("img","legend");
    var legendUrl = url + "?THEMETYPE=" + this.params_.themeType + "&LAYERS=" + this.params_.layers;
    $("#"+id).append("<img src='"+ legendUrl +"' />").find("img").css("vertical-align","top");
    this.legendId = id;
};

