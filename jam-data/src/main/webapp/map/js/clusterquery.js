/** 
 * @数据聚类查询服务
 * @author gaol 2013-6-4
 * @version 7.0.0  
 * @依赖 Openlayers
 */

if(typeof(SuperMap) === "undefined"){
	SuperMap = {DFC:{}};
}else{
	if(typeof(SuperMap.DFC) === "undefined") SuperMap.DFC = {};
}

SuperMap.DFC.ClusterQuery = function(map,url){
	if(typeof url === "string"){
		this.url = url;
	}else{
		var strFullPath = window.document.location.href; 
		var strPath = window.document.location.pathname; 
		var pos = strFullPath.indexOf(strPath); 
		var prePath = strFullPath.substring(0,pos); 
		var postPath = strPath.substring(0,strPath.substr(1).indexOf('/')+1); 
		this.url = prePath+postPath + "/cluster"; 
	}
	this.map = map;
	this.count = 50;
	this.cluster = true;
	this.bounds = map.getExtent();
	this.tileWidth = map.tileSize.w;
	this.tileHeight = map.tileSize.h;
	this.maxExtent = map.maxExtent;
	this.resolution = map.getResolution();
};
SuperMap.DFC.ClusterQuery.prototype.query =  function (oParams,onsucc,onfail,onerror){
	var random = "random="+Math.random();
	var paras = "";
	this.layers = oParams.layers;
	this.filter = oParams.filter;
	this.count = oParams.count || this.count;
	this.cluster = oParams.cluster || this.cluster;
	var bounds = oParams.bounds || this.bounds ;
	//var viewBounds = this.adjustBounds(this.map.getExtent(),this.maxExtent);
	var maxExtent = this.maxExtent;
	paras += "LAYERS=" + this.layers + "&FILTER=" + this.filter;
	paras += "&BOUNDS=" + bounds.left +"," + bounds.bottom +"," + bounds.right +"," + bounds.top ;
	paras += "&MAXEXTENT=" + maxExtent.left +"," + maxExtent.bottom +"," + maxExtent.right +"," + maxExtent.top ;
	paras += "&RESOLUTION=" + this.resolution + "&WIDTH=" + this.tileWidth+ "&HEIGHT=" + this.tileHeight 
			 + "&CLUSTER="+ this.cluster + "&COUNT=" + this.count + "&" + random;
	$.ajax({
		url: this.url + "?" + paras, type: "get", dataType:"json",
		success: function(result, status, detail){
			if(status=="success"){
				alert(result.success);
			}else{
				
			}
		},error:function(){
			alert("query error");
		}	
	});
	
};
SuperMap.DFC.ClusterQuery.prototype.adjustBounds =  function(bounds,maxExtent){
	if(bounds.left<maxExtent.left) bounds.left = maxExtent.left;
	if(bounds.bottom<maxExtent.bottom) bounds.bottom = maxExtent.bottom;
	if(bounds.right>maxExtent.right) bounds.right = maxExtent.right;
	if(bounds.top>maxExtent.top) bounds.top = maxExtent.top;
	return bounds;
};
