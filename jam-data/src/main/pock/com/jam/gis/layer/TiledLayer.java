package com.jam.gis.layer;

import com.jam.gis.map.MapContent;
import com.jam.gis.style.LayerStyle;
import com.jam.gis.style.StyleConfig;
import com.jam.gis.tile.Bounds;
import com.jam.gis.tile.NPoint;
import com.jam.gis.tile.Size;
import com.jam.gis.tile.Tile;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.IllegalFormatCodePointException;


public class TiledLayer implements ILayer {
    private String title;//
    private String type;//数据类型（点线面等）
    private LayerStyle layerStyle;//切片样式
    private Object[] features;//切片麻点对象Point组

    public TiledLayer(){}

    public TiledLayer(Object[] feas, LayerStyle style, String type) {
        this.features = feas;
        this.type = type;
        this.layerStyle = style;
    }

    public void render(Graphics2D g, MapContent map, Bounds bounds) throws IOException {}

    public BufferedImage paint(MapContent map, Tile tile) throws IOException {
        Bounds bbox = tile.getBbox();
        Size tileSize = tile.getTileSize();
        BufferedImage    mkIcon = StyleConfig.DEFAULT_MARKER_ICON;
        int offsetX = this.layerStyle.getIconStyle().iconOffsetX;
        int offsetY = this.layerStyle.getIconStyle().iconOffsetY;
        try {
            BufferedImage tileImg = new BufferedImage(1, 1, 1);

            Graphics2D g2d = tileImg.createGraphics();
            tileImg = g2d.getDeviceConfiguration().createCompatibleImage(tileSize.w, tileSize.h, 3);

            g2d.dispose();
            Graphics2D graphics = tileImg.createGraphics();
            if (this.type.equals("POINT")) {
                Object array[] = getFeatures();
                if (array != null) {
                    int len = array.length;
                    for (int i = 0; i < len; i++) {
                        NPoint fea = (NPoint) array[i];
                        int[] pixel = map.coordsToPixel(fea.getX(), fea.getY(), bbox);
                        graphics.drawImage(mkIcon, pixel[0] + offsetX, pixel[1] + offsetY, null);
                    }
                }
            }
            graphics.dispose();
            return tileImg;
        } finally {
        }
    }

    /**
     * 瓦片上绘制麻点图标
     * */
    public BufferedImage paint(MapContent map, Tile tile,String iconPath) throws IOException {
        Bounds bbox = tile.getBbox();//切片边界
        Size tileSize = tile.getTileSize();//切片大小

        BufferedImage mkIcon = StyleConfig.createIcon(iconPath);//读取瓦片麻点图标
        //获取麻点图标样式
        int offsetX = this.layerStyle.getIconStyle().iconOffsetX;
        int offsetY = this.layerStyle.getIconStyle().iconOffsetY;
        try {
            //宽1，高1，图形类型1
            BufferedImage tileImg = new BufferedImage(1, 1, 1);
            Graphics2D g2d = tileImg.createGraphics();//创建2D图形对象
            tileImg = g2d.getDeviceConfiguration().createCompatibleImage(tileSize.w, tileSize.h, 3);//指定2D兼容图的宽高和通明度
            g2d.dispose();
            Graphics2D graphics = tileImg.createGraphics();
            //瓦片麻点类型为点对象
            if (this.type.equals("POINT")) {
                Object array[] = getFeatures();//瓦片麻点对象组
                if (array != null) {
                    int len = array.length;
                    for (int i = 0; i < len; i++) {
                        NPoint fea = (NPoint) array[i];
                        int[] pixel = map.coordsToPixel(fea.getX(), fea.getY(), bbox);//麻点坐标相对于瓦片边界的像素位置
                        graphics.drawImage(mkIcon, pixel[0] + offsetX, pixel[1] + offsetY, null);//图形对象上绘制麻点图标
                    }
                }
            }
            graphics.dispose();
            return tileImg;
        } catch (Exception e) {
            System.out.println("瓦片上绘麻点图标出错！");
            return null;
        } finally {
        }
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Object[] getFeatures() {
        return this.features;
    }

    public void setFeatures(Object[] features) {
        this.features = features;
    }

    public Bounds getBounds() {
        return null;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LayerStyle getLayerStyle() {
        return this.layerStyle;
    }

    public void setLayerStyle(LayerStyle layerStyle) {
        this.layerStyle = layerStyle;
    }
}
