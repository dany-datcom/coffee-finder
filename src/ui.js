/**
 * User Interface rendering functions
 * Handles dynamic rendering of coffee shop cards
 * Displays loading states and empty states
 */

import { initializeIcons } from "./icons/icons.js";
import { getUserLocation } from "./state/appState.js";
import { createCoffeeCard } from "./components/CoffeeCard.js";


/**
 * Remove all rendered cards and empty state
 * Keeps the loader element intact
 */
function clearResults(container) {

  const oldCards = container.querySelectorAll(".place-card");
  oldCards.forEach(card => card.remove());

  const emptyState = container.querySelector(".empty-state");

  if (emptyState) {
    emptyState.remove();
  }
}


/**
 * Display empty state when no coffee shops are found
 */
function renderEmptyState(container) {

  container.insertAdjacentHTML(
    "beforeend",
    `
    <div class="empty-state">
      <div class="empty-icon">☕</div>
      <h3>No coffee shops found</h3>
      <p>
        Try another location, move the map,
        or zoom out to discover more places.
      </p>
    </div>
    `
  );
}



/**
 * Render coffee shop cards
 */
export function renderPlaces(places) {


  const container = document.getElementById("results");


  console.log(getUserLocation());


  clearResults(container);



  if (!places || places.length === 0) {

    renderEmptyState(container);

    return;

  }



  const template =
    document.getElementById("place-template");



  places.forEach(place => {

    const card =
      createCoffeeCard(template, place);


    container.appendChild(card);

  });



  console.log(`✅ ${places.length} cards rendered`);



  initializeIcons();

}



/**
 * Update map status
 */
export function updateMapStatus(location, total) {


  const locationText =
    document.querySelector(".map-location");


  const resultsText =
    document.querySelector(".map-results");



  if (locationText) {

    locationText.textContent =
      `${location}`;

  }


  if (resultsText) {

    resultsText.textContent =
      `${total} Coffee shops found`;

  }

}



/**
 * Highlight card from marker click
 */
export function highlightPlace(placeName) {


  document
    .querySelectorAll(".place-card")
    .forEach(card =>
      card.classList.remove("active-card")
    );



  const card =
    document.querySelector(
      `[data-place="${placeName}"]`
    );



  if (!card) return;



  card.classList.add("active-card");


  card.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

}