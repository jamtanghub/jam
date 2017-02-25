package com.jam.gis.tile;


public class Size {
    public int w;
    public int h;

    public Size() {
    }

    public Size(int width, int height) {
        this.w = width;
        this.h = height;
    }

    //像素转长度
    public double getDx(double resolution) {
        return this.w * resolution;
    }
    public double getDy(double resolution) {
        return this.h * resolution;
    }
    //拷贝
    public Size clone() {
        return new Size(this.w, this.h);
    }
}
