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
 * Searches coffee shops by text query or city name using Geoapify Places API.
 * Applies a geographic proximity bias towards Costa Rica coordinates and caps results to 10 places.
 * Automatically maps raw GeoJSON features into normalized coffee shop domain objects.
 * 
 * @exports searchPlaces
 * @async
 * @param {string} [query="San Jose"] - Search term, city, or location name.
 * @returns {Promise<Array<CoffeeShop>>} Resolves with an array of normalized coffee shop objects, or an empty array on failure.
 */
export async function searchPlaces(query = "San Jose") {
  const biasLon = -84.0907;
  const biasLat = 9.9281;
  
  const url = `https://api.geoapify.com/v2/places?categories=catering.cafe&text=${encodeURIComponent(query)}&bias=proximity:${biasLon},${biasLat}&limit=10&apiKey=${API_KEY}`;
  
  try {
    const data = await fetchJson(url); 
    return (data.features|| []).map(mapCoffeeShop);
  
  } catch (error) {
    console.error("❌ Geoapify error:", error);
    return [];
  }
}

/**
 * Geocodes a city or location name into geographic coordinates (Forward Geocoding).
 * Requests only the top match (limit=1) for performance optimization.
 * 
 * @exports geocodeCity
 * @async
 * @param {string} cityName - Name of the city or location to geocode.
 * @returns {Promise<{lat: number, lng: number, displayName: string}|null>} Coordinates object or null if not found.
 */
export async function geocodeCity(cityName) {
  
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(cityName)}&limit=1&apiKey=${API_KEY}`;
  
  try {
    const data = await fetchJson(url);
    
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

    return coords;
    
  } catch (error) {
    console.error("❌ Geocoding error:", error);
    return null;
  }
}

/**
 * Performs reverse geocoding on a geographic coordinate pair (lat, lng).
 * Converts raw latitude and longitude into a human-readable city and state object.
 * 
 * @exports reverseGeocode
 * @async
 * @param {number} lat - Latitude coordinate.
 * @param {number} lng - Longitude coordinate.
 * @returns {Promise<{lat: number, lng: number, city: string, state: string}|null>} Location data object or null if request fails/unresolved.
 */
export async function reverseGeocode(lat, lng) {  
  
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&limit=1&apiKey=${API_KEY}`;
    try {
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
    return result;
  } catch (error) {
    console.error("❌ Reverse geocoding error:", error);
    return null;
  }
}  

/**
 * Searches coffee shops within the map's current visible bounding box (viewport).
 * Calculates center coordinates to bias the query and filters places spatially to guarantee bounds inclusion.
 * 
 * @exports searchPlacesByBounds
 * @async
 * @param {Object} bounds - Spatial bounding box coordinates.
 * @param {number} bounds.south - Minimum latitude.
 * @param {number} bounds.north - Maximum latitude.
 * @param {number} bounds.west - Minimum longitude.
 * @param {number} bounds.east - Maximum longitude.
 * @returns {Promise<Array<CoffeeShop>>} Array of normalized coffee shop objects inside bounds.
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
      return (
       lat >= bounds.south &&
       lat <= bounds.north &&
       lng >= bounds.west &&
       lng <= bounds.east
      );
    });
    return cafesInBounds.map(mapCoffeeShop);
      
  } catch (error) {console.error("❌ Bounds search error:", error);
    return [];
  }
}
