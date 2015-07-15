package com.jam.gis.cluster;

import com.jam.gis.map.MapContent;
import com.jam.gis.tile.Size;
import com.jam.gis.tile.Tile;

/**
 * Created by jinn on 2015/7/15.
 */
public interface ICluster {
      Object[] clusterByDistance(Object[] paramArrayOfObject, double paramDouble1, double paramDouble2);

      Object[] clusterByGrid(Object[] paramArrayOfObject, MapContent paramMapContent, Tile paramTile, Size paramSize);
}
