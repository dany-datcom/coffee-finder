import { formatDistance } from "../utils/distance.js";
import { formatTravelTime } from "../utils/travelTime.js";
import { createActionBar } from "./actionBar.js";
import { saveFavorite } from "../storage.js";
import { focusPlace, highlightMarker } from "../map.js";
import {sharePlace} from "../services/shareService.js";


/**
 * Activate selected card
 */
function activateCard(card) {

  document
    .querySelectorAll(".place-card")
    .forEach(item =>
      item.classList.remove("active-card")
    );


  card.classList.add("active-card");

}

/**
 * Setup favorite button behavior
 */
function setupFavoriteButton(clone, place) {

    const button = clone.querySelector(".favorite-btn");

    if (!button) return;

    button.addEventListener("click", (event) => {

        event.stopPropagation();

        saveFavorite(place);

        button.classList.toggle("saved");

    });

}

/**
 * Setup direction button behavior
 */
function setupDirectionButton(clone, place) {

  const button = clone.querySelector(".direction-btn");

  if (!button) {
    console.warn("Direction button not found:", place.name);
    return;
  }


  button.addEventListener("click", (event) => {

    event.stopPropagation();

    const lat = place.geocodes.main.latitude;
    const lng = place.geocodes.main.longitude;


    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );

  });
}

function setupShareButton(clone, place) {

  const button = clone.querySelector(".share-btn");

  if (!button) return;

  button.addEventListener("click", async (event) => {

    event.stopPropagation();

    await sharePlace(place);

  });

}

/**
 * Create coffee shop card
 */
export function createCoffeeCard (template, place) {

  const clone = template.content.cloneNode(true);


  const locationText = clone.querySelector(".location-text");

  if (locationText) {
    locationText.textContent = ` ${place.city}, ${place.state}`;
  }


  const card = clone.querySelector(".place-card");


  if (!card) {
    console.error("Place card template missing");
    return clone;
  }


  card.dataset.place = place.name;



  card.addEventListener("click", () => {

    activateCard(card);
    focusPlace(place);
    highlightMarker(place.name);

  });



  clone.querySelector(".place-name").textContent =
    place.name;


  clone.querySelector(".place-address").textContent =
    place.address || "Address not available";



  /*
    Create action buttons
    BEFORE adding events
  */

  const actionBar = clone.querySelector(".action-bar-container");


  if (actionBar) {

    actionBar.innerHTML = createActionBar();

  }


  setupFavoriteButton(clone, place);

  setupDirectionButton(clone, place);

  setupShareButton(clone, place);



  const distance = clone.querySelector(".distance-value");


  if (distance && place.distance) {

    distance.textContent =
      ` ${formatDistance(place.distance)}`;

  }



  const walking = clone.querySelector(".travel-time-value");


  if (walking && place.walkingTime) {

    walking.textContent =
      ` ${formatTravelTime(place.walkingTime)}`;

  }



  return clone;

}



