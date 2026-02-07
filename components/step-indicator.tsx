"use client"

import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

const stepLabels = ["Layover Details", "Your Pace", "Interests"]

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
                i < currentStep
                  ? "bg-primary text-primary-foreground"
                  : i === currentStep
                    ? "border-2 border-primary bg-background text-foreground"
                    : "border border-border bg-background text-muted-foreground"
              )}
            >
              {i < currentStep ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5 3.5L5.5 10.5L2.5 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={cn(
                "hidden text-sm font-medium sm:block",
                i <= currentStep
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {stepLabels[i]}
            </span>
          </div>
          {i < totalSteps - 1 && (
            <div
              className={cn(
                "h-px w-8 transition-colors duration-300 sm:w-12",
                i < currentStep ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
