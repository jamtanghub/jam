/**
 * Created by jinn on 2016/1/12.
 */

ol.source.pockWMS = function (opt_options) {
    var options = goog.isDef(opt_options) ? opt_options : {};

    var params = goog.isDef(options.params) ? options.params : {};

    var transparent = goog.object.get(params, 'TRANSPARENT', true);

    goog.base(this, {
        attributions: options.attributions,
        crossOrigin: options.crossOrigin,
        logo: options.logo,
        opaque: !transparent,
        projection: options.projection,
        tileGrid: options.tileGrid,
        tileLoadFunction: options.tileLoadFunction,
        tileUrlFunction: goog.bind(this.tileUrlFunction_, this),
        wrapX: goog.isDef(options.wrapX) ? options.wrapX : true
    });

    var urls = options.urls;
    if (!goog.isDef(urls) && goog.isDef(options.url)) {
        urls = ol.TileUrlFunction.expandUrl(options.url);
    }

    /**
     * @private
     * @type {!Array.<string>}
     */
    this.urls_ = goog.isDefAndNotNull(urls) ? urls : [];

    /**
     * @private
     * @type {number}
     */
    this.gutter_ = goog.isDef(options.gutter) ? options.gutter : 0;

    /**
     * @private
     * @type {Object}
     */
    this.params_ = params;

    /**
     * @private
     * @type {boolean}
     */
    this.v13_ = true;

    /**
     * @private
     * @type {ol.source.wms.ServerType|undefined}
     */
    this.serverType_ =
    /** @type {ol.source.wms.ServerType|undefined} */ (options.serverType);

    /**
     * @private
     * @type {boolean}
     */
    this.hidpi_ = goog.isDef(options.hidpi) ? options.hidpi : true;

    /**
     * @private
     * @type {string}
     */
    this.coordKeyPrefix_ = '';
    this.resetCoordKeyPrefix_();

    /**
     * @private
     * @type {ol.Extent}
     */
    this.tmpExtent_ = ol.extent.createEmpty();

    this.updateV13_();

};
ol.inherits(ol.source.pockWMS, ol.source.TileWMS);

ol.source.pockWMS.prototype.getRequestUrl_ = function (tileCoord, tileSize, tileExtent, pixelRatio, projection, params) {

    var urls = this.urls_;
    if (goog.array.isEmpty(urls)) {
        return undefined;
    }

    params['WIDTH'] = tileSize[0];
    params['HEIGHT'] = tileSize[1];

    params[this.v13_ ? 'CRS' : 'SRS'] = projection.getCode();

    if (!('STYLES' in this.params_)) {
        /* jshint -W053 */
        params['STYLES'] = new String('');
        /* jshint +W053 */
    }

    if (pixelRatio != 1) {
        switch (this.serverType_) {
            case ol.source.wms.ServerType.GEOSERVER:
                var dpi = (90 * pixelRatio + 0.5) | 0;
                if (goog.isDef(params['FORMAT_OPTIONS'])) {
                    params['FORMAT_OPTIONS'] += ';dpi:' + dpi;
                } else {
                    params['FORMAT_OPTIONS'] = 'dpi:' + dpi;
                }
                break;
            case ol.source.wms.ServerType.MAPSERVER:
                params['MAP_RESOLUTION'] = 90 * pixelRatio;
                break;
            case ol.source.wms.ServerType.CARMENTA_SERVER:
            case ol.source.wms.ServerType.QGIS:
                params['DPI'] = 90 * pixelRatio;
                break;
            default:
                goog.asserts.fail('unknown serverType configured');
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
        var index = goog.math.modulo(ol.tilecoord.hash(tileCoord), urls.length);
        url = urls[index];
    }

    var _re = goog.uri.utils.appendParamsFromMap(url, params);
    return _re;
};




ol.source.Baidu = function () {

};
ol.inherits(ol.source.WMTS,ol.source.Baidu);