# ⏱️ Waiting for Google APIs to Activate

## ✅ You're on the Right Track!

The `AuthFailure` error you're seeing is **normal** right after enabling APIs.

**Why?** Google needs time to propagate the changes globally (usually 1-5 minutes).

---

## 🕐 Timeline

| Time | What's Happening |
|------|------------------|
| **0:00** | You click "Enable" on APIs ✅ |
| **0:30** | Google Cloud Console shows "enabled" |
| **1-2 min** | Still seeing `AuthFailure` (normal!) |
| **2-5 min** | APIs activate globally 🌍 |
| **5 min** | Map should work! 🗺️ |

**Current status:** You're in the 1-5 minute waiting period. This is expected! ⏳

---

## 🧘 What to Do While Waiting

### Option 1: Wait 5 Minutes (Recommended)
1. ☕ Take a coffee break
2. Come back in 5 minutes
3. Restart: `pnpm dev`
4. Test map again → Should work! ✅

### Option 2: Poll Every Minute
```bash
# Minute 1
pnpm dev
# Test map → Still failing? Normal!

# Minute 2
# Ctrl+C, then pnpm dev again
# Test map → Still failing? Wait more...

# Minute 3-5
# Eventually it will work! ✅
```

---

## 🎯 How to Know It's Working

### ✅ Success Signs:
- No console errors
- Interactive map loads
- Markers appear
- Routes drawn

### ⏳ Still Waiting Signs:
```
Error: AuthFailure
A problem with your API key prevents the map...
```

**If you still see this after 5 minutes**, there might be another issue (see troubleshooting below).

---

## 🐛 If Still Not Working After 5 Minutes

### Check 1: APIs Actually Enabled?

**Go to:**
👉 https://console.cloud.google.com/apis/dashboard

**Should see in your list:**
- ✅ Maps JavaScript API (enabled)
- ✅ Directions API (enabled)

**If not listed** → Go back and enable them again.

---

### Check 2: Billing Enabled?

Some Google APIs require billing to be set up (even though they're free).

1. Go to: https://console.cloud.google.com/billing
2. Check if billing is linked to your project
3. If not:
   - Click "Link a billing account"
   - Add a credit card (won't be charged for free tier)
   - Enable billing

**Why?** Google requires billing info to prevent abuse, but you won't be charged unless you exceed the generous free tier.

---

### Check 3: API Key Restrictions?

Your key might have restrictions blocking `localhost`.

**Go to:**
👉 https://console.cloud.google.com/apis/credentials

**Click your API key → Edit**

**Check these settings:**

#### Application Restrictions:
- **Select:** "HTTP referrers (web sites)"
- **Add these referrers:**
  ```
  localhost:*
  http://localhost:*
  https://localhost:*
  *.vercel.app
  ```

#### API Restrictions:
- **Select:** "Restrict key"
- **Enable these APIs:**
  - ✅ Generative Language API
  - ✅ Maps JavaScript API
  - ✅ Directions API

**Save changes** → Wait 1 minute → Restart server

---

### Check 4: Using Correct Project?

Make sure the APIs are enabled in the **same Google Cloud project** where you created the API key.

1. Check current project (top-left in Cloud Console)
2. Verify APIs enabled in that project
3. Verify API key created in that project

---

## 🔄 Quick Reset (if stuck)

If nothing works after 10 minutes:

1. **Create a brand new API key:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "API Key"
   - Copy the new key

2. **Update .env:**
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="new_key_here"
   ```

3. **Enable APIs for new key:**
   - Maps JavaScript API
   - Directions API

4. **Restart:**
   ```bash
   pnpm dev
   ```

5. **Wait 2 minutes** and test

---

## 📊 Diagnostic Checklist

Run through this:

- [ ] Enabled "Maps JavaScript API"? (check dashboard)
- [ ] Enabled "Directions API"? (check dashboard)
- [ ] Waited at least 5 minutes?
- [ ] Restarted dev server after enabling?
- [ ] Cleared browser cache?
- [ ] Billing enabled on Google Cloud project?
- [ ] API key has no restrictions blocking localhost?
- [ ] Using correct Google Cloud project?

---

## ⏰ Current Recommendation

**WAIT 5 MINUTES** then try again.

The error you're seeing is **normal** right after enabling APIs. Google needs time to activate them globally.

**Timeline:**
- ✅ APIs enabled (you did this)
- ⏳ Waiting for propagation (1-5 minutes)
- 🎯 Map will work soon!

---

## 🧪 Test Script

Want to test if APIs are active without restarting the app?

```bash
# Run this every minute to check
curl "https://maps.googleapis.com/maps/api/js?key=AIzaSyBjK5wMVNIMagWc6mARfKlzA8rdL3yfYqg&callback=test" 2>&1 | grep -i error
```

**If no output** → API is active! ✅  
**If shows error** → Still waiting... ⏳

---

## 💡 Pro Tip

While waiting for Maps, your app **still works perfectly**:
- ✅ AI generates itineraries (Gemini confirmed working!)
- ✅ List view shows all attractions
- ✅ Download KML works
- ⏳ Map view will work once APIs activate

**So you can keep testing other features!** 🎉

---

## 🎯 Summary

**Most likely scenario:** You just need to **wait 2-5 more minutes**.

**Then:**
```bash
pnpm dev  # Restart
```

**And the map will work!** 🗺️

**Less likely:** Billing needs to be enabled or key has restrictions. See troubleshooting above.

---

## ⏳ My Recommendation

**Take a 5-minute break.** ☕

When you come back:
1. Restart server
2. Test map
3. Should work! ✅

If not, check billing and key restrictions (see "Check 2" and "Check 3" above).

---

**Be patient - Google API activation always takes a few minutes!** 🕐
