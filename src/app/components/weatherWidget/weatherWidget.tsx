"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef} from 'react';
import styles from "./weatherWidget.module.css";
import axios from "axios";
import { timeStamp } from "console";

export default function WeatherDataWidget() {

    const [coordinates, setCoordinates] = useState('51.507351,-0.127758');
    const [weatherData, setWeatherData] = useState({ error : true, data : {} });

    const generateApiUrl = (lat, long) => {
        return 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&units=metric&appid=9d62db2cbe320dd848087774768b908c';
    }

    useEffect(() => {
        let frags = coordinates.split(',');

        axios.get( generateApiUrl(frags[0], frags[1]) ).then(function (response) {
            setWeatherData({error: false, data : response.data});
        })
        .catch(function (error) {
            setWeatherData({error : true, data : {}})
        });

    }, [coordinates]);

    const cities = [
        {
            label : 'London, UK',
            value : '51.507351,-0.127758'
        },
        {
            label : 'Tokyo, Japan',
            value : '35.6764,139.6500'
        },
        {
            label : 'Singapore',
            value : '1.3143379,103.6794443'
        },
        {
            label : 'Paris, France',
            value : '48.8589384,2.2646356'
        }
    ]

    const getCurrentLocation = () => {

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                let coords = pos.coords.latitude +','+pos.coords.longitude
                setCoordinates(coords);
            });
        }

    }

    const setCoordinatesByCity = (event) => {
        setCoordinates(event.target.value);
    }

    const formatDateTime = (unix_timestamp) => {
        const dtFormat = new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'medium',
            timeStyle: 'medium',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          });
          
        return dtFormat.format(new Date(unix_timestamp * 1e3));
    }

    const getIconUrl = (icon) => {
        return 'http://openweathermap.org/img/w/'+icon+'.png';
    }
    
    return (
        <div className={styles.container}>
            <p className={styles.topBar}>
                <select onChange={setCoordinatesByCity}>
                    <option disabled selected>Choose a city</option>
                    {cities.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                </select>
                <span>or</span>
                <button type="button" onClick={getCurrentLocation}>use your current location</button>
            </p>

            {
                !weatherData.error && 
                <div>
                    <h3>Showing weather data for "{weatherData.data.name}" on {formatDateTime(weatherData.data.dt)}</h3>
                    <div className={styles.dataBox}>
                        <h5>Weather</h5>
                        <ul>
                            {weatherData.data.weather.map(({ main, description, icon }, index) => 
                            <li key={index}><img src={getIconUrl(icon)} /><p> {main} <span>{description}</span></p></li> )}
                        </ul>
                        <h5>General</h5>
                        <ul>
                            <li><div>Temperature</div><div>{weatherData.data.main.temp}°C</div></li>
                            <li><div>Min Temperature</div><div>{weatherData.data.main.temp_min}°C</div></li>
                            <li><div>Max Temperature</div><div>{weatherData.data.main.temp_max}°C</div></li>
                            <li><div>Humidity</div><div>{weatherData.data.main.humidity}%</div></li>
                            <li><div>Cloudiness</div><div>{weatherData.data.clouds.all}%</div></li>
                        </ul>
                        <h5>Wind</h5>
                        <ul>
                            <li><div>Direction</div><div>{weatherData.data.main.temp}°</div></li>
                            <li><div>Gust</div><div>{weatherData.data.main.temp_min} m/sec</div></li>
                            <li><div>Speed</div><div>{weatherData.data.main.temp_max} m/sec</div></li>
                        </ul>
                    </div>
                </div>
            }

            {
                weatherData.error &&
                <div>
                    <h3>No data available.</h3>
                </div>
            }

        </div>
    );
}
