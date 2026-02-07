import React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans, DM_Serif_Display } from "next/font/google"

import "./globals.css"

const _dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" })
const _dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "Saadiyat Layover Planner",
  description:
    "Plan your perfect Saadiyat Island layover experience. Curated itineraries for Etihad transit passengers.",
}

export const viewport: Viewport = {
  themeColor: "#C4A265",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_dmSans.variable} ${_dmSerif.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
