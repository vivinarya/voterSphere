# VoterSphere 🗳️

VoterSphere is a dynamic, interactive AI assistant designed to demystify the election process, timelines, and procedural steps for users through a conversational interface. Built with an unbiased, encouraging, and authoritative persona, it adapts its guidance to specific voter contexts (e.g., first-time, absentee, student).

## The "Election Information" Vertical

The primary goal of VoterSphere is to address the gap in accessible, easy-to-understand civic education. Elections can be confusing, with differing rules by state and voter status. This vertical focuses on providing clear, verified, and personalized information regarding:
1. **Registration deadlines and rules**
2. **Timeline visualizations** for primary and general elections
3. **Step-by-step breakdowns** of the counting and auditing process

## Logic & Architecture

VoterSphere is built as a lightweight Express web application. 
- **Modular Design:** 
  - `/src`: Contains core logic (`index.js` web server, `chatbot.js` state tree) and integrations (`/services`).
  - `/public`: Contains the interactive HTML/CSS/JS web frontend.
  - `/tests`: Validation logic to ensure state transitions work perfectly.
- **Decision-Making:** The backend maintains an in-memory session mapping of users to their specific `Chatbot` instance, remembering their `state` and `userContext` (first-time, absentee, student).

## Google Services Integration (Mocked)

The platform is designed to plug directly into Google APIs:
- **Google Calendar API:** Enables users to instantly add election deadlines to their personal calendar.
- **Google Maps API:** Finds the nearest polling station or ballot drop-off box based on ZIP code.
- **Gemini / Google Search API:** Fetches real-time, verified election data to ensure maximum accuracy without hardcoding moving dates.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd VoterSphere
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   # Add your Google API keys to the .env file if using real integrations.
   ```

4. **Run Locally:**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:8080` in your browser.

## Cloud Run Deployment

Since the application requires a deployment link, it is containerized via Docker and ready for Google Cloud Run:

1. **Build and Submit to Google Cloud Build:**
   ```bash
   gcloud builds submit --tag gcr.io/[PROJECT-ID]/votersphere
   ```

2. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy votersphere --image gcr.io/[PROJECT-ID]/votersphere --platform managed --region us-central1 --allow-unauthenticated
   ```

## Compliance & Security

- **Accessibility:** Uses standard HTML form elements compatible with screen readers.
- **Security:** API keys are never hardcoded. Environment variables are used, supported by `.env.example` for public repository compliance.
- **Size constraint:** By using minimal dependencies (only `express`), the entire codebase is extremely lightweight (< 5MB), satisfying the < 10MB GitHub repository constraint perfectly.
