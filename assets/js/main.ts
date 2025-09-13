import { updateClock } from "./clock.js";
import { updateWeather } from "./weather.js";

document.addEventListener("DOMContentLoaded", function (): void {
  const melbourneTimezone = "Australia/Melbourne";
  const melbourneLatitude = -37.8136;
  const melbourneLongitude = 144.9631;

  updateClock(melbourneTimezone);
  setInterval(() => updateClock(melbourneTimezone), 1000);

  updateWeather(melbourneLatitude, melbourneLongitude, melbourneTimezone);
  setInterval(
    () =>
      updateWeather(melbourneLatitude, melbourneLongitude, melbourneTimezone),
    600000,
  );
});
