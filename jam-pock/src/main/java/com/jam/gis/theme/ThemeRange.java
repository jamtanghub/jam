package com.jam.gis.theme;

import com.jam.gis.map.MapContent;
import com.jam.gis.style.IconMarkerStyle;
import com.jam.gis.style.StyleConfig;
import com.jam.gis.style.ThemeStyle;
import com.jam.gis.tile.Bounds;
import com.jam.gis.tile.NPointTheme;
import com.jam.gis.tile.Size;
import com.jam.gis.tile.Tile;
import com.jam.gis.tools.StringHelper;
import org.dom4j.Document;
import org.dom4j.Element;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

public class ThemeRange extends Theme {
    public ThemeRangeItem[] items;
    public String rangeExpression;

    public ThemeRange() {
        this.themeType = ThemeType.RANGE;
    }

    public List kvs = null;



    //专题图
    public BufferedImage paint(Object[] features, MapContent map, Tile tile) {
        Size tileSize = tile.getTileSize();
        Bounds bbox = tile.getBbox();

        BufferedImage tileImg = new BufferedImage(1, 1, 1);

        Graphics2D g2d = tileImg.createGraphics();
        tileImg = g2d.getDeviceConfiguration().createCompatibleImage(
                tileSize.w, tileSize.h, 3);

        g2d.dispose();
        Graphics2D graphics = tileImg.createGraphics();
        BufferedImage icon = StyleConfig.DEFAULT_MARKER_ICON;
        HashMap mkMap = StyleConfig.THEME_MARKERS;
        if ((this.dataType.equals("POINT")) && (features != null)) {
            IconMarkerStyle iconStyle = this.layerStyle.getIconStyle();
            int len = features.length;
            for (int i = 0; i < len; i++) {
                NPointTheme fea = (NPointTheme) features[i];

                ThemeStyle style = getStyleBy(fea.getKv());          // 拿到kv值  看其在那个区间



                icon = (BufferedImage) mkMap.get(style.markerSymbol);
                int[] pixel = map.coordsToPixel(fea.getX(), fea.getY(),
                        bbox);
                graphics.drawImage(icon, pixel[0] + iconStyle.iconOffsetX,
                        pixel[1] + iconStyle.iconOffsetY, null);
            }

        }

        return tileImg;

    }

    //专题图图例
    public BufferedImage getThemeRangeLegend(String lyrName, String dataType,
                                             HashMap<String, BufferedImage> mkMap, IconMarkerStyle iconStyle)
            throws IOException {
        Document doc = Theme.getThemeConfigBy(lyrName);
        Element root = doc.getRootElement();
        List listRange = root.selectNodes("range");
        int linesNum = listRange.size();
        int captionLen = 0;
        String[] captions = new String[linesNum];
        int i = 0;
        for (Object o : listRange) {
            Element e = (Element) o;
            String caption = e.element("caption").getTextTrim();
            captions[i] = caption;
            int strLen = StringHelper.lengthEx(captions[i]);
            if (captionLen < strLen)
                captionLen = strLen;
            i++;
        }
        int charSize = 14;
        int leftMargin = 10;
        int rightMargin = 12;
        int topMargin = 10;
        int bottomMargin = 10;
        int lineHeight = iconStyle.iconHeight + 10;
        int colMargin = 8;
        int imgHeight = topMargin + lineHeight * linesNum + bottomMargin / 2;
        int imgWidth = leftMargin + iconStyle.iconWidth + colMargin
                + captionLen / 2 * charSize + rightMargin;
        int top = topMargin;
        float alpha = 0.5F;
        BufferedImage image = new BufferedImage(imgWidth, imgHeight, 2);
        Graphics2D graphics = image.createGraphics();
        int compositeRule = 3;
        AlphaComposite alphaComposite = AlphaComposite.getInstance(
                compositeRule, alpha);
        graphics.setComposite(alphaComposite);
        graphics.setStroke(new BasicStroke(1.0F));
        graphics.draw(new Rectangle(0, 0, imgWidth, imgHeight));

        graphics.setColor(Color.white);
        graphics.fillRect(0, 0, image.getWidth(null), image.getHeight(null));

        alphaComposite = AlphaComposite.getInstance(compositeRule, 1.0F);
        graphics.setComposite(alphaComposite);
        graphics.setColor(Color.black);
        graphics.setFont(new Font("宋体", 0, charSize));
        i = 0;
        for (Object o : listRange) {
            Element e = (Element) o;
            if ("POINT".equals(dataType)) {
                String iconSymbol = e.element("style").getTextTrim();
                BufferedImage icon = mkMap.get(iconSymbol);
                graphics.drawImage(icon, leftMargin, top, null);
                graphics.drawString(captions[(i++)], leftMargin
                        + iconStyle.iconWidth + colMargin, top + 14);
                top += lineHeight;
            }
        }
        graphics.dispose();
        return image;
    }

    public ThemeStyle getStyleBy(double val) {
        ThemeStyle tstyle = null;
        int len = this.items.length;
        for (int i = 0; i < len; i++) {
            ThemeRangeItem item = this.items[i];
            double start = item.start;
            double end = item.end;
            if ((val >= start) && (val < end)) {
                tstyle = item.style;
                break;
            }
        }
        return tstyle;
    }

    public ThemeRangeItem[] getItems() {
        return this.items;
    }

    public void setItems(ThemeRangeItem[] items) {
        this.items = items;
    }

    public String getRangeExpression() {
        return this.rangeExpression;
    }

    public void setRangeExpression(String rangeExpression) {
        this.rangeExpression = rangeExpression;
    }
}
