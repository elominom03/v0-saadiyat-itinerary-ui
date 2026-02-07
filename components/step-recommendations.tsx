"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Upload, FileText, Sparkles, X } from "lucide-react"

interface StepRecommendationsProps {
  recommendationsText: string
  extractedPlaces: string[]
  onRecommendationsChange: (text: string) => void
  onExtractedPlacesChange: (places: string[]) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}

export function StepRecommendations({
  recommendationsText,
  extractedPlaces,
  onRecommendationsChange,
  onExtractedPlacesChange,
  onNext,
  onBack,
  onSkip
}: StepRecommendationsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Process with OCR (placeholder for now)
    setIsProcessing(true)
    try {
      // TODO: Implement OCR with Gemini Vision API
      // For now, just show placeholder
      setTimeout(() => {
        setIsProcessing(false)
        onRecommendationsChange("Example extracted text from image...")
      }, 1500)
    } catch (error) {
      console.error("Error processing image:", error)
      setIsProcessing(false)
    }
  }

  const handleExtractPlaces = async () => {
    if (!recommendationsText.trim()) return

    setIsProcessing(true)
    try {
      // Call backend to extract place names
      const response = await fetch("/api/recommendations/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: recommendationsText })
      })

      if (response.ok) {
        const data = await response.json()
        onExtractedPlacesChange(data.places || [])
      }
    } catch (error) {
      console.error("Error extracting places:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const removePlace = (place: string) => {
    onExtractedPlacesChange(extractedPlaces.filter(p => p !== place))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-foreground">
          Got recommendations?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Share suggestions from friends or online guides
        </p>
      </div>

      {/* Upload Screenshot Option */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Option 1: Upload Screenshot</Label>
        <div className="rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-primary transition-colors">
          <input
            type="file"
            id="screenshot-upload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <label htmlFor="screenshot-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm font-medium">Upload a screenshot</div>
              <div className="text-xs text-muted-foreground">
                From Instagram, TripAdvisor, or friend's messages
              </div>
            </div>
          </label>
        </div>

        {uploadedImage && (
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img src={uploadedImage} alt="Uploaded recommendation" className="w-full h-32 object-cover" />
            <button
              onClick={() => setUploadedImage(null)}
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Paste Text Option */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Option 2: Paste Text</Label>
        <Textarea
          placeholder="Paste recommendations here... e.g., 'You should definitely visit the Louvre Abu Dhabi and try Fouquet's for lunch!'"
          value={recommendationsText}
          onChange={(e) => onRecommendationsChange(e.target.value)}
          rows={5}
          className="resize-none"
        />

        {recommendationsText.trim() && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleExtractPlaces}
            disabled={isProcessing}
            className="w-full gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isProcessing ? "Analyzing..." : "Extract Place Names"}
          </Button>
        )}
      </div>

      {/* Extracted Places */}
      {extractedPlaces.length > 0 && (
        <div className="space-y-3 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Recommended Places</Label>
            <Badge variant="secondary" className="text-xs">
              {extractedPlaces.length} found
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {extractedPlaces.map((place) => (
              <Badge key={place} variant="outline" className="gap-2 py-1.5 px-3">
                <FileText className="h-3 w-3" />
                {place}
                <button
                  type="button"
                  onClick={() => removePlace(place)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            ✨ We'll prioritize these places in your itinerary if they match your interests
          </p>
        </div>
      )}

      {/* Skip option */}
      <div className="text-center">
        <button
          type="button"
          onClick={onSkip}
          className="text-sm text-muted-foreground underline hover:text-foreground"
        >
          Skip this step
        </button>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={isProcessing}
          className="w-full"
        >
          Generate Itinerary
        </Button>
      </div>
    </div>
  )
}
