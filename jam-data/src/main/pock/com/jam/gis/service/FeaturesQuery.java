package com.jam.gis.service;

import com.jam.gis.cluster.ICluster;
import com.jam.gis.dao.ISimpleDao;
import com.jam.gis.data.AttrParams;
import com.jam.gis.map.MapContent;
import com.jam.gis.style.IconMarkerStyle;
import com.jam.gis.style.StyleConfig;
import com.jam.gis.tile.Bounds;
import com.jam.gis.tile.NPoint;
import com.jam.gis.tile.Size;
import com.jam.gis.tile.Tile;

import java.util.ArrayList;


public class FeaturesQuery implements IFeaturesQuery {
    ISimpleDao simpleDAL = null;
    ICluster pointCluster = null;   //实现聚集   by Distance  和  by  Grid

    /**获取切片的全部点对象组*/
    public Object[] getFeatures(AttrParams attrParams, Bounds bounds, double resolution) {
        Object[] feas = null;
        String themeType = attrParams.getThemeType();
        if (themeType == null) {
            IconMarkerStyle iconStyle = StyleConfig.getDefMarkerStyle();//默认麻点图标样式
            double dx = iconStyle.iconWidth * resolution;
            double dy = iconStyle.iconHeight * resolution;
            Bounds queryBounds = bounds.createExtend(-dx, -dy, dx, 0.0D);
            //获取默认麻点图层切片网格 全部点对象NPoint
            feas = this.simpleDAL.getFeatrues(attrParams, queryBounds);
        } else {
            IconMarkerStyle iconStyle = StyleConfig.getDefThemeMarkerStyle();//专题麻点图标样式
            double dx = iconStyle.iconWidth * resolution;
            double dy = iconStyle.iconHeight * resolution;
            Bounds queryBounds = bounds.createExtend(-dx, -dy, dx, 0.0D);
            //获取（行业分段专题）麻点图层切片网格 全部点对象NPoint
            feas = this.simpleDAL.getThemeFeatrues(attrParams, queryBounds);
        }
        return feas;
    }

    /**
     * 获取麻点切片聚集抽希的麻点对象组  限制总数（每网格取1）
     * @param attrParams 切片请求参数
     * @param queryBounds 切片网格边界
     * @param mapContent 当前地图参数
     * @param tile 切片对象
     * @param gridSize 切片网格大小
     * */
    public Object[] getClusterFeatures(AttrParams attrParams, Bounds queryBounds, MapContent mapContent, Tile tile, Size gridSize) {
        Object[] feas = null;//麻点对象（NPoint/NPointTheme）
        String themeType = attrParams.getThemeType();//专题类型
        //后台DB获取切片网格 所有麻点对象
        if (themeType == null)
            feas = this.simpleDAL.getFeatrues(attrParams, queryBounds);//一般对象（NPoint）组
        else {
            feas = this.simpleDAL.getThemeFeatrues(attrParams, queryBounds);//行业大类分段专题麻点对象（NPointTheme）组
        }
        String dtype = attrParams.getDataType();//数据集类型
        if (dtype.equals("POINT")) {
            Object[] clsFeas = this.pointCluster.clusterByGrid(feas, mapContent, tile, gridSize);//聚类抽希切片网格（每网格取1）麻点对象
            return clsFeas;
        }
        return null;
    }

    //获取切片聚集抽希的麻点对象组  （等比例抽希）distance效果与网格雷同
    public Object[] getClusterFeatures(AttrParams attrParams, Bounds queryBounds, double resolution, double distance) {
        Object[] feas = null;
        String themeType = attrParams.getThemeType();
        if (themeType == null)
            feas = this.simpleDAL.getFeatrues(attrParams, queryBounds);
        else {
            feas = this.simpleDAL.getThemeFeatrues(attrParams, queryBounds);
        }
        String dtype = attrParams.getDataType();
        if (dtype.equals("POINT")) {
            Object[] clsFeas = this.pointCluster.clusterByDistance(feas, resolution, distance);
            return clsFeas;
        }
        return null;
    }

    public Object[] getFeaturesInBbox(Object feas, Bounds bounds) {
        if (feas == null)
            return null;
        double minx = bounds.left;
        double miny = bounds.bottom;
        double maxx = bounds.right;
        double maxy = bounds.top;
        Object[] features = (Object[]) feas;
        int len = features.length;
        if ((len > 0) && ((features[0] instanceof NPoint))) {
            ArrayList list = new ArrayList();
            for (int i = 0; i < len; i++) {
                NPoint pnt = (NPoint) features[i];
                double x = pnt.getX();
                double y = pnt.getY();
                if ((x > minx) && (x < maxx) && (y > miny) && (y < maxy)) {
                    list.add(pnt);
                }
            }
            return list.toArray();
        }
        return features;
    }

    public String getHotPOI(Object[] features, int count) {
        return null;
    }


}
