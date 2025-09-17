package com.example.WeatherApp.service;


import com.example.WeatherApp.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    @Value("${weather.api.url}")
    private String apiUrl;

    @Value("${weather.api.forecast.url}")
    private String apiForecastUrl;

    private RestTemplate template = new RestTemplate();

    public String test(){
        return "good";
    }

    public WeatherResponse getData(String city){
        String url = apiUrl + "?key=" + apiKey + "&q=" + city;
       Root response = template.getForObject(url, Root.class);
        WeatherResponse weatherResponse = new WeatherResponse();
        String c = response.getLocation().name;
        String region = response.getLocation().region;
        String country = response.getLocation().country;

        weatherResponse.setCity(response.getLocation().name);
        weatherResponse.setCity(response.getLocation().region);
        weatherResponse.setCountry(response.getLocation().country);
        String condition = response.getCurrent().getCondition().getText();
        weatherResponse.setCondition(condition);
        weatherResponse.setTemperature(response.getCurrent().getTemp_c());

         return weatherResponse;
    }

    public WeatherForeCast getForecast(String city, int days){

            WeatherForeCast weatherForeCast = new WeatherForeCast();
            WeatherResponse weatherResponse = getData(city);
        weatherForeCast.setWeatherResponse(weatherResponse);

       WeatherForeCast response = new WeatherForeCast();
       response.setWeatherResponse(weatherResponse);


       List<DayTemp> dayList = new ArrayList<>();
        String url = apiForecastUrl + "?key=" + apiKey + "&q=" +city + "&days=" + days;
        Root apiResponse = template.getForObject(url, Root.class);
       Forecast forecast = apiResponse.getForecast();
       ArrayList<ForecastDay> forecastDays = forecast.getForecastday();

        for (ForecastDay rs : forecastDays ){

           DayTemp d = new DayTemp();

            d.setDate(rs.date);
            d.setMinTemp(rs.day.getMintemp_c());
            d.setAvgTemp(rs.day.avgtemp_c);
            d.setMaxTemp(rs.day.maxtemp_c);

            dayList.add(d);
        }
        response.setDayTemp(dayList);
        return response;
    }
}
