package com.jam.gis.cluster;

import com.jam.gis.tile.Size;


public class ClusterSettings {
    public boolean isUsingCluster;//切片网格是否聚集抽希
    public Size gridSize;//切片网格大小（像素）
    public int distance;//抽希距离（）
    public int maxClusterLevel;//<=聚集抽希最大比例等级

    public ClusterSettings(){
    }

    public ClusterSettings(boolean isClst, Size gsize, int distance, int maxClusterLevel)
    {
        this.isUsingCluster = isClst;
        this.gridSize = gsize;
        this.distance = distance;
        this.maxClusterLevel = maxClusterLevel;
    }
}
