package com.jam.gis.dao;

import com.jam.gis.data.AttrParams;
import com.jam.gis.tile.Bounds;


public interface ISimpleDao {
    public abstract Object[] getFeatrues(AttrParams paramAttrParams, Bounds paramBounds);

    public abstract Object[] getThemeFeatrues(AttrParams paramAttrParams, Bounds paramBounds);
}
