const API_KEY = "001ee560e2694bd5a870f6a31c7a5c65";

export async function searchPlaces(query = "San Jose") {
  // 📌 Mejor práctica: agregar ubicación de bias (centro de Costa Rica)
  const biasLon = -84.0907;
  const biasLat = 9.9281;
  
  const url = `https://api.geoapify.com/v2/places?categories=catering.cafe&text=${encodeURIComponent(query)}&bias=proximity:${biasLon},${biasLat}&limit=10&apiKey=${API_KEY}`;
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("🌍 Geoapify:", data);
    
    return data.features.map(place => ({
      name: place.properties.name || "Café sin nombre",
      address: place.properties.formatted || "Dirección no disponible",
      geocodes: {
        main: {
          latitude: place.properties.lat,
          longitude: place.properties.lon
        }
      }
    }));
    
  } catch (error) {
    console.error("❌ Geoapify error:", error);
    return [];
  }
}