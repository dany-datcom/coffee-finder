/**
 * @file api.js - Geoapify API Integration Service.
 * @description Handles external HTTP communication with Geoapify REST endpoints.
 * Provides functions for forward geocoding, reverse geocoding, and spatial bounding-box searches for coffee shops.
 * @module services/api
 */

const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

/**
 * Generic HTTP helper that fetches resources from a URL and parses the JSON response.
 * Safely handles HTTP error status codes (4xx/5xx) by throwing an explicit Error instance.
 * 
 * @private
 * @async
 * @param {string} url - Complete REST API endpoint URL to request.
 * @returns {Promise<Object>} Parsed JSON payload returned by the server.
 * @throws {Error} Throws if the HTTP response status code is outside the 200-299 range.
 */

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error (`Error: ${response.status}`);
  }

  return response.json();
}  

/**
 * Wraps the browser's native Geolocation API in a modern JavaScript Promise.
 * Promisifies `navigator.geolocation.getCurrentPosition` to enable clean async/await syntax.
 * 
 * @exports getCurrentLocation
 * @returns {Promise<{lat: number, lng: number}>} Resolves with latitude and longitude object on user approval.
 * @throws {GeolocationPositionError} Rejects if user denies permission or location service times out.
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

/**
 * Maps raw Geoapify place features into a clean, normalized internal CoffeeShop domain object.
 * Applies defensive fallbacks for missing names or addresses and structures coordinate metadata.
 * 
 * @private
 * @param {Object} place - Raw GeoJSON feature object retrieved from Geoapify API.
 * @param {number} idx - Index position within the response array (used as fallback ID).
 * @return {CoffeeShop} Normalized coffee shop place object.
 */
function mapCoffeeShop(place, idx) {
  return {
    id: idx,
    name: place.properties.name || "Untitled Café",
    address: place.properties.formatted || "Address not available",
    location: {
      city: place.properties.city, 
      state: place.properties.state
    },
    geocodes: {
      main: {
        latitude: place.properties.lat,
        longitude: place.properties.lon,
      },
    },
  };
}


/**
 * Search coffee shops by city name or query
 * Uses proximity bias towards Costa Rica
 * @param {String} query - City or location name to search
 * @returns {Array} Array of coffee shop objects
 */
export async function searchPlaces(query = "San Jose") {
  const biasLon = -84.0907;
  const biasLat = 9.9281;
  
  const url = `https://api.geoapify.com/v2/places?categories=catering.cafe&text=${encodeURIComponent(query)}&bias=proximity:${biasLon},${biasLat}&limit=10&apiKey=${API_KEY}`;
  
  try {
    console.log(`🚀 Searching: "${query}"`);
    
    const data = await fetchJson(url);
    console.log("🌍 Geoapify response:", data);
    
    // Transform API response to application format
    return data.features.map(mapCoffeeShop);
    
  } catch (error) {
    console.error("❌ Geoapify error:", error);
    return [];
  }
}

/**
 * Geocode city name to coordinates
 * Converts city name to latitude and longitude
 * Prioritizes Costa Rica for search
 * @param {String} cityName - Name of city to geocode
 * @returns {Object|null} Object with lat, lng, and displayName or null if not found
 */
export async function geocodeCity(cityName) {
  console.log(`🌍 Geocoding city: "${cityName}"`);
  
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(cityName)}&country=Costa%20Rica&limit=1&apiKey=${API_KEY}`;
  
  try {
    const data = await fetchJson(url);
    console.log("📍 Geocode response:", data);
    
    // Return null if no results
    if (!data.features || data.features.length === 0) {
      console.warn(`⚠️ City not found: ${cityName}`);
      return null;
    }
    
    const location = data.features[0];
    const coords = {
      lat: location.properties.lat,
      lng: location.properties.lon,
      displayName: location.properties.city || location.properties.name
    };

    
    
    
    console.log(`✅ City found: ${coords.displayName} (${coords.lat}, ${coords.lng})`);
    return coords;
    
  } catch (error) {
    console.error("❌ Geocoding error:", error);
    return null;

    
  }
  
}

export async function reverseGeocode(lat, lng) {
  
  console.log("📍 reverseGeocode()", lat, lng);
  
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&limit=1&apiKey=${API_KEY}`;

  const data = await fetchJson(url); 
  if (!data.features || data.features.length === 0) {
    return null;
  }
  const location = data.features[0];
  const result = {
    lat,
    lng,
    city: location.properties.city || location.properties.name,
    state: location.properties.state || ""
  };
  console.log(Object.keys(location.properties));
  return result;
}  

/**
 * Search coffee shops within map bounds
 * Searches around map center and filters results by visible bounds
 * @param {Object} bounds - Map bounds with south, north, west, east coordinates
 * @returns {Array} Array of coffee shop objects within bounds
 */
export async function searchPlacesByBounds(bounds) {
  const centerLat = (bounds.south + bounds.north) / 2;
  const centerLng = (bounds.west + bounds.east) / 2;
  
  try {    
    const searchUrl = `https://api.geoapify.com/v2/places?categories=catering.cafe&bias=proximity:${centerLng},${centerLat}&limit=10&apiKey=${API_KEY}`;
    const searchData = await fetchJson(searchUrl);
           
    if (!searchData.features) {
      return [];
    }  
    
  const cafesInBounds = searchData.features.filter(place => {
    const lat = place.properties.lat;
    const lng = place.properties.lon;
    const isInBounds =
      lat >= bounds.south &&
      lat <= bounds.north &&
      lng >= bounds.west &&
      lng <= bounds.east;
    return isInBounds;
  });

  return cafesInBounds.map(mapCoffeeShop);
      
  } catch (error) {console.error("❌ Bounds search error:", error);
    return [];
  }
}
