"use client"

import type { Experience } from "@/lib/mock-data"
import {
  Clock,
  Footprints,
  MapPin,
} from "lucide-react"

interface MapViewProps {
  experiences: Experience[]
}

export function MapView({ experiences }: MapViewProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Map placeholder */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-secondary">
        <div className="relative h-72 w-full sm:h-96">
          {/* Stylized map background */}
          <svg
            viewBox="0 0 800 400"
            className="h-full w-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Water */}
            <rect width="800" height="400" fill="hsl(200, 30%, 88%)" />
            {/* Island shape */}
            <path
              d="M150,180 Q200,120 350,140 Q500,100 600,150 Q700,180 680,250 Q650,320 500,310 Q350,340 250,300 Q150,270 150,180Z"
              fill="hsl(40, 25%, 92%)"
              stroke="hsl(33, 15%, 82%)"
              strokeWidth="1.5"
            />
            {/* Roads */}
            <path
              d="M200,200 Q300,190 400,200 Q500,210 600,200"
              fill="none"
              stroke="hsl(33, 10%, 75%)"
              strokeWidth="2"
              strokeDasharray="6,4"
            />
            <path
              d="M350,150 Q360,200 370,280"
              fill="none"
              stroke="hsl(33, 10%, 75%)"
              strokeWidth="2"
              strokeDasharray="6,4"
            />

            {/* Experience markers */}
            {experiences.map((exp, index) => {
              // Map positions along the island shape
              const positions = [
                { x: 280, y: 190 },
                { x: 380, y: 175 },
                { x: 490, y: 195 },
                { x: 580, y: 210 },
              ]
              const pos = positions[index] || {
                x: 350 + index * 60,
                y: 200,
              }

              return (
                <g key={exp.id}>
                  {/* Connection lines */}
                  {index > 0 && (
                    <line
                      x1={
                        (positions[index - 1] || { x: 0 }).x
                      }
                      y1={
                        (positions[index - 1] || { y: 0 }).y
                      }
                      x2={pos.x}
                      y2={pos.y}
                      stroke="hsl(38, 45%, 58%)"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      opacity="0.6"
                    />
                  )}
                  {/* Marker */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="16"
                    fill="hsl(38, 45%, 58%)"
                    stroke="white"
                    strokeWidth="3"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {index + 1}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Map label */}
          <div className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
            <MapPin className="mr-1 inline-block h-3 w-3" />
            Saadiyat Island
          </div>
        </div>
      </div>

      {/* Route list */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Route for today
        </h3>
        {experiences.map((exp, index) => (
          <div key={exp.id} className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {index + 1}
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium text-foreground">
                {exp.name}
              </span>
              <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {exp.timeRange}
              </span>
            </div>
            {index < experiences.length - 1 && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Footprints className="h-3 w-3" />
                <span>~8 min</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
