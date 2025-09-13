function updateMelbourneTime() {

  const now = new Date();
  const melbourneTime = new Date(now.toLocaleString("en-US", {timeZone: "Australia/Melbourne"}));

  const timeString = melbourneTime.toLocaleTimeString('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const timeElement = document.getElementById('melbourne-time');

  if (timeElement) {
    timeElement.textContent = timeString;
  }
}

export { updateMelbourneTime };
