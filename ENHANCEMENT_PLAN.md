# Feature Enhancement Plan

## 🎯 Overview

Major enhancements requested:
1. **Family Trip Support** - Solo/family trip types with age-based customization
2. **Google Star Ratings** - Show ratings for restaurants/cafes
3. **Recommendations Input** - Upload screenshots or paste text suggestions
4. **Localization** - Arabic/English support with Lingo.dev

---

## 📋 Feature 1: Family Trip Support

### Database Changes ✅ DONE
- Added `tripType` (solo/family)
- Added `familyMembers` JSON array
- Added `kidFriendly` boolean to attractions

### UI Changes (TO DO)

#### Step 0: Trip Type Selection (NEW)
```tsx
// New component: StepTripType.tsx
<RadioGroup>
  <option value="solo">Solo Traveler</option>
  <option value="family">Family Trip</option>
</RadioGroup>

{tripType === 'family' && <FamilyMembersInput />}
```

#### Family Members Input
```tsx
// Component to collect:
- Number of adults
- Number of children
- Ages of each child
// Display: "Add family member" button
// Show: Chips for each member (Adult, Child 5y, Child 8y, etc.)
```

### AI Prompt Enhancement

**For families with kids:**
```
FAMILY COMPOSITION:
- Adults: 2
- Children: 2 (ages 5, 8)

FAMILY-SPECIFIC ADJUSTMENTS:
1. Reduce daily activities by 20-30%
2. Add 15-minute buffer between each stop
3. Prioritize kid-friendly attractions
4. Prefer indoor options during hot hours
5. Include playground/rest areas
6. Suggest nearby facilities (restrooms, changing areas)
7. Avoid attractions with age restrictions
8. Recommend kid-friendly restaurants
```

### Itinerary Adjustments

| Trip Type | Adults Only | With Kids (0-5) | With Kids (6-12) | Teens (13+) |
|-----------|-------------|-----------------|------------------|-------------|
| Attractions/Day | 4-5 | 2-3 | 3-4 | 4-5 |
| Duration Buffer | None | +30 min | +15 min | +5 min |
| Pace | Balanced | Relaxed+ | Relaxed | Balanced |

---

## 📋 Feature 2: Google Star Ratings

### Option A: Google Places API (Requires API Key + Billing)

**Pros:**
- Official data
- Real-time ratings
- Detailed info

**Cons:**
- Costs money (~$17/1000 requests)
- Requires Google Cloud setup
- API rate limits

### Option B: Mock Ratings (Recommended for Now)

Add realistic mock ratings to seed data:

```typescript
{
  name: "Louvre Abu Dhabi",
  googleRating: 4.7,
  googleReviews: 45231,
  kidFriendly: true
}
```

### UI Display

```tsx
<div className="flex items-center gap-1">
  <Star className="fill-yellow-400 text-yellow-400" />
  <span className="font-semibold">4.7</span>
  <span className="text-muted-foreground">(45.2k reviews)</span>
</div>
```

**Show ratings:**
- In itinerary cards
- In experience modal
- In KML export descriptions

---

## 📋 Feature 3: Recommendations Input

### UI: New Step in Setup Flow

```tsx
// New component: StepRecommendations.tsx

<div>
  <h3>Got recommendations from friends?</h3>
  
  {/* Option 1: Upload Screenshot */}
  <FileUpload 
    accept="image/*"
    onUpload={handleScreenshotUpload}
  />
  
  {/* Option 2: Paste Text */}
  <Textarea
    placeholder="Paste recommendations here..."
    value={recommendationsText}
  />
  
  {/* Show extracted places */}
  {extractedPlaces.length > 0 && (
    <div>
      <p>We found these places:</p>
      {extractedPlaces.map(place => (
        <Chip key={place}>{place}</Chip>
      ))}
    </div>
  )}
</div>
```

### Backend Processing

#### Screenshot → Text (OCR)
```typescript
// Option A: Gemini Vision API (text extraction)
const text = await gemini.generateContent({
  contents: [{
    parts: [
      { text: "Extract all place names from this image" },
      { inlineData: { mimeType: "image/jpeg", data: base64Image } }
    ]
  }]
})

// Option B: Browser-based Tesseract.js (free, slower)
import Tesseract from 'tesseract.js'
const { data: { text } } = await Tesseract.recognize(image)
```

#### Text → Structured Data
```typescript
// Use Gemini to parse and match to attractions
const prompt = `
Extract place names from this text and match to Saadiyat Island attractions:
Text: "${userRecommendations}"

Available attractions: ${JSON.stringify(attractions)}

Return JSON: { matchedPlaces: [...], unmatched: [...] }
`
```

### Integration with Itinerary Generation

```typescript
// Enhanced prompt
const recommendations = session.recommendations ? JSON.parse(session.recommendations) : null

if (recommendations?.matchedPlaces) {
  prompt += `
  
  USER RECOMMENDATIONS:
  The user has received recommendations for:
  ${recommendations.matchedPlaces.join(', ')}
  
  Please PRIORITIZE these attractions if they match user interests.
  `
}
```

---

## 📋 Feature 4: Localization (Lingo.dev)

### Setup Steps

#### 1. Install Dependencies
```bash
pnpm add next-intl
```

#### 2. Create i18n Structure
```
src/
├── locales/
│   ├── en.json
│   └── ar.json
├── i18n/
│   ├── config.ts
│   └── request.ts
```

#### 3. i18n Configuration (i18n.json for Lingo.dev)
```json
{
  "sourceLanguage": "en",
  "targetLanguages": ["ar"],
  "sourceFolder": "src/locales",
  "outputFormat": "nested",
  "namespaces": ["common", "setup", "itinerary"]
}
```

#### 4. Locale Files

**src/locales/en.json:**
```json
{
  "common": {
    "next": "Next",
    "back": "Back",
    "generate": "Generate Itinerary"
  },
  "setup": {
    "title": "Your Saadiyat Layover, Curated",
    "tripType": {
      "label": "Trip Type",
      "solo": "Solo Traveler",
      "family": "Family Trip"
    },
    "familyMembers": {
      "label": "Family Members",
      "addAdult": "Add Adult",
      "addChild": "Add Child"
    }
  }
}
```

**src/locales/ar.json:**
```json
{
  "common": {
    "next": "التالي",
    "back": "رجوع",
    "generate": "إنشاء برنامج الرحلة"
  },
  "setup": {
    "title": "رحلتك في جزيرة السعديات",
    "tripType": {
      "label": "نوع الرحلة",
      "solo": "مسافر منفرد",
      "family": "رحلة عائلية"
    }
  }
}
```

#### 5. Translation Helper
```typescript
// lib/i18n.ts
export function useTranslation(namespace: string = 'common') {
  const locale = useLocale()
  const messages = require(`@/locales/${locale}.json`)
  
  return {
    t: (key: string) => {
      const keys = key.split('.')
      let value = messages[namespace]
      for (const k of keys) {
        value = value?.[k]
      }
      return value || key
    }
  }
}
```

#### 6. Language Switcher Component
```tsx
// components/language-switcher.tsx
export function LanguageSwitcher() {
  const [locale, setLocale] = useState('en')
  
  useEffect(() => {
    const saved = localStorage.getItem('locale') || 'en'
    setLocale(saved)
    document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr'
  }, [])
  
  const switchLanguage = (newLocale: string) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
    window.location.reload()
  }
  
  return (
    <div className="flex gap-2">
      <Button onClick={() => switchLanguage('en')}>EN</Button>
      <Button onClick={() => switchLanguage('ar')}>العربية</Button>
    </div>
  )
}
```

#### 7. RTL Support (Tailwind)
```typescript
// tailwind.config.ts
module.exports = {
  // ...
  plugins: [
    require('tailwindcss-rtl'),
  ],
}
```

**Usage in components:**
```tsx
<div className="ml-4 rtl:mr-4 rtl:ml-0">...</div>
```

---

## 🎯 Implementation Priority

### Phase 1: Core Family Features (Week 1)
✅ Database schema updated
- [ ] Trip type selection UI
- [ ] Family member input UI  
- [ ] Update API to save family data
- [ ] Enhanced Gemini prompt for families
- [ ] Adjusted itinerary logic

### Phase 2: Ratings & Recommendations (Week 2)
- [ ] Add mock Google ratings to seed data
- [ ] Display ratings in UI
- [ ] Recommendations input UI
- [ ] OCR/text parsing logic
- [ ] Integrate recommendations into generation

### Phase 3: Localization (Week 3)
- [ ] Set up next-intl
- [ ] Extract all strings to locale files
- [ ] Create Arabic translations (or use Google Translate API)
- [ ] Add language switcher
- [ ] RTL styling adjustments
- [ ] Test all flows in both languages

---

## 📊 Estimated Effort

| Feature | Complexity | Time Estimate |
|---------|-----------|---------------|
| Family Trip UI | Medium | 4-6 hours |
| Family AI Logic | Medium | 3-4 hours |
| Google Ratings (mock) | Low | 2-3 hours |
| Recommendations Input | High | 6-8 hours |
| OCR Integration | High | 4-6 hours |
| Localization Setup | Medium | 5-7 hours |
| Arabic Translation | High | 8-10 hours |
| Testing & Polish | Medium | 4-6 hours |
| **Total** | | **36-50 hours** |

---

## 🚀 Quick Wins (Can Do Now)

1. **Trip Type Selection** - Simple UI addition
2. **Mock Google Ratings** - Just data + display
3. **Basic Text Recommendations** - Skip OCR, just textarea
4. **Language Switcher** - EN/AR with localStorage

---

## 💡 Recommendations

### Start With:
1. ✅ Family trip type selection (simplest, high impact)
2. ✅ Mock Google ratings (easy to add, looks professional)
3. ✅ Basic text recommendations (defer OCR for v2)
4. ⏸️ Localization (save for after core features work)

### For Production:
- Use Google Places API for real ratings (budget ~$50-100/month)
- Use Gemini Vision for OCR (included in Gemini API)
- Hire translator for proper Arabic localization
- Add more languages (French, Hindi, Chinese for tourists)

---

## 📝 Next Steps

Would you like me to:
1. **Implement all features** (36-50 hours of work)
2. **Focus on Phase 1** (family features first)
3. **Create MVP** (trip type + ratings only)
4. **Detailed spec for one feature** (before building)

Let me know your preference and I'll proceed accordingly!
