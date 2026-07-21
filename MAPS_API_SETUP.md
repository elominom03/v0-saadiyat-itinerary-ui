# 🗺️ Google Maps API Setup

## ⚠️ Important: Gemini Key ≠ Maps Key

Your **Gemini API key WILL NOT work for Google Maps**!

They are different services that need different API keys.

---

## 🚀 Quick Setup (2 Minutes)

### Step 1: Get a Google Maps API Key

1. **Go to Google Cloud Console:**
   👉 https://console.cloud.google.com/google/maps-apis/credentials

2. **Click "Create Credentials" → "API Key"**
   - It will generate a key instantly
   - Copy it (starts with `AIza...`)

3. **Enable Required APIs:**
   - Go to: https://console.cloud.google.com/apis/library
   - Search and enable:
     - **Maps JavaScript API** ✅
     - **Directions API** ✅

### Step 2: Add to Your .env

```bash
# In your .env file:
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIza...your_new_maps_key_here"
```

**⚠️ IMPORTANT:** Must have `NEXT_PUBLIC_` prefix!

### Step 3: Restart Dev Server

```bash
# Stop server (Ctrl+C)
pnpm dev
```

---

## 💰 Cost

**Free tier includes:**
- 28,000 map loads/month
- 40,000 directions requests/month

Your app will use ~100-500/month = **$0** 🎉

---

## 🔐 Secure Your Key (Production)

1. Go to: https://console.cloud.google.com/google/maps-apis/credentials
2. Click your API key → "Edit"
3. **Application restrictions:**
   - Select: "HTTP referrers"
   - Add: `localhost:3000` (dev)
   - Add: `*.vercel.app` (production)
4. **API restrictions:**
   - Select: "Restrict key"
   - Enable only:
     - Maps JavaScript API
     - Directions API

---

## 🐛 Troubleshooting

### "AuthFailure" Error

**Problem:** Using wrong key or Gemini key instead of Maps key

**Solution:**
1. Make sure you have a SEPARATE Maps API key
2. Check the `.env` file has `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
3. Restart dev server after adding key

### "Maps JavaScript API not enabled"

**Solution:**
1. Go to: https://console.cloud.google.com/apis/library
2. Search "Maps JavaScript API"
3. Click "Enable"

### Map shows but no routes

**Solution:**
1. Enable "Directions API"
2. Go to: https://console.cloud.google.com/apis/library
3. Search "Directions API"
4. Click "Enable"

---

## 📝 Current .env Structure

You should have TWO different keys:

```bash
# Gemini AI (for itinerary generation)
GEMINI_API_KEY="AIza...key1"

# Google Maps (for interactive map)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIza...key2"
```

**They are DIFFERENT keys for DIFFERENT services!**

---

## ✅ How to Verify It's Working

After setup:

1. `pnpm dev`
2. Generate an itinerary
3. Click "Map" tab
4. **Should see:** Interactive map with markers and routes
5. **Should NOT see:** "API key not configured" message

---

## 🔄 Alternative: Skip Maps for Now

If you don't want to set up Maps right now:

1. Leave `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` empty
2. The app still works!
3. Users can download KML file instead
4. Import to Google My Maps manually

**Map is optional - itinerary generation works without it!**

---

## 🆘 Still Having Issues?

### Check 1: Key Format
```bash
echo $NEXT_PUBLIC_GOOGLE_MAPS_API_KEY | wc -c
# Should be ~40 characters
```

### Check 2: Prefix
```bash
cat .env | grep NEXT_PUBLIC
# Should show: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="..."
```

### Check 3: APIs Enabled
Go to: https://console.cloud.google.com/apis/dashboard

Should show:
- ✅ Maps JavaScript API (enabled)
- ✅ Directions API (enabled)

---

## 📚 More Info

- Get API Key: https://console.cloud.google.com/google/maps-apis/credentials
- Enable APIs: https://console.cloud.google.com/apis/library
- Pricing: https://mapsplatform.google.com/pricing/

**Free tier is generous - you likely won't pay anything!** 🎉
