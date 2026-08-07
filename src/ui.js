/**
 * User Interface rendering functions
 * Handles dynamic rendering of coffee shop cards
 * Displays loading states and empty states
 */

import { createSkeletonCards } from "./components/skeletonCards.js";
import { initializeIcons } from "./icons/icons.js";
import { createCoffeeCard } from "./components/CoffeeCard.js";



/**
 * Remove rendered cards and empty state
 * Keeps loader element intact
 */
function clearResults(container) {


  if (!container) {

    console.warn(
      "⚠️ Results container not found"
    );

    return;

  }



  container
    .querySelectorAll(".place-card")
    .forEach(card => {

      card.remove();

    });



  const emptyState =
    container.querySelector(
      ".empty-state"
    );



  if(emptyState){

    emptyState.remove();

  }


}




/**
 * Display empty results message
 */
function renderEmptyState(container){


  container.insertAdjacentHTML(
    "beforeend",

    `
      <div class="empty-state">

        <div class="empty-icon">
          ☕
        </div>


        <h3>
          No coffee shops found
        </h3>


        <p>
          Try another location, move the map,
          or zoom out to discover more places.
        </p>

      </div>
    `
  );


}
  export function renderSkeletonCards(count = 3) {
    const container = document.getElementById("results");

    if (!container) {
      return;
    }

    clearResults(container);

    container.insertAdjacentHTML(
      "beforeend",
      createSkeletonCards(count)
    );
  }



/**
 * Render coffee shop cards
 */
export function renderPlaces(places){
  const container = document.getElementById("results");

  if(!container){
    console.error("❌ Results container missing");
    return;
  }

  clearResults(container);

  if(!places || places.length === 0){
      renderEmptyState(container);
    return;
  }

  const template = document.getElementById("place-template");

  if(!template){
    console.error("❌ Card template missing");
    return;
  }

  const fragment = document.createDocumentFragment();

  places.forEach(place => {
    const card = createCoffeeCard(template, place);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);

  initializeIcons();

}




/**
 * Update map information panel
 */
export function updateMapStatus(
  location,
  total
){


  const locationText =
    document.querySelector(
      ".map-location"
    );


  const resultsText =
    document.querySelector(
      ".map-results"
    );



  if(locationText){


    if(location){

      locationText.textContent =
        `${location.city ?? ""}
        ${location.state ?? ""}`;

    }
    else{

      locationText.textContent =
        "Unknown location";

    }

  }




  if(resultsText){


    resultsText.textContent =
      `${total} Coffee shop${total !== 1 ? "s" : ""} found`;


  }


}
