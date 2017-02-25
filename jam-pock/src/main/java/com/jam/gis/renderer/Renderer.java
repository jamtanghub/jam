package com.jam.gis.renderer;

import com.jam.gis.map.MapContent;

import java.awt.*;
import java.awt.image.BufferedImage;

/**
 * Created by jinn on 2015/7/15.
 */
public class Renderer {
    private MapContent map;

    public BufferedImage generateTranparentImage(int width, int height) {
        BufferedImage image = new BufferedImage(width, height, 1);

        Graphics2D g2d = image.createGraphics();
        image = g2d.getDeviceConfiguration().createCompatibleImage(width, height, 3);

        g2d.dispose();
        g2d = image.createGraphics();
        g2d.setColor(new Color(255, 0, 0));
        g2d.setStroke(new BasicStroke(1.0F));
        g2d.draw(new java.awt.geom.Line2D.Double(0.0D, 0.0D, 0.0D, 0.0D));
        g2d.dispose();
        return image;
    }

    public BufferedImage generateTranslucencyImage(int width, int height, float opcity) {
        BufferedImage image = new BufferedImage(width, height, 2);

        Graphics2D g2d = image.createGraphics();
        int compositeRule = 3;
        AlphaComposite alphaComposite = AlphaComposite.getInstance(compositeRule, opcity);
        g2d.setComposite(alphaComposite);
        g2d.setStroke(new BasicStroke(1.0F));
        g2d.draw(new java.awt.geom.Line2D.Double(0.0D, 0.0D, 0.0D, 0.0D));

        g2d.setColor(Color.white);
        g2d.fillRect(0, 0, image.getWidth(null), image.getHeight(null));
        g2d.dispose();
        return image;
    }

    public MapContent getMap() {
        return this.map;
    }

    public void setMap(MapContent map) {
        this.map = map;
    }
}
