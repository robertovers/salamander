function updateClock(timezone: string, locale: string = "en-AU"): void {
  const now = new Date();
  const localTime = new Date(
    now.toLocaleString("en-US", { timeZone: timezone }),
  );

  const timeString = localTime.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const timeElement = document.getElementById("clock");

  if (timeElement) {
    timeElement.textContent = timeString;
  }
}

export { updateClock };
