/**
 * @file distance.js - Spatial Distance Calculation Utilities.
 * @description Implements the spherical Haversine formula to compute great-circle distances
 * between coordinate pairs on Earth, with human-readable unit formatting.
 * @module utils/distance
 */

/**
 * Calculates the great-circle distance between two geographic coordinates on Earth using the Haversine formula.
 * Accounts for Earth's curvature using a mean radius of 6371 km.
 * 
 * @exports calculateDistance
 * @param {Object} user - User location object with `lat` and `lng` properties.
 * @param {number} user.lat - User latitude in degrees.
 * @param {number} user.lng - User longitude in degrees.
 * @param {Object} place - Coffee shop domain object containing `geocodes.main`.
 * @returns {number} Straight-line distance over Earth's surface in kilometers.
 */
export function calculateDistance(user, place) {
  const lat1 = user.lat;
  const lon1 = user.lng;

  const lat2 = place.geocodes.main.latitude;
  const lon2 = place.geocodes.main.longitude;

  const R = 6371; // Earth's mean radius in kilometers

  // Convert degree differences to radians
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  // Haversine formula
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Formats a raw numeric distance into a human-readable localized string.
 * Converts distances under 1 km to meters (e.g., "450 m away") and larger values to 1-decimal km ("2.3 km away").
 * 
 * @exports formatDistance
 * @param {number} km - Distance in kilometers.
 * @returns {string} Formatted distance string.
 */
export function formatDistance(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }
  return `${km.toFixed(1)} km away`;
}