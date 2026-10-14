export const eventData = {
  brand: {
    name: "CRAFTELLA",
    subName: "DE ART WORKSHOP",
    fullTitle: "Craftella — De Art Workshop",
    tagline: "De Art Workshop",
    copyright: "© 2026 Craftella. All rights reserved.",
  },
  
  navigation: [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Book Tickets", path: "/book-tickets" },
    { label: "Location", path: "/location" },
  ],
  
  hero: {
    eyebrow: "THE CRAFTELLA EXPERIENCE",
    headingLine1: "Every detail.",
    headingLine2: "One unforgettable day.",
    description:
      "Get ready for a sparkling creative experience with Craftella. Discover the venue, plan your route, and get ready for Craftella.",
  },

  overviewCards: [
    {
      id: "date",
      label: "EVENT DATE",
      value: "Sunday, 18 October 2026",
      description: "Mark your calendar and save the date.",
      icon: "sparkles",
    },
    {
      id: "time",
      label: "EVENT TIME",
      value: "2:00 PM – 5:00 PM",
      description: "Plan your arrival ahead of time.",
      icon: "clock",
    },
    {
      id: "venue",
      label: "EVENT VENUE",
      value: "55 Bistro",
      description: "Open Google Maps for directions.",
      icon: "mapPin",
    },
  ],

  venue: {
    kicker: "FIND YOUR WAY",
    heading: "Meet us at 55 Bistro",
    description:
      "Your Craftella experience awaits. Use the official Google Maps link below to locate the venue and plan your journey.",
    status: "OFFICIAL EVENT VENUE",
    name: "55 Bistro",
    infoText:
      "Join us for Craftella on Sunday, 18 October 2026, from 2:00 PM to 5:00 PM.",
    googleMapsUrl: "https://maps.app.goo.gl/ucLTnMRVcffDAmKV7",
    buttonText: "Get Directions",
    note: "Tap “Get Directions” to open the venue in Google Maps.",
  },

  preparation: {
    kicker: "BE EVENT-READY",
    heading: "A little preparation goes a long way.",
    intro:
      "Keep your booking information ready so your arrival and entry can go smoothly.",
    steps: [
      {
        number: "01",
        title: "Keep your ticket code ready",
        description:
          "Save the six-character ticket code from your booking confirmation.",
      },
      {
        number: "02",
        title: "Check your route",
        description:
          "Open Google Maps and review your route before leaving.",
      },
      {
        number: "03",
        title: "Plan your arrival",
        description:
          "The event is scheduled for 2:00 PM–5:00 PM on 18 October 2026.",
      },
    ],
  },

  bookingCTA: {
    heading: "Your Craftella experience awaits.",
    description:
      "Haven't booked your pass yet? Reserve your place and get ready for a creative experience.",
    buttonText: "Book Your Pass",
    buttonLink: "/book-tickets",
  },

  tickets: [
    {
      id: "single",
      type: "SINGLE ENTRY",
      title: "Single",
      subtitle: "Entry for one person",
      price: 499,
      formattedPrice: "₹499",
      features: [
        "1x Rhinestone canvas art kit",
        "All sparkling craft supplies included",
        "Beverage & light refreshments",
        "Take home your customized artwork",
      ],
      recommended: false,
    },
    {
      id: "duo",
      type: "DUO PASS",
      title: "Duo",
      subtitle: "Entry for two people",
      price: 899,
      formattedPrice: "₹899",
      features: [
        "2x Rhinestone canvas art kits",
        "Reserved adjacent seating",
        "Complimentary sparkling treats",
        "Dedicated artist assistance",
      ],
      recommended: true,
    },
    {
      id: "group",
      type: "CREATIVE GROUP",
      title: "Group (4 Passes)",
      subtitle: "Entry for four people",
      price: 1599,
      formattedPrice: "₹1,599",
      features: [
        "4x Rhinestone canvas art kits",
        "Private group table setup",
        "Group photo session keepsake",
        "Deluxe rhinestone embellishment pack",
      ],
      recommended: false,
    },
  ],
};
