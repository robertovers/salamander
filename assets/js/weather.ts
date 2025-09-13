interface WeatherData {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
}

interface WeatherMap {
  [key: number]: string;
}

function getFromStorage(key: string, defaultValue: any = null): any {
  try {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToStorage(key: string, value: any): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

async function updateWeather(
  latitude: number,
  longitude: number,
  timezone: string,
  elementId: string = "weather-info",
): Promise<void> {
  const now = Date.now();
  const weatherElement = document.getElementById(elementId);

  if (!weatherElement) {
    return;
  }

  const cacheKey = `weatherCache_${latitude}_${longitude}`;
  const cacheTimeKey = `weatherCacheTime_${latitude}_${longitude}`;
  const cachedWeather: string | null = getFromStorage(cacheKey);
  const cacheTime: number = getFromStorage(cacheTimeKey, 0);

  // use cached weather if less than 10 minutes old
  if (cachedWeather && now - cacheTime < 600000) {
    weatherElement.innerHTML = cachedWeather;
    return;
  }

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=${encodeURIComponent(timezone)}`,
    );
    const data: WeatherData = await response.json();

    const temp = Math.round(data.current.temperature_2m);
    const weatherCode = data.current.weather_code;

    const weatherMap: WeatherMap = {
      0: "clear",
      1: "sunny",
      2: "cloudy",
      3: "overcast",
      45: "foggy",
      48: "foggy",
      51: "drizzle",
      53: "drizzle",
      55: "drizzle",
      61: "rain",
      63: "rain",
      65: "heavy rain",
      71: "snow",
      73: "snow",
      75: "heavy snow",
      95: "thunderstorm",
      96: "thunderstorm",
      99: "thunderstorm",
    };

    const weatherIcon = weatherMap[weatherCode] || "sunny";
    const weatherHTML = `
      <span class="weather-temp">${temp}°C</span>
      <span class="weather-icon">${weatherIcon}</span>
    `;

    setToStorage(cacheKey, weatherHTML);
    setToStorage(cacheTimeKey, now);

    weatherElement.innerHTML = weatherHTML;
  } catch (error) {
    const errorHTML = '<span class="error">Weather unavailable</span>';
    weatherElement.innerHTML = errorHTML;
    setToStorage(cacheKey, errorHTML);
    setToStorage(cacheTimeKey, now);
  }
}

export { updateWeather };
