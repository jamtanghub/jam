package com.jam.gis.tile;


public class Tile {
    Size tileSize;
    Bounds bbox;
    int row;
    int col;
    int level;
    String imgFormat;
    int transparency;

    public int getTransparency() {
        return this.transparency;
    }

    public void setTransparency(int transparency) {
        this.transparency = transparency;
    }

    public Tile() {
    }

    public Tile(Size tileInfo) {
        this.tileSize = tileInfo;
    }

    public Tile(Size tileInfo, Bounds bbox) {
        this.tileSize = tileInfo;
        this.bbox = bbox;
    }

    public Bounds getBbox() {
        return this.bbox;
    }

    public void setBbox(Bounds bbox) {
        this.bbox = bbox;
    }

    public int getRow() {
        return this.row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public int getCol() {
        return this.col;
    }

    public void setCol(int col) {
        this.col = col;
    }

    public int getLevel() {
        return this.level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public String getImgFormat() {
        return this.imgFormat;
    }

    public void setImgFormat(String imgFormat) {
        this.imgFormat = imgFormat;
    }

    public Size getTileSize() {
        return this.tileSize;
    }

    public void setTileSize(Size tileSize) {
        this.tileSize = tileSize;
    }

}
