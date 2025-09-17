package com.example.WeatherApp.dto;

import java.util.ArrayList;

public class ForecastDay{
    public String date;
    public int date_epoch;
    public Day day;
    public Astro astro;
    public ArrayList<Hour> hour;
}