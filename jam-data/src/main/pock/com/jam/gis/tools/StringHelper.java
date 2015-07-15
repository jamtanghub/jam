package com.jam.gis.tools;


public class StringHelper {
    public static int lengthEx(String value) {
        int valueLength = 0;
        String chinese = "[Α-￥]";
        for (int i = 0; i < value.length(); i++) {
            String temp = value.substring(i, i + 1);
            if (temp.matches(chinese)) {
                valueLength += 2;
            } else {
                valueLength++;
            }
        }
        return valueLength;
    }
}
