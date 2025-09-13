import { updateClock } from "./clock";
import { updateWeather } from "./weather";
import { updateAstronomy } from "./astronomy";

/**
 * Configuration object passed from Hugo to the client-side JavaScript.
 */
interface HugoConfig {
  /** IANA timezone identifier (e.g., "Australia/Sydney") */
  timezone: string;
  /** Latitude coordinate for weather data */
  latitude: number;
  /** Longitude coordinate for weather data */
  longitude: number;
  /** Locale string for time formatting (e.g., "en-AU") */
  locale: string;
  /** City name for display purposes */
  city: string;
}

declare global {
  interface Window {
    hugoConfig: HugoConfig;
  }
}

/** Update interval for clock display in milliseconds */
const CLOCK_UPDATE_INTERVAL = 1000;

/** Update interval for weather data in milliseconds (10 minutes) */
const WEATHER_UPDATE_INTERVAL = 600000;

/**
 * Initializes the application when the DOM is fully loaded.
 * Sets up clock and weather update intervals based on Hugo configuration.
 */
function initializeApp(): void {
  const config = window.hugoConfig;

  if (!config) {
    console.error("Hugo configuration not found on window.hugoConfig");
    return;
  }

  if (!config.timezone || !config.locale) {
    console.error("Missing required configuration: timezone or locale");
    return;
  }

  if (
    typeof config.latitude !== "number" ||
    typeof config.longitude !== "number"
  ) {
    console.error(
      "Invalid coordinates: latitude and longitude must be numbers",
    );
    return;
  }

  updateClock(config.timezone, config.locale);
  setInterval(
    () => updateClock(config.timezone, config.locale),
    CLOCK_UPDATE_INTERVAL,
  );

  updateAstronomy(config.timezone);
  setInterval(() => updateAstronomy(config.timezone), CLOCK_UPDATE_INTERVAL);

  updateWeather(config.latitude, config.longitude, config.timezone);
  setInterval(
    () => updateWeather(config.latitude, config.longitude, config.timezone),
    WEATHER_UPDATE_INTERVAL,
  );
}

document.addEventListener("DOMContentLoaded", initializeApp);
