import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
import { Switch, FormControlLabel, FormGroup, Button, TextField, Card, CardContent, Typography  } from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [unit, setUnit] = useState('c');
  const [searchHistory, setSearchHistory] = useState([]); 


  const handleUnitToggle = () => {
    setUnit(unit === 'c' ? 'f' : 'c');
  };

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Fetch current weather data
        const response = await axios.get(
          `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
        );
        setWeatherData(response.data);

        // Fetch forecast data
        const forecastResponse = await axios.get(
          `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5`
        );
        setForecastData(forecastResponse.data);

        const newSearchHistory = [
            { city: city, weather: response.data },
            ...searchHistory.slice(0, 4), 
          ];
          setSearchHistory(newSearchHistory);
          localStorage.setItem('searchHistory', JSON.stringify(newSearchHistory));
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [city, API_KEY]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));

    }
  }, []);

  const handleCityInputChange = (event) => {
    setCityInput(event.target.value);
  };

  const handleSearch = () => {
    setCity(cityInput);
    setCityInput('');
  };

  const getWeatherIcon = (conditionText) => {
    const lowerCaseCondition = conditionText.toLowerCase(); 
  
    if (lowerCaseCondition.includes("sunny") || lowerCaseCondition.includes("clear")) {
      return <WiDaySunny size={64} />;
    } else if (lowerCaseCondition.includes("cloudy") || lowerCaseCondition.includes("overcast")) {
      return <WiCloud size={64} />;
    } else if (lowerCaseCondition.includes("rain") || lowerCaseCondition.includes("drizzle") || lowerCaseCondition.includes("shower")) {
      return <WiRain size={64} />;
    } else if (lowerCaseCondition.includes("snow") || lowerCaseCondition.includes("sleet") || lowerCaseCondition.includes("blizzard")) {
      return <WiSnow size={64} />;
    } else if (lowerCaseCondition.includes("thunderstorm") || lowerCaseCondition.includes("lightning")) {
      return <WiThunderstorm size={64} />;
    } else {
      return <WiCloud size={64} />; 
    }
  };

  return (
    <div >
        <div class="weather-nav">
            <TextField
                label="Enter City"
                value={cityInput}
                onChange={handleCityInputChange}
                variant="outlined"
                InputLabelProps={{
                    style: { color: 'white' } 
                }}
                fullWidth
            />
            <Button variant="sharp" onClick={handleSearch}  startIcon={<SearchSharpIcon /> } > </Button> 
            <FormGroup>
                <FormControlLabel
                control={<Switch checked={unit === 'f'} onChange={handleUnitToggle} />}
                label={unit === 'c' ? 'Celsius' : 'Fahrenheit'}
                />
            </FormGroup>
        </div>
      {weatherData && forecastData ? (
            <div style={{ display: 'flex' }}> 
                <div class = 'left-container'>
                <h2>{weatherData.location.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    {getWeatherIcon(weatherData.current.condition.text)}
                    <div>
                        <p>
                        Temperature: {unit === 'c' ? weatherData.current.temp_c : weatherData.current.temp_f}
                        °{unit.toUpperCase()}
                        </p>
                        <p>Condition: {weatherData.current.condition.text}</p>
                    </div>
                    </div>
                    <h3>Search History</h3>
                    <Grid container spacing={2}> 
                        {searchHistory.map((search, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}> 
                            <Card class = 'search-history-card' >
                            <CardContent>
                                <Typography variant="h6" component="div">
                                {search.city}
                                </Typography>
                                <Typography variant="body2">
                                {search.city}: {search.weather.current.condition.text}, {unit === 'c' ? search.weather.current.temp_c : search.weather.current.temp_f}°{unit.toUpperCase()}
                                </Typography>
                            </CardContent>
                            </Card>
                        </Grid>
                        ))}
                    </Grid>
                </div>

                <div class= 'right-container'> 
                    {/* Display hourly forecast */}
                    <h3>Hourly Forecast (Next 2 hours)</h3>
                    <Grid container spacing={2}> 
                        {forecastData.forecast.forecastday[0].hour
                        .filter((hourData) => {
                            const hourTime = new Date(hourData.time);
                            const currentTime = new Date();
                            return hourTime > currentTime && hourTime <= new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);
                        })
                        .map((hourData) => (
                            <Grid item xs={12} sm={6} md={3} key={hourData.time}> 
                            <div style={{ marginRight: '16px' }}>
                                <p>{new Date(hourData.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                {getWeatherIcon(hourData.condition.text)}
                                <p>
                                Temperature:{' '}
                                {unit === 'c' ? weatherData.current.temp_c : weatherData.current.temp_f}°{unit.toUpperCase()}
                                </p>
                                <p>{hourData.condition.text}</p>
                            </div>
                            </Grid>
                        ))}
                    </Grid>
                    <h3>5-Day Forecast</h3>
                    <Grid container spacing={2}>
                        {forecastData.forecast.forecastday.map((dayData) => (
                        <Grid item xs={12} sm={6} md={4} key={dayData.date}>
                            <div style={{ marginRight: '16px' }}>
                            <p>{new Date(dayData.date).toLocaleDateString()}</p>
                            {getWeatherIcon(dayData.day.condition.text)}
                            <p>High: {unit === 'c' ? dayData.day.maxtemp_c : dayData.day.maxtemp_f}°{unit.toUpperCase()}</p>
                            <p>Low: {unit === 'c' ? dayData.day.mintemp_c : dayData.day.mintemp_f}°{unit.toUpperCase()}</p>
                            </div>
                        </Grid>
                        ))}
                    </Grid>
                </div>
        
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default WeatherComponent;

