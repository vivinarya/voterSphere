# VoterSphere 🗳️

VoterSphere is a full-stack AI assistant that helps Indian citizens navigate the election process. It provides real-time, conversational guidance on voter registration, polling booth locations, election timelines, and procedural steps — all powered by Google's Gemini AI.

## Features

- **AI Chat (Gemini 2.5 Flash):** Natural language Q&A tuned exclusively for Indian elections (Lok Sabha, Vidhan Sabha, ECI, NVSP, EVMs, VVPAT).
- **Polling Booth Finder (Google Maps API):** Geocodes a 6-digit Indian PIN code and finds the nearest school/government building likely used as a booth via the Places API.
- **Calendar Reminders (Google Calendar):** Generates a one-click Google Calendar link for election dates.
- **Multilingual Support:** Chat in 11 Indian regional languages — Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, and English.
- **Election Timeline:** Visual, animated timeline of the standard phases of an Indian general election.
- **Voter's Journey Steps:** Step-by-step guide from eligibility check to VVPAT verification.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js, Express 5, Helmet, express-rate-limit |
| **AI** | Google Gemini 2.5 Flash (`@google/generative-ai`) with Function Calling |
| **APIs** | Google Maps Geocoding API, Google Maps Places API, Google Calendar |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion |
| **Deployment** | Docker → Google Cloud Run |

## Project Structure

```
VoterSphere/
├── src/                    # Backend
│   ├── index.js            # Express server (rate-limited, Helmet-secured)
│   ├── chatbot.js          # Gemini chat with Function Calling
│   └── services/
│       ├── mapsService.js  # Google Maps Geocoding + Places
│       ├── calendarService.js  # Google Calendar link generation
│       └── searchService.js    # Gemini-powered election date lookup
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.tsx         # Main app with Chat, Timeline, Steps tabs
│   │   ├── components/
│   │   │   ├── Timeline.tsx
│   │   │   └── Steps.tsx
│   │   └── index.css       # Tailwind CSS v4 theme
│   └── index.html
├── Dockerfile              # Multi-stage Docker build
├── .env.example            # Environment variable template
└── package.json
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vivinarya/voterSphere.git
   cd voterSphere
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Add your real API keys to `.env`:
   - `GEMINI_API_KEY` — from [Google AI Studio](https://aistudio.google.com/)
   - `GOOGLE_MAPS_API_KEY` — from [Google Cloud Console](https://console.cloud.google.com/) (enable Geocoding + Places APIs)
   - `GOOGLE_CALENDAR_API_KEY` — (optional, calendar links work without a key)

4. **Build the frontend and start:**
   ```bash
   cd client && npm run build && cd ..
   npm start
   ```
   Navigate to `http://localhost:8080`.

## Cloud Run Deployment

The app is containerized and ready for Google Cloud Run:

1. Go to **Google Cloud Console → Cloud Run → Create Service**.
2. Select **Continuously deploy from a source repository** and connect `vivinarya/voterSphere` (main branch).
3. Set **Build type** to **Dockerfile**.
4. Under **Variables & Secrets**, add `GEMINI_API_KEY` and `GOOGLE_MAPS_API_KEY`.
5. Click **Deploy**.

## Security

- **Rate Limiting:** API endpoint is limited to 20 requests/minute per IP via `express-rate-limit`.
- **Input Validation:** Messages are capped at 1000 characters; required fields are validated server-side.
- **HTTP Security Headers:** `helmet` adds CSP, X-Frame-Options, HSTS, and more.
- **No hardcoded secrets:** All API keys are loaded from environment variables. `.env` is in `.gitignore`.
- **Session Cleanup:** In-memory sessions expire after 30 minutes of inactivity.

## Accessibility

- All interactive elements have `aria-label` attributes for screen reader support.
- Semantic HTML structure with a single `<h1>` per view.
- Keyboard-navigable: Enter to send, tab to navigate.
- Multilingual interface for diverse Indian language speakers.

## Google Services Integration

| Service | Usage | Real/Mock |
|---------|-------|-----------|
| **Gemini 2.5 Flash** | Conversational AI with function calling | ✅ Real |
| **Google Maps Geocoding API** | Convert PIN code → lat/lng coordinates | ✅ Real |
| **Google Maps Places API** | Find nearby polling-station-like venues | ✅ Real |
| **Google Calendar** | Generate one-click calendar event links | ✅ Real |
