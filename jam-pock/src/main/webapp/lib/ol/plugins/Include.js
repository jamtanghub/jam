/**
 * Created by Tangjin on 2018/4/16.
 */

(function () {
    var r = new RegExp("(^|(.*?\\/))(include\.js)(\\?|$)"),
        s = document.getElementsByTagName('script'), targetScript;
    for (var i = 0; i < s.length; i++) {
        var src = s[i].getAttribute('src');
        if (src) {
            var m = src.match(r);
            if (m) {
                targetScript = s[i];
                break;
            }
        }
    }

    function inputScript(url) {
        var script = '<script type="text/javascript" src="' + url + '"><' + '/script>';
        document.writeln(script);
    }

    function inputCSS(url) {
        var css = '<link rel="stylesheet" href="' + url + '">';
        document.writeln(css);
    }

    function inArray(arr, item) {
        for (i in arr) {
            if (arr[i] == item) {
                return true;
            }
        }
        return false;
    }

    //加载类库资源文件
    function load() {
        // var includes = (targetScript.getAttribute('include') || "").split(",");
        // var excludes = (targetScript.getAttribute('exclude') || "").split(",");

        inputScript("lib/openlayers/plugins/Util.js");
        // inputScript("lib/openlayers/plugins/LonLat.js");
        // inputScript("lib/openlayers/plugins/Feature.js");
        // inputScript("lib/openlayers/plugins/Vector.js");
        // inputScript("lib/openlayers/plugins/point.js");

    }

    load();
})();
