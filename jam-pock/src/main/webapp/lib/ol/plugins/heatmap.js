/**
 * Created by Tangjin on 2018/4/16.
 */

/**
 * @Auth Tangjin
 * 热力图数据源
 * 依赖 ol.source.ImageCanvas
 */

ol.source.HeatMap = function(name,opt_options) {

    var options = opt_options || {};

    ol.source.ImageCanvas.call(this,{
        attributions: options.attributions || new ol.Attribution({
            html: "Map Data <span>© <a href='http://www.geoway.com.cn' target='_blank'>gClient</a></span>"
        }),
        canvasFunction: canvasFunctionInternal_,
        logo: options.logo,
        projection: options.projection,
        ratio: options.ratio,
        resolutions: options.resolutions,
        state: options.state
    });


    //初始化成员变量
    this.canvasFunctionInternal_ = canvasFunctionInternal_;
    this.features = [];
    this.ff = [];
    this.name = name;
    if (!options.map) {
        throw new Error('options.map is not found.');
    }
    this.map = options.map;
    // this.TFEvents = options.TFEvents || [];
    this.id = options.id ? options.id : o.gw.Util.createUniqueID("HeatMapSource_");
    this.opacity = options.opacity ? options.opacity : 1;
    this.colors = options.colors ? options.colors : ['blue', 'cyan', 'lime', 'yellow', 'red'];
    this.useGeoUnit = options.useGeoUnit ? options.useGeoUnit : false;
    this.radius = options.radius ? options.radius : 50;
    this.featureWeight = options.featureWeight ? options.featureWeight : null;
    this.maxWeight = null;
    this.minWeight = null;
    this.maxWidth = null;
    this.maxHeight = null;

    //创建热力图绘制面板
    this.rootCanvas = document.createElement("canvas");
    var mapSize = this.map.getSize();
    this.rootCanvas.width = this.maxWidth = parseInt(mapSize[0]);
    this.rootCanvas.height = this.maxHeight = parseInt(mapSize[1]);
    ol.gw.Util.modifyDOMElement(this.rootCanvas, null, null, null,
        null, null, null, this.opacity);
    this.canvasContext = this.rootCanvas.getContext('2d');

    function canvasFunctionInternal_(extent, resolution, pixelRatio, size, projection) { // eslint-disable-line no-unused-vars
        var mapWidth = size[0] * pixelRatio;
        var mapHeight = size[1] * pixelRatio;

        this.rootCanvas.width = this.maxWidth = mapWidth;
        this.rootCanvas.height = this.maxHeight = mapHeight;
        if (!this.features) {
            return this.rootCanvas;
        }
        this.pixelRatio = pixelRatio;

        //记录偏移量
        var width = this.map.getSize()[0] * pixelRatio;
        var height = this.map.getSize()[1] * pixelRatio;
        this.offset = [(mapWidth - width) / 2 / pixelRatio, (mapHeight - height) / 2 / pixelRatio];

        this.updateHeatPoints(resolution);

        return this.rootCanvas;
    }

};
ol.inherits(ol.source.HeatMap, ol.source.ImageCanvas);

ol.source.HeatMap.prototype.addFeatures = function (features) {
    this.features = features;
    //支持更新features，刷新底图
    this.changed();
};


ol.source.HeatMap.prototype.setOpacity = function (opacity) {
    if (opacity !== this.opacity) {
        this.opacity = opacity;
        var element = this.rootCanvas;
        ol.gw.Util.modifyDOMElement(element, null, null, null,
            null, null, null, opacity);

        if (this.map !== null) {
            this.changed();
        }
    }
};

ol.source.HeatMap.prototype.updateHeatPoints = function (resolution) {
    if (this.features && this.features.length > 0) {
        this.convertFastToPixelPoints(resolution);
    } else {
        this.canvasContext.clearRect(0, 0, this.maxWidth, this.maxWidth);
    }
};

ol.source.HeatMap.prototype.convertFastToPixelPoints = function (resolution) {
    var data = [], x, y, k, maxTemp, minTemp, maxWeightTemp;

    //热点半径  useGeoUnit:是否使用地理坐标
    this.useRadius = this.useGeoUnit ? parseInt(this.radius / resolution) : this.radius;

    for(var i = 0;i<this.features.length;i++){
        var feature = this.features[i];
        var point = feature.getGeometry();
        var pixelPoint = this.getLocalXY(point);
        if(this.featureWeight){
            pixelPoint.weight = feature.getProperties()["Properties"][this.featureWeight];
            if (!this.maxWeight) {
                //找出最大最小权重值
                maxTemp = maxTemp ? maxTemp : pixelPoint.weight;
                minTemp = minTemp ? minTemp : pixelPoint.weight;
                maxTemp = Math.max(maxTemp, pixelPoint.weight);
                minTemp = Math.min(minTemp, pixelPoint.weight);
            }
        }else {
            pixelPoint.weight = 1;
        }

        x = Math.floor(pixelPoint[0]);
        y = Math.floor(pixelPoint[1]);
        k = pixelPoint.weight;

        data.push([x, y, k]);
    }


    //无最大权重设置
    if (!this.maxWeight) {
        if (maxTemp && minTemp) {
            maxWeightTemp = (maxTemp + minTemp) / 2;
        } else {
            maxWeightTemp = 1;
        }
        this.draw(data, maxWeightTemp);
    } else {
        this.draw(data, this.maxWeight);
    }
};


ol.source.HeatMap.prototype.draw = function (data, maxWeight) {
    if (this.maxHeight > 0 && this.maxWidth > 0) {
        //清空
        var ctx = this.canvasContext;
        this.canvasContext.clearRect(0, 0, this.maxWidth, this.maxHeight);
        this.drawCircle(this.useRadius);
        this.createGradient();

        for (var i = 0; i < data.length; i++) {
            var p = data[i];
            this.canvasContext.globalAlpha = Math.max(p[2] / maxWeight, 0.05);
            this.canvasContext.drawImage(this.circle, p[0] - this.useRadius, p[1] - this.useRadius);
        }

        var colored = ctx.getImageData(0, 0, this.maxWidth, this.maxHeight);
        this.colorize(colored.data, this.grad);
        ctx.putImageData(colored, 0, 0);
    } else {
        return false;
    }
};

ol.source.HeatMap.prototype.colorize = function (pixels, gradient) {
    for (var i = 0, j; i < pixels.length; i += 4) {
        j = pixels[i + 3] * 4;
        if (j) {
            pixels[i] = gradient[j];
            pixels[i + 1] = gradient[j + 1];
            pixels[i + 2] = gradient[j + 2];
        }
    }
};

ol.source.HeatMap.prototype.drawCircle = function (r) {
    var blur = r / 2;

    var circle = this.circle = document.createElement('canvas'),
        ctx = circle.getContext("2d");

    circle.height = 2 * r;
    circle.width = 2 * r;
    ctx.shadowOffsetX = ctx.shadowOffsetY = 2 * r;
    ctx.shadowBlur = blur;
    ctx.shadowColor = "#000000";

    ctx.beginPath();
    ctx.arc(-r, -r, r / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    // ctx.fillStyle="red";
    // ctx.fillRect(r,r,r,r);
};

ol.source.HeatMap.prototype.createGradient = function () {
    var colors = this.colors;
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d"),
        gradient = ctx.createLinearGradient(0, 0, 0, 256); //梯度渐变
    canvas.height = 256;
    canvas.width = 1;

    var index = 1;
    for (var i = 0, len = colors.length; i < len; i++) {
        gradient.addColorStop(index / len, colors[i]);
        index++;
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 256);

    this.grad = ctx.getImageData(0, 0, 1, 256).data;
};

ol.source.HeatMap.prototype.getLocalXY = function (coordinate) {
    var pixelP, map = this.map;

    if(coordinate instanceof  ol.geom.Point){
        pixelP = map.getPixelFromCoordinate([coordinate.getCoordinates()[0],coordinate.getCoordinates()[1]])
    }

    var rotation = -map.getView().getRotation();
    var center = map.getPixelFromCoordinate(map.getView().getCenter());
    var rotatedP = pixelP;
    if (this.pixelRatio) {
        rotatedP = this.scale(pixelP, center, this.pixelRatio);
    }
    if (pixelP && center) {
        rotatedP = this.rotate(rotatedP, rotation, center);
    }
    if (this.offset && rotatedP) {
        return [rotatedP[0] + this.offset[0], rotatedP[1] + this.offset[1]];
    }
    return rotatedP;
};

ol.source.HeatMap.prototype.rotate = function (pixelP, rotation, center) {
    var x = Math.cos(rotation) * (pixelP[0] - center[0]) - Math.sin(rotation) * (pixelP[1] - center[1]) + center[0];
    var y = Math.sin(rotation) * (pixelP[0] - center[0]) + Math.cos(rotation) * (pixelP[1] - center[1]) + center[1];
    return [x, y];
};

ol.source.HeatMap.prototype.scale = function (pixelP, center, scaleRatio) {
    var x = (pixelP[0] - center[0]) * scaleRatio + center[0];
    var y = (pixelP[1] - center[1]) * scaleRatio + center[1];
    return [x, y];
};

ol.source.HeatMap.prototype.removeFeatures = function (features) {
    if (!features || features.length === 0 || !this.features || this.features.length === 0) {
        return;
    }
    if (features === this.features) {
        return this.removeAllFeatures();
    }
    if (!(ol.gw.Util.isArray(features))) {
        features = [features];
    }
    var heatPoint, index, heatPointsFailedRemoved = [];
    for (var i = 0, len = features.length; i < len; i++) {
        heatPoint = features[i];
        index = ol.gw.Util.indexOf(this.features, heatPoint);
        //找不到视为删除失败
        if (index === -1) {
            heatPointsFailedRemoved.push(heatPoint);
            continue;
        }
        //删除热点
        this.features.splice(index, 1);
    }
    var succeed = heatPointsFailedRemoved.length == 0 ? true : false;
    //派发删除features成功的事件
    this.dispatchEvent({type: 'featuresremoved', value: {features: heatPointsFailedRemoved, succeed: succeed}});
    this.changed();
};

ol.source.HeatMap.prototype.removeAllFeatures = function () {
    this.features = [];
    this.changed();
};


