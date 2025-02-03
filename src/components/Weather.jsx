import { useState } from 'react';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city) {
      setError('Please enter a city name');
      return;
    }

    try {
      const response = await fetch(`https://checkweather-pzv3.onrender.com/api/weather/${city}`);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeatherData(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Weather App</h1>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={fetchWeather}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Get Weather
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {weatherData && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">{weatherData.city}</h2>
            <p>Temperature: {weatherData.temperature}°C</p>
            <p>Description: {weatherData.description}</p>
            <p>Humidity: {weatherData.humidity}%</p>
            <p>Last Updated: {new Date(weatherData.timestamp).toLocaleTimeString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;