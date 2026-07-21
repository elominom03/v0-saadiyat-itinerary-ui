# ✅ Enable Google Maps APIs (Quick Fix)

Your API key is in `.env` but you need to enable Maps APIs in Google Cloud Console.

## Step 1: Enable Maps APIs (2 minutes)

Go to Google Cloud Console and enable these 3 APIs for your existing project:

1. **Maps JavaScript API** 
   https://console.cloud.google.com/apis/library/maps-backend.googleapis.com
   
2. **Maps Embed API** (FREE - no usage fees!)
   https://console.cloud.google.com/apis/library/maps-embed-backend.googleapis.com
   
3. **Directions API**
   https://console.cloud.google.com/apis/library/directions-backend.googleapis.com

Click "Enable" on each one.

## Step 2: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
pnpm dev
```

## Step 3: Test

1. Generate an itinerary
2. Click "Map View" button
3. You should see the interactive map with markers and routes!

## Troubleshooting

If you still see errors:

1. **Check browser console** (F12 or Cmd+Option+I)
   - Look for Google Maps errors
   - Share the error message

2. **Verify API key is loaded**
   ```bash
   # In project root
   cat .env | grep NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   ```

3. **Wait 5 minutes** after enabling APIs (propagation delay)

4. **Check API restrictions**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click on your API key
   - Under "API restrictions", make sure Maps APIs are allowed
