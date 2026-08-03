const cache = new Map();

export function createSearchKey(map) {
    const center = map.getCenter();

    const lat = center.lat.toFixed(3);
    const lng = center.lng.toFixed(3);
    const zoom = map.getZoom();

    return `${lat},${lng},${zoom}`;
}

export function hasCachedSearch(key) {
  return cache.has(key);
}

export function getCachedSearch(key) {
  return cache.get(key);
}

export function saveSearch(key, places) {
  cache.set(key, places);
}

export function clearSearchCache() {
  cache.clear();
}