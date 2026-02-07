"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Experience } from "@/lib/mock-data"
import {
  Clock,
  Ticket,
  Footprints,
  Home,
  Sun,
  Lightbulb,
  RefreshCw,
} from "lucide-react"
import Image from "next/image"

interface ExperienceModalProps {
  experience: Experience | null
  onClose: () => void
}

export function ExperienceModal({
  experience,
  onClose,
}: ExperienceModalProps) {
  if (!experience) return null

  return (
    <Drawer open={!!experience} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <div className="overflow-y-auto">
          {/* Image */}
          <div className="relative h-56 w-full sm:h-72">
            <Image
              src={experience.image || "/placeholder.svg"}
              alt={experience.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-foreground/10" />
          </div>

          <DrawerHeader className="px-6 pb-0 pt-5">
            <DrawerTitle className="font-serif text-2xl text-foreground">
              {experience.name}
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              Details about {experience.name}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-5 px-6 pb-6 pt-3">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {experience.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {experience.duration}
              </span>
              <span className="flex items-center gap-1.5">
                {experience.indoor ? (
                  <Home className="h-3.5 w-3.5" />
                ) : (
                  <Sun className="h-3.5 w-3.5" />
                )}
                {experience.indoor ? "Indoor" : "Outdoor"}
              </span>
              {experience.ticketRequired && (
                <span className="flex items-center gap-1.5">
                  <Ticket className="h-3.5 w-3.5" />
                  Ticket required
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Footprints className="h-3.5 w-3.5" />
                {experience.walkingDistance}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-foreground">
              {experience.description}
            </p>

            {/* Why chosen */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  Why we chose this for you
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {experience.whyChosen}
              </p>
            </div>

            {/* Tips */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tips
              </h4>
              <ul className="flex flex-col gap-1.5">
                {experience.tips.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-xs leading-relaxed text-foreground"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <DrawerFooter className="border-t border-border px-6">
            <Button
              variant="outline"
              className="h-11 w-full gap-2 rounded-lg text-sm bg-transparent"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Replace this experience
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
