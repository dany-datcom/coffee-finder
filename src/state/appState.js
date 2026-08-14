const appState = {
  userLocation: null,
  currentSort: "distance",
  places: [],
  mapMode: "explore",
  activePlace: null,
  loading: false
};

export function setLoadingState(value) {
  appState.loading = value;}
  export function isLoading() {
  return appState.loading;
}

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

export function setMapMode(mode) {
  appState.mapMode = mode;
}

export function setActivePlace(places) {
  appState.activePlace = places;
}

export function getMapMode() {
  return appState.mapMode;
}

export function getActivePlace() {
  return appState.activePlace;
}

export function getVisiblePlaces() {
  return appState.place;
}