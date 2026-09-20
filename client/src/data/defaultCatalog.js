/**
 * 🌟 Verified Pan-India Tourism Catalog for Moulyasree Client
 * Ensures 100% reliable rendering across all global cloud deployments
 */

export const DEFAULT_HOTELS = [
  {
    _id: "hotel_goa_01",
    id: "hotel_goa_01",
    hotelName: "Taj Exotica Resort & Luxury Spa",
    location: "Benaulim, South Goa",
    description: "Mediterranean-inspired 5-star beachfront paradise nestled amidst 56 acres of lush gardens along Goa's pristine coast.",
    rating: 4.9,
    price: 14500,
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"]
  },
  {
    _id: "hotel_jaipur_01",
    id: "hotel_jaipur_01",
    hotelName: "The Oberoi Rajvilas Heritage Palace",
    location: "Jaipur, Rajasthan",
    description: "Traditional Rajasthani architecture, tranquil reflection pools, luxury tents, and authentic royal hospitality.",
    rating: 4.95,
    price: 18500,
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"]
  },
  {
    _id: "hotel_kerala_01",
    id: "hotel_kerala_01",
    hotelName: "Kumarakom Lake Resort & Backwater Haven",
    location: "Kottayam, Kerala",
    description: "Acclaimed luxury backwater retreat with heritage villas, private plunge pools, and Ayurvedic wellness therapies.",
    rating: 4.88,
    price: 12500,
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80"]
  },
  {
    _id: "hotel_manali_01",
    id: "hotel_manali_01",
    hotelName: "The Himalayan Pine Chalet & Alpine Spa",
    location: "Manali, Himachal Pradesh",
    description: "Victorian Gothic castle set amidst apple orchards and deodar forests overlooking snow-clad Himalayan peaks.",
    rating: 4.85,
    price: 8500,
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"]
  },
  {
    _id: "hotel_varanasi_01",
    id: "hotel_varanasi_01",
    hotelName: "BrijRama Palace Heritage on the Ganges",
    location: "Darbhanga Ghat, Varanasi",
    description: "One of the oldest heritage palaces on the sacred Ganges ghats, showcasing 18th-century Maratha architecture.",
    rating: 4.92,
    price: 11000,
    images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"]
  }
];

export const DEFAULT_VEHICLES = [
  {
    _id: "veh_01",
    id: "veh_01",
    vehicleName: "Toyota Innova Crysta ZX (7-Seater Luxury AC)",
    type: "car",
    pricePerDay: 4200,
    location: "Pan-India / Airport Pickup",
    seats: 7,
    availability: true,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80"]
  },
  {
    _id: "veh_02",
    id: "veh_02",
    vehicleName: "Mahindra Thar 4x4 Hard-Top (Adventure Edition)",
    type: "jeep",
    pricePerDay: 5500,
    location: "Manali / Leh / Goa",
    seats: 4,
    availability: true,
    rating: 4.95,
    images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80"]
  },
  {
    _id: "veh_03",
    id: "veh_03",
    vehicleName: "Force Urbania 17-Seater Executive Coach",
    type: "bus",
    pricePerDay: 9500,
    location: "Jaipur / Delhi / Golden Triangle",
    seats: 17,
    availability: true,
    rating: 4.88,
    images: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80"]
  },
  {
    _id: "veh_04",
    id: "veh_04",
    vehicleName: "Royal Enfield Himalayan 450 (Mountain Tour)",
    type: "bike",
    pricePerDay: 1800,
    location: "Himachal / Ladakh / Rishikesh",
    seats: 2,
    availability: true,
    rating: 4.92,
    images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80"]
  }
];

export const DEFAULT_RESTAURANTS = [
  {
    _id: "rest_01",
    id: "rest_01",
    restaurantName: "Royal Spice Courtyard & Rooftop Lounge",
    location: "Jaipur & Pan-India",
    description: "Fine dining offering authentic Rajasthani Thali, Royal Mughlai kebabs, and live classical sitar music.",
    rating: 4.9,
    cuisine: "Rajasthani & North Indian",
    images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"]
  },
  {
    _id: "rest_02",
    id: "rest_02",
    restaurantName: "Fisherman's Wharf Coastal Catch & Shack",
    location: "Cavelossim, Goa",
    description: "Authentic Goan seafood curries, Butter Garlic Crabs, and riverside sunset cocktails.",
    rating: 4.85,
    cuisine: "Goan Seafood & Continental",
    images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"]
  },
  {
    _id: "rest_03",
    id: "rest_03",
    restaurantName: "Paradise Biryani Heritage Dining",
    location: "Secunderabad, Hyderabad",
    description: "Legendary Nizami Hyderabadi Dum Biryani cooked with authentic slow-fire Dum style.",
    rating: 4.92,
    cuisine: "Hyderabadi & Mughlai",
    images: ["https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1000&q=80"]
  }
];

export const DEFAULT_GUIDES = [
  {
    _id: "guide_01",
    id: "guide_01",
    guideName: "Vikramaditya Rao (UNESCO Heritage Specialist)",
    languages: ["English", "Hindi", "Telugu", "French"],
    experience: 12,
    pricePerDay: 3500,
    location: "Jaipur, Rajasthan & Golden Triangle",
    description: "Ministry of Tourism certified heritage guide specializing in Rajput architecture, astronomy, and fortress folklore.",
    rating: 4.96,
    images: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"]
  },
  {
    _id: "guide_02",
    id: "guide_02",
    guideName: "Meenakshi Sundaram (Temple Narrator)",
    languages: ["English", "Tamil", "Hindi", "German"],
    experience: 9,
    pricePerDay: 3200,
    location: "Madurai / Tanjore / Hampi",
    description: "Dravidian temple architecture scholar and cultural historian.",
    rating: 4.94,
    images: ["https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80"]
  },
  {
    _id: "guide_03",
    id: "guide_03",
    guideName: "Tenzin Norbu (Himalayan Trek Leader)",
    languages: ["English", "Hindi", "Tibetan"],
    experience: 11,
    pricePerDay: 3800,
    location: "Manali / Spiti / Leh Ladakh",
    description: "High altitude certified mountaineering and biodiversity guide.",
    rating: 4.98,
    images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"]
  }
];

export const DEFAULT_EVENTS = [
  {
    _id: "event_01",
    id: "event_01",
    title: "Goa Sunset Beach Music Carnival",
    eventName: "Goa Sunset Beach Music Carnival",
    location: "Vagator Beach, Goa",
    price: 2499,
    eventDate: "2026-11-15",
    description: "India's premier electronic and indie beach gathering featuring world-class DJs, visual art installations, and culinary stalls.",
    images: ["https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"]
  },
  {
    _id: "event_02",
    id: "event_02",
    title: "Pushkar Royal Desert & Cultural Festival",
    eventName: "Pushkar Royal Desert & Cultural Festival",
    location: "Pushkar, Rajasthan",
    price: 1800,
    eventDate: "2026-11-22",
    description: "Spectacular desert folk dances, hot air balloon flights, Rajasthani handicraft bazaars, and sunset camel safaris.",
    images: ["https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80"]
  }
];
