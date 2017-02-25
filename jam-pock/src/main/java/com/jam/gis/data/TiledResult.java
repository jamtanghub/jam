package com.jam.gis.data;

import com.jam.gis.style.LayerStyle;


public class TiledResult {
    private boolean success;
    private Object[] data;
    private LayerStyle style;

    public TiledResult() {
        this.data = null;
        this.success = true;
    }

    public boolean isSuccess() {
        return this.success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Object[] getData() {
        return this.data;
    }

    public void setData(Object[] data) {
        this.data = data;
    }

    public LayerStyle getStyle() {
        return this.style;
    }

    public void setStyle(LayerStyle style) {
        this.style = style;
    }
}
