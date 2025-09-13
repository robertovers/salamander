function getFromStorage(key, defaultValue = null) {
  try {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToStorage(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

async function updateWeather() {
  const now = Date.now();
  const weatherElement = document.getElementById('weather-info');
  
  if (!weatherElement) return;
  
  const cachedWeather = getFromStorage('weatherCache');
  const cacheTime = getFromStorage('weatherCacheTime', 0);
  
  // use cached weather if less than 10 minutes old
  if (cachedWeather && (now - cacheTime) < 600000) {
    weatherElement.innerHTML = cachedWeather;
    return;
  }
  
  try {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-37.8136&longitude=144.9631&current=temperature_2m,weather_code&timezone=Australia%2FMelbourne');
    const data = await response.json();
    
    const temp = Math.round(data.current.temperature_2m);
    const weatherCode = data.current.weather_code;
    
    const weatherMap = {
      0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
      45: '🌫️', 48: '🌫️',
      51: '🌦️', 53: '🌦️', 55: '🌦️',
      61: '🌧️', 63: '🌧️', 65: '🌧️',
      71: '🌨️', 73: '🌨️', 75: '🌨️',
      95: '⛈️', 96: '⛈️', 99: '⛈️'
    };
    
    const weatherIcon = weatherMap[weatherCode] || '🌤️';
    const weatherHTML = `
      <span class="weather-temp">${temp}°C</span>
      <span class="weather-icon">${weatherIcon}</span>
    `;
    
    setToStorage('weatherCache', weatherHTML);
    setToStorage('weatherCacheTime', now);
    
    weatherElement.innerHTML = weatherHTML;
  } catch (error) {
    const errorHTML = '<span class="error">Weather unavailable</span>';
    weatherElement.innerHTML = errorHTML;
    setToStorage('weatherCache', errorHTML);
    setToStorage('weatherCacheTime', now);
  }
}

export { updateWeather };
