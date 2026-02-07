# Quick Start Guide

## ✅ Backend Setup Checklist

### 1. Add Gemini API Key (Required)

```bash
# Open .env file
nano .env

# Replace the placeholder with your actual API key
GEMINI_API_KEY="your-actual-gemini-api-key-here"
```

**Get your API key:** https://makersuite.google.com/app/apikey

---

### 2. Verify Database (Already Done)

The database is already set up! Verify it's working:

```bash
# Check that dev.db exists
ls -la dev.db

# View attractions in database (optional)
pnpm db:studio
```

---

### 3. Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000

---

### 4. Test the Flow

1. Fill out the setup form:
   - Arrival/departure dates
   - Pace (relaxed/balanced/maximize)
   - Interests (art, architecture, food, etc.)

2. Click "Generate Itinerary"

3. Wait for AI to generate (loading screen)

4. View your personalized itinerary!

---

## 🚀 Deploy to Vercel

### Option A: Quick Deploy (Recommended)

1. Push to GitHub:
```bash
git add .
git commit -m "Add backend and AI integration"
git push origin main
```

2. Go to https://vercel.com/new

3. Import your repository

4. Add environment variable in Vercel dashboard:
   - `GEMINI_API_KEY` = your-actual-key

5. Deploy!

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

---

## 📚 Documentation

- **README.md** - Full documentation and architecture
- **DEPLOYMENT.md** - Detailed deployment guide
- **BACKEND_SUMMARY.md** - What was built

---

## 🐛 Troubleshooting

### "Gemini API key not set"
→ Add `GEMINI_API_KEY` to `.env` and restart server

### Database errors
→ Run `pnpm setup` to reset database

### Build fails
→ Check Node.js version (needs 20.19+)

---

## 🎯 Key Features

✅ **AI-Powered Itineraries** - Gemini AI generates personalized plans
✅ **Crowd Management** - Smart distribution across attractions  
✅ **12 Attractions** - Real Saadiyat Island locations
✅ **3 API Endpoints** - Generate, regenerate, list attractions
✅ **Rate Limiting** - Production-ready security
✅ **Vercel-Ready** - One-click deployment

---

## 📞 Need Help?

- Check **README.md** for detailed docs
- Review **DEPLOYMENT.md** for Vercel setup
- See **BACKEND_SUMMARY.md** for architecture

---

**You're all set!** 🎉

Just add your Gemini API key and start building itineraries.
