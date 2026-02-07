"use client"

import { useState } from "react"
import { StepIndicator } from "@/components/step-indicator"
import { StepTripType } from "@/components/step-trip-type"
import { StepLayoverDetails } from "@/components/step-layover-details"
import { StepPaceSelection } from "@/components/step-pace-selection"
import { StepInterests } from "@/components/step-interests"
import { StepRecommendations } from "@/components/step-recommendations"
import { useItinerary } from "@/lib/itinerary-context"
import { generateItinerary } from "@/lib/api-client"
import { useI18n } from "@/lib/i18n-context"
import Image from "next/image"

interface SetupFlowProps {
  onComplete: () => void
}

interface FamilyMember {
  age: number
  type: "child" | "teen" | "adult"
}

export function SetupFlow({ onComplete }: SetupFlowProps) {
  const { t } = useI18n()
  const { setItinerary, setError } = useItinerary()
  const [step, setStep] = useState(0)
  const [tripType, setTripType] = useState<"solo" | "family">("solo")
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [arrivalDate, setArrivalDate] = useState("")
  const [departureDate, setDepartureDate] = useState("")
  const [hotelLocation, setHotelLocation] = useState("")
  const [selectedPace, setSelectedPace] = useState("")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [recommendationsText, setRecommendationsText] = useState("")
  const [extractedPlaces, setExtractedPlaces] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const result = await generateItinerary({
        arrivalTime: arrivalDate,
        departureTime: departureDate,
        hotelLocation,
        pace: selectedPace,
        interests: selectedInterests,
        preferences: {
          dietary: selectedExtras.includes("halal") ? ["halal"] : [],
          accessibility: selectedExtras.includes("wheelchair") ? ["wheelchair"] : [],
        },
        tripType,
        familyMembers: tripType === "family" ? familyMembers : undefined,
        recommendations: extractedPlaces.length > 0 ? {
          text: recommendationsText,
          places: extractedPlaces
        } : undefined,
      })
      setItinerary(result.itinerary)
      onComplete()
    } catch (error) {
      console.error("Failed to generate itinerary:", error)
      setError(error instanceof Error ? error.message : "Failed to generate itinerary")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left side - hero image (desktop) */}
      <div className="relative hidden lg:block lg:w-1/2">
        <Image
          src="/images/saadiyat-hero.jpg"
          alt="Aerial view of Saadiyat Island"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/20" />
        <div className="absolute bottom-12 left-12 right-12">
          <h1 className="font-serif text-4xl text-background xl:text-5xl">
            Your Saadiyat
            <br />
            Layover, Curated.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-background/80">
            Designed around your time. Optimized for a smooth layover. You can
            always regenerate — nothing is locked in.
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <div className="relative h-48 lg:hidden">
          <Image
            src="/images/saadiyat-hero.jpg"
            alt="Aerial view of Saadiyat Island"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-foreground/30" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="font-serif text-2xl text-background">
              Your Saadiyat Layover, Curated.
            </h1>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-6 py-8 sm:px-10 lg:justify-center lg:px-16 xl:px-20">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <StepIndicator currentStep={step} totalSteps={5} />
            </div>

            <div className="transition-all duration-300">
              {step === 0 && (
                <StepTripType
                  tripType={tripType}
                  familyMembers={familyMembers}
                  onTripTypeChange={setTripType}
                  onFamilyMembersChange={setFamilyMembers}
                  onNext={() => setStep(1)}
                />
              )}
              {step === 1 && (
                <StepLayoverDetails
                  arrivalDate={arrivalDate}
                  departureDate={departureDate}
                  hotelLocation={hotelLocation}
                  onArrivalChange={setArrivalDate}
                  onDepartureChange={setDepartureDate}
                  onHotelChange={setHotelLocation}
                  onNext={() => setStep(2)}
                  onBack={() => setStep(0)}
                />
              )}
              {step === 2 && (
                <StepPaceSelection
                  selectedPace={selectedPace}
                  onPaceChange={setSelectedPace}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <StepInterests
                  selectedInterests={selectedInterests}
                  selectedExtras={selectedExtras}
                  onInterestToggle={toggleInterest}
                  onExtraToggle={toggleExtra}
                  onGenerate={() => setStep(4)}
                  onBack={() => setStep(2)}
                />
              )}
              {step === 4 && (
                <StepRecommendations
                  recommendationsText={recommendationsText}
                  extractedPlaces={extractedPlaces}
                  onRecommendationsChange={setRecommendationsText}
                  onExtractedPlacesChange={setExtractedPlaces}
                  onNext={handleGenerate}
                  onBack={() => setStep(3)}
                  onSkip={handleGenerate}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
