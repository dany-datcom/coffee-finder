function buildShareContent(place) {
    const lat = place.geocodes.main.latitude;
    const lng = place.geocodes.main.longitude;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    return `☕ Check out this coffee shop!
    ${place.name}

📍 ${place.address}
🚶 ${place.walkingTime}

🗺️ Get directions:
${mapsUrl}
`;
}


export async function sharePlace(place) {
  const message = buildShareMessage(place);

  if (navigator.share) {
    await navigator.share({
      title: place.name,
      text: message
    });

    return;
  }

  alert("Share is not supported yet.");
}