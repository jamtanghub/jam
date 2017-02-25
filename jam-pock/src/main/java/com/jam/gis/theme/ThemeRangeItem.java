package com.jam.gis.theme;

import com.jam.gis.style.ThemeStyle;

/**
 * Created by jinn on 2015/7/15.
 */
public class ThemeRangeItem {
    String caption;
    double start;
    double end;
    public boolean visible;
    ThemeStyle style;

    public ThemeStyle getStyle()
    {
        return this.style;
    }
    public void setStyle(ThemeStyle style) {
        this.style = style;
    }
    public String getCaption() {
        return this.caption;
    }
    public void setCaption(String caption) {
        this.caption = caption;
    }
    public double getStart() {
        return this.start;
    }
    public void setStart(double start) {
        this.start = start;
    }
    public double getEnd() {
        return this.end;
    }
    public void setEnd(double end) {
        this.end = end;
    }
    public boolean isVisible() {
        return this.visible;
    }
    public void setVisible(boolean visible) {
        this.visible = visible;
    }
}
