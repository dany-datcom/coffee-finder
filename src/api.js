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

function mapCoffeeShop(place, idx) {
  return {
    id: idx,
    name: place.properties.name || "Untitled Café",
    address: place.properties.formatted || "Address not available",
    geocodes: {
      main: {
        latitude: place.properties.lat,
        longitude: place.properties.lon
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

/**
 * Search coffee shops within map bounds
 * Searches around map center and filters results by visible bounds
 * @param {Object} bounds - Map bounds with south, north, west, east coordinates
 * @returns {Array} Array of coffee shop objects within bounds
 */
export async function searchPlacesByBounds(bounds) {
  // Calculate map center coordinates
  const centerLat = (bounds.south + bounds.north) / 2;
  const centerLng = (bounds.west + bounds.east) / 2;

  console.log(`🗺️ Map center: ${centerLat}, ${centerLng}`);

  const radiusKm = calculateRadius(bounds);
  console.log(`📏 Search radius: ${radiusKm} km`);

  try {
    
    // Search coffee shops using proximity (map center coordinates)
    const searchUrl = `https://api.geoapify.com/v2/places?categories=catering.cafe&bias=proximity:${centerLng},${centerLat}&limit=50&apiKey=${API_KEY}`;
    
   
    console.log(`🌐 API URL: ${searchUrl}`);
     
     const searchData = await fetchJson(searchUrl);
    console.log(`📍 ${searchData.features?.length || 0} coffee shops found`);
    
    if (!searchData.features) {
      return [];
    }
    
    // Filter results to only include shops within visible map bounds
    const cafesInBounds = searchData.features.filter(place => {
      const lat = place.properties.lat;
      const lng = place.properties.lon;
      
      const isInBounds = lat >= bounds.south && lat <= bounds.north &&
                        lng >= bounds.west && lng <= bounds.east;
      
      return isInBounds;
    });
    
    console.log(`✅ ${cafesInBounds.length} coffee shops within visible map area`);
    
    // Transform results to application format
    return cafesInBounds.map(mapCoffeeShop);

  
    
  } catch (error) {
    console.error("❌ Bounds search error:", error);
    return [];
  }
}

/**
 * Calculate approximate radius of map view in kilometers
 * Uses Haversine formula for distance calculation
 * @param {Object} bounds - Map bounds object
 * @returns {Number} Approximate radius in kilometers
 */
function calculateRadius(bounds) {
  const lat1 = bounds.south;
  const lat2 = bounds.north;
  const lon1 = bounds.west;
  const lon2 = bounds.east;

  // Earth's radius in kilometers
  const R = 6371;
  
  // Convert degrees to radians
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  // Haversine formula
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}