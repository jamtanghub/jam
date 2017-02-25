/*
 * Copyright 1997-2011, SuperMap Software Co., Ltd 版权所有© 1997-2011，北京超图软件股份有限公司
 */

/**
 * @fileOverview 执行脚本加载工作，在开发过程中使用这里即加载所有SMGIS的分项脚本，最终发布时，应该是一个压缩版~
 *               将本文件放在子系统工程中，配置路径SMGIS.Loader.basePath 如果有额外需要加载的Tag 请自主添加
 */
var SMGIS = SMGIS || {};
/**
 *  config ip address
 *  sgs server address and business framework address
 */
var g_sgsserver = "172.16.10.118:8090";		// 共享平台地址
var g_webframe = "172.16.10.88:8090";		
var g_cas = "172.16.10.17:8090";			// 单点登录
var g_portal = "172.16.10.118:8090/sgs";  	// 门户

/**
 * @namespace 脚本加载
 * @static
 */
SMGIS.Loader = {
	// tag里没有依赖关系
	// [tagName, requireJavascripts, requireCSSs]
	_tags : [
				["jquery-1.7.2", "jquery/jquery-1.7.2" ],
				["jquery-1.4.4", "jquery/jquery-1.4.4.min" ],
				["jquery-flexigrid1.1", "jquery/jquery-flexigrid1.1/js/flexigrid",
				 		"jquery/jquery-flexigrid1.1/css/flexigrid.pack"],
		 		["jquery-flexigridOneMap", "jquery/jquery-flexigrid1.1/js/flexigrid",
		 		 		"jquery/jquery-flexigrid1.1/css/flexigrid.pack"],
				["jquery-ztree", "jquery/jquery-ztree/js/jquery.ztree.all-3.1",
						"jquery/jquery-ztree/css/zTreeStyle/zTreeStyle" ],
				["jquery-lhgdialog4.1", "jquery/jquery-lhgdialog4.1/lhgdialog.min?self=true&skin=mac"],
				["jquery-menu","jquery/jquery-menu/js/jqxcore,jquery/jquery-menu/js/jqxmenu",
				 		"jquery/jquery-menu/css/jqx.base"],
				["dhtmlx", "dhtmlx/dhtmlxcommon,dhtmlx/dhtmlxcontainer" ],
				["dhtmlx_tabbar", "dhtmlx/dhtmlx-tabbar/dhtmlxtabbar", "dhtmlx/dhtmlx-tabbar/dhtmlxtabbar"],
				["dhtmlx_toolbar", "dhtmlx/dhtmlx-toolbar/dhtmlxtoolbar", "dhtmlx/dhtmlx-toolbar/skins/dhtmlxtoolbar_dhx_skyblue,dhtmlx/dhtmlx-toolbar/common/css/style"],
				["windows","dhtmlx/dhtmlx-windows/dhtmlxwindows",
						"dhtmlx/dhtmlx-windows/dhtmlxwindows,dhtmlx/dhtmlx-windows/skins/dhtmlxwindows_dhx_skyblue" ],
				["layout","dhtmlx/dhtmlx-layout/dhtmlxlayout",
						"dhtmlx/dhtmlx-layout/dhtmlxlayout,dhtmlx/dhtmlx-layout/skins/dhtmlxlayout_dhx_skyblue" ],
				["highcharts","highcharts/highcharts.src,highcharts/exporting.src,highcharts/canvas-tools.src"],
				["mapquery","business-common/MapQuery"],
				["ajaxrequest","business-common/AjaxRequest"],
				["jquery-ui","jquery/jquery-ui-1.8.19/js/jquery-ui-1.8.19.custom.min,jquery/jquery-ui-1.8.19/js/jquery.ui.datepicker-zh-CN",
				 	"jquery/jquery-ui-1.8.19/css/ui-base/jquery.ui.all,jquery/jquery-ui-1.8.19/css/demosCss/demos"],
				["jquery-ui-start","jquery/jquery-ui-1.8.19/js/jquery-ui-1.8.19.custom.min",
				 	"jquery/jquery-ui-1.8.19/css/start/jquery-ui-1.8.21.custom,jquery/jquery-ui-1.8.19/css/start/demos"],
				["jquery-easyui-1.2.6","jquery/jquery-easyui-1.2.6/jquery.easyui.min",
				 		"jquery/jquery-easyui-1.2.6/themes/default/easyui,jquery/jquery-easyui-1.2.6/themes/icon"],
				["fancybox","jquery/jquery-fancybox/fancybox/lib/jquery.mousewheel-3.0.6.pack,jquery/jquery-fancybox/fancybox/source" +
						"/jquery.fancybox,jquery/jquery-fancybox/fancybox/source/helpers/jquery.fancybox-buttons",
						"jquery/jquery-fancybox/fancybox/source/helpers/jquery.fancybox-buttons,jquery/jquery-fancybox/fancybox/source/jquery.fancybox"]],
	_js : {},
	_css : {},

	/**
	 * 加载脚本文件
	 * 
	 * @param {String}
	 *            inc 文件名
	 * @return String
	 */
	_IncludeScript : function(inc) {
		var script = "";
		if (inc.indexOf("?") > -1) {
			script = '<script type="text/javascript" src="' + this.basePath
				+ inc.substring(0, inc.indexOf("?")) + '.js' + inc.substring(inc.indexOf("?")) +  '"></script>';
		} else {
			script = '<script type="text/javascript" src="' + this.basePath
				+ inc + '.js"></script>';
		}
		
		return script;
	},
	/**
	 * 加载样式文件
	 * 
	 * @param {String}
	 *            inc 文件名
	 * @return String
	 */
	_IncludeStyle : function(inc) {
		var style = '<link type="text/css" rel="stylesheet" href="'
				+ this.basePath + inc + '.css" />';
		return style;
	},
	/**
	 * 向文档节点里添加文件
	 * 
	 * @param {String}
	 *            str
	 */
	_add : function(str) {
		window.document.write(str);
	},
	/**
	 * 加载文件
	 * 
	 * @example <script type="text/javascript" src="SMGIS.Loader.js"></script>
	 *          <script type="text/javascript"> //立刻执行加载 SMGIS.Loader.load("");
	 *          //文件路径 </script>
	 * @param {Array
	 *            <String>} tags
	 */
	load : function(tags) {
		// 将tag中的脚本进行整理，去重
		for ( var i = 0; i < tags.length; i++) {
			var t = null;
			for ( var k = 0; k < this._tags.length; k++) {
				if (this._tags[k][0] == tags[i]) {
					t = this._tags[k];
					break;
				}
			}
			if (t) {
				if (t[1]) {
					var tjs = t[1].split(",");
					for ( var j = 0; j < tjs.length; j++) {
						this._js[tjs[j]] = 1;
					}
				}
				if (t[2]) {
					var tcss = t[2].split(",");
					for ( var j = 0; j < tcss.length; j++) {
						this._css[tcss[j]] = 1;
					}
				}
			} else {
				alert(tags[i] + " 未能找到该tag。");
			}
		}
		// 构建HTML的js css标签
		var ret = [];
		for (key in this._js) {
			ret.push(this._IncludeScript(key));
		}
		for (key in this._css) {
			ret.push(this._IncludeStyle(key));
		}

		this._add(ret.join(""));
	}	
};

/**
 * 脚本基础路径 loader指向framework，请配置路径
 * 
 * @type String
 * @static
 */
SMGIS.Loader.basePath = "http://"+g_webframe+"/webframe/js/";