/**
 * @file sort.js - Coffee Shop Sorting Utilities.
 * @description Provides pure, immutable sorting functions to reorder arrays of coffee shop objects
 * by distance or alphabetical name, utilizing locale-aware string comparison.
 * @module utils/sort
 */

/**
 * Sorts coffee shops by distance in ascending order (closest first).
 * Creates an immutable shallow copy of the original array.
 * 
 * @exports sortByDistance
 * @param {Array<Object>} places - Array of coffee shop objects containing a `distance` property.
 * @returns {Array<Object>} New array sorted by closest distance.
 */
export function sortByDistance(places) {
    return [...places].sort((a, b) => { 
        return a.distance - b.distance; 
    });
}

/**
 * Sorts coffee shops by distance in descending order (farthest first).
 * Creates an immutable shallow copy of the original array.
 * 
 * @exports sortByFarthest
 * @param {Array<Object>} places - Array of coffee shop objects containing a `distance` property.
 * @returns {Array<Object>} New array sorted by farthest distance.
 */
export function sortByFarthest(places) {
    return [...places].sort((a, b) => { 
        return b.distance - a.distance; 
    });
}

/**
 * Sorts coffee shops alphabetically by name using locale-sensitive comparison.
 * Properly accounts for accents, diacritics, and international characters.
 * 
 * @exports sortByName
 * @param {Array<Object>} places - Array of coffee shop objects containing a `name` property.
 * @returns {Array<Object>} New array sorted alphabetically A-Z.
 */
export function sortByName(places) {
    return [...places].sort((a, b) => { 
        return a.name.localeCompare(b.name); 
    }); 
}

/**
 * Central dispatcher function to sort an array of places based on a strategy key.
 * 
 * @exports sortPlaces
 * @param {Array<Object>} places - Array of coffee shop objects to sort.
 * @param {"distance" | "farthest" | "name"} sortType - Strategy key determining the sort order.
 * @returns {Array<Object>} Sorted array of coffee shops.
 * @throws {Error} Throws if an unsupported `sortType` key is provided.
 */
export function sortPlaces(places, sortType ) {
    switch (sortType) {
        case "distance":
            return sortByDistance(places);
        case "farthest":
            return sortByFarthest(places);
        case "name":
            return sortByName(places);
        default:
            throw new Error(
                `Unknown sort type: ${sortType}`
            );
    }
}
