"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { interestOptions, extraOptions } from "@/lib/mock-data"
import {
  Palette,
  Building2,
  UtensilsCrossed,
  TreePalm,
  Heart,
  ShoppingBag,
} from "lucide-react"

const interestIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  art: Palette,
  architecture: Building2,
  food: UtensilsCrossed,
  nature: TreePalm,
  spiritual: Heart,
  shopping: ShoppingBag,
}

interface InterestsProps {
  selectedInterests: string[]
  selectedExtras: string[]
  onInterestToggle: (id: string) => void
  onExtraToggle: (id: string) => void
  onGenerate: () => void
  onBack: () => void
}

export function StepInterests({
  selectedInterests,
  selectedExtras,
  onInterestToggle,
  onExtraToggle,
  onGenerate,
  onBack,
}: InterestsProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
          What interests you?
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Select as many as you like. We will prioritize experiences that match
          your preferences.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {interestOptions.map((option) => {
          const isSelected = selectedInterests.includes(option.id)
          const Icon = interestIcons[option.id]
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onInterestToggle(option.id)}
              className={cn(
                "flex flex-col items-center gap-2.5 rounded-xl border-2 p-4 text-center transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {Icon && <Icon className="h-5 w-5" />}
              </div>
              <span
                className={cn(
                  "text-xs font-medium leading-tight",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {option.label}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Optional preferences
        </p>
        <div className="flex flex-wrap gap-2">
          {extraOptions.map((option) => {
            const isSelected = selectedExtras.includes(option.id)
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onExtraToggle(option.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30"
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-12 flex-1 rounded-lg text-base bg-transparent"
        >
          Back
        </Button>
        <Button
          onClick={onGenerate}
          disabled={selectedInterests.length === 0}
          className="h-12 flex-1 rounded-lg bg-primary text-base font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40"
        >
          Generate My Itinerary
        </Button>
      </div>
    </div>
  )
}
