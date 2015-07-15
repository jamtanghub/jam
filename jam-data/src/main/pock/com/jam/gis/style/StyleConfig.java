package com.jam.gis.style;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Properties;
import java.util.Set;
import org.apache.log4j.Logger;


public class StyleConfig {
    private static Logger logger = Logger.getLogger(StyleConfig.class);
    public static final Properties TILESTYLE_CONFIG;//切片样式配置
    public static final BufferedImage DEFAULT_MARKER_ICON;//默认麻点图标对象
    public static final HashMap<String, BufferedImage> THEME_MARKERS;//行业分段专题图标对象

    public static IconMarkerStyle getDefMarkerStyle() {
        IconMarkerStyle mkStyle = new IconMarkerStyle();
        mkStyle.iconUrl = TILESTYLE_CONFIG.getProperty("icon.defUrl").toString();
        mkStyle.iconWidth = Integer.parseInt(TILESTYLE_CONFIG.getProperty("icon.width").toString());
        mkStyle.iconHeight = Integer.parseInt(TILESTYLE_CONFIG.getProperty("icon.height").toString());
        mkStyle.iconOffsetX = Integer.parseInt(TILESTYLE_CONFIG.getProperty("icon.offsetX").toString());
        mkStyle.iconOffsetY = Integer.parseInt(TILESTYLE_CONFIG.getProperty("icon.offsetY").toString());
        return mkStyle;
    }

    /**
     * @param defUrl   "/pock/imgs/peop.png"
     * @return
     */
    public static IconMarkerStyle getDefMarkerStyle(String defUrl){
        IconMarkerStyle mkStyle = new IconMarkerStyle();
        mkStyle.iconUrl = defUrl;
        mkStyle.iconWidth  = Integer.parseInt(TILESTYLE_CONFIG.getProperty("icon.width").toString());
        mkStyle.iconHeight = Integer.parseInt(TILESTYLE_CONFIG.getProperty("icon.height").toString());
        mkStyle.iconOffsetX = Integer.parseInt(TILESTYLE_CONFIG.getProperty("icon.offsetX").toString());
        mkStyle.iconOffsetY = Integer.parseInt(TILESTYLE_CONFIG.getProperty("icon.offsetY").toString());
        return mkStyle;
    }

    public static IconMarkerStyle getDefThemeMarkerStyle() {
        IconMarkerStyle mkStyle = new IconMarkerStyle();
        mkStyle.iconUrl = TILESTYLE_CONFIG.getProperty("theme.icons.rootpath").toString();
        mkStyle.iconWidth = Integer.parseInt(TILESTYLE_CONFIG.getProperty("theme.icons.width").toString());
        mkStyle.iconHeight = Integer.parseInt(TILESTYLE_CONFIG.getProperty("theme.icons.height").toString());
        mkStyle.iconOffsetX = Integer.parseInt(TILESTYLE_CONFIG.getProperty("theme.icons.offsetX").toString());
        mkStyle.iconOffsetY = Integer.parseInt(TILESTYLE_CONFIG.getProperty("theme.icons.offsetY").toString());
        return mkStyle;
    }

    //读取指定路径下图片缓存对象
    public static BufferedImage createIcon(String iconPath){
        InputStream iconIS = StyleConfig.class.getResourceAsStream(iconPath);
        BufferedImage icon = null;
        try {
            icon = ImageIO.read(iconIS);//读取
        } catch (IOException e) {
            System.out.println("缓存图片读出错！iconPath："+iconPath);
            e.printStackTrace();
        }
        return icon;
    }

    //服务启动时，读取图层瓦片tiles-config.properties样式配置文件
    static {
        Properties op = new Properties();
        try {
            InputStream in = StyleConfig.class.getResourceAsStream("/pock/tiles-config.properties");
            op = new Properties();
            op.load(in);
            if (in != null)
                in.close();
        } catch (IOException e) {
            logger.error("读取图层瓦片tiles-config.properties配置文件失败！");
        }
        TILESTYLE_CONFIG = op;
        String iconPath = TILESTYLE_CONFIG.getProperty("icon.defUrl").toString();
        InputStream iconIS = null;
        BufferedImage icon = null;
        try {
            iconIS = StyleConfig.class.getResourceAsStream(iconPath);
            icon = ImageIO.read(iconIS);
            if (iconIS != null) iconIS.close();
        } catch (FileNotFoundException e) {
            logger.error(e.getMessage());
        } catch (IOException e) {
            logger.error(e.getMessage());
        }
        DEFAULT_MARKER_ICON = icon;
        String iconRoot = TILESTYLE_CONFIG.getProperty("theme.icons.rootpath").toString();

        THEME_MARKERS = new HashMap();
        iconIS = null;
        icon = null;
        Set set = TILESTYLE_CONFIG.keySet();
        Iterator it = set.iterator();
        while (it.hasNext()) {
            String key = (String) it.next();
            if (key.startsWith("theme.markers")) {
                iconPath = iconRoot + TILESTYLE_CONFIG.getProperty(key).toString();
                try {
                    iconIS = StyleConfig.class.getResourceAsStream(iconPath);
                    icon = ImageIO.read(iconIS);
                    THEME_MARKERS.put(key, icon);
                    if (iconIS != null) iconIS.close();
                } catch (FileNotFoundException e) {
                    logger.error(e.getMessage());
                } catch (IOException e) {
                    logger.error(e.getMessage());
                }
            }
        }
    }
}
