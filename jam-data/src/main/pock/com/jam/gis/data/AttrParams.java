package com.jam.gis.data;

import org.dom4j.Document;

import java.util.List;


public class AttrParams {
    String layerName;
    String nameFiled;
    String keyword;
    String attributeFilter;
    String fields;
    String linkItems;
    String joinItems;
    String orderBy;
    String groupBy;
    int maxCount;
    String dataType;
    String themeType;
    public Document themeConfig;

    //isSampling=true时代表抽样
    boolean isSampling = false;
    String samplingTempTableName;

    public List kvs = null;

    public List getKvs() {
        return kvs;
    }

    public void setKvs(List kvs) {
        this.kvs = kvs;
    }

    public int getMaxCount() {
        return this.maxCount;
    }

    public void setMaxCount(int maxCount) {
        this.maxCount = maxCount;
    }

    public String getLayerName() {
        return this.layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

    public String getKeyword() {
        return this.keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public String getAttributeFilter() {
        return this.attributeFilter;
    }

    public void setAttributeFilter(String attributeFilter) {
        this.attributeFilter = attributeFilter;
    }

    public String getFields() {
        return this.fields;
    }

    public void setFields(String fields) {
        this.fields = fields;
    }

    public String getLinkItems() {
        return this.linkItems;
    }

    public void setLinkItems(String linkItems) {
        this.linkItems = linkItems;
    }

    public String getJoinItems() {
        return this.joinItems;
    }

    public void setJoinItems(String joinItems) {
        this.joinItems = joinItems;
    }

    public String getOrderBy() {
        return this.orderBy;
    }

    public void setOrderBy(String orderBy) {
        this.orderBy = orderBy;
    }

    public String getGroupBy() {
        return this.groupBy;
    }

    public void setGroupBy(String groupBy) {
        this.groupBy = groupBy;
    }

    public String getThemeType() {
        return this.themeType;
    }

    public void setThemeType(String themeType) {
        this.themeType = themeType;
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

    public void setSampling(boolean isSampling){
        this.isSampling = isSampling;
    }

    public boolean isSampling(){
        return isSampling;
    }

    public void setSamplingTempTableName(String samplingTempTableName){
        this.samplingTempTableName = samplingTempTableName;
    }

    public String getSamplingTempTableName(){
        return samplingTempTableName;
    }
}
