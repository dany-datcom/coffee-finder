/**
 * @file map.js
 * @module Map
 * @description Google Maps integration and marker management module.
 * Handles map initialization, custom marker placement, user interactions,
 * and dynamic search bound triggers.
 */

/* global google */

// 1. UI & Visualization Modules
import { mapTheme } from "./mapTheme.js";
import { renderPlaces, updateMapStatus,renderSkeletonCards } from "./ui.js";
// 2. API & Network Services
import { searchPlacesByBounds, reverseGeocode } from "./api.js";
// 3. Application State Management
import {
  setPlace,
  getCurrentSort,
  getUserLocation,
  getPlace, 
  setMapMode, 
  setActivePlace, 
  getMapMode, 
  getActivePlace
} from "./state/appState.js";
// 4. Utility & Helper Functions
import { setLoading } from "./utils/loading.js";
import { sortPlaces } from "./utils/sorting.js";
import { calculateDistance } from "./utils/distance.js";
import { estimateTravelTime } from "./utils/travelTime.js";

/**
 * Custom marker icon configuration for default coffee shop pins.
 * @type {google.maps.Icon}
 */
const MARKER_ICON = {
  url: "/assets/coffee-marker.svg",
  scaledSize: new google.maps.Size(42, 52),
  anchor: new google.maps.Point(21, 52)
};

/**
 * Custom marker icon configuration for the currently active/selected coffee shop pin.
 * @type {google.maps.Icon}
 */
const ACTIVE_MARKER_ICON = {
  url: "/assets/coffee-marker-active.svg",
  scaledSize: new google.maps.Size(46, 56),
  anchor: new google.maps.Point(23, 56)
};

/**
 * Internal module state registry for managing map instances, markers, and UI modes.
 * @type {Object}
 * @property {google.maps.Map|null} map - Active Google Maps instance.
 * @property {Array<google.maps.Marker>} markers - Active map marker instances.
 * @property {Array<google.maps.InfoWindow>} infoWindows - Active InfoWindow instances.
 * @property {number|null} searchTimeout - Timeout ID for debouncing bounds search.
 * @property {Map<string|number, google.maps.Marker>} markerLookup - Fast O(1) marker lookup map by place ID.
 * @property {Object|null} activePlace - Currently highlighted coffee shop place data.
 * @property {string} mode - Current interaction mode (e.g., 'explore').
 */
const mapState = {
  map: null,
  markers: [],
  infoWindows: [],
  searchTimeout: null,
  markerLookup: new Map(),
  activePlace: null,
  mode: "explore"
};

/**
 * Initializes the Google Maps instance inside the '#map' DOM container.
 * Configures default center coordinates (San José, Costa Rica), initial zoom level,
 * and custom brand styling, then binds interactive event listeners.
 * 
 * @returns {void}
 */
export function createMap() {
  mapState.map = new google.maps.Map(
    document.getElementById("map"),
    {
      center: {
        lat: 9.9281,
        lng: -84.0907
      },
      zoom: 13,
      styles: mapTheme
    }
  );

  setupMapListeners();
}

/**
 * Binds interaction event listeners to the active Google Maps instance.
 * Triggers a debounced place search whenever the user finishes panning ('dragend')
 * or altering the camera zoom level ('zoom_changed').
 * 
 * @private
 * @returns {void}
 */
function setupMapListeners(){ 
  mapState.map.addListener("dragend", () => {
    console.log("🖱️ User moved map");
    debouncedSearch();
  });

  mapState.map.addListener("zoom_changed", () => {
    console.log("🔍 User changed zoom");
    debouncedSearch();
  });
}

/**
 * Debounces the map bounds search to prevent excessive API requests during navigation.
 * Cancels any active timeout and resets a timer before executing `performBoundsSearch`.
 * 
 * @private
 * @returns {void}
 */
function debouncedSearch(){
  clearTimeout(mapState.searchTimeout);

  mapState.searchTimeout = setTimeout( () => {
    performBoundsSearch();
  }, 800);
}

/**
 * Extracts the geographic bounding box coordinates of the currently visible map area.
 * Converts Google Maps LatLngBounds into a plain JS object suitable for API requests.
 * 
 * @private
 * @returns {{south: number, north: number, west: number, east: number}|null} Bounding box coordinates object, or null if map bounds are not ready.
 */
function getMapBounds(){
  const bounds = mapState.map.getBounds();

  if(!bounds){
    console.warn("⚠️ Map bounds unavailable");
    return null;
  }

  return {
    south: bounds.getSouthWest().lat(),
    north: bounds.getNorthEast().lat(),
    west: bounds.getSouthWest().lng(),
    east: bounds.getNorthEast().lng()
  };
}

/**
 * Removes all active markers and InfoWindows from the map.
 * Detaches Google Maps instances and flushes internal state registries
 * to prevent memory leaks during view updates.
 * 
 * @private
 * @returns {void}
 */
function clearMarkersAndInfoWindows(){
  mapState.markers.forEach(
    marker => marker.setMap(null)
  );

  mapState.infoWindows.forEach(
    infoWindow => infoWindow.close()
  );

  mapState.markers = [];
  mapState.infoWindows = [];
  mapState.markerLookup.clear();
}

/**
 * Switches the map interaction mode to 'focus' and highlights the selected coffee shop.
 * 
 * @private
 * @param {Object} place - The coffee shop object to focus on.
 * @returns {void}
 */
function enterFocusMode(place) {
  setMapMode("focus");
  setActivePlace(place);
}

/**
 * Resets the map interaction mode back to 'explore' and clears the active place selection.
 * 
 * @private
 * @returns {void}
 */
function exitFocusMode() {
  setMapMode("explore");
  setActivePlace(null);
}

/**
 * Filters the list of coffee shops based on the current map view mode.
 * In 'explore' mode, returns all places. In 'focus' mode, returns an array containing
 * solely the focused place, or resets to 'explore' mode if the place is no longer available.
 * 
 * @private
 * @param {Array<Object>} places - List of coffee shop place objects to filter.
 * @returns {Array<Object>} Array containing all places or strictly the active focused place.
 */
function getVisiblePlaces(places) {
  if (getMapMode() !== "focus") {
    return places;
  }

  const activePlace = getActivePlace();

  const exists = places.find(
    place => place.id === activePlace?.id
  );

  if (!exists) {
    exitFocusMode();
    return places;
  }

  return [exists];
}

/**
 * Checks whether the map is currently in an interactive exploration state.
 * 
 * @private
 * @returns {boolean} `true` if the map mode is 'explore', `false` otherwise.
 */
function isMapInteractive() {
  return getMapMode() === "explore";
}

/**
 * Creates a custom Google Maps marker and associated InfoWindow for a coffee shop place.
 * Binds click events for place selection, updates lookup maps, and expands map bounds.
 * 
 * @private
 * @param {Object} place - The coffee shop place object containing geocode data.
 * @param {google.maps.LatLngBounds} bounds - Google Maps bounds object to extend with place coordinates.
 * @returns {void}
 */
function createMarker(place, bounds){
  const lat = place.geocodes?.main?.latitude;
  const lng = place.geocodes?.main?.longitude;

  if(lat == null || lng == null){
    console.warn(`⚠️ Invalid coordinates for ${place.name}`);
    return;
  }

  const marker = new google.maps.Marker({
    position: { lat, lng },
    map: mapState.map,
    title: place.name,
    icon: MARKER_ICON
  });
  
  const infoWindow = createInfoWindow(place);

  marker.addListener("click", () => {
    if (getMapMode() === "focus" && getActivePlace()?.id !== place.id) {    
    mapState.infoWindows.forEach(window => window.close());
    }

    infoWindow.open(mapState.map, marker);
    focusPlace(place);
  });

  mapState.markerLookup.set(place.id,{ 
    marker, 
    infoWindow, 
    place
  });
  
  mapState.markers.push(marker);
  mapState.infoWindows.push(infoWindow);
  
  bounds.extend({lat, lng});
}

/**
 * Creates a configured Google Maps InfoWindow instance with coffee shop details
 * and an external navigation link. Listens for the 'closeclick' event to restore exploration mode.
 * 
 * @private
 * @param {Object} place - The coffee shop place object containing location and coordinate details.
 * @returns {google.maps.InfoWindow} Configured Google Maps InfoWindow instance.
 */
function createInfoWindow(place) {
  const city = place.location?.city || "";
  const state = place.location?.state || "";
  const locationText = [city, state].filter(Boolean).join(", ") || "Address unavailable";

  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div class="map-popup">
        <h3 class="popup-title">${place.name}</h3>
        <p class="popup-address">${locationText}</p>
        <a
          class="popup-button"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.google.com/maps/dir/?api=1&destination=${place.geocodes.main.latitude},${place.geocodes.main.longitude}"
        >
          🧭 Open in Google Maps
        </a>
      </div>
    `
  });

  infoWindow.addListener("closeclick", () => {
    exitFocusMode();
    performBoundsSearch();
  });

  return infoWindow;
}

/**
 * Adjusts the map camera to encompass all active markers within the viewport.
 * Automatically fits bounds for multiple markers, or centers with a comfortable zoom level (16)
 * if only a single marker is present.
 * 
 * @private
 * @param {google.maps.LatLngBounds} bounds - Google Maps LatLngBounds instance containing marker coordinates.
 * @returns {void}
 */
function fitMarkersOnMap(bounds){
  if(mapState.markers.length === 0){
    return;
  }

  if(mapState.markers.length > 1){
    mapState.map.fitBounds(bounds);
  }

  else{
    mapState.map.setCenter(
      mapState.markers[0].getPosition()
    );

    mapState.map.setZoom(16);
  }
}

/**
 * Orchestrates UI and map updates following a successful place search.
 * Filters visible places, updates DOM cards, renders map markers, and performs
 * asynchronous reverse geocoding to update the human-readable location status bar.
 * 
 * @private
 * @async
 * @param {Array<Object>} places - Array of raw coffee shop place objects retrieved from search.
 * @returns {Promise<void>}
 */
async function updateSearchResults(places){
  const visiblePlaces = getVisiblePlaces(places);
  renderPlaces(visiblePlaces);

  addMarkers(
    visiblePlaces,
    false
  );

  updateMapStats(
    places.length
  );

  const center = mapState.map.getCenter();

  const location = await reverseGeocode(
      center.lat(),
      center.lng()
    );

  updateMapStatus(
    location,
    places.length
  );
}

/**
 * Updates the result counter element in the DOM with the total number of found coffee shops.
 * Handles dynamic singular/plural string formatting safely.
 * 
 * @private
 * @param {number} total - Total count of coffee shops returned from the search.
 * @returns {void}
 */
function updateMapStats(total){
  const counter = document.getElementById("results-count");

  if(counter){
    counter.textContent = `${total} Coffee shop${total !== 1 ? "s" : ""}`;
  }
}

/**
 * Executes an asynchronous coffee shop search based on current visible map bounds.
 * Handles loading UI states, data enrichment (distance and walking time calculations),
 * active sorting criteria, global state synchronization, and UI updates.
 * 
 * @private
 * @async
 * @returns {Promise<void>}
 */
async function performBoundsSearch(){
  if (!isMapInteractive()) {
    return;
  }
  const boundsObj = getMapBounds();

  if(!boundsObj){
    return;
  }

  try{
    setLoading( true, "Searching coffee shops...");
    renderSkeletonCards();

    const places = await searchPlacesByBounds(boundsObj);

    const userLocation = getUserLocation();
    
    if (userLocation) {
      places.forEach(place => {
        const distance = calculateDistance(
    userLocation,
    place
  );

  console.log("📍 Distance calculation:", {
    place: place.name,
    userLocation,
    placeCoordinates: place.geocodes?.main,
    distance
  });

  place.distance = distance;

  place.walkingTime =
    estimateTravelTime(distance);
        /*place.distance = calculateDistance(userLocation, place);
        place.walkingTime = estimateTravelTime(place.distance);*/
      });
    }

    const sorted = sortPlaces(places, getCurrentSort());
    setPlace(sorted);
    updateSearchResults(sorted);
  } catch(error){
    console.error("❌ Bounds search error:", error);
  } finally{
    setLoading(false);
  }
}

/**
 * Repositions the map center to a specified city coordinate and updates the zoom level.
 * Triggers an automatic bounds search once the map camera finishes moving (idle state).
 * 
 * @exports centerMapOnCity
 * @param {number} lat - Latitude coordinate of the target city.
 * @param {number} lng - Longitude coordinate of the target city.
 * @param {number} [zoomLevel=13] - Target zoom level (defaults to 13 for city-wide overview).
 * @returns {void}
 */
export function centerMapOnCity(lat, lng, zoomLevel = 13){
  mapState.map.setCenter({ lat, lng });
  mapState.map.setZoom(zoomLevel);

  google.maps.event.addListenerOnce(
    mapState.map,
    "idle",
    () => {
      performBoundsSearch();
    }
  );
}

/**
 * Clears existing map elements and renders new markers for a list of places.
 * Dynamically extends geographic bounds and optionally adjusts the viewport camera.
 * 
 * @exports addMarkers
 * @param {Array<Object>} places - List of coffee shop place objects to render on the map.
 * @param {boolean} [shouldAutoCenter=true] - Whether to fit map camera bounds around added markers.
 * @returns {void}
 */
export function addMarkers(places, shouldAutoCenter = true) {
  clearMarkersAndInfoWindows();
  
  if(!places || places.length === 0){
    console.warn("⚠️ No markers to add");
    return;
  }

  const bounds = new google.maps.LatLngBounds();

  places.forEach(place => {
    createMarker(place, bounds);
  });

  if(shouldAutoCenter){
    fitMarkersOnMap(bounds);
  }
  
  console.log(
    `✅ ${mapState.markers.length} markers added`
  );
}

/**
 * Public API method to clear all active markers and overlays from the map view.
 * Delegates execution to internal cleanup routines for memory flush.
 * 
 * @exports clearMap
 * @returns {void}
 */
export function clearMap(){
  clearMarkersAndInfoWindows();
}

/**
 * Resets all active map markers back to their default visual icon state.
 * Iterates through the markerLookup registry and applies MARKER_ICON to each instance.
 * 
 * @private
 * @returns {void}
 */
function resetMarkerIcons(){
  mapState.markerLookup.forEach(item => {
    item.marker.setIcon(MARKER_ICON);
  });
}

/**
 * Updates a specific map marker instance to display its active/focused visual icon.
 * 
 * @private
 * @param {google.maps.Marker} marker - Google Maps marker instance to activate.
 * @returns {void}
 */
function activateMarker(marker) {
  marker.setIcon(ACTIVE_MARKER_ICON);
}

/**
 * Focuses on a single coffee shop place across state, map camera, marker animations, and sidebar UI.
 * Handles smooth map panning, zoom adjustment, marker bounce animation, InfoWindow display,
 * and automatic smooth scrolling of the sidebar card into the viewport.
 * 
 * @exports focusPlace
 * @param {Object} place - The coffee shop place object to focus on.
 * @throws {Error} Throws if no matching marker exists in the markerLookup Map.
 * @returns {void}
 */
export function focusPlace(place) {
  enterFocusMode(place);
  renderPlaces(getPlace());

  const item = mapState.markerLookup.get(place.id);

  if (!item) {
    throw new Error(`Marker not found for ${place.name}`);
  }

  const { marker, infoWindow } = item;

  mapState.infoWindows.forEach(window => window.close());

  mapState.map.panTo(marker.getPosition());

  if (mapState.map.getZoom() < 17) {
    mapState.map.setZoom(17);
  }

  resetMarkerIcons();
  activateMarker(marker);

  marker.setAnimation(google.maps.Animation.BOUNCE);

  setTimeout(() => {
    marker.setAnimation(null);
  }, 700);

  infoWindow.open(mapState.map, marker);

  const card = document.querySelector(`[data-place-id="${place.id}"]`);

  if (!card) {
    return;
  }

  const rect = card.getBoundingClientRect();
  const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

  if (!isVisible) {
    card.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

/**
 * Triggers a temporary bounce animation on a map marker for visual feedback (e.g., card hover).
 * Performs an O(1) lookup and automatically cancels the animation after 700ms.
 * 
 * @exports highlightMarker
 * @param {Object} place - The coffee shop place object containing the target place ID.
 * @returns {void}
 */
export function highlightMarker(place){
  const item = mapState.markerLookup.get(place.id);
  
  if(!item){
   return;
  }

  item.marker.setAnimation(google.maps.Animation.BOUNCE);

  setTimeout(() => {
    item.marker.setAnimation(null);
  }, 700);
}