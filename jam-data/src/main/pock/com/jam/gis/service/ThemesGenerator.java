package com.jam.gis.service;

import com.jam.gis.data.AttrParams;
import com.jam.gis.data.DataSetInfo;
import com.jam.gis.map.MapContent;
import com.jam.gis.style.IconMarkerStyle;
import com.jam.gis.style.LayerStyle;
import com.jam.gis.style.StyleConfig;
import com.jam.gis.style.ThemeStyle;
import com.jam.gis.theme.ThemeRange;
import com.jam.gis.theme.ThemeRangeItem;
import com.jam.gis.tile.Tile;
import org.dom4j.Element;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

public class ThemesGenerator extends TilesGenerator implements ITilesGenerator{
    private FeaturesQuery featuresQuery;

    public FeaturesQuery getFeaturesQuery() {
        return featuresQuery;
    }
    public void setFeaturesQuery(FeaturesQuery featuresQuery) {
        this.featuresQuery = featuresQuery;
    }

    HashMap<String, BufferedImage> mkMap = StyleConfig.THEME_MARKERS;
    IconMarkerStyle iconStyle = StyleConfig.getDefThemeMarkerStyle();

    public BufferedImage getDynTile(Object[] features, AttrParams attrParams, MapContent mapContent, Tile tile) {
        BufferedImage img = null;
        String type = attrParams.getDataType();
        Element root = attrParams.themeConfig.getRootElement();
        List list = root.selectNodes("range");

        ThemeRangeItem[] items = new ThemeRangeItem[list.size()];
        int i = 0;
        for (Object o : list) {
            ThemeRangeItem item = new ThemeRangeItem();
            Element e = (Element) o;
            item.setCaption(e.element("caption").getTextTrim());

            String startStr = e.element("start").getTextTrim();
            String endStr = e.element("end").getTextTrim();

            item.setStart(Double.parseDouble(startStr));
            item.setEnd(Double.parseDouble(endStr) + 0.1);
            ThemeStyle themeStyle = new ThemeStyle();
            if ("POINT".equals(type)) {
                themeStyle.markerSymbol = e.element("style").getTextTrim();
            }
            item.setStyle(themeStyle);
            items[(i++)] = item;
        }
        ThemeRange themRange = new ThemeRange();
        themRange.layerStyle = new LayerStyle(
                StyleConfig.getDefThemeMarkerStyle());

        themRange.dataType = type;
        themRange.setItems(items);
        img = themRange.paint(features, mapContent, tile);

        return img;
    }


    /**
     * 生成专题图图例 具体在ThemeRange里实现
     * @param attrParams
     * @return
     */
    public BufferedImage getLegend(AttrParams attrParams) {
        String lyrName = attrParams.getLayerName();
        DataSetInfo dataInfo = DataSetInfo.getDataSetInfoBy(lyrName);
        String dtype = dataInfo.getDataType();
        attrParams.setDataType(dtype);
        ThemeRange themRange = new ThemeRange();
        BufferedImage img = null;
        try {
            img = themRange.getThemeRangeLegend(lyrName, dtype, this.mkMap,this.iconStyle);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return img;
    }
}
