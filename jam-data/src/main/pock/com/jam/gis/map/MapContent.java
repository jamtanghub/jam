package com.jam.gis.map;

import com.jam.gis.layer.ILayer;
import com.jam.gis.tile.Bounds;
import com.jam.gis.tile.Size;
import com.jam.gis.tile.Tile;

import java.awt.*;
import java.util.ArrayList;


public class MapContent {
    Bounds maxExtent;
    Bounds viewBounds;
    double resolution;
    double currentScale;
    ArrayList<ILayer> layers;

    /**
     * 获取点所在屏幕（瓦片or瓦片网格）的“行号_列号”标识符
     * @param x 点X坐标
     * @param y 点Y坐标
     * @param tileSize 瓦片or瓦片网格大小（像素）
     * */
    public String getTileIJ(double x, double y, Size tileSize) {
        double map_minx = this.maxExtent.left;//屏幕最左坐标
        double map_maxy = this.maxExtent.top;//屏幕顶部坐标
        double dx = tileSize.getDx(this.resolution);//转地理坐标
        double dy = tileSize.getDy(this.resolution);
        int col = (int) Math.ceil((x - map_minx) / dx) - 1;
        int row = (int) Math.ceil((map_maxy - y) / dy) - 1;
        col = col < 0 ? 0 : col;
        row = row < 0 ? 0 : row;
        return row + "_" + col;
    }

    /**
     * 获取瓦片唯一标识（行号_列号）
     * @param bounds 瓦片边界
     * @param tileSize 瓦片大小
     * */
    public String getTileIJ(Bounds bounds, Size tileSize) {
        double cx = (bounds.left + bounds.right) / 2.0D;//边界中心点坐标
        double cy = (bounds.bottom + bounds.top) / 2.0D;
        return getTileIJ(cx, cy, tileSize);
    }

    public Bounds getTileBbox(int i, int j, Size tileSize) {
        double dx = tileSize.getDx(this.resolution);
        double dy = tileSize.getDy(this.resolution);
        double minx = this.maxExtent.left + j * dx;
        double maxy = this.maxExtent.top - i * dy;
        double maxx = minx + dx;
        double miny = maxy - dy;
        return new Bounds(minx, miny, maxx, maxy);
    }

    public Tile getTile(double x, double y, Size tileSize) {
        Tile tile = new Tile();
        double map_minx = this.maxExtent.left;
        double map_maxy = this.maxExtent.top;
        double dx = tileSize.getDx(this.resolution);
        double dy = tileSize.getDy(this.resolution);
        int col = (int) Math.ceil((x - map_minx) / dx) - 1;
        int row = (int) Math.ceil((map_maxy - y) / dy) - 1;
        col = col < 0 ? 0 : col;
        row = row < 0 ? 0 : row;
        tile.setRow(row);
        tile.setCol(col);
        double tminx = map_minx + col * dx;
        double tmaxy = map_maxy - row * dy;
        double tmax = tminx + dx;
        double tminy = tmaxy - dy;
        tile.setBbox(new Bounds(tminx, tminy, tmax, tmaxy));
        return tile;
    }

    public Bounds getTilesBounds(Bounds viewBounds, Size tileSize) {
        Tile lbTile = getTile(viewBounds.left, viewBounds.bottom, tileSize);
        Tile rtTile = getTile(viewBounds.right, viewBounds.top, tileSize);
        Bounds lb = lbTile.getBbox();
        Bounds rt = rtTile.getBbox();
        return new Bounds(lb.left, lb.bottom, rt.right, rt.top);
    }

    public int getTilesCount(Bounds tileBounds, Size tileSize) {
        int i = Integer.parseInt(Math.round((tileBounds.top - tileBounds.bottom) / tileSize.getDy(this.resolution)) + "");
        int j = Integer.parseInt(Math.round((tileBounds.right - tileBounds.left) / tileSize.getDx(this.resolution)) + "");
        return i * j;
    }

    //麻点坐标相对于瓦片边界的像素位置
    public int[] coordsToPixel(double x, double y, Bounds bbox) {
        double dx = x - bbox.left;
        double dy = bbox.top - y;
        int left = (int) (dx / this.resolution);
        int top = (int) (dy / this.resolution);
        return new int[]{left, top};
    }

    public void addLayer(ILayer layer) {
        this.layers.add(layer);
    }

    public void render(Graphics2D graphics, Bounds paintArea) {
    }

    public Bounds getMaxExtent() {
        return this.maxExtent;
    }

    public void setMaxExtent(Bounds maxExtent) {
        this.maxExtent = maxExtent;
    }

    public Bounds getViewBounds() {
        return this.viewBounds;
    }

    public void setViewBounds(Bounds viewBounds) {
        this.viewBounds = viewBounds;
    }

    public double getResolution() {
        return this.resolution;
    }

    public void setResolution(double resolution) {
        this.resolution = resolution;
    }

    public double getCurrentScale() {
        return this.currentScale;
    }

    public void setCurrentScale(double currentScale) {
        this.currentScale = currentScale;
    }
}
