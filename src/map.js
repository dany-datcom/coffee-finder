/**
 * Google Maps integration and marker management
 * Handles map initialization, marker placement, and map interactions
 * Implements dynamic search when user moves or zooms the map
 */

/* global google */

import { mapTheme } from "./mapTheme.js";
import { searchPlacesByBounds, reverseGeocode } from "./api.js";
import { renderPlaces, updateMapStatus,renderSkeletonCards } from "./ui.js";
import { setLoading } from "./utils/loading.js";
import {
  setPlaces,
  getCurrentSort,
  getUserLocation,
  getPlaces
} from "./state/appState.js";
import { sortPlaces } from "./utils/sorting.js";
import { calculateDistance } from "./utils/distance.js";
import { estimateTravelTime } from "./utils/travelTime.js";
import { setMapMode, setActivePlace, getMapMode, getActivePlace } from "./state/appState.js";

const MARKER_ICON = {
  url: "/assets/coffee-marker.svg",
  scaledSize: new google.maps.Size(42, 52),
  anchor: new google.maps.Point(21, 52)
};

const ACTIVE_MARKER_ICON = {
  url: "/assets/coffee-marker-active.svg",
  scaledSize: new google.maps.Size(46, 56),
  anchor: new google.maps.Point(23, 56)
};


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
 * Initialize Google Map
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


  console.log("✅ Map created");

  setupMapListeners();

}



/**
 * Setup map listeners
 */
function setupMapListeners(){

  mapState.map.addListener(
    "dragend",
    () => {

      console.log("🖱️ User moved map");

      debouncedSearch();

    }
  );


  mapState.map.addListener(
    "zoom_changed",
    () => {

      console.log("🔍 User changed zoom");

      debouncedSearch();

    }
  );

}



/**
 * Prevent excessive API calls
 */
function debouncedSearch(){

  clearTimeout(
    mapState.searchTimeout
  );


  mapState.searchTimeout = setTimeout(
    () => {

      performBoundsSearch();

    },
    800
  );

}



/**
 * Get visible map bounds
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
 * Remove existing markers
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

function enterFocusMode(place) {

  setMapMode("focus");
  setActivePlace(place);

  console.log({
  mode: getMapMode(),
  activePlace: getActivePlace()
});

}

function exitFocusMode() {
  setMapMode("explore");
  setActivePlace(null);
  
  console.log("☕ Exit Focus Mode");
}

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

function isMapInteractive() {
  return getMapMode() === "explore";
}





/**
 * Create marker
 */
function createMarker(place, bounds){


  const lat =
    place.geocodes?.main?.latitude;


  const lng =
    place.geocodes?.main?.longitude;



  if(lat == null || lng == null){

    console.warn(
      `⚠️ Invalid coordinates for ${place.name}`
    );

    return;

  }



  const marker =
  new google.maps.Marker({

    position: { lat, lng },

    map: mapState.map,

    title: place.name,

    icon: MARKER_ICON

});



  const infoWindow =
    createInfoWindow(place);



  marker.addListener("click", () => {

  if (
    (getMapMode() === "focus") &&
    getActivePlace()?.id !== place.id
  ) 
    

  mapState.infoWindows.forEach(window =>
    window.close()
  );

  infoWindow.open(
    mapState.map,
    marker
  );

  focusPlace(place);

});



  mapState.markerLookup.set(
    place.id,
    {
      marker,
      infoWindow,
      place
    }
  );



  mapState.markers.push(marker);

  mapState.infoWindows.push(infoWindow);



  bounds.extend({
    lat,
    lng
  });


}



/**
 * Create popup window
 */
function createInfoWindow(place) {

  const infoWindow = new google.maps.InfoWindow({

    content: `
      <div class="map-popup">

        <h3 class="popup-title">
          ${place.name}
        </h3>

        <p class="popup-address">
          ${place.location.city}, ${place.location.state}
        </p>

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
 * Fit markers into view
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
 * Update UI after search
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



  const center =
    mapState.map.getCenter();



  const location =
    await reverseGeocode(
      center.lat(),
      center.lng()
    );



  updateMapStatus(
    location,
    places.length
  );


}



/**
 * Update result counter
 */
function updateMapStats(total){


  const counter =
    document.getElementById(
      "results-count"
    );



  if(counter){

    counter.textContent =
      `${total} Coffee shop${total !== 1 ? "s" : ""}`;

  }

}



/**
 * Search places in visible map area
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
    
    if(userLocation){
      places.forEach(place => {
        place.distance = calculateDistance(userLocation, place);
        place.walkingTime = estimateTravelTime(place.distance);
      });
    }

    const sorted = sortPlaces(places, getCurrentSort());
    setPlaces(sorted);
    updateSearchResults(sorted);
  }
  catch(error){
    console.error("❌ Bounds search error:", error);
  }

  finally{
    setLoading(false);
  }
}



/**
 * Center map on city
 */
export function centerMapOnCity(
  lat,
  lng,
  zoomLevel = 13
){


  mapState.map.setCenter({

    lat,

    lng

  });


  mapState.map.setZoom(
    zoomLevel
  );



  google.maps.event.addListenerOnce(
    mapState.map,
    "idle",
    () => {

      performBoundsSearch();

    }
  );


}



/**
 * Add markers
 */
export function addMarkers(
  places,
  shouldAutoCenter = true
){


  clearMarkersAndInfoWindows();
  


  if(!places || places.length === 0){

    console.warn(
      "⚠️ No markers to add"
    );

    return;

  }



  const bounds =
    new google.maps.LatLngBounds();



  places.forEach(place => {

    createMarker(
      place,
      bounds
    );

  });



  if(shouldAutoCenter){

    fitMarkersOnMap(
      bounds
    );

  }



  console.log(
    `✅ ${mapState.markers.length} markers added`
  );


}



/**
 * Clear map
 */
export function clearMap(){

  clearMarkersAndInfoWindows();

}

function resetMarkerIcons() {

  mapState.markerLookup.forEach(item => {
    item.marker.setIcon(MARKER_ICON);
  });

}
  function activateMarker(marker) {
    marker.setIcon(ACTIVE_MARKER_ICON);
  }



/**
 * Focus selected coffee shop
 */
export function focusPlace(place) {

  console.log("1. Enter Focus");

  // Update application state
  enterFocusMode(place);
  renderPlaces(getPlaces());

//addMarkers([place], false);

  const item = mapState.markerLookup.get(place.id);

  if (!item) {
    throw new Error(`Marker not found for ${place.name}`);
  }

  const { marker, infoWindow } = item;

  // Close previous popup
  mapState.infoWindows.forEach(window => window.close());

  // Center map
  mapState.map.panTo(marker.getPosition());
  console.log("2. Pan");

  if (mapState.map.getZoom() < 17) {
    mapState.map.setZoom(17);
  }

  // Update marker appearance
  resetMarkerIcons();
  activateMarker(marker);

  marker.setAnimation(
    google.maps.Animation.BOUNCE
  );

  setTimeout(() => {
    marker.setAnimation(null);
  }, 700);

  // Open popup
  infoWindow.open(
    mapState.map,
    marker
  );

  // Scroll selected card into view
  const card = document.querySelector(
    `[data-place-id="${place.id}"]`
  );

  if (!card) {
    return;
  }

  const rect = card.getBoundingClientRect();

  const isVisible =
    rect.top >= 0 &&
    rect.bottom <= window.innerHeight;

  if (!isVisible) {

    card.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    console.log("3. Popup opened");
  }

}



/**
 * Highlight marker animation
 */
export function highlightMarker(place){


  const item =
    mapState.markerLookup.get(
      place.id
    );



  if(!item){

    return;

  }



  item.marker.setAnimation(
    google.maps.Animation.BOUNCE
  );



  setTimeout(
    () => {

      item.marker.setAnimation(null);

    },
    700
  );


}