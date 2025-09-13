/**
 * @fileoverview Clock functionality for displaying real-time updates.
 * Provides timezone-aware time display with configurable locale formatting.
 */

/** Default locale for time formatting */
const DEFAULT_LOCALE = "en-AU";

/** DOM element ID for the clock display */
const CLOCK_ELEMENT_ID = "clock";

/**
 * Updates the clock display with current time for a specific timezone and locale.
 *
 * @param timezone - IANA timezone identifier (e.g., "Australia/Sydney", "America/New_York")
 * @param locale - Locale string for formatting (e.g., "en-AU", "en-US"). Defaults to "en-AU"
 *
 * @example
 * ```typescript
 * // Update clock for Sydney time in Australian format
 * updateClock("Australia/Sydney", "en-AU");
 *
 * // Update clock for New York time in US format
 * updateClock("America/New_York", "en-US");
 * ```
 */
function updateClock(timezone: string, locale: string = DEFAULT_LOCALE): void {
  const now = new Date();

  const timeString = now.toLocaleTimeString(locale, {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const timeElement = document.getElementById(CLOCK_ELEMENT_ID);

  if (timeElement) {
    timeElement.textContent = timeString;
  } else {
    console.warn(`Clock element with ID "${CLOCK_ELEMENT_ID}" not found`);
  }
}

export { updateClock };
