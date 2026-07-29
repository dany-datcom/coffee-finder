function buildShareMessage(place) {
  const lat = place.geocodes.main.latitude;
  const lng = place.geocodes.main.longitude;

  const mapsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return `
☕ Check out this coffee shop!

${place.name}

📍 ${place.address}
🚶 ${place.walkingTime}

🗺️ Get directions:
${mapsUrl}
`;
}


export async function sharePlace(place) {
  try {  
    const message = buildShareMessage(place);

    if (navigator.share) {
      await navigator.share({
        title: place.name,
        text: message
      });

      return;
    }

    } catch (error) {
      console.error("Shared failed:", error);
      throw error;
    }
}