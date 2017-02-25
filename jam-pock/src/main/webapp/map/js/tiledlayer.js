/** 
 * @自定义动态瓦片图层
 * @author gaol 2013-6-4
 * @version 7.0.0  
 * @依赖 Openlayers
 */

if(typeof(SuperMap) === "undefined"){
	SuperMap = {DFC:{}};
}else{
	if(typeof(SuperMap.DFC) === "undefined") SuperMap.DFC = {};
}
/**
 * Class: SuperMap.DFC.TiledLayer
 * 
 * Inherits from:
 *  - <OpenLayers.Layer.WMS>
 */
SuperMap.DFC.TiledLayer = OpenLayers.Class(OpenLayers.Layer.WMS, {
    url:"services/dyntiles/tile.img",
    // 默认参数设置
    DEFAULT_PARAMS: {
    	service: "TiledLayer",
        version: "1.0.0",
        //request: "GetTile",
        styles: "",
        format: "image/png",
        transparent: true,
        cluster:true,
        count:50
    },

    initialize: function(name, url, params, options) {
        OpenLayers.Layer.WMS.prototype.initialize.apply(this, arguments);
    },
    
    destroy: function() { 
         OpenLayers.Layer.WMS.prototype.destroy.apply(this, arguments);  
    },
    
    clone: function (obj) {
        if (obj == null) {
            obj = new SuperMap.DFC.TiledLayer(this.name,this.url,this.options);
        }
         obj = OpenLayers.Layer.WMS.prototype.clone.apply(this, [obj]);
        return obj;
    },    
    
    /**
     * Method: getURL
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * 
     * Returns:
     * {String} A string with the layer's url and parameters and also the 
     *          passed-in bounds and appropriate tile size specified as 
     *          parameters
     */
    getURL: function (bounds) {
    	var newParams = {};
    	var random = "random="+Math.random(); 
    	newParams.BBOX = this.adjustBounds(bounds);
    	newParams.RESOLUTION = this.map.getResolution();
    	newParams.MAXEXTENT = this.maxExtent;
    	newParams.WIDTH = this.tileSize.w;
    	newParams.HEIGHT = this.tileSize.h;
        newParams.L = this.map.getZoom();
        if(this.params.MAXCLUSTERLEVEL===undefined || this.params.MAXCLUSTERLEVEL===null ){
        	newParams.MAXCLUSTERLEVEL = (this.map.numZoomLevels<5)?this.map.numZoomLevels:(this.map.numZoomLevels-3);
        }
        return this.getFullRequestString(newParams);
    },

    CLASS_NAME: "SuperMap.DFC.TiledLayer"
});