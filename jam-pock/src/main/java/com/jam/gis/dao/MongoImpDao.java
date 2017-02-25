package com.jam.gis.dao;

import com.jam.gis.data.AttrParams;
import com.jam.gis.tile.Bounds;
import com.jam.gis.tile.NPoint;
import com.jam.gis.tile.NPointTheme;
import com.mongodb.*;

import java.util.Collection;
import java.util.Iterator;
import java.util.regex.Pattern;


public class MongoImpDao implements ISimpleDao {
    Mongo mongo;
    String dbname;

    public Mongo getMongo() {
        return mongo;
    }

    public void setMongo(Mongo mongo) {
        this.mongo = mongo;
    }

    public String getDbname() {
        return dbname;
    }

    public void setDbname(String dbname) {
        this.dbname = dbname;
    }

    private final String POINT = "POINT";
    private final String POLOLINE = "POLOLINE";
    private final String POLYGON = "POLYGON";


    public Object[] getFeatrues(AttrParams queryParams, Bounds bounds) {
        Object[] array= null;
        String  dtype = queryParams.getDataType();

        String nameFld = queryParams.getNameFiled();
        double minX = bounds.left;
        double minY = bounds.bottom;
        double maxX = bounds.right;
        double maxY = bounds.top;
        DB db = mongo.getDB(dbname);


        DBCollection coll = db.getCollection(queryParams.getLayerName());
        BasicDBObject query = new BasicDBObject();
        query.put("y", (new BasicDBObject("$gt", Double.valueOf(minY))).append("$lte", Double.valueOf(maxY)));
        query.put("x", (new BasicDBObject("$gt", Double.valueOf(minX))).append("$lte", Double.valueOf(maxX)));
        query.put(nameFld, Pattern.compile(queryParams.getKeyword()));
        DBObject oFlds = new BasicDBObject(nameFld, Integer.valueOf(1));
        oFlds.put("x", Integer.valueOf(1));
        oFlds.put("y", Integer.valueOf(1));
        DBObject oSort = new BasicDBObject(nameFld, Integer.valueOf(-1));

//        System.out.println(query.toString());

        DBCursor cursor = coll.find(query, oFlds).sort(oSort);
        int count = cursor.count();
        array = new Object[count];
        int i = 0;
        while (cursor.hasNext()) {
            DBObject obj = cursor.next();
            String id = obj.get("_id").toString();
            String name = (String) obj.get(nameFld);
            double x = ((Double) obj.get("x")).doubleValue();
            double y = ((Double) obj.get("y")).doubleValue();
            array[i++] = new NPoint(id, name, x, y);
        }
        cursor.close();

        return array;
    }

    public Object[] getThemeFeatrues(AttrParams queryParams, Bounds bounds) {
        Object[] array = null;
        DBCursor cursor;
        String themeFiled = queryParams.themeConfig.getRootElement().attributeValue("field");
        String dtype = queryParams.getDataType();
        String nameFld = queryParams.getNameFiled();
        double minX = bounds.left;
        double minY = bounds.bottom;
        double maxX = bounds.right;
        double maxY = bounds.top;

        DB db = mongo.getDB(dbname);

//        Collection<DB> dbs = mongo.getUsedDatabases();
//        Iterator<DB> iterator = dbs.iterator();
//        while (iterator.hasNext()){
//            DB d = iterator.next();
//            d.getName();
//        }


        DBCollection coll = db.getCollection(queryParams.getLayerName());
        BasicDBObject query = new BasicDBObject();
        query.put("y", (new BasicDBObject("$gt", Double.valueOf(minY))).append("$lte", Double.valueOf(maxY)));
        query.put("x", (new BasicDBObject("$gt", Double.valueOf(minX))).append("$lte", Double.valueOf(maxX)));
        query.put(nameFld, Pattern.compile(queryParams.getKeyword()));
        DBObject oFlds = new BasicDBObject(nameFld, Integer.valueOf(1));
        oFlds.put("x", Integer.valueOf(1));
        oFlds.put("y", Integer.valueOf(1));
        oFlds.put(themeFiled, Integer.valueOf(1));
        DBObject oSort = new BasicDBObject(themeFiled, Integer.valueOf(-1));
        cursor = coll.find(query, oFlds).sort(oSort);
        int count = cursor.count();
        array = new Object[count];

        int i = 0;
        while (cursor.hasNext())
        {
            DBObject obj = cursor.next();
            String name = (String)obj.get(nameFld);
            String id = obj.get("_id").toString();
            double x = ((Double)obj.get("x")).doubleValue();
            double y = ((Double)obj.get("y")).doubleValue();
            double kv = ((Double)obj.get(themeFiled)).doubleValue();
            array[i++] = new NPointTheme(id, name, kv, x, y);
        }
        cursor.close();

        return array;

    }
}
