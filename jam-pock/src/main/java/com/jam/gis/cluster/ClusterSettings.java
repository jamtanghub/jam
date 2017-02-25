package com.jam.gis.cluster;

import com.jam.gis.tile.Size;


public class ClusterSettings {
    public boolean isUsingCluster;
    public Size gridSize;
    public int distance;
    public int maxClusterLevel;

    public ClusterSettings(){}

    public ClusterSettings(boolean isClst, Size gsize, int distance, int maxClusterLevel)
    {
        this.isUsingCluster = isClst;
        this.gridSize = gsize;
        this.distance = distance;
        this.maxClusterLevel = maxClusterLevel;
    }
}
