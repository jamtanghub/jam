package com.jam.gis.tools;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;


public class HttpRequestUtils {
    private static final String ENCODING = "UTF-8";
    private static final int BUFFER_SIZE = 1024;


    /**
     * 返回参数的 map 键值对
     *
     * @param request
     * @return
     */
    public static Map<String, String> lowerRequestParams(HttpServletRequest request) {
        Map mapReturn = new HashMap();
        Map map = request.getParameterMap();   //参数名字和值都拿到
        Object key = null;
        String[] value = null;
        Iterator iter = map.entrySet().iterator();
        while (iter.hasNext()) {
            Map.Entry entry = (Map.Entry) iter.next();
            key = entry.getKey();

            value = (String[]) entry.getValue();
            if (key != null) {
                mapReturn.put(key.toString().trim().toUpperCase(), value[0]);
            }
        }
        return mapReturn;
    }

    public static String getDataFromRequest(HttpServletRequest request) throws IOException {

        ServletInputStream postQueryStream = request.getInputStream();

        byte[] buffer = new byte[1024];
        int length = 0;
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        do {
            length = postQueryStream.read(buffer);
            if (length > 0)
                baos.write(buffer, 0, length);
        }
        while (length > 0);

        String strQueryText = new String(baos.toByteArray(), "UTF-8");

        return strQueryText;
    }
}
