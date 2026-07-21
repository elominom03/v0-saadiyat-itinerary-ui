# 🗺️ Enable Google Maps APIs (1 Minute Setup)

## ✅ Good News!

You can use your **existing Gemini API key** for Google Maps! Just need to enable the Maps APIs for it.

**Maps Embed API = FREE (no usage fees!)** 🎉

---

## 🚀 Quick Setup

### Step 1: Enable Maps APIs (1 minute)

1. **Go to Google Cloud API Library:**
   👉 https://console.cloud.google.com/apis/library

2. **Enable these 3 APIs** (search for each):
   
   a. **Maps Embed API** 
      - Click "Enable"
      - ✅ **FREE** - No usage fees!
   
   b. **Maps JavaScript API**
      - Click "Enable"
      - Free tier: 28,000 loads/month
   
   c. **Directions API**
      - Click "Enable"
      - Free tier: 40,000 routes/month

**That's it!** Your existing Gemini key now works for Maps too!

---

## 📝 Step 2: Update .env

Your `.env` file is already updated! Both keys are now the same:

```bash
GEMINI_API_KEY="AIzaSyBjK5wMVNIMagWc6mARfKlzA8rdL3yfYqg"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyBjK5wMVNIMagWc6mARfKlzA8rdL3yfYqg"
```

**Same key, different services!** ✅

---

## 🔄 Step 3: Restart Dev Server

```bash
# Stop current server (Ctrl+C if running)
pnpm dev
```

---

## 🧪 Step 4: Test It!

1. Go to http://localhost:3000
2. Generate an itinerary
3. Click **"Map"** tab
4. **Should see:** Interactive map with markers and routes! 🗺️
5. **Should NOT see:** "AuthFailure" or "Not Configured"

---

## 📊 What You Enabled

| API | Cost | Usage Limit | What It Does |
|-----|------|-------------|--------------|
| **Maps Embed API** | 💰 **FREE** | Unlimited | Embed maps in pages |
| **Maps JavaScript API** | 💰 Free tier | 28,000/month | Interactive maps |
| **Directions API** | 💰 Free tier | 40,000/month | Routes between places |

**Your usage:** ~100-500/month = **$0** 🎉

---

## ✅ Verification Checklist

After enabling APIs:

- [ ] Go to: https://console.cloud.google.com/apis/dashboard
- [ ] Should see these enabled:
  - ✅ Maps Embed API
  - ✅ Maps JavaScript API
  - ✅ Directions API
- [ ] Restart dev server: `pnpm dev`
- [ ] Generate itinerary
- [ ] Click "Map" tab
- [ ] See interactive map (no errors!)

---

## 🐛 Troubleshooting

### Still Getting "AuthFailure"?

**Wait 1-2 minutes** after enabling APIs. Google needs time to propagate the changes.

Then restart:
```bash
pnpm dev
```

### "This API project is not authorized"

**Problem:** APIs not enabled yet

**Solution:**
1. Double-check all 3 APIs are enabled
2. Wait 1-2 minutes
3. Restart server

### Map shows but no routes

**Problem:** Directions API not enabled

**Solution:**
1. Enable "Directions API"
2. Restart server

---

## 🎯 Expected Result

### Before:
```
❌ AuthFailure
❌ Map doesn't render
```

### After (with APIs enabled):
```
✅ Interactive map loads
✅ Numbered markers (1, 2, 3...)
✅ Routes drawn between stops
✅ Click markers for details
✅ No errors!
```

---

## 💡 Key Points

1. ✅ **Same API key** for both Gemini and Maps
2. ✅ **Just enable Maps APIs** for that key
3. ✅ **Maps Embed API is FREE** (no charges!)
4. ✅ **Free tiers are generous** (you won't hit limits)
5. ✅ **Takes 1-2 minutes** to enable everything

---

## 🔐 Optional: Secure Your Key (Production)

Once maps are working, restrict your key:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your API key → "Edit"
3. **HTTP referrers:**
   - Add: `localhost:*`
   - Add: `*.vercel.app`
4. **API restrictions:**
   - Enable only what you use:
     - Generative Language API (Gemini)
     - Maps Embed API
     - Maps JavaScript API
     - Directions API

---

## 🎉 Summary

1. **Enable 3 Maps APIs** (1 minute)
2. **Same key as Gemini** (already configured)
3. **Restart server** (`pnpm dev`)
4. **Test the map!** (should work!)

**Links:**
- Enable APIs: https://console.cloud.google.com/apis/library
- Check enabled: https://console.cloud.google.com/apis/dashboard

**Ready!** 🚀
