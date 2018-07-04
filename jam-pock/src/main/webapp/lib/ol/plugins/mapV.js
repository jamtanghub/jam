/**
 * Created by Tangjin on 2018/4/20.
 */


/**
 * 对接百度MapV资源
 * @param opt_options
 * @constructor
 */
ol.source.MapV = function (opt_options) {

    var options = opt_options ? opt_options : {};


    this.map = opt_options.map;
    this.dataSet = opt_options.dataSet;
    this.mapvOptions = opt_options.mapvOptions;


    ol.source.ImageCanvas.call(this,{
        attributions: options.attributions || new ol.Attribution({
            html: "© 2018 吉威 MapV with <span>© <a href='http://www.geoway.com.cn' target='_blank'>gClient</a></span>"
        }),
        canvasFunction: canvasFunctionInternal_,
        logo: options.logo,
        projection: options.projection,
        ratio: options.ratio,
        resolutions: options.resolutions,
        state: options.state
    });

    function canvasFunctionInternal_(extent, resolution, pixelRatio, size, projection) {
        var mapWidth = size[0] * pixelRatio;
        var mapHeight = size[1] * pixelRatio;
        var width = this.map.getSize()[0] * pixelRatio;
        var height = this.map.getSize()[1] * pixelRatio;
        if (!this.layer) {
            this.layer = new MapvLayer(this.map, this.dataSet, this.mapvOptions, mapWidth, mapHeight, this);
        }
        this.layer.pixelRatio = pixelRatio;
        this.layer.offset = [(mapWidth - width) / 2 / pixelRatio, (mapHeight - height) / 2 / pixelRatio];
        if (!this.rotate) {
            this.rotate = this.map.getView().getRotation();
        } else {
            if (this.rotate !== this.map.getView().getRotation()) {
                this.layer.canvasLayer.resize(mapWidth, mapHeight);
                this.rotate = this.map.getView().getRotation()
            }
        }
        var canvas = this.layer.canvasLayer.canvas;
        if (!this.layer.isEnabledTime()) {
            this.layer.canvasLayer.resize(mapWidth, mapHeight);
            this.layer.canvasLayer.draw();
        }
        if (!this.context) {
            this.context = Util.createCanvasContext2D(mapWidth, mapHeight);
        }
        var canvas2 = this.context.canvas;
        this.context.clearRect(0, 0, canvas2.width, canvas2.height);
        canvas2.width = mapWidth;
        canvas2.height = mapHeight;
        canvas2.style.width = mapWidth + "px";
        canvas2.style.height = mapHeight + "px";
        this.context.drawImage(canvas, 0, 0, mapWidth, mapHeight, 0, 0, mapWidth, mapHeight);
        if (this.resolution !== resolution || JSON.stringify(this.extent) !== JSON.stringify(extent)) {
            this.resolution = resolution;
            this.extent = extent;
        }
        return this.context.canvas;
    }
};

ol.inherits(ol.source.MapV,ol.source.ImageCanvas);


ol.source.MapV.prototype.addData = function (data, options) {
    this.layer.addData(data, options);
};


ol.source.MapV.prototype.getData = function () {
    if (this.layer) {
        this.dataSet = this.layer.getData();
    }
    return this.dataSet;
};


ol.source.MapV.prototype.removeData = function (filter) {
    this.layer && this.layer.removeData(filter);
};

ol.source.MapV.prototype.clearData = function () {
    this.layer.clearData();
};

ol.source.MapV.prototype.update = function (options) {
    this.layer.update(options);
    this.changed();
};