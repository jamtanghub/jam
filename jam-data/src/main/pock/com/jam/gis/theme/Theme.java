package com.jam.gis.theme;

import com.jam.gis.style.LayerStyle;
import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.io.SAXReader;

import java.io.IOException;
import java.io.InputStream;


public class Theme {
    private static Logger logger = Logger.getLogger(Theme.class);
    public ThemeType themeType;
    public String dataType;
    public LayerStyle layerStyle;

    public static Document getThemeConfigBy(String name) {
        Document doc = null;
        try {
            //麻点专题xml配置文件
            InputStream in = Theme.class.getResourceAsStream("/pock/themes/themes.xml");
            SAXReader reader = new SAXReader();
            doc = reader.read(in);
            if (in != null) in.close();
        } catch (IOException e) {
            logger.error("读取 themes文件 " + name + ".xml 失败！");
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return doc;
    }
}
