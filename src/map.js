/**
 * Google Maps integration and marker management
 * Handles map initialization, marker placement, and map interactions
 * Implements dynamic search when user moves or zooms the map
 */

/* global google */

import { mapTheme } from "./mapTheme.js";
import { searchPlacesByBounds, reverseGeocode } from "./api.js";
import { renderPlaces, updateMapStatus } from "./ui.js";
import { setLoading } from "./utils/loading.js";
import {
  setPlaces,
  getCurrentSort,
  getUserLocation
} from "./state/appState.js";
import { sortPlaces } from "./utils/sorting.js";
import { calculateDistance } from "./utils/distance.js";
import { estimateTravelTime } from "./utils/travelTime.js";


const mapState = {

  map: null,

  markers: [],

  infoWindows: [],

  searchTimeout: null,

  markerLookup: new Map()

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

    console.warn(
      "⚠️ Map bounds unavailable"
    );

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

      position:{
        lat,
        lng
      },

      map: mapState.map,

      title: place.name

    });



  const infoWindow =
    createInfoWindow(place);



  marker.addListener(
    "click",
    () => {


      mapState.infoWindows.forEach(
        window => window.close()
      );


      infoWindow.open(
        mapState.map,
        marker
      );


      focusPlace(place);


    }
  );



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
function createInfoWindow(place){


  return new google.maps.InfoWindow({

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


  renderPlaces(places);


  addMarkers(
    places,
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


  const boundsObj =
    getMapBounds();



  if(!boundsObj){

    return;

  }



  try{


    setLoading(true);



    const places =
      await searchPlacesByBounds(
        boundsObj
      );



    const userLocation =
      getUserLocation();



    if(userLocation){


      places.forEach(place => {


        place.distance =
          calculateDistance(
            userLocation,
            place
          );


        place.walkingTime =
          estimateTravelTime(
            place.distance
          );


      });


    }



    const sorted =
      sortPlaces(
        places,
        getCurrentSort()
      );



    setPlaces(sorted);


    updateSearchResults(sorted);



    console.log(
      `📍 ${sorted.length} coffee shops found`
    );


  }
  catch(error){


    console.error(
      "❌ Bounds search error:",
      error
    );


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



/**
 * Focus selected coffee shop
 */
export function focusPlace(place) {

  const item = mapState.markerLookup.get(place.id);

  if (!item) {
    throw new Error(`Marker not found for ${place.name}`);
  }

  const { marker, infoWindow } = item;

  // Close any previously opened InfoWindows
  mapState.infoWindows.forEach(window => window.close());

  // Center map on selected marker
  mapState.map.panTo(marker.getPosition());

  // Avoid unnecessary zoom changes
  if (mapState.map.getZoom() < 17) {
    mapState.map.setZoom(17);
  }

  // Highlight marker
  marker.setAnimation(google.maps.Animation.BOUNCE);

  setTimeout(() => {
    marker.setAnimation(null);
  }, 700);

  // Open popup
  infoWindow.open(mapState.map, marker);

  // Remove previous active card
  document
    .querySelectorAll(".place-card")
    .forEach(card =>
      card.classList.remove("active-card")
    );

  // Highlight selected card
  const card = document.querySelector(
    `[data-place-id="${place.id}"]`
  );

  if (card) {

    card.classList.add("active-card");

    const rect = card.getBoundingClientRect();

const isVisible =
  rect.top >= 0 &&
  rect.bottom <= window.innerHeight;

if (!isVisible) {
  card.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

    requestAnimationFrame(() => {
      card.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });

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