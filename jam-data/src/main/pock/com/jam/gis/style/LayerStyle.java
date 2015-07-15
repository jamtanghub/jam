package com.jam.gis.style;


public class LayerStyle {
    String lineWidth;
    String lineColor;
    String fillColor;
    IconMarkerStyle iconStyle;

    public LayerStyle()
    {
    }

    public LayerStyle(IconMarkerStyle mkStyle)
    {
        this.iconStyle = mkStyle;
    }

    public IconMarkerStyle getIconStyle() {
        return this.iconStyle;
    }

    public void setIconStyle(IconMarkerStyle iconStyle) {
        this.iconStyle = iconStyle;
    }

    public void setIconStyle(String iconUrl, int iconWidth, int iconHeight, int iconOffsetX, int iconOffsetY) {
        this.iconStyle.iconUrl = iconUrl;
        this.iconStyle.iconWidth = iconWidth;
        this.iconStyle.iconHeight = iconHeight;
        this.iconStyle.iconOffsetX = iconOffsetX;
        this.iconStyle.iconOffsetY = iconOffsetY;
    }

    public String getLineWidth()
    {
        return this.lineWidth;
    }

    public void setLineWidth(String lineWidth) {
        this.lineWidth = lineWidth;
    }

    public String getLineColor() {
        return this.lineColor;
    }

    public void setLineColor(String lineColor) {
        this.lineColor = lineColor;
    }

    public String getFillColor() {
        return this.fillColor;
    }

    public void setFillColor(String fillColor) {
        this.fillColor = fillColor;
    }
}
