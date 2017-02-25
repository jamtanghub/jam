package com.jam.gis.layer;

import com.jam.gis.map.MapContent;
import com.jam.gis.tile.Bounds;
import com.jam.gis.tile.Tile;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;


public interface ILayer {
    public  Bounds getBounds();

    public  void render(Graphics2D paramGraphics2D, MapContent paramMapContent, Bounds paramBounds)throws IOException;

    public  BufferedImage paint(MapContent paramMapContent, Tile paramTile) throws IOException;
}
