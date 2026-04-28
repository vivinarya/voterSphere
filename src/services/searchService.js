const { GoogleGenerativeAI } = require('@google/generative-ai');

async function getUpcomingDates() {
  const currentYear = new Date().getFullYear();
  
  if (!process.env.GEMINI_API_KEY) {
      return `Error: GEMINI_API_KEY is not configured.`;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `What are the dates for the upcoming Indian state assembly or general elections in ${currentYear}? Provide a brief 2-line response covering only India.`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return `An error occurred while fetching the election timeline: ${error.message}`;
  }
}

module.exports = {
  getUpcomingDates
};
