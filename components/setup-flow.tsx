"use client"

import { useState } from "react"
import { StepIndicator } from "@/components/step-indicator"
import { StepLayoverDetails } from "@/components/step-layover-details"
import { StepGroupDetails } from "@/components/step-group-details"
import { StepPaceSelection } from "@/components/step-pace-selection"
import { StepInterests } from "@/components/step-interests"
import type { UserPreferences } from "@/lib/types"
import Image from "next/image"

interface SetupFlowProps {
  onComplete: (preferences: UserPreferences) => void
}

export function SetupFlow({ onComplete }: SetupFlowProps) {
  const [step, setStep] = useState(0)
  const [arrivalDate, setArrivalDate] = useState("")
  const [departureDate, setDepartureDate] = useState("")
  const [hotelLocation, setHotelLocation] = useState("")
  const [groupType, setGroupType] = useState("")
  const [groupSize, setGroupSize] = useState("")
  const [childrenCount, setChildrenCount] = useState("")
  const [selectedPace, setSelectedPace] = useState("")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [selectedArtPreferences, setSelectedArtPreferences] = useState<string[]>([])

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

  const toggleArtPreference = (id: string) => {
    setSelectedArtPreferences((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleGenerate = () => {
    onComplete({
      arrivalDate,
      departureDate,
      hotelLocation,
      groupType,
      groupSize,
      childrenCount,
      selectedPace,
      selectedInterests,
      selectedExtras,
      selectedArtPreferences,
    })
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
              <StepIndicator currentStep={step} totalSteps={4} />
            </div>

            <div className="transition-all duration-300">
              {step === 0 && (
                <StepLayoverDetails
                  arrivalDate={arrivalDate}
                  departureDate={departureDate}
                  hotelLocation={hotelLocation}
                  onArrivalChange={setArrivalDate}
                  onDepartureChange={setDepartureDate}
                  onHotelChange={setHotelLocation}
                  onNext={() => setStep(1)}
                />
              )}
              {step === 1 && (
                <StepGroupDetails
                  groupType={groupType}
                  groupSize={groupSize}
                  childrenCount={childrenCount}
                  onGroupTypeChange={setGroupType}
                  onGroupSizeChange={setGroupSize}
                  onChildrenCountChange={setChildrenCount}
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
                  selectedArtPreferences={selectedArtPreferences}
                  onInterestToggle={toggleInterest}
                  onExtraToggle={toggleExtra}
                  onArtPreferenceToggle={toggleArtPreference}
                  onGenerate={handleGenerate}
                  onBack={() => setStep(2)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
