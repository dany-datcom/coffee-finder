/**
 * Google Maps integration and marker management
 * Handles map initialization, marker placement, and map interactions
 * Implements dynamic search when user moves or zooms the map
 */

import { searchPlacesByBounds } from "./api.js";
import { renderPlaces } from "./ui.js";

let map;
let markers = [];
let infoWindows = [];
let searchTimeout;

/**
 * Initialize Google Map instance
 * Sets default center to San José, Costa Rica
 * Removes POI labels for cleaner appearance
 */
export function createMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 9.9281, lng: -84.0907 },
    zoom: 13,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
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
  map.addListener("dragend", () => {
    console.log("🖱️ User moved map");
    debouncedSearch();
  });

  // Trigger search when user changes zoom level
  map.addListener("zoom_changed", () => {
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
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    performBoundsSearch();
  }, 800);
}

/**
 * Perform search based on current map bounds
 * Queries coffee shops visible in current map viewport
 */
async function performBoundsSearch() {
  const bounds = map.getBounds();

  if (!bounds) {
    console.warn("⚠️ Map bounds not available yet");
    return;
  }

  const boundsObj = {
    south: bounds.getSouthWest().lat(),
    north: bounds.getNorthEast().lat(),
    west: bounds.getSouthWest().lng(),
    east: bounds.getNorthEast().lng()
  };

  console.log("📦 Searching by bounds:", boundsObj);

  try {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.remove("hidden");
    }

    // Search for coffee shops in current map view
    const places = await searchPlacesByBounds(boundsObj);

    console.log(`📍 ${places.length} coffee shops found`);

    // Update UI with new results
    renderPlaces(places);
    addMarkers(places, false);
  } catch (error) {
    console.error("❌ Bounds search error:", error);
  } finally {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.add("hidden");
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
  
  map.setCenter({ lat, lng });
  map.setZoom(zoomLevel);
  
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
  // Clear previous markers from map
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  // Close previous info windows
  infoWindows.forEach(infoWindow => infoWindow.close());
  infoWindows = [];

  if (!places || places.length === 0) {
    console.warn("⚠️ No markers to add");
    return;
  }

  const bounds = new google.maps.LatLngBounds();

  // Create marker for each coffee shop
  places.forEach((place, index) => {
    const lat = place.geocodes?.main?.latitude;
    const lng = place.geocodes?.main?.longitude;

    // Skip places with invalid coordinates
    if (lat == null || lng == null) {
      console.warn(`⚠️ Invalid coordinates for: ${place.name}`);
      return;
    }

    // Create marker with number label
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      title: place.name,
      label: String(index + 1)
    });

    // Create info window with shop details
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; max-width: 200px;">
          <h3 style="margin: 0 0 5px 0;">${place.name}</h3>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">
            ${place.address}
          </p>
        </div>
      `
    });

    // Open info window on marker click
    marker.addListener("click", () => {
      infoWindows.forEach(iw => iw.close());
      infoWindow.open(map, marker);
    });

    markers.push(marker);
    infoWindows.push(infoWindow);

    bounds.extend({ lat, lng });
  });

  // Auto-center map to show all markers
  if (shouldAutoCenter) {
    if (markers.length > 1) {
      map.fitBounds(bounds);
    } else if (markers.length === 1) {
      map.setCenter(markers[0].getPosition());
      map.setZoom(16);
    }
  }

  console.log(`✅ ${markers.length} markers added`);
}

/**
 * Clear all markers from map
 * Removes all markers and closes info windows
 */
export function clearMap() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  infoWindows.forEach(infoWindow => infoWindow.close());
  infoWindows = [];

  console.log("✅ Map cleared");
}