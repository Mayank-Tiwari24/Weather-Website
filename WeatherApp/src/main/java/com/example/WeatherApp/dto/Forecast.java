package com.example.WeatherApp.dto;


import java.util.ArrayList;

public class Forecast{
    public ArrayList<ForecastDay> forecastday;

    public ArrayList<ForecastDay> getForecastday() {
        return forecastday;
    }

    public void setForecastday(ArrayList<ForecastDay> forecastday) {
        this.forecastday = forecastday;
    }
}
