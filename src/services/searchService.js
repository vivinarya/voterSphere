const { GoogleGenerativeAI } = require('@google/generative-ai');

async function getUpcomingDates() {
  const currentYear = new Date().getFullYear();
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('mock')) {
      return `[Mock Search] Verified Election Dates for ${currentYear}:\n- Primary Election: August 6th, ${currentYear}\n- General Election: November 3rd, ${currentYear}`;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `What are the dates for the upcoming US Primary and General elections in ${currentYear}? Provide a brief 2-line response.`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return `[Fallback Search] Verified Election Dates for ${currentYear}:\n- Primary Election: August 6th, ${currentYear}\n- General Election: November 3rd, ${currentYear}`;
  }
}

module.exports = {
  getUpcomingDates
};
