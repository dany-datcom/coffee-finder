/**
 * @file share.js - Web Share API & Clipboard Utilities.
 * @description Handles sharing coffee shop details natively on mobile devices
 * with a automatic fallback to clipboard copy on desktop platforms.
 * @module utils/share
 */

/**
 * Builds a formatted text string containing place details and a Google Maps route URL.
 * @param {Object} place - The place object to extract details from.
 * @returns {string} Formatted multiline message ready for sharing.
 */

function buildShareMessage(place) {
  const lat = place?.geocodes?.main?.latitude ?? 0;
  const lng = place?.geocodes?.main?.longitude ?? 0;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const name = place?.name ?? "Coffee Shop";
  
  return `☕ Check out this coffee shop!\n\n${name}\n📍\n\n🗺️ Get directions:\n${mapsUrl}`.trim();
}

/**
 * Shares a place natively using the Web Share API or copies text to clipboard as a fallback.
 * @param {Object} place - The place data object to share.
 * @returns {Promise<{success: boolean, copied: boolean, cancelled?: boolean}>} Result status object.
 */
export async function sharePlace(place) {
  try {
    const message = buildShareMessage(place);

    if (navigator.share) {
      await navigator.share({
        title: place?.name ?? "Coffee Shop",
        text: message
      });
      return { success: true, copied: false };
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(message);
      return { success: true, copied: true };
    }

    throw new Error("Neither Web Share API nor Clipboard API is supported in this browser.");

  } catch (error) {
    if (error.name === "AbortError") {
      return { success: false, cancelled: true };
    }

    console.error("Failed to share place:", error);
    throw error;
  }
}