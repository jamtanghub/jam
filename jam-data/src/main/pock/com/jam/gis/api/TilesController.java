package com.jam.gis.api;

import com.jam.gis.cluster.ClusterSettings;
import com.jam.gis.data.AttrParams;
import com.jam.gis.data.TiledResult;
import com.jam.gis.map.MapContent;
import com.jam.gis.service.ITilesGenerator;
import com.jam.gis.tile.Bounds;
import com.jam.gis.tile.Size;
import com.jam.gis.tile.Tile;
import com.jam.gis.tools.HttpRequestUtils;
import com.jam.gis.tools.ParamesConvert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Map;


@Controller
@RequestMapping(value = {"pock/tile","service/pock/tile"})
public class TilesController {

    @Autowired
    private ITilesGenerator tileGenerator;//瓦片生成器

    @RequestMapping(value = "/img" ,method = RequestMethod.GET)
    @ResponseBody
    public byte[] getTile(HttpServletRequest request,HttpSession session) throws IOException{
        HttpHeaders responseHeaders = new HttpHeaders();
        request.setCharacterEncoding("UTF-8");

        Map parasMap = HttpRequestUtils.lowerRequestParams(request);
        String keyword = (String)parasMap.get("KEYWORD");           //麻点名称关键字过滤
        String strResolution = (String)parasMap.get("RESOLUTION");  //屏幕分辨率
        String strLevel = (String)parasMap.get("L");                //当前比例尺等级
        String strMaxCount_inTile = (String)parasMap.get("COUNT");  //切片最大麻点数
        String layers = (String)parasMap.get("LAYERS");             //图层名（数据对象ID）
        String strBbox = (String)parasMap.get("BBOX");              //切片边界坐标str
        String strMaxExtent = (String)parasMap.get("MAXEXTENT");    //屏幕最大边界坐标str
        String strWidth = (String)parasMap.get("WIDTH");            //切片宽（像素）
        String strHeight = (String)parasMap.get("HEIGHT");          //切片高（像素）
        String attrFilter = (String)parasMap.get("FILTER");         //区域查询条件
        String orderBy = (String)parasMap.get("ORDERBY");
        String groupBy = (String)parasMap.get("GROUPBY");
        String usingCluster = (String)parasMap.get("CLUSTER");      //是否叠加聚集图
        String strMaxClusterLevel = (String)parasMap.get("MAXCLUSTERLEVEL"); //聚集抽希最大比例等级
        String strGSizeWidth = (String)parasMap.get("GRIDSIZEWIDTH");
        String strGSizeHeight = (String)parasMap.get("GRIDSIZEHEIGHT");
        String format = (String)parasMap.get("FORMAT");             //麻点图标文件格式


        double resolution = Double.parseDouble(strResolution);//屏幕分辨率
        int maxCount_inTile = Integer.parseInt(strMaxCount_inTile);//切片网格最大麻点数
        Bounds bbox = new Bounds(strBbox);//切片边界
        boolean isCluster = Boolean.parseBoolean(usingCluster);//是否叠加聚集图
        int level = Integer.parseInt(strLevel);//当前地图比例尺等级
        int maxClusterLevel = Integer.parseInt(strMaxClusterLevel);//切片网格聚集抽希最大比例等级
        int distance = 0;//切片网格等距聚集抽希距离
        //切片网格大小（像素）
        int gsizeHeight = 0;
        int gsizeWidth = 0;
        if ((strGSizeWidth != null) && (strGSizeHeight != null)) {
            gsizeWidth = Integer.parseInt(strGSizeWidth);
            gsizeHeight = Integer.parseInt(strGSizeHeight);
        }
        format = ParamesConvert.getImgFormat(format);//麻点图标文件类型（路径）
        MediaType mtype = MediaType.valueOf(format);
        responseHeaders.setContentType(mtype);//设置响应上下文媒体类型
        //切片查询参数
        AttrParams attrParams = new AttrParams();
        attrParams.setLayerName(layers);//图层名
        attrParams.setAttributeFilter(attrFilter);//区域等查询条件
        attrParams.setOrderBy(orderBy);
        attrParams.setGroupBy(groupBy);
        attrParams.setKeyword(keyword);//麻点名称关键字过滤
        attrParams.setMaxCount(maxCount_inTile);//切片网格最大显示麻点数


        MapContent mapContent = new MapContent();
        mapContent.setMaxExtent(new Bounds(strMaxExtent));//地图最大边界
        mapContent.setResolution(resolution);//屏幕分辨率

        Size tileSize = new Size();//图层切片大小
        int width = Integer.parseInt(strWidth);
        int height = Integer.parseInt(strHeight);
        tileSize.w = width;
        tileSize.h = height;
        //切片网格聚集抽希设置
        Size gridSize = new Size(gsizeWidth, gsizeHeight);//切片网格大小


        ClusterSettings clusterSettings = new ClusterSettings(isCluster, gridSize, distance, maxClusterLevel);
        //切片对象
        Tile tile = new Tile(tileSize);
        tile.setLevel(level);//比例等级
        tile.setBbox(bbox);//切片边界
        tile.setImgFormat(mtype.getSubtype());//切片麻点图标类型
        BufferedImage tileImg;
        byte[] tileBytes;
        //获取切片唯一标识（行号_列号_比例等级）
        String rcl = mapContent.getTileIJ(bbox, tileSize) + "_" + strLevel;
        //查询参数中设置用户ID和sessionID
        //DB获取切片麻点（NPoint/NPointTheme）对象组
        Object[] feas = tileGenerator.getFeaturesByTileEx(attrParams, mapContent, tile, clusterSettings);
        session.setAttribute("L", strLevel);//当前比例等级
        session.setAttribute(rcl, feas);//session中，设置切片麻点对象

        return null;
    }

    @RequestMapping(value = "/fea",method = RequestMethod.GET)
    @ResponseBody
    public TiledResult getTileFeatures(HttpServletRequest request){

        TiledResult result = new TiledResult();//瓦片结果对象
        HttpSession session = request.getSession(false);
        if (session == null) return result;
        Map parasMap = HttpRequestUtils.lowerRequestParams(request);//request参数
        String strResolution = (String)parasMap.get("RESOLUTION");//屏幕分辨率
        String strLevel = (String)parasMap.get("L");//地图比例尺等级

        String strBbox = (String)parasMap.get("BBOX");//瓦片矩形坐标
        String strMaxExtent = (String)parasMap.get("MAXEXTENT");//屏幕最大边界(x*y坐标)
        String strWidth = (String)parasMap.get("WIDTH");//切片宽（像素）
        String strHeight = (String)parasMap.get("HEIGHT");//切片高（像素）


        double resolution = Double.parseDouble(strResolution);
        Bounds bbox = new Bounds(strBbox);//瓦片边界



        MapContent mapContent = new MapContent();
        mapContent.setMaxExtent(new Bounds(strMaxExtent));//屏幕最大边界
        mapContent.setResolution(resolution);//屏幕分辨率

        Size tileSize = new Size();//瓦片像素大小
        int width = Integer.parseInt(strWidth);
        int height = Integer.parseInt(strHeight);
        tileSize.w = width;
        tileSize.h = height;



        //获取切片唯一标识（行号_列号_比例等级）
        String rcl = mapContent.getTileIJ(bbox, tileSize) + "_" + strLevel;
        //同一比例尺
        if (session.getAttribute("L").equals(strLevel)) {
            Object feas = session.getAttribute(rcl);//瓦片麻点对象
            if (feas != null) {
                result = this.tileGenerator.getFeaturesInBbox(feas, bbox);//获取瓦片麻点对象组（及样式）
            }
        }
        session.removeAttribute(rcl);//避免session空间占满，浏览器死掉，只一次获取
        return result;
    }
}
