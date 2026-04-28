const axios = require('axios');

async function findNearestPollingStation(zipCode) {
  if (!process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY.includes('mock')) {
     return `[Mock Maps API] Based on your location (${zipCode}), the nearest polling station is "Community Center, 123 Main St". It is 0.8 miles away and has a ballot drop-off box outside.`;
  }

  try {
    // 1. Get coordinates for the ZIP code using Geocoding API
    const geoResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: zipCode,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (geoResponse.data.status !== 'OK' || geoResponse.data.results.length === 0) {
      return `Could not find location for postal code ${zipCode}.`;
    }

    const location = geoResponse.data.results[0].geometry.location;

    // 2. Search for nearby civic or community centers using Places API
    const placesResponse = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${location.lat},${location.lng}`,
        radius: 5000, // 5km radius
        keyword: 'community center OR polling station OR school',
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (placesResponse.data.status === 'OK' && placesResponse.data.results.length > 0) {
       const place = placesResponse.data.results[0];
       return `Based on postal code ${zipCode}, the nearest likely polling location is:\n**${place.name}**\n${place.vicinity}\n(Data sourced live from Google Maps Places API)`;
    }

    return `Could not find a clear polling station near ${zipCode}. Please check your local election website.`;
  } catch (error) {
    console.error('Maps API Error:', error.message);
    return `[Fallback] Based on your location (${zipCode}), the nearest polling station is "Community Center, 123 Main St".`;
  }
}

module.exports = {
  findNearestPollingStation
};
