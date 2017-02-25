/**
 * @requires OpenLayers/Layer/Vector.js
 * @requires OpenLayers/Geometry/Polygon.js
 */

/**
 * Class: OpenLayers.Layer.LineGrid
 * Author: gaol
 * Date: 2013-6-18
 * Time: 11:32 AM
 * 
 * A line grid layer dynamically generates a regularly spaced grid of line
 *   features.  This is a specialty layer for cases where an application needs
 *   a regular grid of lines. 
 *
 * Create a new vector layer with the <OpenLayers.Layer.LineGrid> constructor.
 * (code)
 * // create a grid with lines spaced at 10 map units
 * var lines = new OpenLayers.Layer.LineGrid({dx: 10, dy: 10});
 *
 * // create a grid with different x/y spacing rotated 15 degrees clockwise.
 * var lines = new OpenLayers.Layer.LineGrid({dx: 5, dy: 10, rotation: 15});
 * (end)
 *
 * Inherits from:
 *  - <OpenLayers.Layer.Vector>
 */
OpenLayers.Layer.LineGrid = OpenLayers.Class(OpenLayers.Layer.Vector, {

    dx: null,

    dy: null,

    ratio: 1.5,

    maxFeatures: 1000,

    rotation: 0,

    origin: null,

    gridBounds: null,

    
    initialize: function(config) {
        config = config || {};
        OpenLayers.Layer.Grid.prototype.initialize.apply(this,
            [config.name, "", {}, config]);
        OpenLayers.Layer.Vector.prototype.initialize.apply(this, [config.name, config]);
    },

    setMap: function(map) {
        OpenLayers.Layer.Vector.prototype.setMap.apply(this, arguments);
        map.events.register("moveend", this, this.onMoveEnd);
    },

    removeMap: function(map) {
        map.events.unregister("moveend", this, this.onMoveEnd);
        OpenLayers.Layer.Vector.prototype.removeMap.apply(this, arguments);
    },

    setRatio: function(ratio) {
        this.ratio = ratio;
        this.updateGrid(true);
    },

    setMaxFeatures: function(maxFeatures) {
        this.maxFeatures = maxFeatures;
        this.updateGrid(true);
    },

    setSpacing: function(dx, dy) {
        this.dx = dx;
        this.dy = dy || dx;
        this.updateGrid(true);
    },

    setOrigin: function(origin) {
        this.origin = origin;
        this.updateGrid(true);
    },

    getOrigin: function() {
        if (!this.origin) {
            this.origin = this.map.getExtent().getCenterLonLat();
        }
        return this.origin;
    },


    setRotation: function(rotation) {
        this.rotation = rotation;
        this.updateGrid(true);
    },


    onMoveEnd: function() {
        this.updateGrid();
    },
    ajustBounds:function(bounds){
    	var maxExtent = this.map.getMaxExtent();
		if(bounds.left < maxExtent.left) bounds.left = maxExtent.left;
		if(bounds.right > maxExtent.right) bounds.right = maxExtent.right;
		if(bounds.top > maxExtent.top) bounds.top = maxExtent.top;
		if(bounds.bottom < maxExtent.bottom) bounds.bottom = maxExtent.bottom;
		return bounds;
    },
    getViewBounds: function() {
        var bounds = this.map.getExtent();
        if (this.rotation) {
            var origin = this.getOrigin();
            var rotationOrigin = new OpenLayers.Geometry.Point(origin.lon, origin.lat);
            var rect = bounds.toGeometry();
            rect.rotate(-this.rotation, rotationOrigin);
            bounds = rect.getBounds();
        }
        return this.ajustBounds(bounds);
    },

    updateGrid: function(force) {
        force = true;	//  force to update grid
        var vis = this.getVisibility();
        var geodx = this.dx * this.map.getResolution();
        var geody = this.dy * this.map.getResolution();
        var maxExtent = this.map.maxExtent;
        if ((force || this.invalidBounds()) && vis) {
            var viewBounds = this.getViewBounds();
            this.gridsBounds = this.ajustBounds(this.getGridsBounds(viewBounds));
            var gridWidth =  this.gridsBounds.getWidth();
            var gridHeight =  this.gridsBounds.getHeight();
            var rows = parseInt(Math.floor(gridHeight / geody));
            var cols = parseInt(Math.floor(gridWidth / geodx));
            var gridLeft = this.gridsBounds.left;
            var gridTop = this.gridsBounds.top;
            var features = new Array(rows + cols + 2);
            var x, y;
            for(var i=0; i<=cols; ++i){
                x = gridLeft + (i * geodx);
                if(x > maxExtent.right) break;
              //  if(gridBottom < maxExtent.bottom) gridBottom = maxExtent.bottom;
                var point1 = new OpenLayers.Geometry.Point(x, gridTop);
                var point2 = new OpenLayers.Geometry.Point(x, gridTop - gridHeight );
                var lineGeometry = new OpenLayers.Geometry.LineString([point1,point2]);
                var lineFeature = new OpenLayers.Feature.Vector(lineGeometry);
                features[i] = lineFeature;
            }

            for (var j=0; j<=rows; ++j) {
                y = gridTop - (j * geody);
                if(y < maxExtent.bottom) break;
                var point1 = new OpenLayers.Geometry.Point(gridLeft, y);
                var point2 = new OpenLayers.Geometry.Point(gridLeft+gridWidth, y );
                var lineGeometry = new OpenLayers.Geometry.LineString([point1,point2]);
                var lineFeature = new OpenLayers.Feature.Vector(lineGeometry);
                features[i+j] = lineFeature;
            }
            this.destroyFeatures(this.features, {silent: true});
            this.addFeatures(features,{silent: true});
        }
    },
    getGridBounds:function(x,y){
        var map_minx = this.map.maxExtent.left;
        var map_maxy = this.map.maxExtent.top;
        var resolution = this.map.getResolution();
        var dx = resolution * this.dx;
        var dy = resolution * this.dy;
        var col = parseInt( Math.ceil(((x - map_minx)/dx)) -1);
        var row = parseInt( Math.ceil(((map_maxy - y)/dy)) -1);
        col = col < 0? 0: col;
        row = row < 0? 0: row;
        var tminx = map_minx + col * dx;
        var tmaxy = map_maxy - row * dy;
        var tmax = tminx + dx;
        var tminy = tmaxy - dy;
        var bounds = new OpenLayers.Bounds(tminx,tminy,tmax,tmaxy);
        return bounds;
    },
    getGridsBounds:function(viewBounds){
        var lbGridBounds = this.getGridBounds(viewBounds.left,viewBounds.bottom);
        var rtGridBounds = this.getGridBounds(viewBounds.right,viewBounds.top);
        return new OpenLayers.Bounds(lbGridBounds.left,lbGridBounds.bottom,rtGridBounds.right,rtGridBounds.top);
    },

    invalidBounds: function() {
        return !this.gridBounds || !this.gridBounds.containsBounds(this.getViewBounds());
    },

    CLASS_NAME: "OpenLayers.Layer.LineGrid"
});