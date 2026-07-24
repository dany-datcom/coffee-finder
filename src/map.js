/**
 * Google Maps integration and marker management
 * Handles map initialization, marker placement, and map interactions
 * Implements dynamic search when user moves or zooms the map
 */
/* global google */

import { mapTheme } from "./mapTheme.js";
import { searchPlacesByBounds } from "./api.js";
import { renderPlaces,updateMapStatus,highlightPlace } from "./ui.js";
import { setLoading } from "./utils/loading.js";

const mapState = {
  map: null,
  markers: [],
  infoWindows: [],
  searchTimeout: null,
  markerLookup: new Map()
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

  mapState.markerLookup.clear();
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

  mapState.markerLookup.set(place.name, {
      marker,
      infoWindow,
      place
    });

  marker.addListener("click", () => {
    mapState.infoWindows.forEach(iw => iw.close());
    infoWindow.open(mapState.map, marker);
    highlightPlace(place.name);
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
      <div class="map-popup">
        <div class="popup-badge">
          ☕ Coffee Shop
        </div>
        <h3 
          class="popup-title">${place.name}
        </h3>
        <p class="popup-address">
          ${place.address}
        </p>
        <a class="popup-button"
        target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=${place.geocodes.main.latitude},${place.geocodes.main.longitude}"
        >
         🧭 Directions
        </a>
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
  updateMapStats(places.length);

  const center = mapState.map.getCenter();
  updateMapStatus(
    `${center.lat().toFixed(3)}, ${center.lng().toFixed(3)}`,
    places.length
  );
}

function updateMapStats(total){

    const counter = document.getElementById("results-count");

    if(counter){

        counter.textContent =
            `${total} Coffee shop${total !== 1 ? "s" : ""}`;

    }

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

    console.log("Bounds:", boundsObj);
console.log("Places:", places);

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
  
  google.maps.event.addListenerOnce(mapState.map, "idle", () => {
    performBoundsSearch();
  });
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

/**
 * Focus map on a coffee shop
 * Centers the map and opens its InfoWindow
 * @param {Object} place
 */
export function focusPlace(place) {

  const item = mapState.markerLookup.get(place.name);

  if (!item) {
    console.warn(`Marker not found for ${place.name}`);
    return;
  }

  const { marker, infoWindow } = item;

  // Close any previously opened InfoWindows
  mapState.infoWindows.forEach(iw => iw.close());

  // Center map
  mapState.map.panTo(marker.getPosition());

  // Smooth zoom
  mapState.map.setZoom(17);

  // Open popup
  infoWindow.open(mapState.map, marker);
}

export function highlightMarker(placeName) {
  const item = mapState.markerLookup.get(placeName);
  if (!item) return;

  item.marker.setAnimation(google.maps.Animation.BOUNCE);

  setTimeout(() => {
    item.marker.setAnimation(null);
  }, 700);  
}

  
