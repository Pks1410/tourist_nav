export const fetchAttractions = async (lat, lon) => {
  const query = `
    [out:json][timeout:25];
    (
      node["tourism"~"attraction|museum|gallery|viewpoint"](around:5000, ${lat}, ${lon});
      way["tourism"~"attraction|museum|gallery|viewpoint"](around:5000, ${lat}, ${lon});
      relation["tourism"~"attraction|museum|gallery|viewpoint"](around:5000, ${lat}, ${lon});
    );
    out center tags;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);

    // Handle HTTP errors
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Map the response data into usable attraction objects
    return data.elements.map((el) => ({
      id: el.id,
      name: el.tags.name || "Unnamed Attraction",
      lat: el.lat || el.center?.lat,
      lon: el.lon || el.center?.lon,
      description: el.tags.description || "No description available",
      website: el.tags.website || null,
      image: el.tags.image || null,
    }));
  } catch (error) {
    console.error("Error fetching tourist attractions:", error);
    return [];
  }
};

  
  // Haversine formula to calculate distance between two coordinates in km
  export const calculateDistance = (userLocation, attraction) => {
    const [userLat, userLon] = userLocation;
    const { lat: attractionLat, lon: attractionLon } = attraction;
  
    const R = 6371; // Earth's radius in km
    const dLat = (attractionLat - userLat) * (Math.PI / 180);
    const dLon = (attractionLon - userLon) * (Math.PI / 180);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLat * (Math.PI / 180)) *
        Math.cos(attractionLat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2); // Return distance rounded to 2 decimal places
  };
  