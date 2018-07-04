/**
 * Created by Tangjin on 2018/4/16.
 */
ol.gw = ol.gw || {};
ol.gw.Util = {
    DEFAULT_PRECISION: 14,
    lastSeqID:0,
    toFloat:function (number, precision) {
        if (precision == null) {
            precision = ol.gw.Util.DEFAULT_PRECISION;
        }
        if (typeof number !== "number") {
            number = parseFloat(number);
        }
        return precision === 0 ? number :
            parseFloat(number.toPrecision(precision));
    },

    isArray:function (a) {
        return (Object.prototype.toString.call(a) === '[object Array]');
    },

    createUniqueID:function (prefix) {
        if (prefix == null) {
            prefix = "id_";
        }
        ol.gw.Util.lastSeqID += 1;
        return prefix + ol.gw.Util.lastSeqID;
    },

    indexOf:function (array, obj) {
        if (array == null) {
            return -1;
        } else {
            // use the build-in function if available.
            if (typeof array.indexOf === "function") {
                return array.indexOf(obj);
            } else {
                for (var i = 0, len = array.length; i < len; i++) {
                    if (array[i] === obj) {
                        return i;
                    }
                }
                return -1;
            }
        }
    },

    extend:function (destination, source) {
        destination = destination || {};
        if (source) {
            for (var property in source) {
                var value = source[property];
                if (value !== undefined) {
                    destination[property] = value;
                }
            }

            /**
             * IE doesn't include the toString property when iterating over an object's
             * properties with the for(property in object) syntax.  Explicitly check if
             * the source has its own toString property.
             */

            /*
             * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
             * prototype object" when calling hawOwnProperty if the source object
             * is an instance of window.Event.
             */

            var sourceIsEvt = typeof window.Event === "function"
                && source instanceof window.Event;

            if (!sourceIsEvt
                && source.hasOwnProperty && source.hasOwnProperty("toString")) {
                destination.toString = source.toString;
            }
        }
        return destination;
    },

    applyDefaults:function (to, from) {
        to = to || {};
        /*
         * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
         * prototype object" when calling hawOwnProperty if the source object is an
         * instance of window.Event.
         */
        var fromIsEvt = typeof window.Event === "function"
            && from instanceof window.Event;

        for (var key in from) {
            if (to[key] === undefined ||
                (!fromIsEvt && from.hasOwnProperty
                && from.hasOwnProperty(key) && !to.hasOwnProperty(key))) {
                to[key] = from[key];
            }
        }
        /**
         * IE doesn't include the toString property when iterating over an object's
         * properties with the for(property in object) syntax.  Explicitly check if
         * the source has its own toString property.
         */
        if (!fromIsEvt && from && from.hasOwnProperty
            && from.hasOwnProperty('toString') && !to.hasOwnProperty('toString')) {
            to.toString = from.toString;
        }

        return to;
    },

    modifyDOMElement:function (element, id, px, sz, position,
                               border, overflow, opacity) {
        if (id) {
            element.id = id;
        }
        if (px) {
            element.style.left = px.x + "px";
            element.style.top = px.y + "px";
        }
        if (sz) {
            element.style.width = sz.w + "px";
            element.style.height = sz.h + "px";
        }
        if (position) {
            element.style.position = position;
        }
        if (border) {
            element.style.border = border;
        }
        if (overflow) {
            element.style.overflow = overflow;
        }
        if (parseFloat(opacity) >= 0.0 && parseFloat(opacity) < 1.0) {
            element.style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
            element.style.opacity = opacity;
        } else if (parseFloat(opacity) === 1.0) {
            element.style.filter = '';
            element.style.opacity = '';
        }

    }
};
