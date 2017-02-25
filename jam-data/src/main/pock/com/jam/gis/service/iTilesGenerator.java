package com.jam.gis.service;

import com.jam.gis.cluster.ClusterSettings;
import com.jam.gis.data.AttrParams;
import com.jam.gis.data.TiledResult;
import com.jam.gis.map.MapContent;
import com.jam.gis.tile.Bounds;
import com.jam.gis.tile.Tile;

import java.awt.image.BufferedImage;


public interface ITilesGenerator {
      Object[] getFeaturesByTile(AttrParams paramAttrParams, MapContent paramMapContent, Tile paramTile, ClusterSettings paramClusterSettings);

      BufferedImage getDynTile(Object[] paramArrayOfObject, AttrParams paramAttrParams, MapContent paramMapContent, Tile paramTile);

      TiledResult getFeaturesInBbox(Object paramObject, Bounds paramBounds);

      BufferedImage getLegend(AttrParams paramAttrParams);
}
