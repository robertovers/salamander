/**
 * Weather data structure returned by Open-Meteo API.
 */
interface WeatherData {
  current: {
    /** Temperature in Celsius */
    temperature_2m: number;
    /** WMO weather code */
    weather_code: number;
  };
}

/**
 * Mapping of WMO weather codes to human-readable descriptions.
 */
interface WeatherCodeMap {
  [key: number]: string;
}

/** Default DOM element ID for weather display */
const DEFAULT_WEATHER_ELEMENT_ID = "weather-info";

/** Cache duration in milliseconds (10 minutes) */
const CACHE_DURATION = 600000;

/** Open-Meteo API base URL */
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * WMO weather code to description mapping.
 * Based on World Meteorological Organization standards.
 */
const WEATHER_CODE_MAP: WeatherCodeMap = {
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

/**
 * Safely retrieves data from sessionStorage with JSON parsing.
 *
 * @param key - Storage key to retrieve
 * @param defaultValue - Default value if key not found or parsing fails
 * @returns Parsed value from storage or default value
 */
function getFromStorage(key: string, defaultValue: any = null): any {
  try {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.warn(`Failed to parse stored value for key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely stores data in sessionStorage with JSON serialization.
 *
 * @param key - Storage key
 * @param value - Value to store (will be JSON serialized)
 */
function setToStorage(key: string, value: any): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to store value for key "${key}":`, error);
  }
}

/**
 * Formats weather data into HTML string for display.
 *
 * @param temperature - Temperature in Celsius
 * @param weatherCode - WMO weather code
 * @returns HTML string containing formatted weather display
 */
function formatWeatherHtml(temperature: number, weatherCode: number): string {
  const temp = Math.round(temperature);
  const weatherDescription = WEATHER_CODE_MAP[weatherCode] || "sunny";

  return `
    <span class="weather-temp">${temp}°C</span>
    <span class="weather-icon">${weatherDescription}</span>
  `;
}

/**
 * Generates cache keys for weather data storage.
 *
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Object containing cache key and timestamp key
 */
function generateCacheKeys(
  latitude: number,
  longitude: number,
): { cacheKey: string; timeKey: string } {
  return {
    cacheKey: `weatherCache_${latitude}_${longitude}`,
    timeKey: `weatherCacheTime_${latitude}_${longitude}`,
  };
}

/**
 * Checks if cached weather data is still valid.
 *
 * @param cacheTime - Timestamp when data was cached
 * @returns True if cache is still valid, false otherwise
 */
function isCacheValid(cacheTime: number): boolean {
  return Date.now() - cacheTime < CACHE_DURATION;
}

/**
 * Constructs the Open-Meteo API URL for weather data.
 *
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param timezone - IANA timezone identifier
 * @returns Complete API URL
 */
function buildWeatherApiUrl(
  latitude: number,
  longitude: number,
  timezone: string,
): string {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: "temperature_2m,weather_code",
    timezone: timezone,
  });

  return `${WEATHER_API_URL}?${params.toString()}`;
}

/**
 * Updates the weather display with current conditions for specified coordinates.
 * Uses caching to minimize API calls and provides fallback for errors.
 *
 * @param latitude - Latitude coordinate (-90 to 90)
 * @param longitude - Longitude coordinate (-180 to 180)
 * @param timezone - IANA timezone identifier (e.g., "Australia/Sydney")
 * @param elementId - DOM element ID to update (defaults to "weather-info")
 *
 * @example
 * ```typescript
 * // Update weather for Sydney
 * await updateWeather(-33.8688, 151.2093, "Australia/Sydney");
 *
 * // Update weather for custom element
 * await updateWeather(-33.8688, 151.2093, "Australia/Sydney", "my-weather-widget");
 * ```
 */
async function updateWeather(
  latitude: number,
  longitude: number,
  timezone: string,
  elementId: string = DEFAULT_WEATHER_ELEMENT_ID,
): Promise<void> {
  const weatherElement = document.getElementById(elementId);

  if (!weatherElement) {
    console.warn(`Weather element with ID "${elementId}" not found`);
    return;
  }

  const { cacheKey, timeKey } = generateCacheKeys(latitude, longitude);
  const cachedWeather: string | null = getFromStorage(cacheKey);
  const cacheTime: number = getFromStorage(timeKey, 0);

  // use cached weather if still valid
  if (cachedWeather && isCacheValid(cacheTime)) {
    weatherElement.innerHTML = cachedWeather;
    return;
  }

  try {
    const apiUrl = buildWeatherApiUrl(latitude, longitude, timezone);
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data: WeatherData = await response.json();
    const weatherHtml = formatWeatherHtml(
      data.current.temperature_2m,
      data.current.weather_code,
    );
    const currentTime = Date.now();

    weatherElement.innerHTML = weatherHtml;
    setToStorage(cacheKey, weatherHtml);
    setToStorage(timeKey, currentTime);
  } catch (error) {
    console.error("Failed to fetch weather data:", error);

    const errorHtml = '<span class="error">Weather unavailable</span>';
    weatherElement.innerHTML = errorHtml;

    // cache error state to prevent repeated failed requests
    setToStorage(cacheKey, errorHtml);
    setToStorage(timeKey, Date.now());
  }
}

export { updateWeather };
