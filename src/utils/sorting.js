/**
 * Sort coffee shops by distance.
 * Returns a new sorted array without modifying the original.
 *
 * @param {Array} places
 * @returns {Array}
 */

export function sortByDistance(places) {
    return [...places].sort((a, b) => { 
        return a.distance - b.distance; 
    });
}

/**
 * Sort coffee shops by farthest distance.
 *
 * @param {Array} places
 * @returns {Array}
 */

export function sortByFarthest(places) {
    return [...places].sort((a, b) => { 
        return b.distance - a.distance; 
    });
}

/**
 * Sort coffee shops alphabetically.
 *
 * @param {Array} places
 * @returns {Array}
 */

export function sortByName(places) {
    return [...places].sort((a, b) => { 
        return a.name.localeCompare(b.name); 
    }); 
}

export function sortPlaces(places, sortType ) {
    switch (sortType) {
        case "distance":
            return sortByDistance(places);
        case "farthest":
            return sortByFarthest(places);
        case "name":
            return sortByName(places);
        default:
            throw new Error(
                `Unknown sort type: ${sortType}`
            );
    }
}
