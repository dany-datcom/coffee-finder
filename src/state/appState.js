const appState = {

  userLocation: null

};

export function setUserLocation(location) {
  appState.userLocation = location;
}

export function getUserLocation() {
  return appState.userLocation;
}