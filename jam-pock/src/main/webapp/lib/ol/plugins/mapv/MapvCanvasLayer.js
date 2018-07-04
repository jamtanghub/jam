/**
 * Created by Tangjin on 2018/4/20.
 */

/**
 * Mapv渲染器
 * @constructor
 */
function MapvCanvasLayer(){
    this.options = options || {};
    this.enableMassClear = this.options.enableMassClear;
    this._map = options.map;
    this.paneName = this.options.paneName || 'mapPane';
    this.context = this.options.context || '2d';
    this.zIndex = this.options.zIndex || 2;
    this.mixBlendMode = this.options.mixBlendMode || null;
    this.width = options.width;
    this.height = options.height;
    initialize();

    var me = this;
    function initialize(){
        var canvas = me.canvas = document.createElement("canvas");
        canvas.style.cssText = "position:absolute;" + "left:0;" + "top:0;" + "z-index:" + me.zIndex + ";user-select:none;";
        canvas.style.mixBlendMode = me.mixBlendMode;
        canvas.className = "mapvClass";
        var global$2 = typeof window === 'undefined' ? {} : window;
        var devicePixelRatio = me.devicePixelRatio = global$2.devicePixelRatio;
        canvas.width = me.width;
        canvas.height = me.height;
        if (me.context == '2d') {
            canvas.getContext(me.context).scale(devicePixelRatio, devicePixelRatio);
        }
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";
    }
}

MapvCanvasLayer.prototype = {

    draw:function() {
        this.options.update && this.options.update.call(this);
    },

    resize:function (mapWidth, mapHeight) {
        this.canvas.width = mapWidth;
        this.canvas.height = mapHeight;
        this.canvas.style.width = mapWidth + "px";
        this.canvas.style.height = mapHeight + "px";
    },

    getContainer:function () {
        return this.canvas;
    },

    setZIndex:function (zIndex) {
        this.canvas.style.zIndex = zIndex;
    },

    getZIndex:function () {
        return this.zIndex;
    }

};

