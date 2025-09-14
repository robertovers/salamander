/** Default DOM element ID for the astronomy display */
const DEFAULT_ASTRONOMY_ELEMENT_ID = "astronomy-info";

/** Moon phase names corresponding to lunar cycle */
const MOON_PHASES = [
  "○ new moon",
  "◑ waxing crescent",
  "◑ first quarter",
  "◑ waxing gibbous",
  "● full moon",
  "◐ waning gibbous",
  "◐ last quarter",
  "◐ waning crescent",
] as const;

/**
 * Calculates the current moon phase based on the lunar cycle.
 * Uses astronomical calculations to determine moon phase.
 *
 * @param date - Date to calculate moon phase for (defaults to current date)
 * @returns Moon phase emoji representing current lunar phase
 */
function calculateMoonPhase(date: Date = new Date()): string {
  // known new moon date for Melbourne TODO: parameterise
  const knownNewMoon = new Date(2025, 9, 21, 19, 54);

  // average lunar cycle length in milliseconds (29.53 days)
  const lunarCycle = 29.53 * 24 * 60 * 60 * 1000;

  // calculate days since known new moon
  const daysSinceNewMoon =
    (date.getTime() - knownNewMoon.getTime()) / lunarCycle;

  // get current position in lunar cycle (0-1)
  const cyclePosition = daysSinceNewMoon - Math.floor(daysSinceNewMoon);

  // convert to phase index (0-7)
  const phaseIndex = Math.round(cyclePosition * 8) % 8;

  return MOON_PHASES[phaseIndex];
}

/**
 * Updates the astronomy display with the moon phase.
 *
 * @param timezone - IANA timezone identifier for day/night calculation
 * @param elementId - DOM element ID to update (defaults to "astronomy-info")
 *
 * @example
 * ```typescript
 * // Update custom element
 * updateAstronomy("my-astronomy-widget");
 * ```
 */
function updateAstronomy(
  elementId: string = DEFAULT_ASTRONOMY_ELEMENT_ID,
): void {
  const astronomyElement = document.getElementById(elementId);

  if (!astronomyElement) {
    console.warn(`Astronomy element with ID "${elementId}" not found`);
    return;
  }

  const symbol = calculateMoonPhase();
  astronomyElement.textContent = symbol;
}

export { updateAstronomy, isDaytime, calculateMoonPhase };
