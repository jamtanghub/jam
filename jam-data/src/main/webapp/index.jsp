<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%
	session = request.getSession();
%>
<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    <title>pocking</title>
    <link rel="icon" href="map/imgs/mk.ico" mce_href="map/imgs/mk.ico" type="image/x-icon" />
    <link href='dfc-lib/bootstrap/css/bootstrap.min.css' rel='stylesheet' />
    <link href='dfc-lib/bootstrap/css/bootstrap-responsive.min.css' rel='stylesheet' />
    <link href='map/css/markercluster.css' rel='stylesheet' />
    <script src="dfc-lib/async/async.js"></script>
	<script src="dfc-lib/jquery/jquery.min.js"></script>
	<script src="dfc-lib/bootstrap/js/bootstrap.min.js"></script>
	<script src="dfc-lib/common/json3.min.js"></script>
	<script src="dfc-lib/openlayers/OpenLayers.js"> </script>
	<script src="map/js/tiledlayer.js"></script>
	<script src="map/js/clusterquery.js"></script>
    <script src="map/js/clustertiles.js"></script>
	<script src="map/js/linegrid.js"></script>
    <script src="map/js/main.js"></script>
</head>
<body>
    <div class="wraper">
        <div class="clearfix">
            <div class="float-left ml10 mt10 fs16">
				<div class="dropdown">
					<a class="dropdown-toggle" data-toggle="dropdown" data-target="#">
						<span type="pocking" id="themeType" class="themeType hand">麻点图</span>
						<b class="caret hand"></b>
					</a>
					<ul id="themeList" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
						<li><a type="pocking" href="#">麻点图</a></li>
						<li class="divider"></li>
						<li><a type="range" href="#">分段专题图</a></li>
					</ul>
				</div>
			</div>
			<div class="float-left ml50 mt10 fs16" style="line-height:22px;height:22px;">
			    <div class="title-text fs12 float-left">聚类</div>
				<div id="clusterSwitch" class="switch switch-mini float-left">
				    <input type="checkbox" checked />
				</div>
            </div>
            <div class="mysettings float-right mt10 mr10 fs14">
                <div class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown" data-target="#">
                        <span id="myconfig" class="hand">设置</span> <b class="caret hand"></b>
                    </a>
                    <ul id="configList" class="dropdown-menu pull-right" style="right:0;"  role="menu"
                        aria-labelledby="dropdownMenu">
                        <li><a class="gridsize" gsize="16" href="#"><i class="icon-ok mr10"></i>Grid 16×16</a></li>
                        <li><a class="gridsize" gsize="24" href="#"><i class="icon- mr10"></i>Grid 24×24</a></li>
                        <li><a class="gridsize" gsize="32" href="#"><i class="icon- mr10"></i>Grid 32×32</a></li>
                        <li class="divider"></li>
                        <li><a id="grid-switch" href="#"><i class="icon- mr10"></i>显示网格</a></li>
                    </ul>
                </div>
            </div>
			<div class="input-append float-right mr50">		
				<div class="float-left">
					<input id="keyword" class="span5" id="appendedInputButton" 
						type="text" value="测试-1" >
					<button id="query" class="btn" type="button">查 询</button>
				</div>
			</div>
			<div class="float-right mt5 mr10 fs14">
				<div class="dropdown clearfix">
					<a class="dropdown-toggle" data-toggle="dropdown" data-target="#">
						<span id="layerName"  class="hand">随机数据(10万)</span> <b
						class="caret hand"></b>
					</a>
					<ul id="layerList" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
						<li><a layername="TEST_POINTS" defKeyWord="测试-1" href="#">随机数据(10万)</a></li>
						<li class="divider"></li>
						<li><a layername="WORLD_EARTHQUAKE" defKeyWord="四川" href="#">地震数据(18万)</a></li>
					</ul>
				</div>
			</div>

		</div>
        <div id="map-wrapper" class="map-wrapper">
	        <!--地图显示的div-->
	        <div id="map" class="map-container rect-rounded" ></div> 
	        <!-- 图例 -->
	        <div id="mapLegend" class="map-legend"></div>
        </div>
    </div>
	
</body>
</html>