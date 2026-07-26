/**
 * Estimate travel time based on transportation mode.
 *
 * @param {number} distanceKm
 * @param {"walking" | "driving"} mode
 * @returns {number} Estimated minutes
 */

export function estimateTravelTime(distanceKm, mode = "walking") {
    const speed = 
        mode === "walking"
            ? 5 // km/h
            : 35; // km/h
    
    const hours = distanceKm / speed;
    return Math.round(hours * 60);
}

/**
 * Format estimated travel time.
 *
 * @param {number} minutes
 * @returns {string}
 */

export function formatTravelTime(minutes) { 
    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return `${hours} h ${remaining} min`;
}