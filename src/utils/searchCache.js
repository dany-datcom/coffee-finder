const cache = new Map();

export function createSearchKey(map) {
    const center = map.getCenter();

    const lat = center.lat.toFixed(2);
    const lng = center.lng.toFixed(2);
    const zoom = map.getZoom();

    return `${lat},${lng},${zoom}`;
}
export function saveSearch(key, places) {
  cache.set(key, places);
}

export function getCachedSearch(key) {
  return cache.get(key);
}



export function clearSearchCache() {
  cache.clear();
}