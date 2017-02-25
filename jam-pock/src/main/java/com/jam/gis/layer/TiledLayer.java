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
    private String title;
    private String type;
    private LayerStyle layerStyle;
    private Object[] features;

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

    public TiledLayer(){

    }

    public TiledLayer(Object[] feas, LayerStyle style, String type) {
        this.features = feas;
        this.type = type;
        this.layerStyle = style;
    }

    public void render(Graphics2D g, MapContent map, Bounds bounds) throws IOException {


    }

    public Bounds getBounds(){
        return null;
    }

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




}
