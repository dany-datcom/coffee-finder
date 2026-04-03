export function saveFavorite(place) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push(place);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}