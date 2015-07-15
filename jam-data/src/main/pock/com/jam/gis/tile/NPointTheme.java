package com.jam.gis.tile;


public class NPointTheme extends NPoint {

    private double kv;//行业大类编码首字母的ASCII编号

    /**
     * @param id 实体ID（建筑/单位id等）
     * @param name 实体名（建筑/单位名称等）
     * @param x/y 坐标
     * */
    public NPointTheme(String id, String name, double kv, double x, double y) {
        super(id, name, x, y);
        this.kv = kv;
    }

    public double getKv() {
        return this.kv;
    }

    public void setKv(double kv) {
        this.kv = kv;
    }
}
