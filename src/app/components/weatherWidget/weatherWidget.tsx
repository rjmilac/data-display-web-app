"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef} from 'react';
import styles from "./weatherWidget.module.css";
import axios from "axios";
import Select from 'react-select'

export default function WeatherDataWidget() {

    const [coordinates, setCoordinates] = useState('na');
    const [isLoaded, setIsLoaded] = useState(0);
    const [selectValue, setSelectValue] = useState({ label : 'Choose a city', value : 'na'});
    const [weatherData, setWeatherData] = useState({ error : true, data : {
        name : '',
        main : {
            temp : 0,
            temp_min : 0,
            temp_max : 0,
            humidity : 0
        },
        clouds : { all : '' },
        weather : [],
        wind : {
            deg : 0,
            gust: 0,
            speed: 0
        },
        dt : 0
    } });

    const generateApiUrl = (lat, long) => {
        return 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&units=metric&appid=9d62db2cbe320dd848087774768b908c';
    }

    useEffect(() => {

        if(coordinates == 'na'){

            setWeatherData({error : true, data : {
                name : '',
                main : {
                    temp : 0,
                    temp_min : 0,
                    temp_max : 0,
                    humidity : 0
                },
                clouds : { all : '' },
                weather : [],
                wind : {
                    deg : 0,
                    gust: 0,
                    speed: 0
                },
                dt : 0
            }})

        } else {
            let frags = coordinates.split(',');

            axios.get( generateApiUrl(frags[0], frags[1]) ).then((response) => {
                setWeatherData({error: false, data : response.data});
            })
            .catch((error) => {
                setWeatherData({error : true, data : {
                    name : '',
                    main : {
                        temp : 0,
                        temp_min : 0,
                        temp_max : 0,
                        humidity : 0
                    },
                    clouds : { all : '' },
                    weather : [],
                    wind : {
                        deg : 0,
                        gust: 0,
                        speed: 0
                    },
                    dt : 0
                }})
            }).then( () => { setIsLoaded(1) });
        }

    }, [coordinates]);

    const cities = [
        {
            label : 'Choose a city',
            value : 'na'
        },
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
                setSelectValue({ label : 'Choose a city', value : 'na'});
                setCoordinates(coords);
            });
        } 

    }

    const setCoordinatesByCity = (selected) => {
        setSelectValue(selected);
        if(selected.value != 'na'){
            setCoordinates(selected.value);
        }
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
            <div className={styles.topBar}>
                <Select id="city-select" options={cities} value={selectValue} onChange={setCoordinatesByCity} placeholder="Choose a city" />
                <span>or</span>
                <button type="button" onClick={getCurrentLocation}>use your current location</button>
            </div>

            
            <div className={(isLoaded) ? styles.dataBoxContainerLoaded : styles.dataBoxContainer}>

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
                                <li><div>Direction</div><div>{weatherData.data.wind.deg}°</div></li>
                                <li><div>Gust</div><div>{weatherData.data.wind.gust} m/sec</div></li>
                                <li><div>Speed</div><div>{weatherData.data.wind.speed} m/sec</div></li>
                            </ul>
                        </div>
                    </div>
                }

                {
                    weatherData.error &&
                    <div>
                        <h3>No weather data available.</h3>
                    </div>
                }

            </div>

        </div>
    );
}
