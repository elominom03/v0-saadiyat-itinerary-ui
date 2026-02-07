export interface Experience {
  id: string
  name: string
  description: string
  shortDescription: string
  duration: string
  timeRange: string
  tags: string[]
  indoor: boolean
  ticketRequired: boolean
  walkingDistance: string
  image: string
  whyChosen: string
  tips: string[]
  lat: number
  lng: number
}

export interface DayItinerary {
  day: number
  date: string
  experiences: Experience[]
}

export const mockExperiences: Experience[] = [
  {
    id: "louvre-abu-dhabi",
    name: "Louvre Abu Dhabi",
    description:
      "Explore the universal museum designed by Jean Nouvel, featuring a stunning dome that creates a 'rain of light' effect. The collection spans civilizations and cultures from prehistory to contemporary works.",
    shortDescription:
      "Universal museum by Jean Nouvel with a breathtaking rain of light dome.",
    duration: "2.5 hrs",
    timeRange: "10:00 - 12:30",
    tags: ["Art", "Indoor", "Architecture"],
    indoor: true,
    ticketRequired: true,
    walkingDistance: "5 min from drop-off",
    image: "/images/louvre.jpg",
    whyChosen:
      "Based on your interest in art and architecture, the Louvre Abu Dhabi is a must-see landmark of Saadiyat Island.",
    tips: [
      "Visit early morning for fewer crowds",
      "Smart casual dress code recommended",
      "Photography allowed without flash",
      "Audio guide available in multiple languages",
    ],
    lat: 24.5338,
    lng: 54.3983,
  },
  {
    id: "manarat-al-saadiyat",
    name: "Manarat Al Saadiyat",
    description:
      "A vibrant arts and culture center hosting rotating exhibitions, workshops, and community events. The gallery spaces showcase contemporary art from the UAE and around the world.",
    shortDescription:
      "Contemporary arts center with rotating exhibitions and cultural events.",
    duration: "1.5 hrs",
    timeRange: "13:30 - 15:00",
    tags: ["Art", "Indoor", "Culture"],
    indoor: true,
    ticketRequired: false,
    walkingDistance: "10 min walk",
    image: "/images/manarat.jpg",
    whyChosen:
      "A relaxed gallery experience that complements the Louvre visit, perfect for your balanced pace.",
    tips: [
      "Check current exhibitions online before visiting",
      "Gift shop has unique local art pieces",
      "Cafe on-site for a light break",
    ],
    lat: 24.5401,
    lng: 54.4108,
  },
  {
    id: "saadiyat-beach",
    name: "Saadiyat Beach",
    description:
      "A pristine stretch of white sand beach along the Arabian Gulf. The naturally preserved coastline is a protected habitat for hawksbill turtles and offers crystal-clear waters.",
    shortDescription:
      "Pristine white sand beach with crystal-clear waters on the Arabian Gulf.",
    duration: "2 hrs",
    timeRange: "15:30 - 17:30",
    tags: ["Nature", "Outdoor", "Relaxed"],
    indoor: false,
    ticketRequired: false,
    walkingDistance: "3 min from resort area",
    image: "/images/beach.jpg",
    whyChosen:
      "A refreshing outdoor break to balance your museum visits, matching your interest in nature and beach time.",
    tips: [
      "Sunscreen is essential year-round",
      "Beach access through Saadiyat Beach Club",
      "Turtle nesting season is March to July",
      "Sunset views are spectacular",
    ],
    lat: 24.5469,
    lng: 54.4342,
  },
  {
    id: "fouquet-abu-dhabi",
    name: "Fouquet's Abu Dhabi",
    description:
      "An elegant French brasserie located at the Louvre Abu Dhabi offering refined dining with views of the museum's architecture. Enjoy classic French cuisine with an Arabian twist.",
    shortDescription:
      "Refined French brasserie with stunning museum-side views.",
    duration: "1.5 hrs",
    timeRange: "12:30 - 14:00",
    tags: ["Food", "Indoor", "Premium"],
    indoor: true,
    ticketRequired: false,
    walkingDistance: "2 min from Louvre",
    image: "/images/fouquets.jpg",
    whyChosen:
      "A premium dining experience steps from the Louvre, perfect for your interest in food and cafes.",
    tips: [
      "Reservations recommended for lunch",
      "Try the signature Abu Dhabi brunch on weekends",
      "Terrace seating has the best views",
    ],
    lat: 24.534,
    lng: 54.399,
  },
  {
    id: "abrahamic-family-house",
    name: "Abrahamic Family House",
    description:
      "A landmark complex comprising a mosque, church, and synagogue, symbolizing coexistence and dialogue among the three Abrahamic faiths. Designed by Sir David Adjaye.",
    shortDescription:
      "Iconic interfaith complex by Sir David Adjaye symbolizing coexistence.",
    duration: "1.5 hrs",
    timeRange: "09:00 - 10:30",
    tags: ["Spiritual", "Architecture", "Indoor"],
    indoor: true,
    ticketRequired: true,
    walkingDistance: "8 min from hotel",
    image: "/images/abrahamic.jpg",
    whyChosen:
      "A deeply meaningful architectural and spiritual experience aligned with your interest in reflection.",
    tips: [
      "Modest dress required for all three houses of worship",
      "Guided tours available",
      "Morning light is best for photography",
      "Allow time for quiet reflection",
    ],
    lat: 24.5182,
    lng: 54.4063,
  },
  {
    id: "saadiyat-grove",
    name: "The Collection at Saadiyat Grove",
    description:
      "A contemporary lifestyle destination featuring boutique shopping, artisan cafes, and creative retail experiences set within Saadiyat Island's cultural district.",
    shortDescription:
      "Boutique shopping and artisan cafes in the cultural district.",
    duration: "1.5 hrs",
    timeRange: "16:00 - 17:30",
    tags: ["Shopping", "Food", "Outdoor"],
    indoor: false,
    ticketRequired: false,
    walkingDistance: "5 min from beach area",
    image: "/images/grove.jpg",
    whyChosen:
      "A relaxed way to wind down the day with shopping and local finds before heading back.",
    tips: [
      "Many shops accept international credit cards",
      "Look for local artisan products as souvenirs",
      "Several cafes offer vegan and gluten-free options",
    ],
    lat: 24.538,
    lng: 54.421,
  },
  {
    id: "teamlab-phenomena",
    name: "teamLab Phenomena Abu Dhabi",
    description:
      "An immersive digital art museum by the renowned Japanese art collective teamLab, offering a transcendent experience where visitors become part of the artwork in vast, borderless spaces.",
    shortDescription:
      "Immersive digital art museum by the Japanese collective teamLab.",
    duration: "2 hrs",
    timeRange: "14:00 - 16:00",
    tags: ["Art", "Indoor", "Immersive"],
    indoor: true,
    ticketRequired: true,
    walkingDistance: "6 min from Louvre",
    image: "/images/teamlab.jpg",
    whyChosen:
      "A cutting-edge art experience that's unlike anything else, perfect for art enthusiasts.",
    tips: [
      "Wear comfortable shoes for walking through installations",
      "Allow at least 2 hours for the full experience",
      "Photography and video encouraged",
      "Some rooms are dark; take care with young children",
    ],
    lat: 24.536,
    lng: 54.401,
  },
  {
    id: "natural-history-museum",
    name: "Natural History Museum Abu Dhabi",
    description:
      "Discover 13.8 billion years of history through interactive exhibits, rare specimens, and cutting-edge technology. Home to 'Stan,' one of the most complete T. Rex fossils ever found.",
    shortDescription:
      "Explore 13.8 billion years of history with rare specimens and 'Stan' the T. Rex.",
    duration: "2 hrs",
    timeRange: "10:30 - 12:30",
    tags: ["Indoor", "Culture", "Architecture"],
    indoor: true,
    ticketRequired: true,
    walkingDistance: "7 min from Louvre",
    image: "/images/natural-history.jpg",
    whyChosen:
      "An awe-inspiring journey through Earth's history, great for curious minds.",
    tips: [
      "Don't miss the Stan the T. Rex exhibit",
      "Interactive displays are great for all ages",
      "The gift shop has unique fossil replicas",
    ],
    lat: 24.535,
    lng: 54.403,
  },
]

export const mockItinerary: DayItinerary[] = [
  {
    day: 1,
    date: "Friday, March 14",
    experiences: [
      mockExperiences[0], // Louvre
      mockExperiences[3], // Fouquet's
      mockExperiences[1], // Manarat
      mockExperiences[2], // Beach
    ],
  },
  {
    day: 2,
    date: "Saturday, March 15",
    experiences: [
      mockExperiences[4], // Abrahamic
      mockExperiences[7], // Natural History
      mockExperiences[6], // teamLab
      mockExperiences[5], // Grove
    ],
  },
]

export const paceOptions = [
  {
    id: "relaxed",
    label: "Relaxed",
    description: "Fewer activities, more breaks",
    icon: "leaf",
  },
  {
    id: "balanced",
    label: "Balanced",
    description: "Curated highlights",
    icon: "scale",
  },
  {
    id: "maximize",
    label: "Maximize",
    description: "Fit in as much as possible",
    icon: "zap",
  },
] as const

export const interestOptions = [
  { id: "art", label: "Art & Museums" },
  { id: "architecture", label: "Architecture" },
  { id: "food", label: "Food & Cafes" },
  { id: "nature", label: "Nature & Beach" },
  { id: "spiritual", label: "Spiritual / Reflection" },
  { id: "shopping", label: "Shopping" },
] as const

export const extraOptions = [
  { id: "exhibits", label: "Must-see specific exhibits" },
  { id: "dietary", label: "Dietary preferences" },
  { id: "low-walking", label: "Low walking preference" },
] as const
