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
import { cn } from "@/lib/utils"
import { User, Users, Baby, UserPlus } from "lucide-react"

const groupTypes = [
  { id: "solo", label: "Solo", icon: "user", description: "Just me" },
  { id: "couple", label: "Couple", icon: "users", description: "Two of us" },
  {
    id: "family",
    label: "Family",
    icon: "baby",
    description: "With children",
  },
  {
    id: "friends",
    label: "Friends",
    icon: "userplus",
    description: "Group trip",
  },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  user: User,
  users: Users,
  baby: Baby,
  userplus: UserPlus,
}

interface GroupDetailsProps {
  groupType: string
  groupSize: string
  childrenCount: string
  onGroupTypeChange: (val: string) => void
  onGroupSizeChange: (val: string) => void
  onChildrenCountChange: (val: string) => void
  onNext: () => void
  onBack: () => void
}

export function StepGroupDetails({
  groupType,
  groupSize,
  childrenCount,
  onGroupTypeChange,
  onGroupSizeChange,
  onChildrenCountChange,
  onNext,
  onBack,
}: GroupDetailsProps) {
  const isValid = groupType && groupSize

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
          Who is joining you?
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We will tailor activities, dining, and pace for your group.
        </p>
      </div>

      {/* Group type */}
      <div className="grid grid-cols-2 gap-3">
        {groupTypes.map((option) => {
          const isSelected = groupType === option.id
          const Icon = iconMap[option.icon]
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onGroupTypeChange(option.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-200",
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
              <div className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {option.label}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {option.description}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Group size */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-foreground">
          Total number of people
        </Label>
        <Select value={groupSize} onValueChange={onGroupSizeChange}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select group size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 person</SelectItem>
            <SelectItem value="2">2 people</SelectItem>
            <SelectItem value="3">3 people</SelectItem>
            <SelectItem value="4">4 people</SelectItem>
            <SelectItem value="5">5 people</SelectItem>
            <SelectItem value="6">6 people</SelectItem>
            <SelectItem value="7-10">7 - 10 people</SelectItem>
            <SelectItem value="10+">10+ people</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Children count (only for family) */}
      {groupType === "family" && (
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-foreground">
            Number of children (under 12)
          </Label>
          <Select value={childrenCount} onValueChange={onChildrenCountChange}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select number of children" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 child</SelectItem>
              <SelectItem value="2">2 children</SelectItem>
              <SelectItem value="3">3 children</SelectItem>
              <SelectItem value="4+">4+ children</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

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
          disabled={!isValid}
          className="h-12 flex-1 rounded-lg bg-primary text-base font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
