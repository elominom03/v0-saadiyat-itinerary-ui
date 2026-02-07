"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { paceOptions } from "@/lib/mock-data"
import { Leaf, Scale, Zap } from "lucide-react"

const iconMap = {
  leaf: Leaf,
  scale: Scale,
  zap: Zap,
}

interface PaceSelectionProps {
  selectedPace: string
  onPaceChange: (pace: string) => void
  onNext: () => void
  onBack: () => void
}

export function StepPaceSelection({
  selectedPace,
  onPaceChange,
  onNext,
  onBack,
}: PaceSelectionProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
          Choose your pace
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          How would you like to experience Saadiyat? We will adjust the number
          of stops and free time accordingly.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {paceOptions.map((option) => {
          const Icon = iconMap[option.icon]
          const isSelected = selectedPace === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onPaceChange(option.id)}
              className={cn(
                "flex items-center gap-4 rounded-xl border-2 p-5 text-left transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-semibold text-foreground">
                  {option.label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {option.description}
                </span>
              </div>
            </button>
          )
        })}
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
          onClick={onNext}
          disabled={!selectedPace}
          className="h-12 flex-1 rounded-lg bg-primary text-base font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
