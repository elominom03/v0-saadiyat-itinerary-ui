import type { DayPlan } from "./api-client"

export interface AttractionWithDetails {
  id: string
  name: string
  lat: number | null
  lng: number | null
  description: string
  openingHours?: string | null
  openingDays?: string | null
  ticketPrice?: string | null
  website?: string | null
  phone?: string | null
  category: string
}

export interface ItineraryForKML {
  sessionId: string
  days: DayPlan[]
  attractions: Map<string, AttractionWithDetails>
}

/**
 * Generate KML file content for Google My Maps import
 */
export function generateKML(itinerary: ItineraryForKML): string {
  const { days, attractions } = itinerary
  
  // KML header
  let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Saadiyat Island Itinerary</name>
    <description>Your personalized Saadiyat Island layover itinerary</description>
    
    <!-- Define styles for different types of places -->
    <Style id="museum">
      <IconStyle>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/purple-circle.png</href>
        </Icon>
      </IconStyle>
    </Style>
    <Style id="restaurant">
      <IconStyle>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/orange-circle.png</href>
        </Icon>
      </IconStyle>
    </Style>
    <Style id="beach">
      <IconStyle>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/blu-circle.png</href>
        </Icon>
      </IconStyle>
    </Style>
    <Style id="shopping">
      <IconStyle>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/grn-circle.png</href>
        </Icon>
      </IconStyle>
    </Style>
    <Style id="spiritual">
      <IconStyle>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png</href>
        </Icon>
      </IconStyle>
    </Style>
    <Style id="default">
      <IconStyle>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/red-circle.png</href>
        </Icon>
      </IconStyle>
    </Style>
    <Style id="route">
      <LineStyle>
        <color>ff0000ff</color>
        <width>3</width>
      </LineStyle>
    </Style>
`

  // Create a folder for each day
  days.forEach((day) => {
    kml += `
    <!-- ${day.date} -->
    <Folder>
      <name>Day ${day.day}: ${day.date}</name>
      <description>Your itinerary for ${day.date}</description>
`

    const dayAttractions: Array<{ attraction: AttractionWithDetails; timeRange: string; timeBlock: string }> = []

    // Collect all attractions for this day
    const timeBlocks: Array<{ period: "morning" | "afternoon" | "evening"; slot: typeof day.morning }> = [
      { period: "morning", slot: day.morning },
      { period: "afternoon", slot: day.afternoon },
      { period: "evening", slot: day.evening }
    ]

    timeBlocks.forEach(({ period, slot }) => {
      if (!slot) return
      
      const attraction = attractions.get(slot.attractionId)
      if (!attraction || !attraction.lat || !attraction.lng) return

      dayAttractions.push({
        attraction,
        timeRange: slot.timeRange,
        timeBlock: period.charAt(0).toUpperCase() + period.slice(1)
      })

      // Add placemark for this attraction
      const style = getStyleForCategory(attraction.category)
      const description = createPlacemarkDescription(attraction, slot.timeRange, period, slot.whyChosen, slot.tips)

      kml += `
      <Placemark>
        <name>${escapeXML(attraction.name)}</name>
        <description><![CDATA[${description}]]></description>
        <styleUrl>#${style}</styleUrl>
        <Point>
          <coordinates>${attraction.lng},${attraction.lat},0</coordinates>
        </Point>
      </Placemark>
`
    })

    // Add route between attractions for this day
    if (dayAttractions.length > 1) {
      const routeCoordinates = dayAttractions
        .filter(({ attraction }) => attraction.lat && attraction.lng)
        .map(({ attraction }) => `${attraction.lng},${attraction.lat},0`)
        .join('\n            ')

      kml += `
      <Placemark>
        <name>Route for Day ${day.day}</name>
        <description>Suggested route between stops</description>
        <styleUrl>#route</styleUrl>
        <LineString>
          <tessellate>1</tessellate>
          <coordinates>
            ${routeCoordinates}
          </coordinates>
        </LineString>
      </Placemark>
`
    }

    kml += `
    </Folder>
`
  })

  // Close KML document
  kml += `
  </Document>
</kml>`

  return kml
}

/**
 * Create detailed description HTML for a placemark
 */
function createPlacemarkDescription(
  attraction: AttractionWithDetails,
  timeRange: string,
  timeBlock: string,
  whyChosen: string,
  tips?: string[]
): string {
  let html = `<div style="font-family: Arial, sans-serif; max-width: 350px;">
  <h3 style="color: #C4A265; margin-bottom: 8px;">${escapeXML(attraction.name)}</h3>
  
  <p style="margin: 8px 0;"><strong>📅 Scheduled Time:</strong> ${timeBlock} (${escapeXML(timeRange)})</p>
  
  <p style="margin: 8px 0;"><strong>ℹ️ About:</strong><br/>${escapeXML(attraction.description)}</p>
`

  if (attraction.openingHours) {
    html += `  <p style="margin: 8px 0;"><strong>🕒 Opening Hours:</strong> ${escapeXML(attraction.openingHours)}</p>
`
  }

  if (attraction.openingDays) {
    html += `  <p style="margin: 8px 0;"><strong>📆 Open:</strong> ${escapeXML(attraction.openingDays)}</p>
`
  }

  if (attraction.ticketPrice) {
    html += `  <p style="margin: 8px 0;"><strong>💰 Ticket Price:</strong> ${escapeXML(attraction.ticketPrice)}</p>
`
  }

  if (attraction.website) {
    html += `  <p style="margin: 8px 0;"><strong>🌐 Website:</strong> <a href="${escapeXML(attraction.website)}" target="_blank">${escapeXML(attraction.website)}</a></p>
`
  }

  if (attraction.phone) {
    html += `  <p style="margin: 8px 0;"><strong>📞 Phone:</strong> ${escapeXML(attraction.phone)}</p>
`
  }

  html += `
  <p style="margin: 8px 0; padding: 8px; background: #f5f5f5; border-left: 3px solid #C4A265;"><strong>✨ Why This Stop:</strong><br/>${escapeXML(whyChosen)}</p>
`

  if (tips && tips.length > 0) {
    html += `
  <p style="margin: 8px 0;"><strong>💡 Tips:</strong></p>
  <ul style="margin: 4px 0; padding-left: 20px;">
`
    tips.forEach(tip => {
      html += `    <li>${escapeXML(tip)}</li>
`
    })
    html += `  </ul>
`
  }

  html += `</div>`

  return html
}

/**
 * Get style ID for category
 */
function getStyleForCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    museum: "museum",
    gallery: "museum",
    restaurant: "restaurant",
    cafe: "restaurant",
    beach: "beach",
    "beach-club": "beach",
    shopping: "shopping",
    promenade: "shopping",
    spiritual: "spiritual",
    "hotel-dining": "restaurant"
  }

  return categoryMap[category.toLowerCase()] || "default"
}

/**
 * Escape XML special characters
 */
function escapeXML(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/**
 * Generate filename for KML download
 */
export function generateKMLFilename(sessionId: string): string {
  const date = new Date().toISOString().split('T')[0]
  return `saadiyat-itinerary-${date}-${sessionId.substring(0, 8)}.kml`
}
