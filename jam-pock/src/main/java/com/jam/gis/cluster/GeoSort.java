package com.jam.gis.cluster;

import com.jam.gis.tile.NPoint;


public class GeoSort {
    public static void sort(Object[] arry, int low, int high)
    {
        if (low >= high) {
            return;
        }
        int index = sortUnit(arry, low, high);

        sort(arry, low, index - 1);

        sort(arry, index + 1, high);
    }

    private static int sortUnit(Object[] arry, int low, int high)
    {
        NPoint key = (NPoint)arry[low];
        while (low < high)
        {
            while ((geoCompare((NPoint)arry[high], key) > 0) && (high > low)) {
                high--;
            }
            arry[low] = arry[high];

            while ((geoCompare((NPoint)arry[low], key) <= 0) && (high > low)) {
                low++;
            }
            arry[high] = arry[low];
        }

        arry[high] = key;
        return high;
    }

    public static int geoCompare(NPoint p0, NPoint p1) {
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
