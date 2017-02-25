package com.jam.gis.style;

import java.awt.*;


public class ThemeStyle {
    public Color fillBackColor;
    public boolean fillBackOpaque;
    public Color fillForeColor;
    public int fillOpaqueRate;
    public int fillSymbol;
    public Color lineColor;
    public int lineSymbol;
    public double lineWidth;
    public double markerAngle;
    public double markerSize;
    public String markerSymbol;

    public ThemeStyle()
    {
        this.fillBackColor = new Color(255, 255, 255);
        this.fillForeColor = new Color(255, 0, 0);
        this.lineColor = new Color(0, 0, 0);
        this.lineWidth = 0.01D;
        this.fillOpaqueRate = 100;
    }

    public ThemeStyle(ThemeStyle paramStyle)
    {
        if (paramStyle.fillBackColor != null) {
            this.fillBackColor = paramStyle.fillBackColor;
        }
        this.fillBackOpaque = paramStyle.fillBackOpaque;
        if (paramStyle.fillForeColor != null) {
            this.fillForeColor = paramStyle.fillForeColor;
        }
        this.fillOpaqueRate = paramStyle.fillOpaqueRate;
        this.fillSymbol = paramStyle.fillSymbol;
        if (paramStyle.lineColor != null) {
            this.lineColor = paramStyle.lineColor;
        }
        this.lineSymbol = paramStyle.lineSymbol;
        this.lineWidth = paramStyle.lineWidth;
        this.markerAngle = paramStyle.markerAngle;
        this.markerSize = paramStyle.markerSize;
        this.markerSymbol = paramStyle.markerSymbol;
    }
}
