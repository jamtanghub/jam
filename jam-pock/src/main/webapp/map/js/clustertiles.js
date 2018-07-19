/** 
 * @聚类瓦片服务
 * @author gaol 2013-6-4
 * @version 7.0.0  
 * @依赖 SuperMap.DFC.ClusterQuery，SuperMap.DFC.TiledLayer
 */

SuperMap.DFC.ClusterTiles = function(name,url,attrParams,icon){
	this.layerName = name;
	this.url = url;
	this.attrParams = attrParams;
    this.highligthIcon = icon;
    this.legendId = "";
};

SuperMap.DFC.ClusterTiles.prototype.appendTo = function(geoMap,onclick){
	var tilesLayerName =  this.layerName;
	var dyntiles = geoMap.getLayersByName(tilesLayerName);
	var len = dyntiles.length;
	if(len>0){
		for(var i=0;i<len;i++){
			var legendId = dyntiles[i].legendId;
			if(legendId !== undefined){
				var lgd = document.getElementById(legendId);
				lgd.innerHTML = "";
			}
			geoMap.removeLayer(dyntiles[i]);
		}
	}
	//dyntiles = new SuperMap.DFC.TiledLayer(tilesLayerName, this.url +".img",
	dyntiles = new SuperMap.DFC.TiledLayer(tilesLayerName, this.url,this.attrParams,
		{
			isBaseLayer: false,
			visibility: true
		}
	);
	if(typeof getjson=="undefined" || getjson==null || getjson){
		geoMap.tileMarkerConfig = {};
		dyntiles.events.on({
	        tileloaded: function(evt) {
	        	var tile = evt.tile;
	        	var strUrl = tile.url.replace("img","feature");
	        	$.ajax({
	        		url: strUrl, type: "get", dataType:"json",
	        		success: function(result, status, detail){
	        			if(status=="success"){
	        				tile.imgDiv.features = result.data;
	        				if(geoMap.tileMarkerConfig!==undefined && geoMap.tileMarkerConfig!==null){
	        					if(result.style) geoMap.tileMarkerConfig['iconStyle']  = result.style.iconStyle;
	        				}
	        				
	        			}else{
	        				tile.imgDiv.features = [];
	        			}
	        		},error:function(){
	        			tile.imgDiv.features = [];
	        		}	
	        	});
	            /*var ctx = evt.tile.getCanvasContext();
	            if (ctx) {
	               
	            }*/
	        }
	    });
		geoMap.tileMarkerConfig['hIconStyle'] = this.highligthIcon;
		geoMap.tileMarkerConfig['onclick'] = onclick;
		geoMap.events.register("mousemove", geoMap,this.drawHighlightMarker);
	}
	geoMap.addLayer(dyntiles);
	this.tiledLayer = dyntiles;
	return dyntiles;
};

SuperMap.DFC.ClusterTiles.prototype.setLegend = function(id){
	var url = this.url.replace("img","legend");
	var legendUrl = url + "?THEMETYPE=" + this.attrParams.themeType + "&LAYERS=" + this.attrParams.layers;
	$("#"+id).append("<img src='"+ legendUrl +"' />")
		.find("img").css("vertical-align","top");
	this.tiledLayer.legendId = id;
};

SuperMap.DFC.ClusterTiles.prototype.drawHighlightMarker = function(evt){
	var zindex = 123456789;
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
	var mouse = this.events.getMousePosition(evt);
	var oImg = evt.srcElement || evt.target || evt.toElement;
	var features = oImg.features;
	var boxLeft = 0, boxRight = 0, boxBottom = 0, boxTop = 0;
	if(boxLeft <= mouse.x && mouse.x < boxRight && boxBottom < mouse.y && mouse.y <= boxTop) return;
	if(features){
		var len = features.length;
		for(var i=0;i<len;i++){
			var pnt = features[i];
			var pntPx = this.getPixelFromLonLat(new OpenLayers.LonLat(pnt.x,pnt.y));
			boxLeft = pntPx.x + iconOffX;
			boxRight = pntPx.x + iconW + iconOffX;
			boxTop = pntPx.y + iconH + iconOffY;
			boxBottom = pntPx.y + iconOffY;
			var inx = boxLeft <= mouse.x && mouse.x < boxRight;
			var iny = boxBottom < mouse.y && mouse.y <= boxTop;
			if(inx && iny){
				if(this.highlightPockingLayer == null){
					this.highlightPockingLayer = new OpenLayers.Layer.Markers( "highlightPockingLayer" );
					this.highlightPockingLayer.div.style.width = 0;
					this.addLayer(this.highlightPockingLayer);
				}
					var size = new OpenLayers.Size(hIconW,hIconH);
				var offset = new OpenLayers.Pixel(hIconOffX, hIconOffY+1);
				var icon = new OpenLayers.Icon(highlightIconUrl, size, offset);
				icon.imageDiv.style.cursor = "pointer";
				var mk = new OpenLayers.Marker(new OpenLayers.LonLat(pnt.x,pnt.y),icon);
				mk.events.register('mousedown', mk, function(evt) {
					OpenLayers.Event.stop(evt);
					if(typeof config.onclick === "function"){
						var hmks = icon.imageDiv.getElementsByTagName("div");
						if(hmks && hmks.length>0) hmks[0].style.display = "none";
						config.onclick(pnt,icon.imageDiv.firstChild.id);
						
					}
				});
				mk.events.register('mouseout', mk, function(evt) {
					OpenLayers.Event.stop(evt);
					//map.highlightPockingLayer.removeMarker(mk);
				});
				this.highlightPockingLayer.clearMarkers();
				this.highlightPockingLayer.addMarker(mk);
				this.highlightPockingLayer.setZIndex(zindex);
				var tileNode = document.createElement("div");
				tileNode.innerHTML = pnt.name;
				tileNode.className = "markNameCss";
				icon.imageDiv.style.width = "auto";
				icon.imageDiv.appendChild(tileNode);
				break;
			}else{
				if(this.highlightPockingLayer){
					this.highlightPockingLayer.clearMarkers();
				}
			}
		}
	}
};