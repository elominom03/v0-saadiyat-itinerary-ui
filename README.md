# Saadiyat Layover Itinerary Planner

A smart, AI-powered itinerary planner for international transit passengers visiting Saadiyat Island, Abu Dhabi during 1-3 day layovers.

## 🌟 Features

### Core Features
- **AI-Powered Itineraries**: Uses Google Gemini AI to generate personalized travel plans
- **Crowd-Aware Distribution**: Intelligent crowd management algorithm to distribute visitors evenly
- **Real-Time Optimization**: Considers time constraints, interests, pace preferences, and city conditions
- **Google My Maps Export**: Download your itinerary as a KML file with routes, opening hours, and costs
- **Mobile-First Design**: Responsive UI optimized for jet-lagged travelers
- **Rate-Limited APIs**: Built-in rate limiting for production reliability

### New Features 🆕
- **Family Trip Support**: Tailor itineraries based on family composition and children's ages
- **Google Star Ratings**: Display ratings and reviews for attractions
- **Recommendations Input**: Upload screenshots or paste text suggestions from friends
- **Bilingual Support**: Full English and Arabic translations with RTL layout

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS + shadcn/ui

**Backend:**
- Next.js API Routes
- Prisma ORM (SQLite)
- Google Gemini AI
- Zod validation

**Deployment:**
- Vercel (recommended)
- Stateless API design

## 📁 Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── attractions/          # GET /api/attractions
│   │   └── itinerary/
│   │       ├── generate/          # POST /api/itinerary/generate
│   │       └── regenerate/        # POST /api/itinerary/regenerate
│   ├── layout.tsx
│   └── page.tsx
├── components/                    # React UI components
├── lib/
│   ├── api-client.ts             # Frontend API client
│   ├── crowd-management.ts       # Crowd distribution logic
│   ├── gemini-ai.ts              # AI integration
│   ├── itinerary-context.tsx    # React context
│   ├── prisma.ts                 # Prisma client
│   └── rate-limit.ts             # Rate limiting
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data (12 attractions)
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.19+ (required)
- pnpm (recommended) or npm
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd v0-saadiyat-itinerary-ui
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY="your-actual-api-key"
```

Get your API key from: https://makersuite.google.com/app/apikey

4. **Initialize database**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with attractions
pnpm db:seed
```

5. **Run development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

### UserSession
Stores user preferences and layover details.

- `id` - Unique session identifier
- `arrivalTime` - Arrival datetime
- `departureTime` - Departure datetime
- `hotelLocation` - Hotel/resort location
- `pace` - relaxed | balanced | maximize
- `interests` - JSON array of interest tags
- `preferences` - JSON object (dietary, walking, etc.)

### Attraction
Saadiyat Island points of interest.

- `id` - Unique attraction ID
- `name` - Attraction name
- `category` - museum | cafe | beach | etc.
- `themes` - JSON array of themes
- `indoorOutdoor` - indoor | outdoor | mixed
- `locationCluster` - Geographic zone
- `avgDuration` - Average visit time (minutes)
- `crowdLevel` - low | medium | high
- `heatSensitivity` - low | high
- `description`, `tips`, `lat`, `lng` - Additional metadata

### Itinerary
Generated itinerary entries.

- `id` - Unique entry ID
- `sessionId` - Links to UserSession
- `dayNumber` - Day in itinerary (1, 2, 3...)
- `timeBlock` - morning | afternoon | evening
- `attractionId` - Links to Attraction
- `reasoningText` - AI explanation
- `timeRange` - e.g., "10:00 - 12:30"

## 🤖 AI Integration

### Gemini Prompt Strategy

The system sends a structured prompt to Gemini AI containing:

1. **User Profile**: arrival/departure times, pace, interests, preferences
2. **City State**: current temperature, crowd levels, time of day
3. **Attractions**: All available attractions with crowd-aware scores
4. **Constraints**: Time blocks, location efficiency, heat management

### Prompt Engineering

The prompt explicitly:
- Instructs Gemini to prefer higher-scored attractions (already crowd-optimized)
- Asks for location clustering to minimize travel
- Requests indoor/outdoor balance based on heat
- Demands strict JSON output format
- Provides fallback to heuristic algorithm if AI fails

### Response Validation

All Gemini responses are:
- Parsed and validated as JSON
- Checked against attraction IDs
- Sanitized (remove markdown code blocks)
- Fallback to deterministic algorithm on failure

## 🎯 Crowd Management Logic

### Algorithm Overview

**Goal**: Distribute visitors evenly across attractions to prevent overcrowding.

**How it works**:

1. **Base Scoring**
   - Match user interests with attraction themes
   - Apply pace modifiers (relaxed prefers low-crowd)
   - Score: 0.0 to 1.0

2. **Crowd Penalty Calculation**
   ```
   Base Penalty (by crowd level):
     - low: 0
     - medium: 0.15
     - high: 0.3
   
   Dynamic Penalty:
     + 0.1 for every 5 recent assignments (last 24h)
   
   Total Penalty: min(base + dynamic, 0.7)
   ```

3. **Final Score**
   ```
   finalScore = max(baseScore - crowdPenalty, 0)
   ```

4. **Ranking**
   - Attractions sorted by final score (descending)
   - AI receives pre-ranked list
   - Encourages selection of less-crowded alternatives

### Alternative Suggestions

The system can suggest similar attractions with lower crowd levels:
- Finds attractions with overlapping themes
- Filters to equal or lower crowd levels
- Returns top 3 alternatives

## 📡 API Endpoints

### POST `/api/itinerary/generate`

Generate a new itinerary.

**Request Body:**
```json
{
  "arrivalTime": "2024-03-14T08:00:00.000Z",
  "departureTime": "2024-03-16T22:00:00.000Z",
  "hotelLocation": "Saadiyat Beach",
  "pace": "balanced",
  "interests": ["art", "architecture", "food"],
  "preferences": {
    "dietary": ["vegetarian"],
    "lowWalking": false,
    "mustSee": ["Louvre Abu Dhabi"]
  }
}
```

**Response:**
```json
{
  "sessionId": "clxxx...",
  "itinerary": [
    {
      "day": 1,
      "date": "Friday, March 14",
      "morning": {
        "attractionId": "louvre-abu-dhabi",
        "attractionName": "Louvre Abu Dhabi",
        "timeRange": "9:00 - 12:00",
        "duration": "2h 30m",
        "whyChosen": "...",
        "tips": ["...", "..."]
      },
      "afternoon": { /* ... */ },
      "evening": { /* ... */ }
    }
  ],
  "excludedPlaces": ["Attraction Name: Reason"],
  "optimizations": ["Location clustering applied", "..."],
  "crowdStrategy": "Distributed visitors across 3 art venues",
  "attractionsUsed": 12
}
```

**Rate Limit:** 5 requests / minute

---

### GET `/api/attractions`

Get all attractions with optional filters.

**Query Parameters:**
- `category` - Filter by category (optional)
- `crowdLevel` - Filter by crowd level (optional)
- `indoorOutdoor` - Filter by indoor/outdoor (optional)

**Response:**
```json
{
  "attractions": [
    {
      "id": "louvre-abu-dhabi",
      "name": "Louvre Abu Dhabi",
      "category": "museum",
      "themes": ["art", "architecture", "universal museum"],
      "crowdLevel": "high",
      "avgDuration": 150,
      "description": "...",
      "lat": 24.5338,
      "lng": 54.3983
    }
  ],
  "total": 12
}
```

**Rate Limit:** 30 requests / minute

---

### POST `/api/itinerary/regenerate`

Regenerate itinerary with updated preferences.

**Request Body:**
```json
{
  "sessionId": "clxxx...",
  "pace": "relaxed",
  "interests": ["art", "beach"]
}
```

**Response:** Same as `/generate`

**Rate Limit:** 5 requests / minute

---

### GET `/api/itinerary/export-kml`

Export itinerary as KML file for Google My Maps import.

**Query Parameters:**
- `sessionId` - Session ID (required)

**Response:** KML file download

**Example:**
```
GET /api/itinerary/export-kml?sessionId=clxxx...
```

**Features:**
- Organized layers by day
- Routes between attractions
- Opening hours and ticket prices
- Contact information (website, phone)
- Color-coded pins by category
- AI reasoning for each stop

Users can import the downloaded KML file directly into **Google My Maps** for offline access and GPS navigation.

📖 **See [GOOGLE_MAPS_EXPORT.md](./GOOGLE_MAPS_EXPORT.md) for complete documentation**

---

## 🛡️ Security & Safety

### Input Validation

All API inputs validated with Zod schemas:
- Required fields enforced
- Type checking
- Date validation
- Array length limits

### Rate Limiting

Simple in-memory rate limiter:
- Per-IP tracking
- Configurable windows and limits
- Automatic cleanup
- Response headers with retry info

**Production Note**: For production, replace with Redis-based rate limiting (Upstash, Vercel KV, etc.)

### Error Handling

- Graceful AI failures (heuristic fallback)
- Detailed error messages in development
- Generic errors in production
- Proper HTTP status codes

### Environment Variables

Sensitive data via environment variables:
- `GEMINI_API_KEY` - Never committed to repo
- `.env.example` provided for setup

## 📦 Deployment (Vercel)

### Prerequisites

1. Vercel account
2. Push code to GitHub/GitLab
3. Gemini API key

### Steps

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your git repository

2. **Configure Environment Variables**
   - Add `GEMINI_API_KEY` in Vercel dashboard
   - Add `DATABASE_URL` (use Vercel Postgres or keep SQLite)

3. **Build Settings**
   ```
   Framework: Next.js
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   ```

4. **Post-Deploy Setup**
   ```bash
   # Run migrations on deployed database
   vercel env pull .env.local
   npx prisma migrate deploy
   npx prisma generate
   pnpm db:seed
   ```

5. **Production Considerations**
   - **Database**: Migrate to Vercel Postgres or Neon for production
   - **Rate Limiting**: Use Redis (Upstash) instead of in-memory
   - **Monitoring**: Set up error tracking (Sentry, LogRocket)
   - **Analytics**: Add usage analytics
   - **Caching**: Enable Vercel Edge caching for `/api/attractions`

### Database Migration (SQLite → Postgres)

For production, switch to Postgres:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
}
```

2. Update adapter in `lib/prisma.ts`:
```typescript
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
})

const adapter = new PrismaPg(pool)
```

3. Run migration:
```bash
npx prisma migrate dev
```

## 🧪 Testing

### Manual Testing

1. **Generate Itinerary**
   - Fill out setup flow
   - Verify loading screen
   - Check generated itinerary

2. **Test Crowd Distribution**
   - Generate multiple itineraries with same interests
   - Verify different attractions selected
   - Check crowd strategy explanation

3. **Test Rate Limiting**
   - Make 6+ requests in quick succession
   - Verify 429 response

### Automated Testing (Future)

Recommended test coverage:
- API route unit tests (Jest)
- Crowd management algorithm tests
- Gemini prompt validation
- E2E tests (Playwright)

## 🐛 Troubleshooting

### "Gemini API key not set"
- Add `GEMINI_API_KEY` to `.env`
- Restart dev server

### "Table does not exist"
- Run `npx prisma migrate dev`
- Run `pnpm db:seed`

### "better-sqlite3 build failed"
- Run `npm rebuild better-sqlite3`
- Or use Node 20.19 (LTS)

### Vercel deployment fails
- Check build logs
- Verify environment variables
- Run `npx prisma generate` in build step

## 📝 License

MIT

## 👥 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Test thoroughly
4. Submit a pull request

## 🙏 Acknowledgments

- Saadiyat Island attractions data
- Google Gemini AI
- Next.js and Vercel teams
- shadcn/ui component library
