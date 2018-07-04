/**
 * Created by Tangjin on 2018/4/23.
 */

var DigControl = (function () {

   var radius = 75;
   var mapContainer = "map";
   var map = null;
   var mousePosition = null;

   var layer = null;


   var init = function (_map,_layer) {
        map = _map;
        layer = _layer;
        UI();
        dig();
   };
   var UI = function () {
       $(document).keydown(function (evt) {
           if(evt.which == 38){
               radius = Math.min(radius + 5,150);
               map.render();
           }else if(evt.which == 40){
              radius = Math.max(radius-5,25);

              map.render();
           }
       });

      $(map.getViewport()) .on("mousemove",function (evt) {
          mousePosition = map.getEventPixel(evt.originalEvent);
          map.render();
      }).on("mouseout",function () {
          mousePosition = null;
          map.render();


          MapUtil.printLayerMsg(map)
      });
   };

   var dig = function () {
       var oldZindex = layer.getZIndex();




       layer.on("precompose",function (evt) {
           layer.setZIndex(999);

           var ctx = evt.context;
           var pixelRatio = evt.frameState.pixelRatio;
           ctx.save();
           ctx.beginPath();
           if(mousePosition){
               ctx.arc(mousePosition[0]*pixelRatio,mousePosition[1]*pixelRatio,radius*pixelRatio,0,2*Math.PI);
               ctx.lineWidth = 5*pixelRatio;
               ctx.strokeStyle = 'rgba(0,0,0,0.5)';
               ctx.stroke();
           }

           ctx.clip();

       });


       layer.on("postcompose",function (evt) {

           var ctx = evt.context;
           ctx.restore();

       });
   };



   return {
       init:init
   }

})();