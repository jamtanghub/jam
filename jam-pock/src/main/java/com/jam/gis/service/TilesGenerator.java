package com.jam.gis.service;

import com.jam.gis.cluster.ClusterSettings;
import com.jam.gis.data.AttrParams;
import com.jam.gis.data.DataSetInfo;
import com.jam.gis.data.TiledResult;
import com.jam.gis.layer.TiledLayer;
import com.jam.gis.map.MapContent;
import com.jam.gis.style.IconMarkerStyle;
import com.jam.gis.style.LayerStyle;
import com.jam.gis.style.StyleConfig;
import com.jam.gis.theme.Theme;
import com.jam.gis.tile.*;
import org.dom4j.Document;

import java.awt.image.BufferedImage;
import java.io.IOException;

public class TilesGenerator implements ITilesGenerator {
    IFeaturesQuery featureQuery;

    public IFeaturesQuery getFeatureQuery() {
        return featureQuery;
    }
    public void setFeatureQuery(IFeaturesQuery featureQuery) {
        this.featureQuery = featureQuery;
    }

    protected static IconMarkerStyle defMarkerStyle = StyleConfig.getDefMarkerStyle();//获取瓦片麻点样式配置
    protected static IconMarkerStyle themeMarkerStyle = StyleConfig.getDefThemeMarkerStyle();//获取专题瓦片麻点样式配置


    public TilesGenerator()
    {
        themeMarkerStyle.iconUrl = "";
        defMarkerStyle.iconUrl = "";
    }

    /**
     * 查询要素数据
     * @param attrParams
     * @param mapContent
     * @param tile
     * @param clusterSettings
     * @return
     */
    public Object[] getFeaturesByTile(AttrParams attrParams, MapContent mapContent, Tile tile, ClusterSettings clusterSettings)
    {
        DataSetInfo dataInfo = DataSetInfo.getDataSetInfoBy(attrParams.getLayerName());//麻点图层对应点数据集信息
        Document doc = Theme.getThemeConfigBy(attrParams.getLayerName()); //doc是专题图是用到的配置文件/pock/themes/themes.xml
        attrParams.themeConfig = doc;
        String dtype = dataInfo.getDataType();//数据类型（点数据集）
        attrParams.setDataType(dtype);
        attrParams.setNameFiled(dataInfo.getNameFiled()); //麻点名称对应数据集字段名
        if ("POINT".equals(dtype)) {
            boolean clusted = false;
            //聚集抽希&当前比例等级小于最大限制
            if ((clusterSettings.isUsingCluster) && (tile.getLevel() <= clusterSettings.maxClusterLevel)) {
                //限制切片麻点（网格）总数聚集抽希
                Size gridSize = clusterSettings.gridSize;//切片网格大小
                if ((gridSize.h != 0) && (gridSize.w != 0)) {
                    clusted = true;
                    Bounds queryBox = getQueryBounds(mapContent, tile, gridSize);//获取麻点图层切片的网格边界
                    //获取切片聚类抽希麻点对象组（按每网格取1）
                    return this.featureQuery.getClusterFeatures(attrParams, queryBox, mapContent, tile, gridSize);
                }
                //等距聚集抽希不用（等比例聚类比较合理）
                int distance = clusterSettings.distance; //distance 已经在 TilesGenerator里设置为0
                if (distance != 0) {
                    clusted = true;
                    Bounds queryBox = tile.getBbox();
                    return this.featureQuery.getClusterFeatures(attrParams, queryBox, mapContent.getResolution(), distance);
                }
                clusted = false;
            }
            //非聚集抽希，取全部麻点
            if (!clusted) {
                return this.featureQuery.getFeatures(attrParams, tile.getBbox(), mapContent.getResolution());
            }
        }
        return null;
    }



    public BufferedImage getDynTile(Object[] features, AttrParams attrParams, MapContent mapContent, Tile tile) {
        TiledLayer layer = null;
        String type = attrParams.getDataType();
        if ("POINT".equals(type)) {
            LayerStyle layerStyle = new LayerStyle(defMarkerStyle);
            layer = new TiledLayer(features, layerStyle, type);
        }
        try {
            return layer.paint(mapContent, tile);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 获取瓦片数据对象
     * @param feas 瓦片麻点对象组
     * @param bounds 瓦片边界
     * */
    public TiledResult getFeaturesInBbox(Object feas, Bounds bounds) {
        TiledResult result = new TiledResult();
        if (feas == null) return result;
        Object[] features = (Object[])feas;
        int len = features.length;

        if ((len > 0) && (features[0] instanceof NPoint)){
            LayerStyle layerStyle = null;
            if ((features[0] instanceof NPointTheme)) {
                layerStyle = new LayerStyle(themeMarkerStyle);//瓦片分段专题麻点样式
            }
            else if ((features[0] instanceof NPoint)) {
                layerStyle = new LayerStyle(defMarkerStyle);//默认瓦片麻点样式
            }
            result.setStyle(layerStyle);
            result.setData(features);
        }
        return result;
    }

    //获取麻点图层切片的网格边界
    protected Bounds getQueryBounds(MapContent map, Tile tile, Size gridSize){
        double resolution = map.getResolution();
        double dx = gridSize.getDx(resolution);
        double dy = gridSize.getDy(resolution);
        Bounds bbox = tile.getBbox();//切片边界
        Bounds lbGridBbox = map.getTile(bbox.left, bbox.bottom, gridSize).getBbox();
        Bounds rtGridBbox = map.getTile(bbox.right, bbox.top, gridSize).getBbox();
        double minx = lbGridBbox.left - dx;
        double miny = lbGridBbox.bottom - dy;
        double maxx = rtGridBbox.right + dx;
        double maxy = rtGridBbox.top + (tile.getTileSize().h % gridSize.h == 0 ? 0.0D : dy);
        return new Bounds(minx, miny, maxx, maxy);
    }

    /**
     * 生成图例
     * @param attrParams
     * @return
     */
    public BufferedImage getLegend(AttrParams attrParams)
    {
        return null;
    }
}
