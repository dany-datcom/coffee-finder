const appState = {
  userLocation: null,
  currentSort: "distance",
  places: []
};

export function setUserLocation(location) {
  appState.userLocation = location;
}

export function getUserLocation() {
  return appState.userLocation;
}

export function getCurrentSort() {
  return appState.currentSort;

}

export function setCurrentSort(sort) {
  appState.currentSort = sort;

}

export function setPlaces(data) {
  appState.places = data;
}

export function getPlaces() {
  return appState.places;
}