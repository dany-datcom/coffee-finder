/**
 * @file travelTime.js - Travel Time Estimation and Formatting Utilities.
 * @description Provides pure helper functions to calculate estimated transit durations (walking/driving)
 * based on physical distance and format minute values into human-readable strings.
 * @module utils/travelTime
 */

/**
 * Estimates travel time in minutes based on distance and mode of transportation.
 * Uses average city velocities (5 km/h for walking, 35 km/h for driving).
 * 
 * @exports estimateTravelTime
 * @param {number} distanceKm - Distance between origin and destination in kilometers.
 * @param {"walking" | "driving"} [mode="walking"] - Transportation mode.
 * @returns {number} Rounded estimated travel duration in minutes.
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
 * Formats a duration in minutes into a localized human-readable string.
 * Converts values >= 60 minutes into hours and remaining minutes (e.g. "1 h 15 min").
 * 
 * @exports formatTravelTime
 * @param {number} minutes - Total transit time in minutes.
 * @returns {string} Formatted duration string (e.g., "45 min" or "1 h 20 min").
 */
export function formatTravelTime(minutes) { 
    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return `${hours} h ${remaining} min`;
}