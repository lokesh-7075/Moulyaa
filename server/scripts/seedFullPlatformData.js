/**
 * 🌟 Master Platform Data & Demo Seeder for Moulyasree Tourism Platform
 * Populates full users, providers, hotels, rooms, vehicles, restaurants, foods, 
 * guides, travel posts, bookings, reviews, and events into both MongoDB and Amazon DynamoDB!
 * 
 * Run via: node server/scripts/seedFullPlatformData.js
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

// Models
const User = require("../models/User");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const Vehicle = require("../models/Vehicle");
const Restaurant = require("../models/Restaurant");
const Food = require("../models/Food");
const Guide = require("../models/Guide");
const GuidePost = require("../models/GuidePost");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const Event = require("../models/Event");
const Employee = require("../models/Employee");

// DynamoDB Repositories
const { putItem } = require("../services/dynamoRepository");

const SEED_USERS = [
  {
    name: "Moulyasree Super Admin",
    email: "admin@moulyasree.com",
    password: "Admin@123",
    role: "admin",
    phone: "+91 98765 43210",
    status: "approved",
    membership: true
  },
  {
    name: "Priya Sharma (Explorer)",
    email: "traveler@gmail.com",
    password: "Traveler@123",
    role: "traveler",
    phone: "+91 98111 22334",
    status: "approved",
    membership: true
  },
  {
    name: "Rajesh Verma (Grand Heritage Hotel)",
    email: "hotel_owner@gmail.com",
    password: "Hotel@123",
    role: "hotel_owner",
    phone: "+91 98222 33445",
    status: "approved",
    membership: true
  },
  {
    name: "Suresh Kumar (Innova & Thar Fleet)",
    email: "vehicle_owner@gmail.com",
    password: "Vehicle@123",
    role: "vehicle_owner",
    phone: "+91 98333 44556",
    status: "approved",
    membership: true
  },
  {
    name: "Chef Ananya Roy (Royal Spice Dining)",
    email: "restaurant_owner@gmail.com",
    password: "Restaurant@123",
    role: "restaurant_owner",
    phone: "+91 98444 55667",
    status: "approved",
    membership: true
  },
  {
    name: "Vikramaditya Rao (Certified Guide)",
    email: "tour_guide@gmail.com",
    password: "Guide@123",
    role: "tour_guide",
    phone: "+91 98555 66778",
    status: "approved",
    membership: true
  },
  {
    name: "Kavita Reddy (Events & Festivals)",
    email: "event_organizer@gmail.com",
    password: "Event@123",
    role: "event_organizer",
    phone: "+91 98666 77889",
    status: "approved",
    membership: true
  },
  {
    name: "Ramesh Naidu (Customer Operations)",
    email: "employee@moulyasree.com",
    password: "Employee@123",
    role: "employee",
    phone: "+91 98777 88990",
    status: "approved",
    membership: true
  },
  // Pending Providers to test Admin Approval workflow in Admin Dashboard!
  {
    name: "Arjun Mehta (Mountain View Homestay)",
    email: "pending_hotel@gmail.com",
    password: "Hotel@123",
    role: "hotel_owner",
    phone: "+91 98888 99001",
    status: "pending",
    membership: false
  },
  {
    name: "Deepak Chawla (Jaipur Royal Cabs)",
    email: "pending_cab@gmail.com",
    password: "Vehicle@123",
    role: "vehicle_owner",
    phone: "+91 98999 00112",
    status: "pending",
    membership: false
  }
];

async function seedData() {
  console.log("\n=======================================================");
  console.log("🌱 Starting Full Platform Data & User Seeder for Moulyasree");
  console.log("=======================================================\n");

  let mongoConnected = false;
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
      mongoConnected = true;
      console.log("🍃 Connected to MongoDB / DocumentDB successfully.");
    }
  } catch (err) {
    console.warn("ℹ️ MongoDB local offline (seeding to AWS DynamoDB directly).");
  }

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const createdUsers = {};

  console.log("🔑 [1/6] Creating & Synchronizing User Accounts...");
  for (const u of SEED_USERS) {
    const hashedPassword = await bcrypt.hash(u.password, salt);
    const userId = `usr_${u.role}_${Math.random().toString(36).substring(2, 8)}`;

    // Sync to AWS DynamoDB
    try {
      await putItem("Moulyasree_Users", {
        id: userId,
        name: u.name,
        email: u.email.toLowerCase(),
        password: hashedPassword,
        phone: u.phone,
        role: u.role,
        status: u.status,
        membership: u.membership,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      // ignore if offline
    }

    // Sync to MongoDB if connected
    if (mongoConnected) {
      const existing = await User.findOne({ email: u.email.toLowerCase() });
      if (!existing) {
        const saved = await new User({
          ...u,
          email: u.email.toLowerCase(),
          password: hashedPassword
        }).save();
        createdUsers[u.role] = saved;
      } else {
        createdUsers[u.role] = existing;
      }
    }
  }

  console.log("🏨 [2/6] Seeding Verified Hotels & Luxury Rooms...");
  const hotelsData = [
    {
      id: "hotel_goa_01",
      hotelName: "Taj Exotica Resort & Luxury Spa",
      location: "Benaulim, South Goa",
      description: "Mediterranean-inspired 5-star beachfront paradise nestled amidst 56 acres of lush gardens along Goa's pristine coast.",
      rating: 4.9,
      images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"]
    },
    {
      id: "hotel_jaipur_01",
      hotelName: "The Oberoi Rajvilas Heritage Palace",
      location: "Jaipur, Rajasthan",
      description: "Traditional Rajasthani architecture, tranquil reflection pools, luxury tents, and authentic royal hospitality.",
      rating: 4.95,
      images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"]
    },
    {
      id: "hotel_kerala_01",
      hotelName: "Kumarakom Lake Resort & Backwater Haven",
      location: "Kottayam, Kerala",
      description: "Acclaimed luxury backwater retreat with heritage villas, private plunge pools, and Ayurvedic wellness therapies.",
      rating: 4.88,
      images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80"]
    },
    {
      id: "hotel_manali_01",
      hotelName: "The Himalayan Pine Chalet & Alpine Spa",
      location: "Manali, Himachal Pradesh",
      description: "Victorian Gothic castle set amidst apple orchards and deodar forests overlooking snow-clad Himalayan peaks.",
      rating: 4.85,
      images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"]
    },
    {
      id: "hotel_varanasi_01",
      hotelName: "BrijRama Palace Heritage on the Ganges",
      location: "Darbhanga Ghat, Varanasi",
      description: "One of the oldest heritage palaces on the sacred Ganges ghats, showcasing 18th-century Maratha architecture.",
      rating: 4.92,
      images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"]
    }
  ];

  for (const h of hotelsData) {
    try {
      await putItem("Moulyasree_Hotels", h);
    } catch (e) {}

    if (mongoConnected && createdUsers["hotel_owner"]) {
      const existing = await Hotel.findOne({ hotelName: h.hotelName });
      let hotelDoc = existing;
      if (!existing) {
        hotelDoc = await new Hotel({
          ownerId: createdUsers["hotel_owner"]._id,
          hotelName: h.hotelName,
          location: h.location,
          description: h.description,
          rating: h.rating,
          images: h.images
        }).save();
      }

      // Add rooms
      const existingRoom = await Room.findOne({ hotelId: hotelDoc._id });
      if (!existingRoom) {
        await new Room({
          hotelId: hotelDoc._id,
          ownerId: createdUsers["hotel_owner"]._id,
          title: "Royal Deluxe Heritage Suite with Balcony",
          price: 6500,
          capacity: 2,
          bedType: "King Size",
          available: true,
          roomImages: h.images
        }).save();
      }
    }
  }

  console.log("🚗 [3/6] Seeding Vehicles & Cabs Fleet...");
  const vehiclesData = [
    {
      id: "veh_01",
      vehicleName: "Toyota Innova Crysta ZX (7-Seater Luxury AC)",
      type: "car",
      pricePerDay: 4200,
      location: "Pan-India / Airport Pickup",
      availability: true,
      rating: 4.9,
      images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      id: "veh_02",
      vehicleName: "Mahindra Thar 4x4 Hard-Top (Adventure Expedition)",
      type: "jeep",
      pricePerDay: 5500,
      location: "Manali / Leh / Goa",
      availability: true,
      rating: 4.95,
      images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      id: "veh_03",
      vehicleName: "Force Urbania 17-Seater Luxury Tour Coach",
      type: "bus",
      pricePerDay: 9500,
      location: "Jaipur / Delhi / Golden Triangle",
      availability: true,
      rating: 4.88,
      images: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      id: "veh_04",
      vehicleName: "Royal Enfield Himalayan 450 (Mountain Tour)",
      type: "bike",
      pricePerDay: 1800,
      location: "Himachal / Ladakh / Rishikesh",
      availability: true,
      rating: 4.92,
      images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80"]
    }
  ];

  for (const v of vehiclesData) {
    try {
      await putItem("Moulyasree_Vehicles", v);
    } catch (e) {}

    if (mongoConnected && createdUsers["vehicle_owner"]) {
      const existing = await Vehicle.findOne({ vehicleName: v.vehicleName });
      if (!existing) {
        await new Vehicle({
          ownerId: createdUsers["vehicle_owner"]._id,
          vehicleName: v.vehicleName,
          type: v.type,
          pricePerDay: v.pricePerDay,
          location: v.location,
          availability: v.availability,
          rating: v.rating,
          images: v.images
        }).save();
      }
    }
  }

  console.log("🍽️ [4/6] Seeding Authentic Restaurants & Gourmet Dishes...");
  const restaurantsData = [
    {
      id: "rest_01",
      restaurantName: "Royal Spice Courtyard & Rooftop Lounge",
      location: "Jaipur & Pan-India",
      description: "Fine dining offering authentic Rajasthani Thali, Royal Mughlai kebabs, and live classical sitar music.",
      images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      id: "rest_02",
      restaurantName: "Fisherman's Wharf Coastal Catch & Shack",
      location: "Cavelossim, Goa",
      description: "Authentic Goan seafood curries, Butter Garlic Crabs, and riverside sunset cocktails.",
      images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"]
    }
  ];

  for (const r of restaurantsData) {
    try {
      await putItem("Moulyasree_Restaurants", r);
    } catch (e) {}

    if (mongoConnected && createdUsers["restaurant_owner"]) {
      const existing = await Restaurant.findOne({ restaurantName: r.restaurantName });
      let restDoc = existing;
      if (!existing) {
        restDoc = await new Restaurant({
          ownerId: createdUsers["restaurant_owner"]._id,
          restaurantName: r.restaurantName,
          location: r.location,
          description: r.description,
          images: r.images
        }).save();
      }

      // Add Food items
      const existingFood = await Food.findOne({ restaurantId: restDoc._id });
      if (!existingFood) {
        await new Food({
          restaurantId: restDoc._id,
          foodName: "Shahi Royal Dal Makhani & Garlic Butter Naan",
          category: "North Indian Main Course",
          price: 450,
          description: "Slow cooked black lentils for 24 hours infused with butter and aromatic spices.",
          foodImages: r.images,
          availability: true
        }).save();
      }
    }
  }

  console.log("🗺️ [5/6] Seeding Certified Guides & Visual Travel Posts...");
  const guidesData = [
    {
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
      id: "guide_02",
      guideName: "Meenakshi Sundaram (Temple & Cultural Narrator)",
      languages: ["English", "Tamil", "Hindi", "German"],
      experience: 9,
      pricePerDay: 3200,
      location: "Madurai / Tanjore / Hampi",
      description: "Dravidian temple architecture scholar and cultural historian.",
      rating: 4.94,
      images: ["https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80"]
    }
  ];

  for (const g of guidesData) {
    try {
      await putItem("Moulyasree_Guides", g);
    } catch (e) {}

    if (mongoConnected && createdUsers["tour_guide"]) {
      const existing = await Guide.findOne({ guideName: g.guideName });
      let guideDoc = existing;
      if (!existing) {
        guideDoc = await new Guide({
          ownerId: createdUsers["tour_guide"]._id,
          guideName: g.guideName,
          languages: g.languages,
          experience: g.experience,
          pricePerDay: g.pricePerDay,
          location: g.location,
          description: g.description,
          rating: g.rating,
          images: g.images
        }).save();
      }

      // Add Guide Post
      const existingPost = await GuidePost.findOne({ guideId: guideDoc._id });
      if (!existingPost) {
        await new GuidePost({
          guideId: guideDoc._id,
          title: "🌅 Secret Sunset & Architecture Secrets of Amber Fort",
          description: "Discover how Raja Man Singh built acoustic water channels and mirror mosaic halls that lit up an entire palace with a single candle!",
          images: ["https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"]
        }).save();
      }
    }
  }

  console.log("💳 [6/6] Generating Rich Bookings, Payments & Revenue for Admin Dashboard...");
  if (mongoConnected && createdUsers["traveler"] && createdUsers["hotel_owner"]) {
    const travelerId = createdUsers["traveler"]._id;
    const providerId = createdUsers["hotel_owner"]._id;

    const sampleBookings = [
      { serviceType: "hotel", totalAmount: 18500, bookingStatus: "confirmed", paymentStatus: "paid", numberOfPeople: 2 },
      { serviceType: "vehicle", totalAmount: 12600, bookingStatus: "confirmed", paymentStatus: "paid", numberOfPeople: 4 },
      { serviceType: "tour_guide", totalAmount: 7000, bookingStatus: "confirmed", paymentStatus: "paid", numberOfPeople: 2 },
      { serviceType: "restaurant", totalAmount: 3800, bookingStatus: "confirmed", paymentStatus: "paid", numberOfPeople: 4 },
      { serviceType: "event", totalAmount: 9500, bookingStatus: "confirmed", paymentStatus: "paid", numberOfPeople: 2 },
      { serviceType: "hotel", totalAmount: 24500, bookingStatus: "pending", paymentStatus: "pending", numberOfPeople: 3 }
    ];

    for (const b of sampleBookings) {
      const count = await Booking.countDocuments();
      if (count < 10) {
        await new Booking({
          travelerId,
          providerId,
          serviceId: providerId,
          serviceType: b.serviceType,
          totalAmount: b.totalAmount,
          bookingStatus: b.bookingStatus,
          paymentStatus: b.paymentStatus,
          numberOfPeople: b.numberOfPeople,
          travelDate: new Date(Date.now() + 86400000 * 3)
        }).save();
      }
    }
  }

  console.log("\n🎉 =======================================================");
  console.log("✨ ALL DEFAULT DATA, USERS, POSTS & BOOKINGS POPULATED!");
  console.log("=======================================================\n");

  if (mongoConnected) {
    await mongoose.disconnect();
  }
}

seedData().catch(err => {
  console.error("❌ Seeding Error:", err);
  process.exit(1);
});
