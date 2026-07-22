/**
 * Google Maps integration and marker management
 * Handles map initialization, marker placement, and map interactions
 * Implements dynamic search when user moves or zooms the map
 */
/* global google */
import { mapTheme } from "./mapTheme.js";
import { searchPlacesByBounds } from "./api.js";
import { renderPlaces } from "./ui.js";
import { setLoading } from "./utils/loading.js";

const mapState = {
  map: null,
  markers: [],
  infoWindows: [],
  searchTimeout: null
};

/**
 * Initialize Google Map instance
 * Sets default center to San José, Costa Rica
 * Removes POI labels for cleaner appearance
 */
export function createMap() {
  mapState.map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 9.9281, lng: -84.0907 },
    zoom: 13,
    styles: mapTheme
  });

  console.log("✅ Map created");
  setupMapListeners();
}

/**
 * Setup map event listeners
 * Triggers coffee shop search when user moves or zooms
 * Uses debounce to prevent excessive API calls
 */
function setupMapListeners() {
  // Trigger search when user finishes dragging map
  mapState.map.addListener("dragend", () => {
    console.log("🖱️ User moved map");
    debouncedSearch();
  });

  // Trigger search when user changes zoom level
  mapState.map.addListener("zoom_changed", () => {
    console.log("🔍 User changed zoom");
    debouncedSearch();
  });
}

/**
 * Debounced search function
 * Waits 800ms after user stops interacting before searching
 * Prevents multiple rapid API calls
 */
function debouncedSearch() {
  clearTimeout(mapState.searchTimeout);
  mapState.searchTimeout = setTimeout(() => {
    performBoundsSearch();
  }, 800);
}

/**
 * Get current visible map bounds
 * Converts Google Maps bounds into application format
 * @returns {Object|null} Bounds object or null if unavailable
 */
function getMapBounds() {
  const bounds = mapState.map.getBounds();

  if (!bounds) {
    console.warn("⚠️ Map bounds not available yet");
    return null;
  }

  return {
    south: bounds.getSouthWest().lat(),
    north: bounds.getNorthEast().lat(),
    west: bounds.getSouthWest().lng(),
    east: bounds.getNorthEast().lng()
  };
}
function clearMarkersAndInfoWindows() {
  mapState.markers.forEach(marker => marker.setMap(null));
  mapState.markers = [];

  mapState.infoWindows.forEach(infoWindow => infoWindow.close());
  mapState.infoWindows = [];
}

/**
 * Create a single map marker
 * @param {Object} place - Coffee shop data
 * @param {Number} index - Marker number
 * @param {Object} bounds - Google Maps bounds instance
 */
function createMarker(place, index, bounds) {
  const lat = place.geocodes?.main?.latitude;
  const lng = place.geocodes?.main?.longitude;

  if (lat == null || lng == null) {
    console.warn(`⚠️ Invalid coordinates for: ${place.name}`);
    return;
  }

  const markerOptions = {
    position: { lat, lng },
    map: mapState.map,
    title: place.name
 
  };
   markerOptions.icon = {
  url: "public/assets/icons/coffee-marker.svg",

  scaledSize: new google.maps.Size(42, 52),
  anchor: new google.maps.Point(21, 52)
  };
  

  const marker = new google.maps.Marker(markerOptions);

  const infoWindow = createInfoWindow(place);

  marker.addListener("click", () => {
    mapState.infoWindows.forEach(iw => iw.close());
    infoWindow.open(mapState.map, marker);
  });

  mapState.markers.push(marker);
  mapState.infoWindows.push(infoWindow);

  bounds.extend({ lat, lng });
}

/**
 * Create information popup for a coffee shop
 * @param {Object} place - Coffee shop data
 * @returns {google.maps.InfoWindow}
 */
function createInfoWindow(place) {
  return new google.maps.InfoWindow({
    content: `
      <div style="padding: 10px; max-width: 200px;">
        <h3 style="margin: 0 0 5px 0;">${place.name}</h3>
        <p style="margin: 0; font-size: 0.9rem; color: #666;">
          ${place.address}
        </p>
      </div>
    `
  });
}

/**
 * Adjust map view to display markers
 * @param {google.maps.LatLngBounds} bounds - Marker boundaries
 */
function fitMarkersOnMap(bounds) {
  if (mapState.markers.length > 1) {
    mapState.map.fitBounds(bounds);

  } else if (mapState.markers.length === 1) {
    mapState.map.setCenter(
      mapState.markers[0].getPosition()
    );

    mapState.map.setZoom(16);
  }
}

/**
 * Update UI and map with search results
 * @param {Array} places - Coffee shops found
 */
function updateSearchResults(places) {
  renderPlaces(places);
  addMarkers(places, false);
}
/**
 * Perform search based on current map bounds
 * Queries coffee shops visible in current map viewport
 */
async function performBoundsSearch() {
  const boundsObj = getMapBounds();

  if (!boundsObj) {
    return;
  }

  console.log("📦 Searching by bounds:", boundsObj);

  try {
    setLoading(true);
    // Search for coffee shops in current map view
    const places = await searchPlacesByBounds(boundsObj);

    console.log(`📍 ${places.length} coffee shops found`);

    // Update UI with new results
    updateSearchResults(places);

  } catch (error) {
    console.error("❌ Bounds search error:", error);
  } finally {
    const loader = document.getElementById("loader");
    if (loader) {
      setLoading(false);
    }
  }
}

/**
 * Center map on specific city coordinates
 * Updates map view to show the specified location
 * @param {Number} lat - Latitude of target location
 * @param {Number} lng - Longitude of target location
 * @param {Number} zoomLevel - Zoom level (default 13)
 */
export function centerMapOnCity(lat, lng, zoomLevel = 13) {
  console.log(`🎯 Centering map on: ${lat}, ${lng}`);
  
  mapState.map.setCenter({ lat, lng });
  mapState.map.setZoom(zoomLevel);
  
  // Map bounds_changed listener will trigger search automatically
}

/**
 * Add markers to map for each coffee shop
 * Removes previous markers
 * Adds info windows with shop details
 * Implements auto-zoom for search results
 * @param {Array} places - Array of coffee shop objects
 * @param {Boolean} shouldAutoCenter - Whether to auto-zoom to fit markers (default true)
 */
export function addMarkers(places, shouldAutoCenter = true) {
  
  clearMarkersAndInfoWindows();

  if (!places || places.length === 0) {
    console.warn("⚠️ No markers to add");
    return;
  }

  const bounds = new google.maps.LatLngBounds();

  // Create marker for each coffee shop
  places.forEach((place, index) => {
    createMarker(place, index, bounds);
  });

  // Auto-center map to show all markers
  if (shouldAutoCenter) {
  fitMarkersOnMap(bounds);
}

  console.log(`✅ ${mapState.markers.length} markers added`);
}

/**
 * Clear all markers from map
 * Removes all markers and closes info windows
 */
export function clearMap() {
  clearMarkersAndInfoWindows();
  console.log("✅ Map cleared");
}

  
