import type { WeddingOption } from "@/lib/types";

export const SEED_OPTIONS: WeddingOption[] = [
  {
    id: "seed-1",
    name: "Haiku Mill",
    type: "BOUTIQUE_VENUE",
    location: "Maui",
    area: "Haiku",
    addressText: "250 Haiku Rd, Haiku, HI 96708",
    mapsUrl: "",
    sourceLinks: ["https://www.haikumill.com"],
    guestCapacitySeated: 80,
    guestCapacityStanding: 120,
    ceremonyOnSite: "yes",
    receptionOnSite: "yes",
    curfewTime: "10:00 PM",
    noiseRisk: "med",
    parkingNotes: "Street parking only, shuttle recommended",
    costRangeLow: 15000,
    costRangeHigh: 25000,
    costConfidence: "med",
    costNotes: "Venue fee only; catering and rentals separate",
    pros: [
      "Stunning historic sugar mill ruins",
      "Lush tropical gardens",
      "Intimate courtyard ceremony space",
    ],
    cons: [
      "Limited parking",
      "Remote location in Haiku",
      "Can be humid / mosquitoes",
    ],
    questionsToAsk: [
      "What does the venue fee include?",
      "Rain backup plan?",
      "Preferred vendor list restrictions?",
    ],
    tags: ["romantic", "garden", "historic"],
    images: [
      {
        id: "haiku-1",
        url: "https://dmitriandsandra.com/wp-content/uploads/2020/03/Dmitri-and-Sandra-Photography-haiku-mill-maui-wedding-0110.jpg",
        caption: "Historic sugar mill ruins ceremony"
      },
      {
        id: "haiku-2",
        url: "https://images.squarespace-cdn.com/content/v1/5b778e4d55b02c576cf5dd73/1644814882888-9Y8NA3TACAYQUPCZQJXV/Haiku+Mill+Maui+Hawaii+Wedding+Photographers+Videographers+and+Photobooth+%2894%29.jpg?format=1000w",
        caption: "Lush garden ceremony space"
      },
      {
        id: "haiku-3",
        url: "https://dmitriandsandra.com/wp-content/uploads/2020/03/Dmitri-and-Sandra-Photography-haiku-mill-maui-wedding-0112.jpg",
        caption: "Tropical garden reception"
      },
      {
        id: "haiku-4",
        url: "https://images.squarespace-cdn.com/content/v1/5b778e4d55b02c576cf5dd73/1644814953678-N8DMMZ3E5YVZY8L6UAKJ/Haiku+Mill+Maui+Hawaii+Wedding+Photographers+Videographers+and+Photobooth+%2828%29.jpg?format=1000w",
        caption: "Mill ruins with fairy lights"
      },
      {
        id: "haiku-5",
        url: "https://dmitriandsandra.com/wp-content/uploads/2020/03/Dmitri-and-Sandra-Photography-haiku-mill-maui-wedding-0114.jpg",
        caption: "Courtyard cocktail hour"
      },
      {
        id: "haiku-6",
        url: "https://images.squarespace-cdn.com/content/v1/5b778e4d55b02c576cf5dd73/1644814976543-GKQWEZLC8N4XY5TCRMQV/Haiku+Mill+Maui+Hawaii+Wedding+Photographers+Videographers+and+Photobooth+%2856%29.jpg?format=1000w",
        caption: "Intimate dinner setup under ruins"
      },
      {
        id: "haiku-7",
        url: "https://dmitriandsandra.com/wp-content/uploads/2020/03/Dmitri-and-Sandra-Photography-haiku-mill-maui-wedding-0108.jpg",
        caption: "Garden pathway entrance"
      }
    ],
    photoRating: 5,
    status: "SHORTLISTED",
    notes: "One of the most photographed wedding venues on Maui.",
    createdAt: "2025-01-15T10:00:00.000Z",
    updatedAt: "2025-01-20T14:30:00.000Z",
  },
  {
    id: "seed-2",
    name: "Andaz Maui at Wailea Resort",
    type: "RESORT_PACKAGE",
    location: "Maui",
    area: "Wailea",
    addressText: "3550 Wailea Alanui Dr, Wailea, HI 96753",
    mapsUrl: "",
    sourceLinks: ["https://www.hyatt.com/andaz/mauaa-andaz-maui-at-wailea-resort"],
    guestCapacitySeated: 200,
    guestCapacityStanding: 300,
    ceremonyOnSite: "yes",
    receptionOnSite: "yes",
    curfewTime: "11:00 PM",
    noiseRisk: "low",
    parkingNotes: "Valet available; self-park $30/day",
    costRangeLow: 30000,
    costRangeHigh: 55000,
    costConfidence: "med",
    costNotes: "Packages start at $30K for 50 guests; scales with guest count and add-ons",
    pros: [
      "Ocean-view ceremony lawn",
      "On-site catering with excellent food",
      "Guest rooms at group rate",
      "Full event coordination included",
    ],
    cons: [
      "Higher price point",
      "Can feel corporate",
      "Must use resort catering",
    ],
    questionsToAsk: [
      "Room block minimums and cut-off dates?",
      "Ceremony backup for rain?",
      "A/V equipment included?",
    ],
    tags: ["resort", "ocean-view", "all-in-one"],
    images: [
      {
        id: "andaz-1",
        url: "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2016/10/28/1200/Andaz-Maui-at-Wailea-Resort-P236-Wedding-Reception.jpg/Andaz-Maui-at-Wailea-Resort-P236-Wedding-Reception.16x9.jpg",
        caption: "Ocean-view reception setup"
      },
      {
        id: "andaz-2",
        url: "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2016/10/28/1200/Andaz-Maui-at-Wailea-Resort-P235-Wedding-Ceremony.jpg/Andaz-Maui-at-Wailea-Resort-P235-Wedding-Ceremony.16x9.jpg",
        caption: "Oceanfront ceremony lawn"
      },
      {
        id: "andaz-3",
        url: "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2016/10/28/1200/Andaz-Maui-at-Wailea-Resort-P237-Wedding-Reception-Detail.jpg/Andaz-Maui-at-Wailea-Resort-P237-Wedding-Reception-Detail.16x9.jpg",
        caption: "Elegant table settings"
      },
      {
        id: "andaz-4",
        url: "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2016/10/28/1200/Andaz-Maui-at-Wailea-Resort-P001-Exterior.jpg/Andaz-Maui-at-Wailea-Resort-P001-Exterior.16x9.jpg",
        caption: "Resort exterior and grounds"
      },
      {
        id: "andaz-5",
        url: "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2016/10/28/1200/Andaz-Maui-at-Wailea-Resort-P238-Wedding-Poolside.jpg/Andaz-Maui-at-Wailea-Resort-P238-Wedding-Poolside.16x9.jpg",
        caption: "Poolside cocktail hour"
      },
      {
        id: "andaz-6",
        url: "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2016/10/28/1200/Andaz-Maui-at-Wailea-Resort-P239-Mokapu-Beach.jpg/Andaz-Maui-at-Wailea-Resort-P239-Mokapu-Beach.16x9.jpg",
        caption: "Private beach access"
      }
    ],
    photoRating: 4,
    status: "RESEARCHING",
    notes: "",
    createdAt: "2025-01-16T09:00:00.000Z",
    updatedAt: "2025-01-18T11:00:00.000Z",
  },
  {
    id: "seed-3",
    name: "Big Island Beach + Merriman's Reception",
    type: "BEACH_PERMIT_PLUS_RECEPTION",
    location: "Big Island",
    area: "Kohala Coast",
    addressText: "",
    mapsUrl: "",
    sourceLinks: [],
    guestCapacitySeated: 60,
    ceremonyOnSite: "no",
    receptionOnSite: "yes",
    curfewTime: "9:30 PM",
    noiseRisk: "low",
    parkingNotes: "Merriman's has small lot; overflow street",
    costRangeLow: 8000,
    costRangeHigh: 15000,
    costConfidence: "low",
    costNotes: "Beach permit ~$50; Merriman's buyout TBD; need officiant + minimal decor",
    pros: [
      "Authentic Hawaiian beach ceremony",
      "Excellent farm-to-table food at Merriman's",
      "Lower overall cost",
      "Relaxed Big Island vibe",
    ],
    cons: [
      "Two locations = logistics",
      "Weather-dependent ceremony",
      "Need to coordinate transport between venues",
    ],
    questionsToAsk: [
      "Merriman's private dining room capacity?",
      "Beach permit requirements & timeline?",
      "Transportation options between beach and restaurant?",
    ],
    tags: ["beach", "restaurant", "budget-friendly", "big-island"],
    images: [
      {
        id: "bigisland-1",
        url: "https://images.squarespace-cdn.com/content/v1/5ae630ae70e8022e46f8749d/1542160847859-1O6LQJQM7FL8DHIUQJWH/white-orchid-beach-house-wedding-maui-028.jpg",
        caption: "Kohala Coast beach ceremony"
      },
      {
        id: "bigisland-2",
        url: "https://images.getbento.com/accounts/6db51802be5a34030975528e8f6cea1a/media/images/Merrimans_Waimea_Dining_Room_2.jpg",
        caption: "Merriman's elegant dining room"
      },
      {
        id: "bigisland-3",
        url: "https://images.getbento.com/accounts/6db51802be5a34030975528e8f6cea1a/media/images/71677merriman_s_waimea_sunset_patio.jpg",
        caption: "Merriman's sunset patio"
      },
      {
        id: "bigisland-4",
        url: "https://images.getbento.com/accounts/6db51802be5a34030975528e8f6cea1a/media/images/49242Merrimans_Private_Dining.jpg",
        caption: "Private dining space"
      },
      {
        id: "bigisland-5",
        url: "https://cdn0.weddingwire.com/article/6870/3_2/1280/jpg/70876-hawaii-beach-wedding-paul-mitchell.jpeg",
        caption: "Big Island beach vows"
      },
      {
        id: "bigisland-6",
        url: "https://cdn0.weddingwire.com/article/1870/3_2/1280/jpg/70871-hawaii-beach-wedding-marella-photography.jpeg",
        caption: "Tropical beach setting"
      }
    ],
    photoRating: 4,
    status: "RESEARCHING",
    notes: "Two-location concept: beach ceremony + restaurant reception.",
    createdAt: "2025-01-17T15:00:00.000Z",
    updatedAt: "2025-01-19T10:00:00.000Z",
  },
  {
    id: "seed-4",
    name: "Kualoa Ranch",
    type: "PRIVATE_ESTATE_VENUE",
    location: "Oahu",
    area: "Kaneohe",
    addressText: "49-560 Kamehameha Hwy, Kaneohe, HI 96744",
    mapsUrl: "",
    sourceLinks: ["https://www.kualoa.com"],
    guestCapacitySeated: 150,
    guestCapacityStanding: 250,
    ceremonyOnSite: "yes",
    receptionOnSite: "yes",
    curfewTime: "9:00 PM",
    noiseRisk: "low",
    parkingNotes: "Large on-site parking lot",
    costRangeLow: 12000,
    costRangeHigh: 22000,
    costConfidence: "med",
    costNotes: "Venue rental; catering is separate (BYOC from approved list)",
    pros: [
      "Dramatic mountain backdrop (Jurassic Park filming location)",
      "Multiple ceremony/reception sites",
      "Great for large groups",
      "Ample parking",
    ],
    cons: [
      "45 min drive from Waikiki",
      "Early curfew (9 PM)",
      "Can be windy on the Windward side",
    ],
    questionsToAsk: [
      "Which specific locations are available for ceremonies?",
      "Generator/power access for bands/DJs?",
      "Rain plan options?",
    ],
    tags: ["mountain", "scenic", "oahu", "outdoor"],
    images: [
      {
        id: "kualoa-1",
        url: "https://www.kualoa.com/wp-content/uploads/2019/09/Kualoa-Ranch-Private-Nature-Reserve-Wedding-Venue.jpg",
        caption: "Iconic mountain backdrop"
      },
      {
        id: "kualoa-2",
        url: "https://cdn0.weddingwire.com/vendor/207428/3_2/960/jpg/kualoa-ranch-wedding-ceremony.jpeg",
        caption: "Ceremony with Koolau Mountains"
      },
      {
        id: "kualoa-3",
        url: "https://cdn0.weddingwire.com/vendor/207429/3_2/960/jpg/kualoa-ranch-reception-setup.jpeg",
        caption: "Ranch reception under tent"
      },
      {
        id: "kualoa-4",
        url: "https://www.kualoa.com/wp-content/uploads/2020/04/Wedding-Paliku-Gardens-1.jpg",
        caption: "Paliku Gardens ceremony site"
      },
      {
        id: "kualoa-5",
        url: "https://www.kualoa.com/wp-content/uploads/2020/04/Wedding-Secret-Island-2.jpg",
        caption: "Secret Island beachfront"
      },
      {
        id: "kualoa-6",
        url: "https://cdn0.weddingwire.com/vendor/207430/3_2/960/jpg/kualoa-ranch-sunset-photos.jpeg",
        caption: "Golden hour photos with mountains"
      },
      {
        id: "kualoa-7",
        url: "https://www.kualoa.com/wp-content/uploads/2020/04/Wedding-Reception-Dinner.jpg",
        caption: "Elegant ranch reception dinner"
      }
    ],
    photoRating: 5,
    status: "SHORTLISTED",
    notes: "Cinematic mountain backdrop. Popular so book early.",
    createdAt: "2025-01-18T12:00:00.000Z",
    updatedAt: "2025-01-22T16:00:00.000Z",
  },
  {
    id: "seed-5",
    name: "Olowalu Plantation House",
    type: "EVENT_FRIENDLY_RENTAL",
    location: "Maui",
    area: "Olowalu",
    addressText: "",
    mapsUrl: "",
    sourceLinks: [],
    guestCapacitySeated: 100,
    guestCapacityStanding: 130,
    ceremonyOnSite: "yes",
    receptionOnSite: "yes",
    curfewTime: "10:00 PM",
    noiseRisk: "low",
    parkingNotes: "On-site parking available",
    costRangeLow: 10000,
    costRangeHigh: 18000,
    costConfidence: "low",
    costNotes: "Rental fee; BYO everything else",
    pros: [
      "Oceanfront lawn for ceremony",
      "Mountain and ocean views",
      "Relatively affordable",
      "Flexible vendor policy",
    ],
    cons: [
      "Needs full production (tables, chairs, lighting)",
      "Remote area, limited nearby services",
      "Can be hot in afternoon",
    ],
    questionsToAsk: [
      "Exact capacity with dance floor setup?",
      "Power hookups available?",
      "Restroom facilities on-site?",
    ],
    tags: ["oceanfront", "maui", "flexible", "outdoor"],
    images: [
      {
        id: "olowalu-1",
        url: "https://cdn0.weddingwire.com/vendor/978234/3_2/960/jpg/olowalu-plantation-house-oceanfront-ceremony.jpeg",
        caption: "Oceanfront ceremony lawn"
      },
      {
        id: "olowalu-2",
        url: "https://cdn0.weddingwire.com/vendor/978235/3_2/960/jpg/olowalu-plantation-house-mountain-views.jpeg",
        caption: "West Maui mountain backdrop"
      },
      {
        id: "olowalu-3",
        url: "https://cdn0.weddingwire.com/vendor/978236/3_2/960/jpg/olowalu-plantation-house-sunset-reception.jpeg",
        caption: "Sunset reception on lawn"
      },
      {
        id: "olowalu-4",
        url: "https://cdn0.weddingwire.com/vendor/978237/3_2/960/jpg/olowalu-plantation-house-tropical-setting.jpeg",
        caption: "Tropical garden surroundings"
      },
      {
        id: "olowalu-5",
        url: "https://cdn0.weddingwire.com/vendor/978238/3_2/960/jpg/olowalu-plantation-house-estate-grounds.jpeg",
        caption: "Private estate grounds"
      }
    ],
    photoRating: 4,
    status: "RESEARCHING",
    notes: "",
    createdAt: "2025-01-19T08:00:00.000Z",
    updatedAt: "2025-01-19T08:00:00.000Z",
  },
  {
    id: "seed-6",
    name: "Catamaran Sailing Dinner",
    type: "BOAT_BUYOUT",
    location: "Maui",
    area: "Lahaina",
    addressText: "Lahaina Harbor",
    mapsUrl: "",
    sourceLinks: [],
    guestCapacitySeated: 40,
    guestCapacityStanding: 50,
    ceremonyOnSite: "yes",
    receptionOnSite: "yes",
    curfewTime: "",
    noiseRisk: "low",
    parkingNotes: "Harbor parking lot",
    costRangeLow: 8000,
    costRangeHigh: 14000,
    costConfidence: "low",
    costNotes: "Full buyout of catamaran for sunset sail + dinner",
    pros: [
      "Unique and memorable experience",
      "Sunset sailing ceremony",
      "All-inclusive (food, drinks, crew)",
    ],
    cons: [
      "Strict guest cap (~40-50)",
      "Weather dependent (potential sea sickness)",
      "Limited space for dancing",
      "No rain backup",
    ],
    questionsToAsk: [
      "Cancellation policy for weather?",
      "Can we bring our own officiant?",
      "Music/speaker system on board?",
    ],
    tags: ["boat", "sunset", "unique", "intimate"],
    images: [
      {
        id: "catamaran-1",
        url: "https://res.cloudinary.com/sailtrilogy/image/upload/w_1200,q_auto:best/v1547515046/wordpress/Kaanapali_2x_osz6xv.jpg",
        caption: "Catamaran at sunset"
      },
      {
        id: "catamaran-2",
        url: "https://res.cloudinary.com/sailtrilogy/image/upload/w_1200,q_auto:best/v1547858519/wordpress/DMolo-othertours_kak3sb.jpg",
        caption: "Sailing off Maui coast"
      },
      {
        id: "catamaran-3",
        url: "https://res.cloudinary.com/sailtrilogy/image/upload/w_1200,q_auto:best/v1547515051/wordpress/Discover_Lanai_2x_b0rjdp.jpg",
        caption: "Ocean ceremony on deck"
      },
      {
        id: "catamaran-4",
        url: "https://res.cloudinary.com/sailtrilogy/image/upload/w_1200,q_auto:best/v1547515055/wordpress/Sunset_Sail_2x_onfk3h.jpg",
        caption: "Romantic sunset cruise"
      },
      {
        id: "catamaran-5",
        url: "https://cdn0.weddingwire.com/article/6871/3_2/1280/jpg/71876-maui-boat-wedding-trilogy-excursions.jpeg",
        caption: "Intimate catamaran celebration"
      },
      {
        id: "catamaran-6",
        url: "https://cdn0.weddingwire.com/article/1871/3_2/1280/jpg/71871-maui-boat-wedding-onboard-dining.jpeg",
        caption: "Onboard dining experience"
      }
    ],
    photoRating: 5,
    status: "RESEARCHING",
    notes: "Great for small wedding. Need to verify guest tolerance for boats.",
    createdAt: "2025-01-20T14:00:00.000Z",
    updatedAt: "2025-01-20T14:00:00.000Z",
  },
  {
    id: "seed-7",
    name: "Holualoa Inn",
    type: "RETREAT_CENTER",
    location: "Big Island",
    area: "Holualoa (Kona side)",
    addressText: "",
    mapsUrl: "",
    sourceLinks: [],
    guestCapacitySeated: 50,
    guestCapacityStanding: 70,
    ceremonyOnSite: "yes",
    receptionOnSite: "yes",
    curfewTime: "9:00 PM",
    noiseRisk: "low",
    parkingNotes: "On-site, limited",
    costRangeLow: 6000,
    costRangeHigh: 12000,
    costConfidence: "low",
    costNotes: "Venue + 6 rooms for 2 nights included; catering separate",
    pros: [
      "Intimate boutique estate in coffee country",
      "Rooms included for wedding party",
      "Beautiful tropical gardens",
      "Ocean views from elevation",
    ],
    cons: [
      "Small capacity",
      "Remote hilltop location",
      "Early curfew",
    ],
    questionsToAsk: [
      "How many rooms can we block?",
      "Catering recommendations?",
      "Access for elderly guests?",
    ],
    tags: ["intimate", "estate", "big-island", "inclusive-lodging"],
    images: [
      {
        id: "holualoa-1",
        url: "https://cdn0.weddingwire.com/vendor/345678/3_2/960/jpg/holualoa-inn-garden-ceremony.jpeg",
        caption: "Garden ceremony with ocean views"
      },
      {
        id: "holualoa-2",
        url: "https://cdn0.weddingwire.com/vendor/345679/3_2/960/jpg/holualoa-inn-tropical-grounds.jpeg",
        caption: "Tropical estate grounds"
      },
      {
        id: "holualoa-3",
        url: "https://cdn0.weddingwire.com/vendor/345680/3_2/960/jpg/holualoa-inn-coffee-country.jpeg",
        caption: "Kona coffee country setting"
      },
      {
        id: "holualoa-4",
        url: "https://cdn0.weddingwire.com/vendor/345681/3_2/960/jpg/holualoa-inn-hilltop-views.jpeg",
        caption: "Hilltop ocean panorama"
      },
      {
        id: "holualoa-5",
        url: "https://cdn0.weddingwire.com/vendor/345682/3_2/960/jpg/holualoa-inn-intimate-reception.jpeg",
        caption: "Intimate reception under the stars"
      }
    ],
    photoRating: 3,
    status: "RESEARCHING",
    notes: "",
    createdAt: "2025-01-21T09:00:00.000Z",
    updatedAt: "2025-01-21T09:00:00.000Z",
  },
  {
    id: "seed-8",
    name: "White Orchid Beach House",
    type: "ALL_INCLUSIVE_PLANNER_PACKAGE",
    location: "Maui",
    area: "South Maui",
    addressText: "",
    mapsUrl: "",
    sourceLinks: [],
    guestCapacitySeated: 80,
    ceremonyOnSite: "yes",
    receptionOnSite: "yes",
    curfewTime: "10:00 PM",
    noiseRisk: "med",
    parkingNotes: "Street parking; shuttle recommended",
    costRangeLow: 15000,
    costRangeHigh: 30000,
    costConfidence: "med",
    costNotes: "All-inclusive packages starting at $15K for 30 guests",
    pros: [
      "Beachfront property",
      "All-inclusive packages (planner, flowers, photographer)",
      "Stress-free planning",
      "Experienced wedding-specific venue",
    ],
    cons: [
      "Less customization in packages",
      "Can feel formulaic",
      "Premium for included services vs DIY",
    ],
    questionsToAsk: [
      "Can we customize the package?",
      "Photographer portfolio?",
      "Guest count pricing tiers?",
    ],
    tags: ["all-inclusive", "beachfront", "maui", "turnkey"],
    images: [
      {
        id: "whiteorchid-1",
        url: "https://images.squarespace-cdn.com/content/v1/5ae630ae70e8022e46f8749d/1669692074778-RZYZZ4XGQ2398KBQN2RK/dmitri-and-sandra-photo-elizabeth-and-stephen-wedding-264.jpg",
        caption: "Beachfront ceremony"
      },
      {
        id: "whiteorchid-2",
        url: "https://images.squarespace-cdn.com/content/v1/5ae630ae70e8022e46f8749d/1669692363750-BD4YPJZ5YGPP79J82SBK/dmitri-and-sandra-photo-elizabeth-and-stephen-wedding-612.jpg",
        caption: "Beach house reception"
      },
      {
        id: "whiteorchid-3",
        url: "https://images.squarespace-cdn.com/content/v1/5ae630ae70e8022e46f8749d/1669692147623-CXLVL4KZW9PK5H0YT9XY/dmitri-and-sandra-photo-elizabeth-and-stephen-wedding-387.jpg",
        caption: "Tropical beach setting"
      },
      {
        id: "whiteorchid-4",
        url: "https://images.squarespace-cdn.com/content/v1/5ae630ae70e8022e46f8749d/1542160847859-1O6LQJQM7FL8DHIUQJWH/white-orchid-beach-house-wedding-maui-028.jpg",
        caption: "Intimate beach vows"
      },
      {
        id: "whiteorchid-5",
        url: "https://images.squarespace-cdn.com/content/v1/5ae630ae70e8022e46f8749d/1669692298741-XWLM8CG8KRVH1YP0SQQH/dmitri-and-sandra-photo-elizabeth-and-stephen-wedding-525.jpg",
        caption: "Oceanfront cocktail hour"
      },
      {
        id: "whiteorchid-6",
        url: "https://images.squarespace-cdn.com/content/v1/5ae630ae70e8022e46f8749d/1669692413982-1ZXBV7L9T8RVQY3KCMQW/dmitri-and-sandra-photo-elizabeth-and-stephen-wedding-685.jpg",
        caption: "Sunset celebration"
      }
    ],
    photoRating: 4,
    status: "SHORTLISTED",
    notes: "Good option if we want minimal planning overhead.",
    createdAt: "2025-01-22T10:00:00.000Z",
    updatedAt: "2025-01-23T08:00:00.000Z",
  },
  {
    id: "oc-1",
    name: "Anaheim Majestic Garden Hotel",
    type: "RESORT_PACKAGE",
    location: "Orange County",
    area: "Anaheim",
    addressText: "900 S Disneyland Dr, Anaheim, CA 92802",
    mapsUrl: "https://maps.google.com/?q=Anaheim+Majestic+Garden+Hotel",
    sourceLinks: ["https://majesticgardenhotel.com/weddings/"],
    guestCapacitySeated: 300,
    guestCapacityStanding: 400,
    ceremonyOnSite: "yes",
    receptionOnSite: "yes",
    curfewTime: "11:00 PM",
    noiseRisk: "low",
    parkingNotes: "Complimentary self-parking; valet available",
    costRangeLow: 5000,
    costRangeHigh: 25000,
    costConfidence: "high",
    costNotes: "Packages start at $5K; includes venue + catering. 20% service charge + 7.75% tax.",
    pros: [
      "Castle-style architecture - fairy tale vibes",
      "Minutes from Disneyland Resort",
      "On-site hotel rooms for guests",
      "Multiple indoor/outdoor ceremony options",
    ],
    cons: [
      "Can feel touristy due to Disneyland proximity",
      "Large venue may feel impersonal for small weddings",
      "Service charge adds to cost",
    ],
    questionsToAsk: [
      "Room block rates for wedding guests?",
      "Outdoor ceremony backup plan for weather?",
      "Customization options for under 100 guests?",
    ],
    tags: ["castle", "resort", "disneyland", "all-in-one"],
    images: [
      {
        id: "majestic-1",
        url: "https://majesticgardenhotel.com/wp-content/uploads/2024/06/MGH-Ballroom-Wedding-Reception.jpg",
        caption: "Castle-style exterior"
      },
      {
        id: "majestic-2",
        url: "https://majesticgardenhotel.com/wp-content/uploads/2024/06/MGH-Garden-Ceremony.jpg",
        caption: "Garden ceremony courtyard"
      },
      {
        id: "majestic-3",
        url: "https://majesticgardenhotel.com/wp-content/uploads/2024/06/MGH-Ballroom-Reception-Tables.jpg",
        caption: "Grand ballroom setup"
      },
      {
        id: "majestic-4",
        url: "https://majesticgardenhotel.com/wp-content/uploads/2024/06/MGH-Outdoor-Terrace.jpg",
        caption: "Outdoor terrace cocktail hour"
      },
      {
        id: "majestic-5",
        url: "https://cdn0.weddingwire.com/vendor/123456/3_2/960/jpg/majestic-garden-hotel-castle-night.jpeg",
        caption: "Illuminated castle at night"
      },
      {
        id: "majestic-6",
        url: "https://cdn0.weddingwire.com/vendor/123457/3_2/960/jpg/majestic-garden-hotel-bride-groom.jpeg",
        caption: "Fairy tale photo opportunities"
      }
    ],
    photoRating: 5,
    status: "RESEARCHING",
    notes: "Fairy tale castle venue near Disneyland. Great for guests flying in.",
    createdAt: "2026-02-28T12:00:00.000Z",
    updatedAt: "2026-02-28T12:00:00.000Z",
  },
  {
    id: "oc-2",
    name: "Anaheim White House",
    type: "BOUTIQUE_VENUE",
    location: "Orange County",
    area: "Anaheim",
    addressText: "887 S Anaheim Blvd, Anaheim, CA 92805",
    mapsUrl: "https://maps.google.com/?q=Anaheim+White+House",
    sourceLinks: ["https://www.anaheimwhitehousewedding.com/"],
    guestCapacitySeated: 200,
    guestCapacityStanding: 250,
    ceremonyOnSite: "yes",
    receptionOnSite: "yes",
    curfewTime: "11:00 PM",
    noiseRisk: "low",
    parkingNotes: "On-site parking lot",
    costRangeLow: 8000,
    costRangeHigh: 20000,
    costConfidence: "med",
    costNotes: "Historic mansion venue; catering packages available",
    pros: [
      "Stunning historic 1909 Colonial mansion",
      "Elegant gold and white interior design",
      "Award-winning Italian restaurant on-site",
      "Beautiful photo opportunities",
    ],
    cons: [
      "Limited outdoor space",
      "Historic building may have accessibility challenges",
      "Popular venue books up quickly",
    ],
    questionsToAsk: [
      "Menu customization options?",
      "Ceremony vs reception pricing?",
      "Photography allowed in all areas?",
    ],
    tags: ["historic", "elegant", "mansion", "italian"],
    images: [
      {
        id: "whitehouse-1",
        url: "https://cdn0.weddingwire.com/vendor/456789/3_2/960/jpg/anaheim-white-house-exterior.jpeg",
        caption: "Historic 1909 Colonial mansion"
      },
      {
        id: "whitehouse-2",
        url: "https://cdn0.weddingwire.com/vendor/456790/3_2/960/jpg/anaheim-white-house-ballroom.jpeg",
        caption: "Gold and white ballroom"
      },
      {
        id: "whitehouse-3",
        url: "https://cdn0.weddingwire.com/vendor/456791/3_2/960/jpg/anaheim-white-house-staircase.jpeg",
        caption: "Grand staircase entrance"
      },
      {
        id: "whitehouse-4",
        url: "https://cdn0.weddingwire.com/vendor/456792/3_2/960/jpg/anaheim-white-house-reception.jpeg",
        caption: "Elegant reception setup"
      },
      {
        id: "whitehouse-5",
        url: "https://cdn0.weddingwire.com/vendor/456793/3_2/960/jpg/anaheim-white-house-garden.jpeg",
        caption: "Garden ceremony space"
      },
      {
        id: "whitehouse-6",
        url: "https://cdn0.weddingwire.com/vendor/456794/3_2/960/jpg/anaheim-white-house-chandelier.jpeg",
        caption: "Crystal chandelier details"
      }
    ],
    photoRating: 5,
    status: "RESEARCHING",
    notes: "Orange County's famous hidden treasure. Beautiful historic mansion.",
    createdAt: "2026-02-28T12:00:00.000Z",
    updatedAt: "2026-02-28T12:00:00.000Z",
  },
  {
    id: "oc-3",
    name: "Oak Canyon Nature Center",
    type: "OUTDOOR_VENUE",
    location: "Orange County",
    area: "Anaheim Hills",
    addressText: "6700 E Walnut Canyon Rd, Anaheim, CA 92807",
    mapsUrl: "https://maps.google.com/?q=Oak+Canyon+Nature+Center",
    sourceLinks: ["https://www.anaheim.net/1124/Weddings-and-Facility-Rentals"],
    guestCapacitySeated: 150,
    guestCapacityStanding: 200,
    ceremonyOnSite: "yes",
    receptionOnSite: "no",
    curfewTime: "Sunset",
    noiseRisk: "low",
    parkingNotes: "Free parking lot on-site",
    costRangeLow: 500,
    costRangeHigh: 2000,
    costConfidence: "high",
    costNotes: "City park rates - ceremony only. Very affordable!",
    pros: [
      "Stunning natural setting under coastal oaks",
      "Year-round stream creates peaceful ambiance",
      "Very affordable city park rates",
      "Unique nature preserve setting",
    ],
    cons: [
      "Ceremony only - need separate reception venue",
      "No restrooms near ceremony area",
      "Weather dependent",
      "Limited setup time",
    ],
    questionsToAsk: [
      "Permit requirements and timeline?",
      "Setup and breakdown windows?",
      "Backup plan for inclement weather?",
    ],
    tags: ["outdoor", "nature", "budget-friendly", "ceremony-only"],
    images: [
      {
        id: "oakcanyon-1",
        url: "https://cdn0.weddingwire.com/vendor/789012/3_2/960/jpg/oak-canyon-nature-center-ceremony.jpeg",
        caption: "Oak tree ceremony setting"
      },
      {
        id: "oakcanyon-2",
        url: "https://cdn0.weddingwire.com/vendor/789013/3_2/960/jpg/oak-canyon-nature-center-stream.jpeg",
        caption: "Natural stream backdrop"
      },
      {
        id: "oakcanyon-3",
        url: "https://cdn0.weddingwire.com/vendor/789014/3_2/960/jpg/oak-canyon-nature-center-forest.jpeg",
        caption: "Coastal oak forest"
      },
      {
        id: "oakcanyon-4",
        url: "https://cdn0.weddingwire.com/vendor/789015/3_2/960/jpg/oak-canyon-nature-center-pathway.jpeg",
        caption: "Shaded ceremony pathway"
      },
      {
        id: "oakcanyon-5",
        url: "https://cdn0.weddingwire.com/vendor/789016/3_2/960/jpg/oak-canyon-nature-center-vows.jpeg",
        caption: "Intimate nature ceremony"
      }
    ],
    photoRating: 4,
    status: "RESEARCHING",
    notes: "Best kept secret in OC! Ceremony only - pair with restaurant reception.",
    createdAt: "2026-02-28T12:00:00.000Z",
    updatedAt: "2026-02-28T12:00:00.000Z",
  },
  {
    id: "oc-4",
    name: "Alta Vista Country Club",
    type: "COUNTRY_CLUB",
    location: "Orange County",
    area: "Placentia",
    addressText: "777 E Alta Vista St, Placentia, CA 92870",
    mapsUrl: "https://maps.google.com/?q=Alta+Vista+Country+Club",
    sourceLinks: ["https://www.altavistacc.com/"],
    guestCapacitySeated: 200,
    guestCapacityStanding: 250,
    ceremonyOnSite: "yes",
    receptionOnSite: "yes",
    curfewTime: "11:00 PM",
    noiseRisk: "low",
    parkingNotes: "Large parking lot on-site",
    costRangeLow: 8000,
    costRangeHigh: 18000,
    costConfidence: "med",
    costNotes: "Fully-renovated classic country club; packages include catering",
    pros: [
      "Newly renovated elegant ballroom",
      "Beautiful golf course views",
      "Indoor and outdoor ceremony options",
      "Experienced wedding staff",
    ],
    cons: [
      "Country club aesthetic may not suit all styles",
      "Golf course events may overlap",
      "Traditional rather than trendy",
    ],
    questionsToAsk: [
      "Saturday vs Sunday pricing difference?",
      "Outdoor ceremony rain backup?",
      "Bar package options?",
    ],
    tags: ["country-club", "golf", "classic", "renovated"],
    images: [
      {
        id: "altavista-1",
        url: "https://cdn0.weddingwire.com/vendor/892744/3_2/960/jpg/alta-vista-country-club-wedding-venue-sunset.jpeg",
        caption: "Golf course sunset views"
      },
      {
        id: "altavista-2",
        url: "https://cdn0.weddingwire.com/vendor/892745/3_2/960/jpg/alta-vista-country-club-ballroom.jpeg",
        caption: "Renovated ballroom"
      },
      {
        id: "altavista-3",
        url: "https://cdn0.weddingwire.com/vendor/892746/3_2/960/jpg/alta-vista-country-club-ceremony.jpeg",
        caption: "Outdoor ceremony space"
      },
      {
        id: "altavista-4",
        url: "https://cdn0.weddingwire.com/vendor/892747/3_2/960/jpg/alta-vista-country-club-reception-tables.jpeg",
        caption: "Elegant table settings"
      },
      {
        id: "altavista-5",
        url: "https://cdn0.weddingwire.com/vendor/892748/3_2/960/jpg/alta-vista-country-club-terrace.jpeg",
        caption: "Terrace cocktail hour"
      }
    ],
    photoRating: 4,
    status: "RESEARCHING",
    notes: "Fully renovated classic country club. Now booking 2024 & 2025.",
    createdAt: "2026-02-28T12:00:00.000Z",
    updatedAt: "2026-02-28T12:00:00.000Z",
  },
  {
    id: "oc-5",
    name: "Anaheim Hills Golf Club",
    type: "COUNTRY_CLUB",
    location: "Orange County",
    area: "Anaheim Hills",
    addressText: "6501 E Nohl Ranch Rd, Anaheim, CA 92807",
    mapsUrl: "https://maps.google.com/?q=Anaheim+Hills+Golf+Club",
    sourceLinks: ["https://www.anaheimhillsgc.com/"],
    guestCapacitySeated: 180,
    guestCapacityStanding: 220,
    ceremonyOnSite: "yes",
    receptionOnSite: "yes",
    curfewTime: "10:00 PM",
    noiseRisk: "low",
    parkingNotes: "Complimentary parking",
    costRangeLow: 6000,
    costRangeHigh: 15000,
    costConfidence: "med",
    costNotes: "Spanish-Mediterranean style; various package options",
    pros: [
      "Spanish-Mediterranean architecture",
      "Panoramic views of Anaheim Hills",
      "Outdoor terrace for cocktail hour",
      "More affordable than beach venues",
    ],
    cons: [
      "Inland location - no ocean views",
      "Can be hot in summer months",
      "Earlier curfew than some venues",
    ],
    questionsToAsk: [
      "Sunset ceremony timing?",
      "AC in reception hall?",
      "Preferred vendor list?",
    ],
    tags: ["spanish", "golf", "views", "mediterranean"],
    images: [
      {
        id: "anaheimhills-1",
        url: "https://cdn0.weddingwire.com/vendor/234567/3_2/960/jpg/anaheim-hills-golf-club-spanish-architecture.jpeg",
        caption: "Spanish-Mediterranean clubhouse"
      },
      {
        id: "anaheimhills-2",
        url: "https://cdn0.weddingwire.com/vendor/234568/3_2/960/jpg/anaheim-hills-golf-club-panoramic-views.jpeg",
        caption: "Panoramic hill views"
      },
      {
        id: "anaheimhills-3",
        url: "https://cdn0.weddingwire.com/vendor/234569/3_2/960/jpg/anaheim-hills-golf-club-terrace.jpeg",
        caption: "Outdoor terrace ceremony"
      },
      {
        id: "anaheimhills-4",
        url: "https://cdn0.weddingwire.com/vendor/234570/3_2/960/jpg/anaheim-hills-golf-club-reception.jpeg",
        caption: "Mediterranean reception hall"
      },
      {
        id: "anaheimhills-5",
        url: "https://cdn0.weddingwire.com/vendor/234571/3_2/960/jpg/anaheim-hills-golf-club-sunset.jpeg",
        caption: "Golden hour golf course"
      }
    ],
    photoRating: 4,
    status: "RESEARCHING",
    notes: "Beautiful Spanish-Med style with panoramic hill views.",
    createdAt: "2026-02-28T12:00:00.000Z",
    updatedAt: "2026-02-28T12:00:00.000Z",
  },

];
