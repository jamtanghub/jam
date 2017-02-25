package com.jam.gis.cluster;

import com.jam.gis.map.MapContent;
import com.jam.gis.tile.Point;
import com.jam.gis.tile.Size;
import com.jam.gis.tile.Tile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;


public class PointCluster implements ICluster {


    public Object[] clusterByDistance(Object[] features, double resolution, double distance)
    {
        ArrayList clusters = new ArrayList();
        if ((features != null) && (features.length > 0)) {
            ArrayList cluster = new ArrayList();
            int len = features.length;
            for (int i = 0; i < len; i++) {
                Point fea = (Point)features[i];
                int size = clusters.size();
                boolean clustered = false;
                for (int j = size - 1; j >= 0; j--) {
                    cluster = (ArrayList)clusters.get(j);
                    Point cc = (Point)cluster.get(0);
                    if (shouldCluster(cc, fea, distance, resolution))
                    {
                        clustered = true;
                        break;
                    }
                }
                if (!clustered) {
                    ArrayList newCluster = new ArrayList();
                    newCluster.add(fea);
                    clusters.add(newCluster);
                }
            }
        }
        int len = clusters.size();
        Point[] pnts = new Point[len];
        for (int i = 0; i < len; i++) {
            pnts[i] = ((Point)((ArrayList)clusters.get(i)).get(0));
        }
        return pnts;
    }


    public Object[] clusterByGrid(Object[] feas, MapContent map, Tile tile, Size gridSize)
    {
        int len = feas.length;//网格麻点数
        Map gridMap = new HashMap();
        for (int i = 0; i < len; i++) {
            Point pnt = (Point)feas[i];//麻点对象
            String rc = map.getTileIJ(pnt.getX(), pnt.getY(), gridSize);//麻点坐在网格的“行_列”序号符
            //存在
            if (gridMap.containsKey(rc)) {
                ((ArrayList)gridMap.get(rc)).add(pnt);//追加
            } else {
                ArrayList gridPnts = new ArrayList();
                gridPnts.add(pnt);
                gridMap.put(rc, gridPnts);
            }
        }
        ArrayList clsPnts = new ArrayList();//网格聚类后麻点组
        Iterator iter = gridMap.entrySet().iterator();
        while (iter.hasNext()) {
            Map.Entry entry = (Map.Entry)iter.next();
            ArrayList pnts = (ArrayList)entry.getValue();
            clsPnts.add(pnts.get(0));//每个网格只抽一个
        }
        return clsPnts.toArray();
    }

    public HashMap<String, ArrayList<Point>> groupByTile(Object[] feas, MapContent map, Tile tile)
    {
        HashMap grpMap = new HashMap();
        int len = feas.length;
        for (int i = 0; i < len; i++) {
            Point p = (Point)feas[i];
            String rc = map.getTileIJ(p.getX(), p.getY(), tile.getTileSize());

            if (grpMap.containsKey(rc)) {
                ArrayList grp = (ArrayList)grpMap.get(rc);
                grp.add(p);
            } else {
                ArrayList grp = new ArrayList();
                grp.add(p);
                grpMap.put(rc, grp);
            }
        }
        return grpMap;
    }

    private boolean shouldCluster(Point clusterCenter, Point feaPoint, double distance, double resolution)
    {
        double realDistance = Math.sqrt(Math.pow(clusterCenter.getX() - feaPoint.getX(), 2.0D) + Math.pow(clusterCenter.getY() - feaPoint.getY(), 2.0D)) / resolution;
        return realDistance <= distance;
    }
}
