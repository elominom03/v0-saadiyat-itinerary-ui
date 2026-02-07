"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface LayoverDetailsProps {
  arrivalDate: string
  departureDate: string
  hotelLocation: string
  onArrivalChange: (val: string) => void
  onDepartureChange: (val: string) => void
  onHotelChange: (val: string) => void
  onNext: () => void
}

export function StepLayoverDetails({
  arrivalDate,
  departureDate,
  hotelLocation,
  onArrivalChange,
  onDepartureChange,
  onHotelChange,
  onNext,
}: LayoverDetailsProps) {
  const isValid = arrivalDate && departureDate && hotelLocation

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
          When are you visiting?
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Tell us about your layover so we can design the perfect itinerary
          around your time.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="arrival"
            className="text-sm font-medium text-foreground"
          >
            Arrival date & time
          </Label>
          <input
            id="arrival"
            type="datetime-local"
            value={arrivalDate}
            onChange={(e) => onArrivalChange(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="departure"
            className="text-sm font-medium text-foreground"
          >
            Departure date & time
          </Label>
          <input
            id="departure"
            type="datetime-local"
            value={departureDate}
            onChange={(e) => onDepartureChange(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-foreground">
            Hotel location
          </Label>
          <Select value={hotelLocation} onValueChange={onHotelChange}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select your hotel area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="airport">Near the Airport</SelectItem>
              <SelectItem value="saadiyat">On Saadiyat Island</SelectItem>
              <SelectItem value="city">Abu Dhabi City</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={onNext}
        disabled={!isValid}
        className="h-12 w-full rounded-lg bg-primary text-base font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40"
      >
        Plan My Saadiyat Stay
      </Button>
    </div>
  )
}
