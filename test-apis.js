require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

async function testGemini() {
    try {
        console.log('Testing Gemini API...');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent('Say "Gemini is working!"');
        console.log('✅ Gemini Success:', result.response.text().trim());
    } catch (e) {
        console.error('❌ Gemini Error:', e.message);
    }
}

async function testMaps() {
    try {
        console.log('\nTesting Google Maps Geocoding API...');
        const geoResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: { address: '10001', key: process.env.GOOGLE_MAPS_API_KEY }
        });
        
        if (geoResponse.data.status === 'OK') {
            console.log('✅ Maps Success: Found location for 10001');
        } else {
            console.error('❌ Maps Error:', geoResponse.data.error_message || geoResponse.data.status);
        }
    } catch (e) {
        console.error('❌ Maps Error:', e.message);
    }
}

async function runTests() {
    await testGemini();
    await testMaps();
    console.log('\nNote: The Calendar feature does not require an API request to be made from the server (it generates a direct clickable link), so it works automatically!');
}

runTests();
