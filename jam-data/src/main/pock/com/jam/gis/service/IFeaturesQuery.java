package com.jam.gis.service;

import com.jam.gis.data.AttrParams;
import com.jam.gis.map.MapContent;
import com.jam.gis.tile.Bounds;
import com.jam.gis.tile.Size;
import com.jam.gis.tile.Tile;


public interface IFeaturesQuery {
     Object[] getFeatures(AttrParams paramAttrParams, Bounds paramBounds, double paramDouble);

     Object[] getClusterFeatures(AttrParams paramAttrParams, Bounds paramBounds, MapContent paramMapContent, Tile paramTile, Size paramSize);

     Object[] getClusterFeatures(AttrParams paramAttrParams, Bounds paramBounds, double paramDouble1, double paramDouble2);

     String getHotPOI(Object[] paramArrayOfObject, int paramInt);
}
