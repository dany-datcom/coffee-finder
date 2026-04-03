let map;
let markers = [];

// 🚀 Crear mapa
export function createMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 9.9281, lng: -84.0907 }, // San José por defecto
    zoom: 13
  });
}

// 📍 Agregar markers
export function addMarkers(places) {
  // 🧹 Limpiar markers anteriores
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  places.forEach(place => {
    const lat = place.geocodes?.main?.latitude;
    const lng = place.geocodes?.main?.longitude;

    if (lat == null || lng == null) return;

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      title: place.name
    });

    markers.push(marker);
  });

  // 🎯 Centrar mapa automáticamente (nivel PRO)
  if (places.length > 0) {
    const bounds = new google.maps.LatLngBounds();

    places.forEach(place => {
      const lat = place.geocodes?.main?.latitude;
      const lng = place.geocodes?.main?.longitude;

      if (lat && lng) {
        bounds.extend({ lat, lng });
      }
    });

    map.fitBounds(bounds);
  }
}