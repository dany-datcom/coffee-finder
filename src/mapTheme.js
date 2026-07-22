/**
 * Google Maps custom theme
 * Code & Coffee visual identity
 */

export const mapTheme = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { color: "#F5F3EF" }
    ]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      { color: "#6B7280" }
    ]
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      { color: "#F8E7C9" }
    ]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      { color: "#D7ECE5" }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      { color: "#CFE8DD" }
    ]
  },
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [
      { color: "#064E3B" }
    ]
  }
];