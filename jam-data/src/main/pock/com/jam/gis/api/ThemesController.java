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
import org.codehaus.jackson.map.util.JSONPObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

/**
 * Created by jinn on 2016/1/6.
 */
@Controller
@RequestMapping(value = {"pock/theme","service/pock/theme"})
public class ThemesController{

    @Autowired
    ITilesGenerator themeGenerator;

    @RequestMapping(value = "/img",method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<byte[]> getThemeTiles(HttpServletRequest request, HttpServletResponse response,HttpSession session) throws IOException {
        HttpHeaders responseHeaders = new HttpHeaders();

        Map parasMap = HttpRequestUtils.lowerRequestParams(request);
        String keyword = (String)parasMap.get("KEYWORD");
        String strResolution = (String)parasMap.get("RESOLUTION");
        String strLevel = (String)parasMap.get("L");
        String strMaxCount_inTile = (String)parasMap.get("COUNT");
        String layers = (String)parasMap.get("LAYERS");
        String strBbox = (String)parasMap.get("BBOX");
        String strMaxExtent = (String)parasMap.get("MAXEXTENT");
        String strWidth = (String)parasMap.get("WIDTH");
        String strHeight = (String)parasMap.get("HEIGHT");
        String attrFilter = (String)parasMap.get("FILTER");
        String orderBy = (String)parasMap.get("ORDERBY");
        String groupBy = (String)parasMap.get("GROUPBY");
        String usingCluster = (String)parasMap.get("CLUSTER");
        String format = (String)parasMap.get("FORMAT");
        String themeType = (String)parasMap.get("THEMETYPE");
        String strGSizeWidth = (String)parasMap.get("GRIDSIZEWIDTH");
        String strGSizeHeight = (String)parasMap.get("GRIDSIZEHEIGHT");
        String strMaxClusterLevel = (String)parasMap.get("MAXCLUSTERLEVEL");


        double resolution = Double.parseDouble(strResolution);
        int maxCount_inTile = Integer.parseInt(strMaxCount_inTile);
        Bounds bbox = new Bounds(strBbox);
        boolean isCluster = Boolean.parseBoolean(usingCluster);
        int level = Integer.parseInt(strLevel);
        int maxClusterLevel = Integer.parseInt(strMaxClusterLevel);
        int distance = 0;
        int gsizeHeight = 0;
        int gsizeWidth = 0;
        if ((strGSizeWidth != null) && (strGSizeHeight != null)) {
            gsizeWidth = Integer.parseInt(strGSizeWidth);
            gsizeHeight = Integer.parseInt(strGSizeHeight);
        }

        format = ParamesConvert.getImgFormat(format);

        MediaType mtype = MediaType.valueOf(format);
        responseHeaders.setContentType(mtype);

        AttrParams attrParams = new AttrParams();
        attrParams.setLayerName(layers);
        attrParams.setKeyword(keyword);
        attrParams.setAttributeFilter(attrFilter);
        attrParams.setOrderBy(orderBy);
        attrParams.setGroupBy(groupBy);
        attrParams.setMaxCount(maxCount_inTile);
        attrParams.setThemeType(themeType);



        MapContent mapContent = new MapContent();
        mapContent.setMaxExtent(new Bounds(strMaxExtent));
        mapContent.setResolution(resolution);

        Size tileSize = new Size();
        int width = Integer.parseInt(strWidth);
        int height = Integer.parseInt(strHeight);
        tileSize.w = width;
        tileSize.h = height;

        Tile tile = new Tile(tileSize);
        tile.setLevel(level);
        tile.setBbox(bbox);
        tile.setImgFormat(mtype.getSubtype());

        Size gridSize = new Size(gsizeWidth, gsizeHeight);
        ClusterSettings clusterSettings = new ClusterSettings(isCluster, gridSize, distance, maxClusterLevel);

        String rcl = mapContent.getTileIJ(bbox, tileSize) + "_" + strLevel;
        Object[] feas = this.themeGenerator.getFeaturesByTile(attrParams, mapContent, tile, clusterSettings);
        session.setAttribute("L", strLevel);
        session.setAttribute(rcl, feas);
        BufferedImage tileImg = this.themeGenerator.getDynTile(feas, attrParams, mapContent, tile);   // 这个在themeGenerator里重写了
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ImageIO.write(tileImg, tile.getImgFormat(), out);
        byte[] tileBytes = out.toByteArray();
        return new ResponseEntity(tileBytes, responseHeaders, HttpStatus.OK);
    }

    @RequestMapping(value = "/feature",method = RequestMethod.GET)
    @ResponseBody
    public TiledResult getThemeFeatures(HttpServletRequest request, HttpServletResponse response,HttpSession session){
        TiledResult result = new TiledResult();

        if (session == null) return result;

        Map parasMap = HttpRequestUtils.lowerRequestParams(request);
        String strResolution = (String)parasMap.get("RESOLUTION");
        String strLevel = (String)parasMap.get("L");
        String strMaxCount_inTile = (String)parasMap.get("COUNT");

        String layers = (String)parasMap.get("LAYERS");
        String strBbox = (String)parasMap.get("BBOX");
        String strMaxExtent = (String)parasMap.get("MAXEXTENT");
        String strWidth = (String)parasMap.get("WIDTH");
        String strHeight = (String)parasMap.get("HEIGHT");
        String attrFilter = (String)parasMap.get("FILTER");
        String orderBy = (String)parasMap.get("ORDERBY");
        String groupBy = (String)parasMap.get("GROUPBY");

        double resolution = Double.parseDouble(strResolution);
        int maxCount_inTile = Integer.parseInt(strMaxCount_inTile);
        Bounds bbox = new Bounds(strBbox);

        int level = Integer.parseInt(strLevel);

//        AttrParams attrParams = new AttrParams();
//        attrParams.setLayerName(layers);
//        attrParams.setAttributeFilter(attrFilter);
//        attrParams.setOrderBy(orderBy);
//        attrParams.setGroupBy(groupBy);
//        attrParams.setMaxCount(maxCount_inTile);


        MapContent mapContent = new MapContent();
        mapContent.setMaxExtent(new Bounds(strMaxExtent));
        mapContent.setResolution(resolution);

        Size tileSize = new Size();
        int width = Integer.parseInt(strWidth);
        int height = Integer.parseInt(strHeight);
        tileSize.w = width;
        tileSize.h = height;

//        Tile tile = new Tile(tileSize);
//        tile.setLevel(level);
//        tile.setBbox(bbox);

        String rcl = mapContent.getTileIJ(bbox, tileSize) + "_" + strLevel;
        if (session.getAttribute("L").equals(strLevel)) {
            Object feas = session.getAttribute(rcl);
            if (feas != null) {
                result = this.themeGenerator.getFeaturesInBbox(feas, bbox);
            }
        }
        session.removeAttribute(rcl);
        return result;
    }

    @RequestMapping(value = "/legend",method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<byte[]> getThemeLegend(HttpServletRequest request, HttpServletResponse response,HttpSession session) throws IOException{
        HttpHeaders responseHeaders = new HttpHeaders();

        Map parasMap = HttpRequestUtils.lowerRequestParams(request);
        String layers = (String)parasMap.get("LAYERS");
        String format = (String)parasMap.get("FORMAT");
        String themeType = (String)parasMap.get("THEMETYPE");

        format = ParamesConvert.getImgFormat(format);

        MediaType mtype = MediaType.valueOf(format);
        responseHeaders.setContentType(mtype);

        AttrParams attrParams = new AttrParams();
        attrParams.setLayerName(layers);
        attrParams.setThemeType(themeType);

        BufferedImage legendImg = this.themeGenerator.getLegend(attrParams);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ImageIO.write(legendImg, "png", out);                           //图例输出
        byte[] legendBytes = out.toByteArray();
        return new ResponseEntity(legendBytes, responseHeaders, HttpStatus.OK);
    }




}
