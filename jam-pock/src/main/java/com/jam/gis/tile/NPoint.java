package com.jam.gis.tile;

import java.io.Serializable;


public class NPoint extends Point implements Serializable {
    private String id;//麻点ID（建筑物/单位...ID）
    private String name;//麻点名称（建筑物/单位...名称）

    public NPoint() {
    }

    public NPoint(String name, double x, double y) {
        super(x, y);
        this.name = name;
    }

    public NPoint(String id, String name, double x, double y) {
        super(x, y);
        this.id = id;
        this.name = name;
    }

    public String toString() {
        return "[" + this.name + "," + getX() + "," + getY() + "]";
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
