package com.jam.gis.cluster;

import com.jam.gis.tile.NPoint;

import java.util.Comparator;



public class GeoComparator implements Comparator {
    public int compare(Object o1, Object o2) {
        NPoint p0 = (NPoint) o1;
        NPoint p1 = (NPoint) o2;
        if (p0 == null) {
            if (p1 == null) {
                return 0;
            }
            return -1;
        }

        if (p1 == null) {
            return 1;
        }
        double x0 = p0.getX();
        double x1 = p1.getX();
        double y0 = p0.getY();
        double y1 = p1.getY();
        if (x0 > x1) {
            return 1;
        }

        if (x0 == x1) {
            if (y0 > y1) {
                return 1;
            }
            if (y0 == y1) {
                return 0;
            }
            return -1;
        }

        return -1;
    }
}

