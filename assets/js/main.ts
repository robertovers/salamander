import { updateClock } from "./clock";
import { updateWeather } from "./weather";

interface HugoConfig {
  timezone: string;
  latitude: number;
  longitude: number;
  locale: string;
  city: string;
}

declare global {
  interface Window {
    hugoConfig: HugoConfig;
  }
}

document.addEventListener("DOMContentLoaded", function (): void {
  const config = window.hugoConfig;

  if (!config) {
    console.error("Hugo configuration not found");
    return;
  }

  updateClock(config.timezone, config.locale);
  setInterval(() => updateClock(config.timezone, config.locale), 1000);

  updateWeather(config.latitude, config.longitude, config.timezone);
  setInterval(
    () => updateWeather(config.latitude, config.longitude, config.timezone),
    600000,
  );
});
