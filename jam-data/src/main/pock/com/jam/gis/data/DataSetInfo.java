package com.jam.gis.data;


public class DataSetInfo {
    private String id;//唯一标识
    private String name;//数据集名
    private String dataType;//数据类型（点线面）
    private String nameFiled;//名称字段

    public static DataSetInfo getDataSetInfoBy(String strName) {
        DataSetInfo info = new DataSetInfo();
        info.setName(strName);
        String dType = "POINT";
        info.setDataType(dType);//点数据集
        String nFiled = "name";
        info.setNameFiled(nFiled);
        return info;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDataType() {
        return this.dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getNameFiled() {
        return this.nameFiled;
    }

    public void setNameFiled(String nameFiled) {
        this.nameFiled = nameFiled;
    }
}

