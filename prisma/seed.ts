import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db"
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database with Saadiyat Island attractions...")

  // Clear existing data
  await prisma.itinerary.deleteMany()
  await prisma.attraction.deleteMany()
  await prisma.userSession.deleteMany()

  // Seed attractions
  const attractions = [
    {
      id: "louvre-abu-dhabi",
      name: "Louvre Abu Dhabi",
      category: "museum",
      themes: JSON.stringify(["art", "architecture", "universal museum", "modern art", "ancient civilizations"]),
      indoorOutdoor: "indoor",
      locationCluster: "cultural-district-west",
      avgDuration: 150, // 2.5 hours
      crowdLevel: "high",
      heatSensitivity: "low",
      description: "Explore the universal museum designed by Jean Nouvel, featuring a stunning dome that creates a 'rain of light' effect. The collection spans civilizations and cultures from prehistory to contemporary works.",
      shortDescription: "Universal museum by Jean Nouvel with a breathtaking rain of light dome.",
      ticketRequired: true,
      walkingDistance: "5 min from drop-off",
      image: "/images/louvre.jpg",
      tips: JSON.stringify([
        "Visit early morning for fewer crowds",
        "Smart casual dress code recommended",
        "Photography allowed without flash",
        "Audio guide available in multiple languages"
      ]),
      lat: 24.5338,
      lng: 54.3983,
      openingHours: "10:00 AM - 6:30 PM (Thu-Sun until 8:30 PM)",
      openingDays: "Tue-Sun (Closed Monday)",
      ticketPrice: "AED 63 (Adults), AED 31.50 (13-22 years), Free (under 13)",
      website: "https://www.louvreabudhabi.ae",
      phone: "+971 600 56 5566",
      googleRating: 4.7,
      googleReviews: 45231,
      kidFriendly: true
    },
    {
      id: "manarat-al-saadiyat",
      name: "Manarat Al Saadiyat",
      category: "gallery",
      themes: JSON.stringify(["contemporary art", "culture", "exhibitions", "local art"]),
      indoorOutdoor: "indoor",
      locationCluster: "cultural-district-east",
      avgDuration: 90,
      crowdLevel: "medium",
      heatSensitivity: "low",
      description: "A vibrant arts and culture center hosting rotating exhibitions, workshops, and community events. The gallery spaces showcase contemporary art from the UAE and around the world.",
      shortDescription: "Contemporary arts center with rotating exhibitions and cultural events.",
      ticketRequired: false,
      walkingDistance: "10 min walk",
      image: "/images/manarat.jpg",
      tips: JSON.stringify([
        "Check current exhibitions online before visiting",
        "Gift shop has unique local art pieces",
        "Cafe on-site for a light break"
      ]),
      lat: 24.5401,
      lng: 54.4108,
      openingHours: "9:00 AM - 8:00 PM",
      openingDays: "Daily",
      ticketPrice: "Free",
      website: "https://www.manarat.ae",
      phone: "+971 2 657 5800",
      googleRating: 4.5,
      googleReviews: 3420,
      kidFriendly: true
    },
    {
      id: "saadiyat-beach",
      name: "Saadiyat Beach",
      category: "beach",
      themes: JSON.stringify(["nature", "relaxation", "beach", "outdoor", "wildlife"]),
      indoorOutdoor: "outdoor",
      locationCluster: "beach-zone",
      avgDuration: 120,
      crowdLevel: "medium",
      heatSensitivity: "high",
      description: "A pristine stretch of white sand beach along the Arabian Gulf. The naturally preserved coastline is a protected habitat for hawksbill turtles and offers crystal-clear waters.",
      shortDescription: "Pristine white sand beach with crystal-clear waters on the Arabian Gulf.",
      ticketRequired: false,
      walkingDistance: "3 min from resort area",
      image: "/images/beach.jpg",
      tips: JSON.stringify([
        "Sunscreen is essential year-round",
        "Beach access through Saadiyat Beach Club",
        "Turtle nesting season is March to July",
        "Sunset views are spectacular"
      ]),
      lat: 24.5469,
      lng: 54.4342,
      openingHours: "8:00 AM - Sunset",
      openingDays: "Daily",
      ticketPrice: "Free (public access)",
      website: "https://www.saadiyat.ae/beaches",
      phone: null,
      googleRating: 4.6,
      googleReviews: 8945,
      kidFriendly: true
    },
    {
      id: "fouquet-abu-dhabi",
      name: "Fouquet's Abu Dhabi",
      category: "restaurant",
      themes: JSON.stringify(["food", "french cuisine", "fine dining", "premium"]),
      indoorOutdoor: "indoor",
      locationCluster: "cultural-district-west",
      avgDuration: 90,
      crowdLevel: "medium",
      heatSensitivity: "low",
      description: "An elegant French brasserie located at the Louvre Abu Dhabi offering refined dining with views of the museum's architecture. Enjoy classic French cuisine with an Arabian twist.",
      shortDescription: "Refined French brasserie with stunning museum-side views.",
      ticketRequired: false,
      walkingDistance: "2 min from Louvre",
      image: "/images/fouquets.jpg",
      tips: JSON.stringify([
        "Reservations recommended for lunch",
        "Try the signature Abu Dhabi brunch on weekends",
        "Terrace seating has the best views"
      ]),
      lat: 24.534,
      lng: 54.399,
      openingHours: "12:00 PM - 11:00 PM",
      openingDays: "Daily",
      ticketPrice: "AED 150-300 per person",
      website: "https://www.louvreabudhabi.ae/fouquets",
      phone: "+971 2 205 4200",
      googleRating: 4.4,
      googleReviews: 2156,
      kidFriendly: true
    },
    {
      id: "abrahamic-family-house",
      name: "Abrahamic Family House",
      category: "spiritual",
      themes: JSON.stringify(["spiritual", "architecture", "interfaith", "culture", "reflection"]),
      indoorOutdoor: "indoor",
      locationCluster: "cultural-district-south",
      avgDuration: 90,
      crowdLevel: "low",
      heatSensitivity: "low",
      description: "A landmark complex comprising a mosque, church, and synagogue, symbolizing coexistence and dialogue among the three Abrahamic faiths. Designed by Sir David Adjaye.",
      shortDescription: "Iconic interfaith complex by Sir David Adjaye symbolizing coexistence.",
      ticketRequired: true,
      walkingDistance: "8 min from hotel",
      image: "/images/abrahamic.jpg",
      tips: JSON.stringify([
        "Modest dress required for all three houses of worship",
        "Guided tours available",
        "Morning light is best for photography",
        "Allow time for quiet reflection"
      ]),
      lat: 24.5182,
      lng: 54.4063,
      openingHours: "9:00 AM - 6:00 PM",
      openingDays: "Daily",
      ticketPrice: "Free",
      website: "https://abrahamicfamilyhouse.ae",
      phone: "+971 2 657 0000",
      googleRating: 4.9,
      googleReviews: 6732,
      kidFriendly: true
    },
    {
      id: "saadiyat-grove",
      name: "The Collection at Saadiyat Grove",
      category: "shopping",
      themes: JSON.stringify(["shopping", "food", "cafes", "lifestyle", "artisan"]),
      indoorOutdoor: "outdoor",
      locationCluster: "grove-district",
      avgDuration: 90,
      crowdLevel: "low",
      heatSensitivity: "medium",
      description: "A contemporary lifestyle destination featuring boutique shopping, artisan cafes, and creative retail experiences set within Saadiyat Island's cultural district.",
      shortDescription: "Boutique shopping and artisan cafes in the cultural district.",
      ticketRequired: false,
      walkingDistance: "5 min from beach area",
      image: "/images/grove.jpg",
      tips: JSON.stringify([
        "Many shops accept international credit cards",
        "Look for local artisan products as souvenirs",
        "Several cafes offer vegan and gluten-free options"
      ]),
      lat: 24.538,
      lng: 54.421,
      openingHours: "10:00 AM - 10:00 PM",
      openingDays: "Daily",
      ticketPrice: "Free entry (shopping prices vary)",
      website: "https://www.saadiyat.ae/grove",
      phone: "+971 2 886 5555",
      googleRating: 4.3,
      googleReviews: 1876,
      kidFriendly: true
    },
    {
      id: "teamlab-phenomena",
      name: "teamLab Phenomena Abu Dhabi",
      category: "museum",
      themes: JSON.stringify(["digital art", "immersive", "modern art", "technology", "interactive"]),
      indoorOutdoor: "indoor",
      locationCluster: "cultural-district-west",
      avgDuration: 120,
      crowdLevel: "high",
      heatSensitivity: "low",
      description: "An immersive digital art museum by the renowned Japanese art collective teamLab, offering a transcendent experience where visitors become part of the artwork in vast, borderless spaces.",
      shortDescription: "Immersive digital art museum by the Japanese collective teamLab.",
      ticketRequired: true,
      walkingDistance: "6 min from Louvre",
      image: "/images/teamlab.jpg",
      tips: JSON.stringify([
        "Wear comfortable shoes for walking through installations",
        "Allow at least 2 hours for the full experience",
        "Photography and video encouraged",
        "Some rooms are dark; take care with young children"
      ]),
      lat: 24.536,
      lng: 54.401,
      openingHours: "10:00 AM - 10:00 PM",
      openingDays: "Daily",
      ticketPrice: "AED 150 (Adults), AED 105 (Children 3-11)",
      website: "https://www.teamlab.art/e/phenomena-abudhabi",
      phone: "+971 2 910 8222",
      googleRating: 4.8,
      googleReviews: 12453,
      kidFriendly: true
    },
    {
      id: "natural-history-museum",
      name: "Natural History Museum Abu Dhabi",
      category: "museum",
      themes: JSON.stringify(["natural history", "science", "dinosaurs", "education", "interactive"]),
      indoorOutdoor: "indoor",
      locationCluster: "cultural-district-east",
      avgDuration: 120,
      crowdLevel: "medium",
      heatSensitivity: "low",
      description: "Discover 13.8 billion years of history through interactive exhibits, rare specimens, and cutting-edge technology. Home to 'Stan,' one of the most complete T. Rex fossils ever found.",
      shortDescription: "Explore 13.8 billion years of history with rare specimens and 'Stan' the T. Rex.",
      ticketRequired: true,
      walkingDistance: "7 min from Louvre",
      image: "/images/natural-history.jpg",
      tips: JSON.stringify([
        "Don't miss the Stan the T. Rex exhibit",
        "Interactive displays are great for all ages",
        "The gift shop has unique fossil replicas"
      ]),
      lat: 24.535,
      lng: 54.403,
      openingHours: "10:00 AM - 7:00 PM",
      openingDays: "Daily",
      ticketPrice: "AED 75 (Adults), AED 30 (Children 4-15)",
      website: "https://nhmad.ae",
      phone: "+971 600 56 6423",
      googleRating: 4.8,
      googleReviews: 9876,
      kidFriendly: true
    },
    {
      id: "saadiyat-public-beach",
      name: "Saadiyat Public Beach",
      category: "beach",
      themes: JSON.stringify(["nature", "relaxation", "beach", "outdoor", "free"]),
      indoorOutdoor: "outdoor",
      locationCluster: "beach-zone",
      avgDuration: 150,
      crowdLevel: "low",
      heatSensitivity: "high",
      description: "A public access beach offering the same pristine white sands as the private beaches, with basic facilities and stunning views of the Arabian Gulf.",
      shortDescription: "Free public beach with pristine white sand and basic facilities.",
      ticketRequired: false,
      walkingDistance: "10 min from resort area",
      image: "/images/beach.jpg",
      tips: JSON.stringify([
        "Best visited early morning or late afternoon to avoid heat",
        "Bring your own towels and umbrella",
        "Limited food options nearby",
        "Free parking available"
      ]),
      lat: 24.5445,
      lng: 54.4371,
      openingHours: "8:00 AM - 8:00 PM",
      openingDays: "Daily",
      ticketPrice: "Free",
      website: "https://www.dmt.gov.ae/beaches",
      phone: null,
      googleRating: 4.5,
      googleReviews: 5432,
      kidFriendly: true
    },
    {
      id: "soul-beach",
      name: "Soul Beach",
      category: "beach-club",
      themes: JSON.stringify(["beach", "food", "relaxation", "premium", "social"]),
      indoorOutdoor: "outdoor",
      locationCluster: "beach-zone",
      avgDuration: 180,
      crowdLevel: "medium",
      heatSensitivity: "medium",
      description: "A stylish beach club offering sunbeds, pool access, and Mediterranean-inspired cuisine. Perfect for a relaxing afternoon with views of the Gulf.",
      shortDescription: "Stylish beach club with pool, dining, and Gulf views.",
      ticketRequired: true,
      walkingDistance: "5 min from resort area",
      image: "/images/beach.jpg",
      tips: JSON.stringify([
        "Minimum spend required for sunbeds",
        "Reservations recommended on weekends",
        "Live DJ sessions in the evening",
        "Kids welcome during day hours"
      ]),
      lat: 24.5451,
      lng: 54.4355,
      openingHours: "10:00 AM - 8:00 PM",
      openingDays: "Daily",
      ticketPrice: "AED 100 minimum spend (weekdays), AED 200 (weekends)",
      website: "https://www.soulbeach.ae",
      phone: "+971 2 656 3500",
      googleRating: 4.2,
      googleReviews: 3289,
      kidFriendly: true
    },
    {
      id: "mamsha-al-saadiyat",
      name: "Mamsha Al Saadiyat",
      category: "promenade",
      themes: JSON.stringify(["walking", "cafes", "food", "outdoor", "family"]),
      indoorOutdoor: "outdoor",
      locationCluster: "beach-zone",
      avgDuration: 60,
      crowdLevel: "low",
      heatSensitivity: "medium",
      description: "A beachfront promenade lined with cafes, restaurants, and boutique shops. Perfect for a leisurely stroll with views of the beach and sunset.",
      shortDescription: "Beachfront promenade with dining and shopping options.",
      ticketRequired: false,
      walkingDistance: "Direct beach access",
      image: "/images/grove.jpg",
      tips: JSON.stringify([
        "Best for evening walks when cooler",
        "Multiple dining options from casual to fine dining",
        "Bike rentals available",
        "Wheelchair accessible"
      ]),
      lat: 24.5428,
      lng: 54.4323,
      openingHours: "Open 24/7 (shops/restaurants vary)",
      openingDays: "Daily",
      ticketPrice: "Free (individual venues vary)",
      website: "https://www.mamsha-alsaadiyat.com",
      phone: "+971 2 558 8000",
      googleRating: 4.4,
      googleReviews: 4521,
      kidFriendly: true
    },
    {
      id: "saadiyat-rotana",
      name: "Saadiyat Rotana Resort & Villas",
      category: "hotel-dining",
      themes: JSON.stringify(["food", "spa", "relaxation", "premium", "resort"]),
      indoorOutdoor: "indoor",
      locationCluster: "beach-zone",
      avgDuration: 120,
      crowdLevel: "low",
      heatSensitivity: "low",
      description: "A luxury resort offering multiple dining venues, spa services, and beach access. Non-guests can book spa treatments or dining experiences.",
      shortDescription: "Luxury resort with multiple dining and spa options.",
      ticketRequired: false,
      walkingDistance: "Beach resort area",
      image: "/images/grove.jpg",
      tips: JSON.stringify([
        "Saffron restaurant offers excellent Southeast Asian cuisine",
        "Spa reservations required in advance",
        "Day passes available for beach and pool access",
        "Multiple vegetarian and vegan options"
      ]),
      lat: 24.5419,
      lng: 54.4301,
      openingHours: "Varies by venue (dining 7:00 AM - 11:00 PM)",
      openingDays: "Daily",
      ticketPrice: "Dining AED 80-250 per person, Day pass AED 200",
      website: "https://www.rotana.com/saadiyatrotanaresort",
      phone: "+971 2 697 0000",
      googleRating: 4.6,
      googleReviews: 7654,
      kidFriendly: true
    }
  ]

  console.log(`Creating ${attractions.length} attractions...`)
  
  for (const attraction of attractions) {
    await prisma.attraction.create({ data: attraction })
  }

  console.log("✅ Database seeded successfully!")
  console.log(`   - ${attractions.length} attractions created`)
  console.log(`   - Ready to generate itineraries!`)
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
