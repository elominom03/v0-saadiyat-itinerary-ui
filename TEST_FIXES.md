# ✅ Quick Test: Are the Fixes Working?

## 🧪 Test 1: Gemini API Works (No 404 Error)

**Before:** Getting 404 error on every request

**After:** Should work OR gracefully fallback without error spam

1. Start dev server (if not running):
   ```bash
   pnpm dev
   ```

2. Go to http://localhost:3000

3. Complete the setup flow and generate an itinerary

4. **Check terminal output:**
   - ❌ If you see: `Error: models/gemini-1.5-flash is not found`
     → Still broken, try alternative models (see below)
   - ✅ If you see: No errors OR `Gemini AI failed, using heuristic fallback` (one time only)
     → Fixed!

---

## 🧪 Test 2: Different Itineraries for Different Trips

### Test A: Art Lover
1. Refresh page (http://localhost:3000)
2. Select **Solo Traveler**
3. Enter dates (e.g., Feb 10 - Feb 12)
4. Pace: **Balanced**
5. Interests: Select **Art & Museums** + **Architecture**
6. Skip recommendations
7. **Generate**

**Expected:** Should see Louvre Abu Dhabi, Manarat Al Saadiyat, etc.

### Test B: Beach Person
1. Refresh page again
2. Select **Solo Traveler**
3. Same dates
4. Pace: **Balanced**
5. Interests: Select **Beach & Relaxation** + **Nature**
6. Skip recommendations
7. **Generate**

**Expected:** Should see Saadiyat Beach, Turtle Beach, Soul Beach, etc.

**Result:**
- ❌ Same attractions as Test A → Not fully fixed, need to debug further
- ✅ Different attractions → Fixed!

---

## 🧪 Test 3: Family Adjustments

1. Refresh page
2. Select **Family Trip**
3. Add: 2 adults + 1 child (age 5)
4. Complete flow normally
5. **Generate**

**Expected:**
- Fewer activities (2-3 per day instead of 4-5)
- Shorter time slots (e.g., "9:00 - 11:00" instead of "9:00 - 12:00")
- Optimizations message mentions "family"

---

## 🧪 Test 4: Recommendations Work

1. Refresh page
2. Go through setup
3. At "Got recommendations?" step:
   - Paste: `You must visit Louvre Abu Dhabi and try Fouquet's!`
   - Click **Extract Place Names**
4. Wait 2-3 seconds
5. Should show chips: "Louvre Abu Dhabi", "Fouquet's"
6. **Generate**

**Expected:**
- Louvre and/or Fouquet's appear in itinerary
- If they don't match your interests, they might not appear (AI is smart!)

---

## 🐛 If Gemini Still Fails

### Option 1: Try Different Model Names

Edit `lib/gemini-ai.ts` line ~267:

```typescript
// Try these in order:

// 1. Flash latest (should work)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })

// 2. Pro latest (more capable)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" })

// 3. Stable pro
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

// 4. Flash 8B (faster, cheaper)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b-latest" })
```

### Option 2: Check Your API Key

```bash
cat .env
```

Should show:
```
GEMINI_API_KEY=AIza...your_key_here
```

Get a key at: https://makersuite.google.com/app/apikey

### Option 3: List Available Models

Add this to `lib/gemini-ai.ts` temporarily:

```typescript
// At the top of generateItineraryWithGemini function
const models = await genAI.listModels()
console.log("Available models:", models.map(m => m.name))
```

This will show what models are actually available for your API key.

---

## ✅ Success Criteria

All fixes are working when:

1. ✅ No 404 errors in terminal (or only one fallback message)
2. ✅ Art interests → Art attractions
3. ✅ Beach interests → Beach attractions  
4. ✅ Family trips → Fewer activities
5. ✅ Recommendations → Extracted and prioritized
6. ✅ Build passes: `pnpm run build`

---

## 📊 Expected Terminal Output (Good)

```
✓ Ready in 623ms
GET / 200 in 1510ms
POST /api/itinerary/generate 200 in 2.3s
✓ Compiled successfully
```

OR (if Gemini unavailable but heuristic works):

```
✓ Ready in 623ms
Gemini AI failed, using heuristic fallback: [error message]
POST /api/itinerary/generate 200 in 877ms
```

---

## 🚨 Expected Terminal Output (Bad)

```
Error calling Gemini AI: Error: [404 Not Found]
Error calling Gemini AI: Error: [404 Not Found]  ← Repeating = not fixed
Error calling Gemini AI: Error: [404 Not Found]
```

If you see repeating errors, the model name fix didn't work.

---

## 🎯 Quick Verification Script

Run this to test everything at once:

```bash
# 1. Build should pass
pnpm run build

# 2. Start dev
pnpm dev

# 3. Open in browser
open http://localhost:3000

# 4. Check for errors
# (Look at terminal - should be clean)
```

---

## 📞 Still Not Working?

Share:
1. Terminal error output
2. Which test failed
3. Your model name from `lib/gemini-ai.ts`
4. Result of: `echo $GEMINI_API_KEY | wc -c` (should be ~40 characters)

I'll help debug further! 🛠️
