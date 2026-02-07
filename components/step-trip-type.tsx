"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Users, User } from "lucide-react"
import { useState } from "react"

export interface FamilyMember {
  id: string
  age: number
  type: "adult" | "child"
}

interface StepTripTypeProps {
  tripType: "solo" | "family"
  familyMembers: FamilyMember[]
  onTripTypeChange: (type: "solo" | "family") => void
  onFamilyMembersChange: (members: FamilyMember[]) => void
  onNext: () => void
}

export function StepTripType({
  tripType,
  familyMembers,
  onTripTypeChange,
  onFamilyMembersChange,
  onNext
}: StepTripTypeProps) {
  const [newMemberAge, setNewMemberAge] = useState("")

  const addFamilyMember = (type: "adult" | "child") => {
    const age = type === "adult" ? 30 : parseInt(newMemberAge) || 5
    const member: FamilyMember = {
      id: `${Date.now()}-${Math.random()}`,
      age,
      type
    }
    onFamilyMembersChange([...familyMembers, member])
    setNewMemberAge("")
  }

  const removeFamilyMember = (id: string) => {
    onFamilyMembersChange(familyMembers.filter(m => m.id !== id))
  }

  const canProceed = tripType === "solo" || familyMembers.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-foreground">
          Who's traveling?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Help us tailor your itinerary to your group
        </p>
      </div>

      {/* Trip Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Trip Type</Label>
        <RadioGroup value={tripType} onValueChange={(value) => onTripTypeChange(value as "solo" | "family")}>
          <div className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:border-primary transition-colors">
            <RadioGroupItem value="solo" id="solo" />
            <Label htmlFor="solo" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Solo Traveler</div>
                  <div className="text-xs text-muted-foreground">Just me, maximum flexibility</div>
                </div>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:border-primary transition-colors">
            <RadioGroupItem value="family" id="family" />
            <Label htmlFor="family" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Family Trip</div>
                  <div className="text-xs text-muted-foreground">Traveling with family members</div>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Family Members (shown only if family selected) */}
      {tripType === "family" && (
        <div className="space-y-4 rounded-lg border border-border bg-card p-4">
          <Label className="text-sm font-medium">Family Members</Label>
          
          {/* Current family members */}
          {familyMembers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {familyMembers.map((member) => (
                <Badge key={member.id} variant="secondary" className="gap-2 py-1.5 px-3">
                  {member.type === "adult" ? "👤" : "👶"} {member.type === "adult" ? "Adult" : `Child (${member.age}y)`}
                  <button
                    type="button"
                    onClick={() => removeFamilyMember(member.id)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Add family member */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addFamilyMember("adult")}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Adult
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addFamilyMember("child")}
                className="flex-1"
                disabled={!newMemberAge}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Child
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Child's age (0-17)"
                value={newMemberAge}
                onChange={(e) => setNewMemberAge(e.target.value)}
                min="0"
                max="17"
                className="text-sm"
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">years old</span>
            </div>

            {familyMembers.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Add at least one family member to continue
              </p>
            )}
          </div>

          {/* Family composition summary */}
          {familyMembers.length > 0 && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Your group:</strong>{" "}
                {familyMembers.filter(m => m.type === "adult").length} adult(s), {" "}
                {familyMembers.filter(m => m.type === "child").length} child(ren)
                {familyMembers.some(m => m.type === "child" && m.age < 6) && (
                  <span className="block mt-1">
                    ℹ️ We'll add extra time for young children
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Next button */}
      <Button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full"
      >
        Next
      </Button>
    </div>
  )
}
