/**
 * 🇮🇳 Pan-India Tourism Inventory Catalog
 * Across North, South, East, West, Central & Himalayan Regions
 */

const panIndiaHotels = [
  // 1. Kashmir (Srinagar / Gulmarg)
  {
    id: "hotel_kash_01",
    ownerEmail: "hotel_kashmir@gmail.com",
    name: "Kashmir Grand Palace & Dal Lake Houseboats",
    location: "Srinagar, Kashmir",
    region: "North",
    pricePerNight: 5500,
    rating: 4.9,
    description: "Luxury heritage stay with private shikara transfers and snow mountain views of Pir Panjal.",
    images: ["https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800"],
    amenities: ["Heated Rooms", "Dal Lake View", "Wazwan Dining", "Shikara Pickup"]
  },
  {
    id: "hotel_gul_02",
    ownerEmail: "hotel_gulmarg@gmail.com",
    name: "The Gulmarg Alpine Ski Resort & Chalet",
    location: "Gulmarg, Kashmir",
    region: "North",
    pricePerNight: 7200,
    rating: 4.8,
    description: "Premium ski chalet 5 mins from Gulmarg Gondola phase 1 with private fireplace.",
    images: ["https://images.unsplash.com/photo-1548013146-72479768bada?w=800"],
    amenities: ["Ski Gear Rental", "Gondola Access", "Bonfire Lounge"]
  },

  // 2. Goa (North & South)
  {
    id: "hotel_goa_01",
    ownerEmail: "hotel_goa@gmail.com",
    name: "Goa Beachfront Palms Resort & Villa",
    location: "Calangute & Baga, Goa",
    region: "West",
    pricePerNight: 4200,
    rating: 4.8,
    description: "Vibrant beach resort 100m from Baga shoreline featuring infinity pool and sunset cabanas.",
    images: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800"],
    amenities: ["Private Beach Access", "Infinity Pool", "Live Seafood Shack"]
  },

  // 3. Rajasthan (Jaipur / Udaipur / Jaisalmer)
  {
    id: "hotel_jpr_01",
    ownerEmail: "hotel_jaipur@gmail.com",
    name: "Haveli Heritage Royal Palace",
    location: "Jaipur, Rajasthan",
    region: "West",
    pricePerNight: 4800,
    rating: 4.9,
    description: "Authentic 18th-century royal haveli with jharokha balconies and traditional Rajasthani courtyard.",
    images: ["https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800"],
    amenities: ["Rooftop Fort View", "Kathak Folk Dances", "Royal Dining"]
  },
  {
    id: "hotel_udp_02",
    ownerEmail: "hotel_udaipur@gmail.com",
    name: "Lake Pichola Heritage Lakeview Suites",
    location: "Udaipur, Rajasthan",
    region: "West",
    pricePerNight: 6500,
    rating: 4.9,
    description: "Panoramic lakefront hotel overlooking City Palace and Lake Palace.",
    images: ["https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800"],
    amenities: ["Boat Transfers", "Rooftop Romantic Dining", "Spa"]
  },

  // 4. Himachal Pradesh (Manali / Shimla)
  {
    id: "hotel_mnl_01",
    ownerEmail: "hotel_manali@gmail.com",
    name: "Solang Valley Snow View Resort",
    location: "Manali, Himachal Pradesh",
    region: "North",
    pricePerNight: 3800,
    rating: 4.7,
    description: "Pine forest retreat on the Beas River bank with stunning Rohtang Pass panoramas.",
    images: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800"],
    amenities: ["Apple Orchard Trail", "Heated Beds", "Adventure Desk"]
  },

  // 5. Kerala (Munnar / Alleppey / Wayanad)
  {
    id: "hotel_ker_01",
    ownerEmail: "hotel_kerala@gmail.com",
    name: "Munnar Mist Tea Plantation Estate",
    location: "Munnar, Kerala",
    region: "South",
    pricePerNight: 4500,
    rating: 4.9,
    description: "Breathtaking bungalow surrounded by 200 acres of emerald tea gardens with waterfall trek.",
    images: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800"],
    amenities: ["Tea Tasting Tour", "Ayurvedic Spa", "Mountain Trekking"]
  },
  {
    id: "hotel_alp_02",
    ownerEmail: "hotel_alleppey@gmail.com",
    name: "Alleppey Luxury Backwater Cruise & Houseboats",
    location: "Alleppey, Kerala",
    region: "South",
    pricePerNight: 7500,
    rating: 4.9,
    description: "Air-conditioned 2-bedroom traditional Kettuvallam boat with private chef on backwaters.",
    images: ["https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800"],
    amenities: ["Private Chef", "Sunset Cruise", "Village Tours"]
  },

  // 6. Tamil Nadu (Ooty / Kodaikanal)
  {
    id: "hotel_ooty_01",
    ownerEmail: "hotel_ooty@gmail.com",
    name: "Nilgiri Mountain Grand Heritage",
    location: "Ooty, Tamil Nadu",
    region: "South",
    pricePerNight: 3900,
    rating: 4.8,
    description: "Colonial British cottage nestled in eucalyptus hills near Ooty Lake and Botanical Gardens.",
    images: ["https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800"],
    amenities: ["Fireplace Rooms", "High Tea", "Toy Train Station Shuttle"]
  },

  // 7. Uttar Pradesh (Varanasi / Agra)
  {
    id: "hotel_vns_01",
    ownerEmail: "hotel_varanasi@gmail.com",
    name: "Ganga Ghat Heritage Riverside Retreat",
    location: "Varanasi, Uttar Pradesh",
    region: "North",
    pricePerNight: 3600,
    rating: 4.8,
    description: "Ancient haveli right on Assi Ghat with front-row view of Morning Subah-e-Banaras and Ganga Aarti.",
    images: ["https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800"],
    amenities: ["Rooftop Aarti View", "Boat Pickup", "Yoga Hall"]
  },

  // 8. Karnataka (Hampi / Coorg)
  {
    id: "hotel_hmp_01",
    ownerEmail: "hotel_hampi@gmail.com",
    name: "Hampi Boulders & Heritage Village Resort",
    location: "Hampi, Karnataka",
    region: "South",
    pricePerNight: 4100,
    rating: 4.8,
    description: "Unique stone architecture resort right next to Tungabhadra River and UNESCO ruins.",
    images: ["https://images.unsplash.com/photo-1600100397608-f010e4210a56?w=800"],
    amenities: ["Ruins Cycle Tour", "Rock Climbing", "Riverside Dining"]
  },

  // 9. Ladakh (Leh / Nubra / Pangong)
  {
    id: "hotel_ldk_01",
    ownerEmail: "hotel_ladakh@gmail.com",
    name: "The Grand Dragon Ladakh & Nubra Glamping",
    location: "Leh & Nubra, Ladakh",
    region: "North",
    pricePerNight: 6800,
    rating: 4.9,
    description: "Solar-heated luxury hotel with oxygen-enriched suites and views of Leh Palace and Stok Kangri.",
    images: ["https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800"],
    amenities: ["Oxygen Concentrator", "Stargazing Deck", "Camel Safari Booking"]
  },

  // 10. Uttarakhand (Rishikesh / Nainital)
  {
    id: "hotel_rsh_01",
    ownerEmail: "hotel_rishikesh@gmail.com",
    name: "Ganga Kinare Riverside Yoga & Wellness Resort",
    location: "Rishikesh, Uttarakhand",
    region: "North",
    pricePerNight: 4600,
    rating: 4.8,
    description: "Private beach access on holy Ganges, daily yoga by Himalayan masters, and rafting desk.",
    images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
    amenities: ["Private Ghat", "Rafting Package", "Ayurveda Wellness"]
  }
];

const panIndiaVehicles = [
  // Kashmir
  {
    id: "veh_kash_01",
    ownerEmail: "vehicle_kashmir@gmail.com",
    name: "Toyota Innova Crysta Luxury 4x4 (Snow-Chained)",
    location: "Srinagar & Gulmarg, Kashmir",
    type: "car",
    category: "Luxury SUV",
    pricePerDay: 3200,
    rating: 4.9,
    description: "All-weather heated luxury MPV with snow chains for Gulmarg, Sonamarg, and Pahalgam circuits.",
    images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"]
  },
  {
    id: "veh_kash_02",
    ownerEmail: "vehicle_shikara@gmail.com",
    name: "Royal Kashmiri Decorated Shikara Boat (Dal Lake)",
    location: "Srinagar, Kashmir",
    type: "van",
    category: "Heritage Water Transport",
    pricePerDay: 1200,
    rating: 4.9,
    description: "Traditional carved cedarwood Shikara for floating flower markets and Char Chinar.",
    images: ["https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800"]
  },

  // Goa
  {
    id: "veh_goa_01",
    ownerEmail: "vehicle_goa@gmail.com",
    name: "Mahindra Thar 4x4 Open Convertible",
    location: "North & South Goa",
    type: "jeep",
    category: "Beach Adventure",
    pricePerDay: 2800,
    rating: 4.9,
    description: "Iconic red open-top 4x4 Thar for beach hopping across Vagator, Anjuna, and Palolem.",
    images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"]
  },
  {
    id: "veh_goa_02",
    ownerEmail: "vehicle_goa_bike@gmail.com",
    name: "Royal Enfield Classic 350 Cruise Bike",
    location: "Panaji & Calangute, Goa",
    type: "bike",
    category: "Cruise Bike",
    pricePerDay: 800,
    rating: 4.8,
    description: "Thumping Royal Enfield with dual helmets, ideal for exploring coastal highways and spice farms.",
    images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800"]
  },

  // Rajasthan (Jaipur / Jaisalmer)
  {
    id: "veh_jpr_01",
    ownerEmail: "vehicle_jaipur@gmail.com",
    name: "Heritage AC Sedan Swift Dzire (Chauffeur Driven)",
    location: "Jaipur & Udaipur, Rajasthan",
    type: "car",
    category: "Comfort Sedan",
    pricePerDay: 2100,
    rating: 4.8,
    description: "Clean sanitized chauffeur-driven sedan covering Amer Fort, Hawa Mahal, and City Palace.",
    images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"]
  },
  {
    id: "veh_jsm_02",
    ownerEmail: "vehicle_jaisalmer@gmail.com",
    name: "Desert Safari 4x4 Dune Bashing Gypsy",
    location: "Jaisalmer Sam Dunes, Rajasthan",
    type: "jeep",
    category: "Desert Safari",
    pricePerDay: 3500,
    rating: 4.9,
    description: "Specially tuned 4WD vehicle for thrilling dune bashing and desert camp transfers in Thar.",
    images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"]
  },

  // Himachal Pradesh (Manali / Spiti)
  {
    id: "veh_mnl_01",
    ownerEmail: "vehicle_manali@gmail.com",
    name: "Force Tempo Traveller 12-Seater (Himalayan Special)",
    location: "Manali, Shimla & Spiti Valley",
    type: "bus",
    category: "Group Mountain Transport",
    pricePerDay: 4800,
    rating: 4.8,
    description: "Spacious push-back AC tempo traveller equipped with music system and heavy-duty suspension.",
    images: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800"]
  },
  {
    id: "veh_mnl_02",
    ownerEmail: "vehicle_leh_himalayan@gmail.com",
    name: "Royal Enfield Himalayan 450 Adv Bike",
    location: "Manali to Leh Highway",
    type: "bike",
    category: "Adventure Tourer",
    pricePerDay: 1600,
    rating: 4.9,
    description: "Purpose-built adventure tourer bike with panniers, perfect for Atal Tunnel and high mountain passes.",
    images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800"]
  },

  // Kerala (Munnar / Kochi)
  {
    id: "veh_ker_01",
    ownerEmail: "vehicle_kerala@gmail.com",
    name: "Toyota Ertiga XL6 Premium AC Cab",
    location: "Cochin, Munnar & Alleppey, Kerala",
    type: "car",
    category: "Family MUV",
    pricePerDay: 2400,
    rating: 4.9,
    description: "Smooth English/Hindi speaking driver for airport pickup, hill transfers, and tea garden circuits.",
    images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"]
  },

  // Tamil Nadu (Ooty / Kodaikanal)
  {
    id: "veh_ooty_01",
    ownerEmail: "vehicle_ooty@gmail.com",
    name: "Mahindra Bolero Neo Mountain 7-Seater",
    location: "Ooty & Coonoor, Tamil Nadu",
    type: "car",
    category: "Hill Station Special",
    pricePerDay: 2300,
    rating: 4.8,
    description: "High torque hill station vehicle covering Pykara Lake, Doddabetta Peak, and tea factories.",
    images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"]
  },

  // Uttar Pradesh (Varanasi / Agra / Delhi)
  {
    id: "veh_del_01",
    ownerEmail: "vehicle_delhi@gmail.com",
    name: "Honda City Golden Triangle Highway Sedan",
    location: "Delhi, Agra & Jaipur Circuit",
    type: "car",
    category: "Executive Express",
    pricePerDay: 2700,
    rating: 4.9,
    description: "Expressway-toll-ready luxury sedan for Yamuna Expressway Taj Mahal and Delhi sightseeing.",
    images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"]
  },
  {
    id: "veh_vns_02",
    ownerEmail: "vehicle_varanasi@gmail.com",
    name: "Banaras Green Electric Auto & Cab Service",
    location: "Varanasi, Uttar Pradesh",
    type: "car",
    category: "Ghats Transit",
    pricePerDay: 1400,
    rating: 4.8,
    description: "Compact eco cab capable of navigating Old Varanasi gallis, Sarnath, and airport expressway.",
    images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"]
  },

  // Ladakh
  {
    id: "veh_ldk_01",
    ownerEmail: "vehicle_ladakh@gmail.com",
    name: "Toyota Fortuner 4x4 High-Altitude Expedition",
    location: "Leh, Nubra, Pangong Tso & Hanle",
    type: "jeep",
    category: "Expedition 4WD",
    pricePerDay: 4500,
    rating: 4.9,
    description: "Heavy duty 4x4 equipped with oxygen cylinder and satellite GPS for Khardung La (18,380 ft).",
    images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"]
  },

  // Karnataka (Hampi / Coorg)
  {
    id: "veh_hmp_01",
    ownerEmail: "vehicle_hampi@gmail.com",
    name: "Hampi Heritage Vintage Open Jeep",
    location: "Hampi & Hospet, Karnataka",
    type: "jeep",
    category: "Heritage Explorer",
    pricePerDay: 2200,
    rating: 4.9,
    description: "Open air safari jeep covering Vijayanagara ruins, Vitthala Stone Chariot, and Sanapur Lake.",
    images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"]
  }
];

const panIndiaRestaurants = [
  // Kashmir
  {
    id: "rest_kash_01",
    ownerEmail: "restaurant_kashmir@gmail.com",
    name: "Mughal Darbar & Wazwan House",
    location: "Srinagar, Kashmir",
    specialties: ["Rogan Josh", "Gushtaba", "Kahwa Tea", "Modur Pulao"],
    rating: 4.9,
    description: "Famous 50-year-old establishment serving authentic 36-course royal Kashmiri Wazwan.",
    images: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800"]
  },

  // Goa
  {
    id: "rest_goa_01",
    ownerEmail: "restaurant_goa@gmail.com",
    name: "Fisherman's Wharf & Sunset Beach Shack",
    location: "Calangute & Panaji, Goa",
    specialties: ["Goan Prawn Curry", "Pork Vindaloo", "Bebinca", "Kingfish Rava Fry"],
    rating: 4.9,
    description: "Iconic riverside dining with live Portuguese fado music and fresh Arabian Sea catch.",
    images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"]
  },

  // Rajasthan (Jaipur)
  {
    id: "rest_jpr_01",
    ownerEmail: "restaurant_jaipur@gmail.com",
    name: "Chokhi Dhani Royal Rajasthani Rasoi",
    location: "Jaipur, Rajasthan",
    specialties: ["Dal Baati Churma", "Laal Maas", "Gatte Ki Sabzi", "Ker Sangri"],
    rating: 4.9,
    description: "Traditional village-themed luxury dining served on brass thalis with royal hospitality.",
    images: ["https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800"]
  },

  // Kerala
  {
    id: "rest_ker_01",
    ownerEmail: "restaurant_kerala@gmail.com",
    name: "Malabar Spice & Banana Leaf House",
    location: "Munnar & Kochi, Kerala",
    specialties: ["Kerala Sadya Feast", "Appam with Stew", "Karimeen Pollichathu", "Filter Coffee"],
    rating: 4.8,
    description: "Authentic coastal dining served on fresh plantain leaves featuring Kerala spices.",
    images: ["https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800"]
  },

  // Varanasi
  {
    id: "rest_vns_01",
    ownerEmail: "restaurant_varanasi@gmail.com",
    name: "Kashi Chaat Bhandar & Malaiyo Sweet Corner",
    location: "Varanasi, Uttar Pradesh",
    specialties: ["Tamatar Chaat", "Banarasi Paan", "Malaiyo Saffron Foam", "Kachori Jalebi"],
    rating: 4.9,
    description: "Legendary heritage street food institution praised by national and international food critics.",
    images: ["https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800"]
  },

  // Delhi
  {
    id: "rest_del_01",
    ownerEmail: "restaurant_delhi@gmail.com",
    name: "Karim's & Daryaganj Original Mughlai",
    location: "Old Delhi & Connaught Place",
    specialties: ["Butter Chicken", "Mutton Seekh Kebab", "Nihari", "Shahi Tukda"],
    rating: 4.9,
    description: "Historic culinary powerhouse established in 1913 near Jama Masjid.",
    images: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800"]
  },

  // Hyderabad
  {
    id: "rest_hyd_01",
    ownerEmail: "restaurant_hyderabad@gmail.com",
    name: "Paradise & Shadab Nizami Dum Biryani House",
    location: "Hyderabad, Telangana",
    specialties: ["Hyderabadi Mutton Dum Biryani", "Mirchi Ka Salan", "Double Ka Meetha", "Haleem"],
    rating: 4.9,
    description: "The gold standard of aromatic dum cooking and authentic Nizami recipes.",
    images: ["https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800"]
  },

  // Kolkata
  {
    id: "rest_kol_01",
    ownerEmail: "restaurant_kolkata@gmail.com",
    name: "6 Ballygunge Place Bengali Dining",
    location: "Kolkata, West Bengal",
    specialties: ["Kosha Mangsho", "Ilish Macher Paturi", "Chingri Malai Curry", "Mishti Doi"],
    rating: 4.8,
    description: "Refined heritage bungalow setting serving time-honored traditional Bengali cuisine.",
    images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"]
  }
];

const panIndiaGuides = [
  // Agra / Taj Mahal
  {
    id: "guide_agr_01",
    ownerEmail: "guide_agra@gmail.com",
    guideName: "Rajesh Sharma (ASI Gold Medalist)",
    location: "Agra, Uttar Pradesh",
    languages: ["English", "Hindi", "French", "German"],
    experience: 14,
    pricePerDay: 2000,
    rating: 4.9,
    description: "Ministry of Tourism certified heritage archaeologist specializing in Taj Mahal, Agra Fort, and Fatehpur Sikri secrets.",
    images: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800"]
  },

  // Varanasi
  {
    id: "guide_vns_01",
    ownerEmail: "guide_varanasi@gmail.com",
    guideName: "Acharya Anand Mishra",
    location: "Varanasi, Uttar Pradesh",
    languages: ["English", "Hindi", "Sanskrit", "Spanish"],
    experience: 12,
    pricePerDay: 1800,
    rating: 4.9,
    description: "Deep spiritual guide for Ghat boat stories, Kashi Vishwanath corridors, Vedic rituals, and silk weaving alleys.",
    images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"]
  },

  // Kashmir
  {
    id: "guide_kash_01",
    ownerEmail: "guide_kashmir@gmail.com",
    guideName: "Tariq Ahmad Dar",
    location: "Srinagar & Gulmarg, Kashmir",
    languages: ["English", "Hindi", "Kashmiri", "Urdu"],
    experience: 9,
    pricePerDay: 2200,
    rating: 4.9,
    description: "Native Himalayan mountaineer and licensed guide for Great Lakes trek, Mughal Gardens, and saffron farming.",
    images: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800"]
  },

  // Jaipur
  {
    id: "guide_jpr_01",
    ownerEmail: "guide_jaipur@gmail.com",
    guideName: "Vikramaditya Singh Rathore",
    location: "Jaipur, Rajasthan",
    languages: ["English", "Hindi", "Italian", "Japanese"],
    experience: 15,
    pricePerDay: 2100,
    rating: 4.9,
    description: "Royal Rajput heritage historian with VIP entry privileges at Amer Fort, Jantar Mantar, and hidden stepwells.",
    images: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800"]
  },

  // Hampi
  {
    id: "guide_hmp_01",
    ownerEmail: "guide_hampi@gmail.com",
    guideName: "Manjunath Gowda",
    location: "Hampi, Karnataka",
    languages: ["English", "Hindi", "Kannada", "Telugu"],
    experience: 11,
    pricePerDay: 1900,
    rating: 4.8,
    description: "Archaeological enthusiast bringing the 14th-century Vijayanagara Empire stone ruins alive with captivating storytelling.",
    images: ["https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800"]
  },

  // Kerala
  {
    id: "guide_ker_01",
    ownerEmail: "guide_kerala@gmail.com",
    guideName: "Mathew Varghese",
    location: "Munnar & Kochi, Kerala",
    languages: ["English", "Hindi", "Malayalam", "Tamil"],
    experience: 10,
    pricePerDay: 1900,
    rating: 4.9,
    description: "Certified naturalist covering spice plantations, endemic birds in Eravikulam National Park, and Kathakali history.",
    images: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800"]
  },

  // Ladakh
  {
    id: "guide_ldk_01",
    ownerEmail: "guide_ladakh@gmail.com",
    guideName: "Stanzin Norbu",
    location: "Leh, Nubra & Pangong, Ladakh",
    languages: ["English", "Hindi", "Ladakhi", "Tibetan"],
    experience: 8,
    pricePerDay: 2500,
    rating: 4.9,
    description: "High-altitude wilderness guide & Tibetan Buddhist monastery historian.",
    images: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800"]
  }
];

module.exports = {
  panIndiaHotels,
  panIndiaVehicles,
  panIndiaRestaurants,
  panIndiaGuides
};
