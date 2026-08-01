import { formatDistance } from "../utils/distance.js";
import { formatTravelTime } from "../utils/travelTime.js";
import { createActionBar } from "./actionBar.js";
import { saveFavorite } from "../storage.js";
import { focusPlace } from "../map.js";
import {sharePlace} from "../services/shareService.js";
import { getMapMode, getActivePlace } from "../state/appState.js";



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
export function createCoffeeCard(template, place) {

  const clone = template.content.cloneNode(true);

  const locationText = clone.querySelector(".location-text");

  if (locationText) {
    locationText.textContent = `${place.location.city?? ""}, ${place.location.state?? ""}`;
  }

  const card = clone.querySelector(".place-card");

  if (!card) {
    console.error("Place card template missing");
    return clone;
  }

  // Dataset
  card.dataset.place = place.name;
  card.dataset.placeId = place.id;
  console.log(
  "Rendering",
  place.name,
  getMapMode(),
  getActivePlace()?.name
);

  // Focus Mode visual state
  if (getMapMode() === "focus") {

    if (getActivePlace()?.id === place.id) {

      card.classList.add("active-card");

    } else {

      card.classList.add("inactive-card");

    }

  }

  // Click
  card.addEventListener("click", () => {
    focusPlace(place);
  });

  // Basic info
  clone.querySelector(".place-name").textContent =
    place.name;

  clone.querySelector(".place-address").textContent =
    place.address || "Address not available";

  // Action buttons
  const actionBar =
    clone.querySelector(".action-bar-container");

  if (actionBar) {
    actionBar.innerHTML = createActionBar();
  }

  setupFavoriteButton(clone, place);
  setupDirectionButton(clone, place);
  setupShareButton(clone, place);

  // Distance
  const distance =
    clone.querySelector(".distance-value");

  if (distance && place.distance) {

    distance.textContent =
      formatDistance(place.distance);

  }

  // Walking time
  const walking =
    clone.querySelector(".travel-time-value");

  if (walking && place.walkingTime) {

    walking.textContent =
      formatTravelTime(place.walkingTime);

  }

  return clone;

}



