"use client"

import { useEffect, useState } from "react"
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps"
import type { Experience, DayItinerary } from "@/lib/mock-data"

interface ItineraryMapProps {
  itinerary: DayItinerary[]
}

interface MarkerData {
  experience: Experience
  day: number
  position: { lat: number; lng: number }
  label: string
}

function MapContent({ markers }: { markers: MarkerData[] }) {
  const map = useMap()
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null)

  useEffect(() => {
    if (!map || markers.length === 0) return

    // Fit bounds to show all markers
    const bounds = new google.maps.LatLngBounds()
    markers.forEach(marker => {
      bounds.extend(marker.position)
    })
    map.fitBounds(bounds)

    // Draw routes between consecutive attractions
    if (markers.length > 1) {
      const directionsService = new google.maps.DirectionsService()
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true, // We'll use our own markers
        polylineOptions: {
          strokeColor: "#C4A265",
          strokeWeight: 3,
          strokeOpacity: 0.7
        }
      })

      // Group markers by day
      const markersByDay = markers.reduce((acc, marker) => {
        if (!acc[marker.day]) acc[marker.day] = []
        acc[marker.day].push(marker)
        return acc
      }, {} as Record<number, MarkerData[]>)

      // Draw route for each day
      Object.entries(markersByDay).forEach(([day, dayMarkers]) => {
        if (dayMarkers.length < 2) return

        const waypoints = dayMarkers.slice(1, -1).map(m => ({
          location: m.position,
          stopover: true
        }))

        directionsService.route(
          {
            origin: dayMarkers[0].position,
            destination: dayMarkers[dayMarkers.length - 1].position,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: false // Keep our order
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              directionsRenderer.setDirections(result)
            }
          }
        )
      })
    }
  }, [map, markers])

  return (
    <>
      {markers.map((marker, index) => (
        <AdvancedMarker
          key={`${marker.day}-${marker.experience.id}`}
          position={marker.position}
          onClick={() => setSelectedMarker(marker)}
        >
          <div className="relative">
            {/* Custom marker pin */}
            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-lg border-2 border-white">
                {index + 1}
              </div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-primary -mt-1" />
            </div>
          </div>
        </AdvancedMarker>
      ))}

      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.position}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div className="p-2 max-w-xs">
            <h3 className="font-semibold text-sm mb-1">
              {selectedMarker.experience.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              Day {selectedMarker.day} • {selectedMarker.experience.timeRange}
            </p>
            <p className="text-xs line-clamp-2">
              {selectedMarker.experience.shortDescription}
            </p>
            {selectedMarker.experience.googleRating && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-yellow-500">⭐</span>
                <span className="text-xs font-semibold">
                  {selectedMarker.experience.googleRating.toFixed(1)}
                </span>
                {selectedMarker.experience.googleReviews && (
                  <span className="text-xs text-muted-foreground">
                    ({(selectedMarker.experience.googleReviews / 1000).toFixed(1)}k)
                  </span>
                )}
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  )
}

export function ItineraryMap({ itinerary }: ItineraryMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className="rounded-lg border border-border bg-yellow-50 p-6 text-center">
        <h3 className="font-semibold text-yellow-900 mb-2">📍 Google Maps Not Configured</h3>
        <p className="text-sm text-yellow-800 mb-3">
          To see the interactive map, enable Maps APIs for your existing API key (FREE!)
        </p>
        <div className="text-xs text-left bg-white rounded p-3 border border-yellow-200 space-y-2">
          <p className="font-semibold">Quick Setup (1 minute):</p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Go to <a href="https://console.cloud.google.com/apis/library" target="_blank" className="text-blue-600 underline">Google Cloud API Library</a></li>
            <li>Enable these APIs (all FREE):
              <ul className="list-disc ml-4 mt-1">
                <li><strong>Maps Embed API</strong> (no usage fees!)</li>
                <li><strong>Maps JavaScript API</strong></li>
                <li><strong>Directions API</strong></li>
              </ul>
            </li>
            <li>Add your Gemini key to .env: <code className="bg-gray-100 px-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="same_as_gemini"</code></li>
            <li>Restart: <code className="bg-gray-100 px-1">pnpm dev</code></li>
          </ol>
          <p className="mt-2 text-green-700">✨ You can use your existing Gemini API key - just enable Maps APIs for it!</p>
        </div>
      </div>
    )
  }

  // Extract all experiences with coordinates
  const markers: MarkerData[] = []
  itinerary.forEach((day) => {
    day.experiences.forEach((exp, index) => {
      if (exp.lat && exp.lng) {
        markers.push({
          experience: exp,
          day: day.day,
          position: { lat: exp.lat, lng: exp.lng },
          label: `Day ${day.day} - Stop ${index + 1}`
        })
      }
    })
  })

  if (markers.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No location data available for map display
        </p>
      </div>
    )
  }

  // Default center (Saadiyat Island)
  const defaultCenter = { lat: 24.5388, lng: 54.4348 }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="rounded-lg overflow-hidden border border-border shadow-sm">
        <Map
          style={{ width: "100%", height: "500px" }}
          defaultCenter={defaultCenter}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapId="itinerary-map" // Required for AdvancedMarker
        >
          <MapContent markers={markers} />
        </Map>
      </div>
    </APIProvider>
  )
}
