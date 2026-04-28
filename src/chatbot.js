const { GoogleGenerativeAI } = require('@google/generative-ai');
const calendarService = require('./services/calendarService');
const mapsService = require('./services/mapsService');

class Chatbot {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Tools declaration for Gemini Function Calling
    const tools = [{
      functionDeclarations: [
        {
          name: "findNearestPollingStation",
          description: "Use this to find the nearest likely polling station (school, college, government building) when the user provides a postal code/ZIP code/PIN code.",
          parameters: {
            type: "OBJECT",
            properties: {
              zipCode: {
                type: "STRING",
                description: "The 5 or 6 digit postal code."
              }
            },
            required: ["zipCode"]
          }
        },
        {
          name: "getCalendarLink",
          description: "Generate a Google Calendar link for a specific election event so the user can save it.",
          parameters: {
            type: "OBJECT",
            properties: {
              eventName: {
                type: "STRING",
                description: "The name of the election event, e.g. 'General Election'."
              }
            },
            required: ["eventName"]
          }
        }
      ]
    }];

    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are VoterSphere, an unbiased, authoritative civic guide specifically tuned for Indian elections. You must ONLY answer questions related to the Indian election process (e.g. Lok Sabha, Vidhan Sabha, ECI guidelines, voter ID registration in India, Form 6, NVSP, EVMs, VVPAT). If asked about elections outside of India or non-election topics, politely decline and steer the conversation back to Indian elections. Always provide real, accurate, and up-to-date data. NEVER use mock data or fake examples. Always talk naturally. If a user asks for a polling station or provides an Indian PIN code (6 digits), use the findNearestPollingStation tool. If they ask to save a date or calendar, use the getCalendarLink tool. Format your text nicely using Markdown.",
      tools: tools
    });

    this.chatSession = this.model.startChat({
        history: [],
    });
  }

  async handleInput(input) {
    if (!process.env.GEMINI_API_KEY) {
        return "Error: GEMINI_API_KEY is not configured.";
    }

    try {
        const result = await this.chatSession.sendMessage(input);
        
        // Check if Gemini decided to call a function
        const functionCalls = result.response.functionCalls && result.response.functionCalls();
        if (functionCalls && functionCalls.length > 0) {
            const call = functionCalls[0];
            
            if (call.name === 'findNearestPollingStation') {
                const apiResponse = await mapsService.findNearestPollingStation(call.args.zipCode);
                
                // Send the tool's response back to Gemini so it can generate a final reply
                const secondResult = await this.chatSession.sendMessage([{
                    functionResponse: {
                        name: 'findNearestPollingStation',
                        response: { result: apiResponse }
                    }
                }]);
                return secondResult.response.text();
            } 
            else if (call.name === 'getCalendarLink') {
                const link = calendarService.addToCalendar(call.args.eventName);
                
                const secondResult = await this.chatSession.sendMessage([{
                    functionResponse: {
                        name: 'getCalendarLink',
                        response: { result: link }
                    }
                }]);
                return secondResult.response.text();
            }
        }
        
        // Normal text response
        return result.response.text();
        
    } catch (e) {
        console.error("Gemini Chat Error:", e.message);
        if (e.message.includes('429')) {
            return "I am receiving too many requests right now. Please wait about 30 seconds and try again.";
        }
        return "I'm sorry, I'm having trouble connecting to my AI brain right now. Please try again later.";
    }
  }
}

module.exports = Chatbot;
