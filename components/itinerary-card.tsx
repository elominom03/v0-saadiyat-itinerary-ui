"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Experience } from "@/lib/mock-data"
import {
  Clock,
  Ticket,
  Footprints,
  Home,
  Sun,
} from "lucide-react"
import Image from "next/image"

interface ItineraryCardProps {
  experience: Experience
  onClick: () => void
}

export function ItineraryCard({ experience, onClick }: ItineraryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-all duration-200 hover:border-primary/30 hover:shadow-md"
    >
      <div className="relative h-36 w-full overflow-hidden sm:h-44">
        <Image
          src={experience.image || "/placeholder.svg"}
          alt={experience.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-foreground/10" />
        {experience.timeRange && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {experience.timeRange}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-serif text-lg font-medium leading-tight text-foreground">
            {experience.name || "Attraction"}
          </h3>
          {experience.shortDescription && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {experience.shortDescription}
            </p>
          )}
        </div>

        {experience.tags && experience.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {experience.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
          {experience.indoor !== undefined && (
            <span className="flex items-center gap-1">
              {experience.indoor ? (
                <Home className="h-3 w-3" />
              ) : (
                <Sun className="h-3 w-3" />
              )}
              {experience.indoor ? "Indoor" : "Outdoor"}
            </span>
          )}
          {experience.ticketRequired && (
            <span className="flex items-center gap-1">
              <Ticket className="h-3 w-3" />
              Ticket required
            </span>
          )}
          {experience.walkingDistance && (
            <span className="flex items-center gap-1">
              <Footprints className="h-3 w-3" />
              {experience.walkingDistance}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
