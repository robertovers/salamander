import { updateMelbourneTime } from "./clock.js";
import { updateWeather } from "./weather.js";

document.addEventListener("DOMContentLoaded", function () {
  updateMelbourneTime();
  setInterval(updateMelbourneTime, 1000);
  updateWeather();
  setInterval(updateWeather, 600000);
});
