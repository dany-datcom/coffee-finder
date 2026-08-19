/**
 * @file coffeeCard.js - Coffee Shop Card Component
 * @description Generates interactable DOM elements for individual coffee shop cards
 * from HTML templates, handling map sync and quick actions (Favorite, Directions, Share).
 * @module components/coffeeCard
 */

import { formatDistance } from "../utils/distance.js";
import { formatTravelTime } from "../utils/travelTime.js";
import { createActionBar } from "./actionBar.js";
import { saveFavorite } from "../storage.js";
import { focusPlace, highlightMarker } from "../map.js";
import {sharePlace} from "../services/shareService.js";
import { getMapMode, getActivePlace } from "../state/appState.js";
import { toggleFavorite, isFavorite } from "../storage.js";

/**
 * Attaches click listener to the favorite button within the card.
 * Saves the place to LocalStorage and toggles visual active state.
 *
 * @param {DocumentFragment} clone - Cloned template DOM fragment.
 * @param {Object} place - Coffee shop place data object.
 */
function setupFavoriteButton(clone, place) {
  const button = clone.querySelector(".favorite-btn");
  if (!button) return;

  if (isFavorite(place.id)) {
    button.classList.add("saved");
  }

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    
    const isSaved = toggleFavorite(place);
    
    button.classList.toggle("saved", isSaved);
  });
}

/**
 * Attaches click listener to the directions button.
 * Opens Google Maps directions in a new browser tab using GPS coordinates.
 *
 * @param {DocumentFragment} clone - Cloned template DOM fragment.
 * @param {Object} place - Coffee shop place data object.
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

    if(lat && lng) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
        "_blank"
      );
    }
  });
}

/**
 * Attaches click listener to the share button.
 * Triggers native Web Share API or falls back to clipboard copy.
 *
 * @param {DocumentFragment} clone - Cloned template DOM fragment.
 * @param {Object} place - Coffee shop place data object.
 */
function setupShareButton(clone, place) {
  const button = clone.querySelector(".share-btn");
  if (!button) return;

  button.addEventListener("click", async (event) => {
    event.stopPropagation();
    await sharePlace(place);
  });
}

/**
 * Creates and returns a populated coffee shop card DOM fragment from an HTML template.
 * Sets up map interactive hooks, action buttons, and distance/travel time formats.
 *
 * @param {HTMLTemplateElement} template - The HTML `<template>` element for place cards.
 * @param {Object} place - Coffee shop data object.
 * @returns {DocumentFragment} Populated DOM node ready to be inserted into the document.
 */
export function createCoffeeCard(template, place) {
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector(".place-card");

  if (!card) {
    console.error("Place card element not found in template");
    return clone;
  }

  // Set dataset attributes for DOM identification
  card.dataset.place = place.name;
  card.dataset.placeId = place.id;

  // Set city and state location label
  const locationText = clone.querySelector(".location-text");
  if (locationText) {
    locationText.textContent = `${place.location?.city || ""}${
      place.location?.city && place.location?.state ? ", " : ""
    }${place.location?.state || ""}`;
  }

  // Handle Focus Mode highlighting vs inactive cards
  if (getMapMode() === "focus") {
    if (getActivePlace()?.id === place.id) {
      card.classList.add("active-card");
    } else {
      card.classList.add("inactive-card");
    }
  }

  // Hover and Click events for Google Maps synchronization
  card.addEventListener("mouseenter", () => {
    highlightMarker(place);
  });

  card.addEventListener("click", () => {
    focusPlace(place);
  });

  // Populate basic information
  const titleEl = clone.querySelector(".place-name");
  if (titleEl) titleEl.textContent = place.name;

  const addressEl = clone.querySelector(".place-address");
  if (addressEl) {
    addressEl.textContent = place.address || "Address not available";
  }

  // Inject action bar HTML template
  const actionBar = clone.querySelector(".action-bar-container");
  if (actionBar) {
    actionBar.innerHTML = createActionBar();
  }

  // Setup interactive event listeners for action buttons
  setupFavoriteButton(clone, place);
  setupDirectionButton(clone, place);
  setupShareButton(clone, place);

  // Populate formatted Distance
  const distance = clone.querySelector(".distance-value");
  if (distance && place.distance) {
    distance.textContent = formatDistance(place.distance);
  }

  // Populate formatted Walking Travel Time
  const walking = clone.querySelector(".travel-time-value");
  if (walking && place.walkingTime) {
    walking.textContent = formatTravelTime(place.walkingTime);
  }

  return clone;
}