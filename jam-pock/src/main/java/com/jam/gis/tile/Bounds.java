package com.jam.gis.tile;


public class Bounds {
    public double left;
    public double bottom;
    public double right;
    public double top;

    public Bounds() {
    }

    public Bounds(String coords) {
        String[] cd = coords.split(",");
        this.left = Double.parseDouble(cd[0]);
        this.bottom = Double.parseDouble(cd[1]);
        this.right = Double.parseDouble(cd[2]);
        this.top = Double.parseDouble(cd[3]);
    }

    public Bounds(double left, double bottom, double right, double top) {
        this.left = left;
        this.bottom = bottom;
        this.right = right;
        this.top = top;
    }

    public Bounds(int row, int col, int tileWidth, int tileHeight, double resolution, Bounds maxExtent) {
        double dx = resolution * tileWidth;
        double dy = resolution * tileHeight;
        this.left = (dx * col + maxExtent.left);
        maxExtent.top -= dy * row;
        this.right = (dx + this.left);
        this.bottom = (this.top - dy);
    }

    public Point getCenter() {
        return new Point((this.left + this.right) / 2.0D, (this.bottom + this.top) / 2.0D);
    }

    public void extend(double left, double bottom, double right, double top) {
        this.left += left;
        this.bottom += bottom;
        this.right += right;
        this.top += top;
    }

    public Bounds createExtend(double left, double bottom, double right, double top) {
        double x0 = this.left + left;
        double y0 = this.bottom + bottom;
        double x1 = this.right + right;
        double y1 = this.top + top;
        return new Bounds(x0, y0, x1, y1);
    }

    public void ajustBounds(Bounds maxExtent) {
        if (this.left < maxExtent.left) this.left = maxExtent.left;
        if (this.right > maxExtent.right) this.right = maxExtent.right;
        if (this.top > maxExtent.top) this.top = maxExtent.top;
        if (this.bottom < maxExtent.bottom) this.bottom = maxExtent.bottom;
    }

    public String toString() {
        return "[" + this.left + "," + this.bottom + "," + this.right + "," + this.top + "]";
    }
}
