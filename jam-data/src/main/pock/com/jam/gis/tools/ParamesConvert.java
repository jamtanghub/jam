package com.jam.gis.tools;


public class ParamesConvert {
    public static final String PARAM_VERSION = "VERSION";
    public static final String PARAM_SERVICE = "SERVICE";
    public static final String PARAM_REQUEST = "REQUEST";
    public static final String PARAM_KEYWORD = "KEYWORD";
    public static final String PARAM_ROW = "TILEROW";
    public static final String PARAM_COL = "TILECOL";
    public static final String PARAM_LEVEL = "L";
    public static final String PARAM_RESOLUTION = "RESOLUTION";
    public static final String PARAM_STYLE = "STYLE";
    public static final String PARAM_SRS = "SRS";
    public static final Object PARAM_BOUNDS = "BOUNDS";
    public static final String PARAM_BBOX = "BBOX";
    public static final String PARAM_MAXEXTENT = "MAXEXTENT";
    public static final String PARAM_WIDTH = "WIDTH";
    public static final String PARAM_HEIGHT = "HEIGHT";
    public static final String PARAM_FORMAT = "FORMAT";
    public static final String PARAM_TRANSPARENT = "TRANSPARENT";
    public static final String PARAM_BGCOLOR = "BGCOLOR";
    public static final String PARAM_EXCEPTIONS = "EXCEPTIONS";
    public static final String PARAM_TIME = "TIME";
    public static final String PARAM_ELEVATION = "ELEVATION";
    public static final String PARAM_MAXCOUNT_INTILE = "COUNT";
    public static final String PARAM_LAYERS = "LAYERS";
    public static final String PARAM_QUERY_FILTER = "FILTER";
    public static final String PARAM_QUERY_ORDERBY = "ORDERBY";
    public static final String PARAM_QUERY_GROUPBY = "GROUPBY";
    public static final String PARAM_CLUSTER = "CLUSTER";
    public static final String PARAM_MAXCLUSTERLEVEL = "MAXCLUSTERLEVEL";
    public static final String PARAM_DISTANCE = "DISTANCE";
    public static final String PARAM_GRIDSIZEWIDTH = "GRIDSIZEWIDTH";
    public static final String PARAM_GRIDSIZEHEIGHT = "GRIDSIZEHEIGHT";
    public static final String PARAM_COUNT = "COUNT";
    public static final String PARAM_THEMETYPE = "THEMETYPE";
    public static final String PARAM_SCALE = "SCALE";
    public static final String PARAM_RULE = "RULE";
    public static final String PARAM_USECACHE = "USECACHE";
    public static final String PARAM_CACHESIZE = "CACHESIZE";
    public static final String PARAM_QUERY_LAYERS = "QUERY_LAYERS";
    public static final String PARAM_INFO_FORMAT = "INFO_FORMAT";
    public static final String PARAM_FEATURE_COUNT = "FEATURE_COUNT";
    public static final String PARAM_X = "X";
    public static final String PARAM_Y = "Y";
    public static final int CLUSTER_SIZE = 16;
    public static final String HTML_FORMAT = "text/html";
    public static final String JAVASCRIPT_FORMAT = "text/javascript";
    public static final String DEFAULT_COLOR = "#FFFFFF";
    public static final String DEFAULT_UTF_8 = "UTF-8";
    public static final String DEFAULT_ISO = "ISO-8859-1";
    public static final String IMAGE_FORMAT = "image/png";
    public static final String[] DEFAULT_FORMATS = { "png", "jpeg", "jpg", "gif" };

    //麻点图标文件格式
    public static String getImgFormat(String format)
    {
        if ((format == null) || ("".equals(format)) || ("null".equalsIgnoreCase(format)))
        {
            format = "image/png";
        } else {
            format = format.toLowerCase();
            if (format.indexOf("image") < 0) {
                for (int i = 0; i < DEFAULT_FORMATS.length; i++) {
                    if (DEFAULT_FORMATS[i].equals(format)) {
                        format = "image/" + format;
                    }
                }
            }
        }
        return format;
    }

    public static void main(String[] args)
    {
    }

    public static enum ImgFormat
    {
        png, gif, jpg, jpeg;
    }
}
