/**
 * Class: SuperMap.Layer.HighlightLayer
 *    此图层可以访问queryResult的高亮图。
 *
 * Inherits from:
 *  - <SuperMap.CanvasLayer>
 */
SuperMap.Layer.TiledHighlightLayer = SuperMap.Class(SuperMap.CanvasLayer, {
    /**
     * APIProperty: name
     * {String}图层名称，默认为“TiledHighlightLayer”，防止初始化时未设置图层名
     */
    name: "tiledHighlightMap",

    /**
     * Property: attribution
     * {String} The layer attribution.
     */
    attribution: "",

	redirect:false,
	
	transparent: false,
	//style:'{"fillBackColor":{"red":255,"green":255,"blue":255},"fillForeColor":{"red":255,"green":0,"blue":0},"fillBackOpaque":false,"fillGradientMode":"NONE","fillGradientAngle":0,"fillGradientOffsetRatioX":0,"fillGradientOffsetRatioY":0,"fillOpaqueRate":80,"fillSymbolID":0,"lineColor":{"red":0,"green":0,"blue":0},"lineSymbolID":0,"lineWidth":0.5,"markerAngle":0,"markerSize":1,"markerSymbolID":-1}',
	
	style:'{"markerAngle":0,"markerSize":3,"markerSymbolID":4}',
    /**
     * Constructor: SuperMap.Layer.TiledHighlightLayer
     * 创建TiledHighlightLayer图层，可以浏览queryResult的高亮图。
     * Example:
     * (code)
     *
     * var tiledHighlightLayer = new SuperMap.Layer.TiledHighlightLayer("MyName",url);
     *                                    
     * (end)
     *
     * Parameters:
     * name - {String} 图层名称
     */
    initialize: function(name, url, options) {
        options = SuperMap.Util.extend({}, options);
        SuperMap.CanvasLayer.prototype.initialize.apply(this,[name, url, {}, options] );
    },

    /**
     * Method: clone
     */
    clone: function(obj) {
        if (obj == null) {
            obj = new SuperMap.Layer.TiledHighlightLayer(
                this.name, this.url, this.getOptions());
        }
        obj = SuperMap.CanvasLayer.prototype.clone.apply(this, [obj]);
        return obj;
    },

    /**
     * APIMethod: destroy
     * 解构TiledHighlightLayer类，释放资源。
     */
    destroy: function () {
        var me = this;
        SuperMap.CanvasLayer.prototype.destroy.apply(me, arguments);
    },
    /**
     * Method: getTileUrl
     * 获取瓦片的URL。
     *
     * Parameters:
     * xyz - {Object} 一组键值对，表示瓦片X, Y, Z方向上的索引。
     *
     * Returns
     * {String} 瓦片的 URL 。
     */
    getTileUrl: function (xyz) {
        var me = this;
        var dx = me.resolutions[xyz.z] * me.tileSize.w
        var dy = me.resolutions[xyz.z] * me.tileSize.h
        minx = dx * xyz.x + me.map.maxExtent.left;
        maxy =  me.map.maxExtent.top - dy * xyz.y;
        maxx = dx + minx;
        miny = maxy - dy;
		var urlParams = {
			url: me.url,
			viewBounds: new SuperMap.Bounds(minx,miny,maxx,maxy),
			width: me.tileSize.w,
			height: me.tileSize.h,
			transparent: me.transparent,
			redirect: me.redirect,
			style: me.style
		}
		return this.formatUrl(urlParams);
    },
	formatUrl: function(urlParams){
		var url = urlParams.url;
		if(-1 == url.indexOf("?")){
			url = url + "?";
		}
		if(urlParams.viewBounds){
			url += "viewBounds=" + '{"rightTop":{"y":' + urlParams.viewBounds.top 
				+ ',"x":' + urlParams.viewBounds.right + '},"leftBottom":{"y":' + urlParams.viewBounds.bottom + ',"x":' + 
				urlParams.viewBounds.left + '}}&';
		}
		if(urlParams.width){
			url += "width=" + urlParams.width + '&';
		}
		if(urlParams.height){
			url += "height=" + urlParams.height + '&';
		}
		if(urlParams.transparent){
			url += "transparent=" + urlParams.transparent + '&';
		}
		if(urlParams.redirect){
			url += "redirect=" + urlParams.redirect + '&';
		}
		if(urlParams.style){
			url += "style=" + urlParams.style;
		}
		return url;
	},
    CLASS_NAME: "SuperMap.Layer.TiledHighlightLayer"
});


/*var path = "?layers=" + this.layers + "&filter=" +  this.filter;
path += "&bbox=" + bbox.left +"," + bbox.bottom +"," + bbox.right +"," + bbox.top ;
path += "&maxExtent=" + maxExtent.left +"," + maxExtent.bottom +"," + maxExtent.right +"," + maxExtent.top ;
path += "&resolution=" + resolution + "&width=" + tSize.w+ "&height=" + tSize.h +"&format=" + format;
path += "&transparent=" + transparent + "&l=" + z;
path += "&cluster="+ this.cluster + "&count=" + this.count
		 + "&" + random;
var url = this.url;
if (url instanceof Array) {
    url = this.selectUrl(path, url);
}
return url + path;
*/