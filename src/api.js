/**
 * API integration for Geoapify service
 * Handles geocoding, reverse geocoding, and location searches
 * Provides functions for searching coffee shops by location and bounds
 */

const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error (`Error: ${response.status}`);
  }

  return response.json();
}  

/**
 * Get the user's current location from the browser.
 * @returns {Promise<{lat:number,lng:number}|null>}
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
