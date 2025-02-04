import { useState, useEffect } from 'react';
import * as THREE from 'three';
import CLOUDS from 'vanta/dist/vanta.clouds.min';
import FOG from 'vanta/dist/vanta.fog.min';
import WAVES from 'vanta/dist/vanta.waves.min';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [vantaRef, setVantaRef] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setInitialLoading(false);
    }, 1500);
  }, []);

  // Cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  // Update background based on weather
  useEffect(() => {
    if (!weatherData || !vantaRef) return;

    // Destroy previous effect
    if (vantaEffect) vantaEffect.destroy();

    const description = weatherData.description.toLowerCase();
    let newEffect;

    if (description.includes('rain') || description.includes('drizzle')) {
      newEffect = WAVES({
        el: vantaRef,
        THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x2c5282,
        shininess: 35.00,
        waveHeight: 20.00,
        zoom: 0.65
      });
    } else if (description.includes('cloud')) {
      newEffect = CLOUDS({
        el: vantaRef,
        THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        backgroundColor: 0x68788c,
        cloudColor: 0xadc2d4,
        cloudShadowColor: 0x486176,
        sunColor: 0xffffff,
        sunGlareColor: 0xf5f5f5,
        sunlightColor: 0xf5f5f5,
      });
    } else if (description.includes('clear') || description.includes('sun')) {
      newEffect = FOG({
        el: vantaRef,
        THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        highlightColor: 0xffd700,
        midtoneColor: 0xff8c00,
        lowlightColor: 0xff4500,
        baseColor: 0x87ceeb,
        speed: 1.50,
      });
    } else {
      newEffect = FOG({
        el: vantaRef,
        THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        baseColor: 0x68788c,
      });
    }

    setVantaEffect(newEffect);
  }, [weatherData, vantaRef]);

  const kelvinToCelsius = (kelvin) => {
    return Math.round(kelvin - 273.15);
  };

  const fetchWeather = async () => {
    if (!city) {
      setError('Please enter a city name');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`https://checkweather-pzv3.onrender.com/api/weather/${city}`);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeatherData({
        ...data,
        temperature: kelvinToCelsius(data.temperature)
      });
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        className="animate-spin text-blue-500"
      >
        <path d="M8 13h2v7H8zm3 2h2v7h-2zm3-2h2v7h-2z" fill="currentColor"/>
        <path d="M18.944 10.113C18.507 6.671 15.56 4.001 12 4.001c-2.756 0-5.15 1.611-6.243 4.15C3.609 8.793 2 10.82 2 13.001c0 2.757 2.243 5 5 5v-2c-1.654 0-3-1.346-3-3 0-1.403 1.199-2.756 2.673-3.015l.581-.103.192-.559C8.149 7.274 9.895 6.001 12 6.001c2.757 0 5 2.243 5 5v1h1c1.103 0 2 .897 2 2s-.897 2-2 2h-1v2h1c2.206 0 4-1.794 4-4a4.008 4.008 0 0 0-3.056-3.888z" fill="currentColor"/>
      </svg>
    </div>
  );

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Loading Weather App...</p>
      </div>
    );
  }

  return (
    <div 
      ref={setVantaRef}
      className="min-h-screen w-full relative"
    >
      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10">
        <h1 className="text-3xl font-bold mb-4 text-emerald-500">Weather App</h1>
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-md">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            disabled={isLoading}
          />
          <button
            onClick={fetchWeather}
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Getting Weather...' : 'Get Weather'}
          </button>
          
          {isLoading && <LoadingSpinner />}
          {error && <p className="text-red-500 mt-4">{error}</p>}
          
          {!isLoading && weatherData && (
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
    </div>
  );
};

export default Weather;