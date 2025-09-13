import { updateMelbourneTime } from "./clock.js";
import { updateWeather } from "./weather.js";

document.addEventListener("DOMContentLoaded", function (): void {
  updateMelbourneTime();
  setInterval(updateMelbourneTime, 1000);
  updateWeather();
  setInterval(updateWeather, 600000);
});
