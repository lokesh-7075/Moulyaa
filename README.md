# 🌍 Moulyasree — Next-Gen Pan-India Tourism & AI Concierge Platform

[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Cloud%20%7C%20AI-blue.svg)](https://github.com/lokesh-7075/Moulyaa)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%20%7C%20CSS%20Glassmorphism-61DAFB.svg)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%205-green.svg)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20%2B%20Amazon%20DynamoDB-47A248.svg)](https://aws.amazon.com/dynamodb/)
[![AI Models](https://img.shields.io/badge/AI-Amazon%20Bedrock%20%28Claude%203%29%20%7C%20Ollama-orange.svg)](https://aws.amazon.com/bedrock/)
[![Cloud Infrastructure](https://img.shields.io/badge/AWS-S3%20%7C%20CloudFront%20%7C%20App%20Runner%20%7C%20Terraform-FF9900.svg)](https://aws.amazon.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 📖 Table of Contents
1. [Project Vision & Core Idea](#-project-vision--core-idea)
2. [Key Platform Features](#-key-platform-features)
3. [Technology Stack & Why Each Tool Was Chosen](#-technology-stack--why-each-tool-was-chosen)
4. [System Architecture](#-system-architecture)
5. [Pan-India Tourism Verticals](#-pan-india-tourism-verticals)
6. [Generative AI Capabilities](#-generative-ai-capabilities)
7. [Project Directory Structure](#-project-directory-structure)
8. [Getting Started & Local Setup](#-getting-started--local-setup)
9. [Docker & Containerized Deployment](#-docker--containerized-deployment)
10. [AWS Cloud Deployment](#-aws-cloud-deployment)
11. [Environment Variables Reference](#-environment-variables-reference)
12. [Contributing & Authors](#-contributing--authors)

---

## 💡 Project Vision & Core Idea

Planning travel across diverse tourist destinations in India typically requires navigating fragmented services: one app for hotels, another for local cab rentals, third-party sites for tour guides, separate platforms for local food ordering, and guidebooks for trip planning.

**Moulyasree** solves this problem by providing a **unified, hyper-personalized, and AI-powered Pan-India Tourism Ecosystem**. It integrates five essential pillars of travel into a single intuitive application, augmented with enterprise Generative AI capabilities:

1. **🏨 Stays & Resorts** — Luxury, boutique, and budget accommodations across 30+ major Indian travel hubs.
2. **🍽️ Dining & Culinary** — Table reservations, localized menus, and regional food ordering.
3. **🧭 Certified Tour Guides** — Multilingual heritage, adventure, and cultural local guides.
4. **🚗 Vehicle & Chauffeur Fleet** — Self-drive cars, bikes, luxury SUVs, and point-to-point taxis.
5. **🎟️ Events & Heritage Passes** — Cultural festivals, temple tours, desert safaris, and ticket passes.
6. **🤖 GenAI Travel Concierge & Visual Discovery** — Instant customized itineraries, multimodal landmark image recognition, and 24/7 intelligent chat assistance.
7. **💼 Vendor & Admin Portals** — Full-featured provider dashboards with booking management, revenue metrics, catalog uploads, and platform-wide administrative controls.

---

## ✨ Key Platform Features

### 👤 For Travelers
- **Multi-Vertical Smart Search & Discovery**: Filter by state, category, rating, budget, and real-time availability.
- **Smart Bundle Booking Engine**: Add a hotel, vehicle, tour guide, and event passes into one combined trip bundle with a single discount checkout.
- **AI Dynamic Itinerary Planner**: Enter destination, duration, travel style, and budget to receive an hour-by-hour customized itinerary powered by Claude 3 / LLMs.
- **Snap & Explore (Multimodal Vision)**: Take a photo or upload a picture of any monument or attraction to instantly identify history, timings, ticket prices, and nearby stays.
- **24/7 Floating AI Assistant**: Real-time context-aware answers to local etiquette, packing tips, transit routes, and emergency assistance.
- **Interactive Booking History & Ticket Receipts**: Real-time booking statuses (Confirmed, Completed, Cancelled) and instant invoice generation.

### 🏢 For Service Providers (Vendors)
- **Dedicated Provider Dashboards**:
  - Hotel Managers: Room inventories, amenity tagging, check-in dates, and pricing.
  - Restaurant Owners: Menu item management, dietary tags, table bookings, and food orders.
  - Tour Guides: Language proficiencies, itinerary specialties, and booking schedules.
  - Vehicle Fleet Owners: Car models, fuel types, transmission, rates, and pickup locations.
  - Event Organizers: Venue capacities, ticket pricing, and attendee rosters.
- **Real-Time Revenue Analytics**: Track gross volume, confirmed bookings, and payout statuses.

### 👑 For Platform Administrators
- **Global Overview Dashboard**: Platform user count, total providers, gross transaction volume, and active bookings.
- **Vendor Verification & Approval**: Audit and verify provider profiles and credentials.
- **Platform Integrity**: Audit user activities, review logs, and configure platform settings.

---

## 🛠️ Technology Stack & Why Each Tool Was Chosen

| Technology / Tool | Layer | Why It Was Chosen for Moulyasree |
| :--- | :--- | :--- |
| **React 19** | Frontend Framework | State-of-the-art UI rendering, optimized concurrent rendering features, robust ecosystem, and clean component lifecycle hooks. |
| **Vite 7** | Frontend Build Tool | Lightning-fast Hot Module Replacement (HMR), sub-second cold starts, and tree-shaken production bundles compared to legacy Webpack. |
| **Vanilla CSS & Glassmorphism** | Styling & Aesthetics | Tailored design system with custom CSS variables, gradients, backdrop blurs, and micro-interactions without bloated framework CSS overrides. |
| **Framer Motion** | UI Animation | Fluid spring-based page transitions, modal fade-ins, and animated loading states for a premium traveler UX. |
| **Lucide React** | UI Icons | Lightweight, consistent, tree-shakeable vector icons covering travel, navigation, stars, and controls. |
| **Axios** | HTTP Client | Automatic JSON parsing, request/response interceptors for JWT token injection, and global error handling. |
| **Node.js & Express 5** | Backend API Server | Asynchronous non-blocking I/O ideal for high-concurrency API calls, modular routing, middleware pipelines, and robust ecosystem. |
| **MongoDB & Mongoose** | Primary Document DB | Flexible JSON-like document models for complex nested data (bookings, user profiles, provider catalogs, menus, and reviews). |
| **Amazon DynamoDB** | High-Speed Distributed NoSQL | Sub-10ms latency for Pan-India tourism inventory lookups, auto-scaling capacity, and high availability with zero server management. |
| **Amazon Bedrock (Claude 3)** | Enterprise Generative AI | High-intelligence reasoning for itinerary creation, multimodal vision for landmark identification, zero GPU infrastructure management, and secure AWS IAM governance. |
| **Ollama (Fallback Engine)** | Local LLM Support | Enables local development and offline AI testing using Llama 3 / Mistral without incurring AWS token charges. |
| **Amazon S3** | Cloud Storage & Static Hosting | 99.999999999% data durability for uploaded vendor media/images and ultra-reliable static asset hosting for Vite SPAs. |
| **Amazon CloudFront** | Global CDN | Global low-latency edge caching, free SSL/TLS certificate termination, and seamless Single Page Application (SPA) fallback routing. |
| **AWS App Runner / ECS** | Compute Container Runtime | Fully managed containerized server hosting that auto-scales based on traffic from 1 to 10+ instances with automated health checks. |
| **Docker & Docker Compose** | Containerization | Standardized multi-stage container builds ensuring consistency between local development, testing, and production cloud environments. |
| **Terraform & CloudFormation** | Infrastructure as Code (IaC) | Declarative cloud infrastructure provisioning, reproducible multi-environment setups (Dev/Staging/Prod), and automated rollback safeguards. |
| **JWT & Bcrypt.js** | Security & Authentication | Stateless token-based user/provider authentication paired with salted 12-round hashing for password storage. |
| **Multer** | Multipart Upload Middleware | Streamlined disk/memory buffer handling for image uploads with MIME-type validation and size restrictions. |
| **Stripe** | Payment Gateway Integration | Global multi-currency payment checkout support with secure PCI-compliant tokenization. |

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Users & CDN Tier
        Travelers([🌍 Travelers / Users]) -->|HTTPS| Route53[Amazon Route 53 DNS]
        Vendors([💼 Providers & Admins]) -->|HTTPS| Route53
        Route53 --> CloudFront[Amazon CloudFront CDN + WAF]
    end

    subgraph Static Web Hosting
        CloudFront -->|/ (Traveler App)| S3Client[Amazon S3: Client App Bucket]
        CloudFront -->|/admin (Admin Portal)| S3Admin[Amazon S3: Admin Portal Bucket]
    end

    subgraph Compute & API Gateway
        CloudFront -->|/api/* Requests| AppRunner[AWS App Runner / Container Runtime]
        AppRunner --> ExpressAPI[Node.js Express 5 API Server]
    end

    subgraph Intelligence & Media Tier
        ExpressAPI -->|Vision & Itineraries| Bedrock[Amazon Bedrock\nClaude 3 Models]
        ExpressAPI -->|Offline / Local Fallback| Ollama[Local Ollama LLM Service]
        ExpressAPI -->|Image Uploads & Presigned URLs| S3Media[Amazon S3: Media Bucket]
    end

    subgraph Data & Storage Tier
        ExpressAPI -->|Fast Inventory Queries| DynamoDB[(Amazon DynamoDB\nPan-India Catalog)]
        ExpressAPI -->|Users, Orders, Bookings| MongoDB[(MongoDB / DocumentDB\nDocument Store)]
    end

    subgraph Observability
        ExpressAPI -->|Structured JSON Logs| CloudWatch[Amazon CloudWatch]
    end
```

---

## 🇮🇳 Pan-India Tourism Verticals

Moulyasree comes preloaded with a curated catalog across India's top tourist destinations:

```
├── 🏰 North India      (Delhi, Agra, Jaipur, Udaipur, Varanasi, Leh-Ladakh, Manali)
├── 🌴 South India      (Munnar, Kochi, Ooty, Hampi, Madurai, Coorg, Wayanad)
├── 🌊 West India       (Goa, Mumbai, Udaipur, Rann of Kutch, Lonavala)
├── 🌿 East & NE India  (Darjeeling, Gangtok, Shillong, Kaziranga, Puri)
└── 🏛️ Central India    (Khajuraho, Bhopal, Bandhavgarh)
```

Each destination includes verified:
- **Hotels**: Room configurations, star ratings, amenities (WiFi, pool, breakfast, spa), and price per night.
- **Restaurants**: Cuisines (North Indian, South Indian, Mughlai, Continental), dining timings, and signature dishes.
- **Tour Guides**: Spoken languages (English, Hindi, French, German, Spanish, regional languages) and verified badges.
- **Vehicles**: Sedans, SUVs, hatchbacks, cruisers, and tempo travelers with per-km/per-day pricing.
- **Events**: Heritage walks, desert safaris, festival passes, boat races, and sound-and-light shows.

---

## 🤖 Generative AI Capabilities

### 1. 🗺️ AI Dynamic Itinerary Planner
- **How it works**: Users enter their destination (e.g. *"3 days in Jaipur with family on a moderate budget"*).
- **Backend Flow**: Formulates a detailed prompt grounded with real catalog data and queries Amazon Bedrock (`anthropic.claude-3-haiku` / `anthropic.claude-3-sonnet`).
- **Output**: Returns a structured day-by-day, morning/afternoon/evening schedule with recommended stays, authentic dining spots, and travel tips.

### 2. 📸 Snap & Explore (Visual Landmark Recognition)
- **How it works**: Travelers capture a live photo via their camera or upload an image of an Indian monument, temple, or scenic spot.
- **Backend Flow**: The image buffer is converted to base64 and processed via Bedrock Multimodal Vision AI.
- **Output**: Returns the monument's historical background, architectural style, visiting hours, estimated ticket costs, and recommended local guides.

### 3. 💬 24/7 AI Travel Concierge Assistant
- **How it works**: An interactive floating chat widget accessible on every screen.
- **Capabilities**: Translates local phrases, provides packing checklists, calculates approximate taxi fares, answers regional cultural etiquette questions, and suggests nearby places.

---

## 📂 Project Directory Structure

```
Moulyasree/
├── .github/
│   └── workflows/
│       └── deploy-aws.yml             # Automated CI/CD pipeline for AWS deployment
├── admin/                             # Administrator & Platform Management Portal
│   ├── src/
│   │   ├── components/                # Layout, Sidebar, Navbar components
│   │   ├── pages/                     # Dashboard, Users, Providers management
│   │   └── services/api.js            # Admin API connector
│   ├── Dockerfile                     # Multi-stage Docker build for admin
│   └── nginx.conf                     # Nginx SPA routing configuration
├── aws/                               # Infrastructure as Code (IaC) & Deployment
│   ├── cloudformation/
│   │   └── moulyasree-stack.yml       # CloudFormation stack (S3, CloudFront, DynamoDB, IAM)
│   ├── terraform/
│   │   ├── main.tf                    # Terraform AWS infrastructure resources
│   │   ├── variables.tf               # Terraform variable definitions
│   │   └── outputs.tf                 # Terraform CloudFront & S3 outputs
│   └── scripts/
│       └── deploy-frontend-s3.js      # Automated S3 build & upload script
├── client/                            # Traveler Web Application
│   ├── src/
│   │   ├── components/                # Navbar, Layout, AIChatWidget
│   │   ├── data/                      # Pan-India default catalog fallback
│   │   ├── pages/
│   │   │   ├── dashboards/            # Provider dashboards (Hotel, Guide, Restaurant, etc.)
│   │   │   ├── AITripPlanner.jsx      # GenAI dynamic itinerary generator
│   │   │   ├── SnapAndExplore.jsx     # Multimodal camera & image landmark AI
│   │   │   ├── BundleBookings.jsx     # All-in-one unified cart & discount checkout
│   │   │   ├── Hotels.jsx / HotelDetails.jsx
│   │   │   ├── Restaurants.jsx / RestaurantDetails.jsx
│   │   │   ├── Guides.jsx / GuideDetails.jsx
│   │   │   ├── Vehicle.jsx / VehicleDetails.jsx
│   │   │   └── Events.jsx / EventDetails.jsx
│   │   └── services/api.js            # Axios client API service
│   ├── Dockerfile                     # Production Nginx container for client
│   └── vite.config.js                 # Vite build configuration
├── server/                            # Node.js & Express API Backend
│   ├── config/                        # Database & AWS SDK initialization
│   ├── controllers/                   # AI, Auth, Booking, Bundle, and Category controllers
│   ├── middleware/                    # Auth verification, CloudWatch logger, Multer uploads
│   ├── models/                        # Mongoose schemas (User, Hotel, Booking, Bundle, etc.)
│   ├── routes/                        # Express API REST routes
│   ├── scripts/                       # DynamoDB table setup & catalog seeders
│   ├── services/                      # Bedrock, Ollama, S3, and DynamoDB services
│   ├── Dockerfile                     # Optimized Node.js Alpine container
│   └── server.js                      # Application entry point
├── deploy-aws.ps1                     # 1-Click AWS deployment script for Windows
├── deploy-aws.sh                      # 1-Click AWS deployment script for Linux/macOS
├── docker-compose.yml                 # Local multi-container development orchestration
└── .gitignore                         # Git exclusion rules for secrets and dependencies
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection URI
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/lokesh-7075/Moulyaa.git
cd Moulyaa
```

### 2. Configure Environment Variables
Copy the `.env.example` templates to `.env`:

```bash
# Backend configuration
cp server/.env.example server/.env

# Client configuration
cp client/.env.example client/.env

# Admin configuration
cp admin/.env.example admin/.env
```

### 3. Install Dependencies
```bash
# Install Server Dependencies
cd server && npm install

# Install Client Dependencies
cd ../client && npm install

# Install Admin Dependencies
cd ../admin && npm install
cd ..
```

### 4. Seed Pan-India Tourism Data (Optional)
Populate sample hotels, restaurants, guides, vehicles, and events:
```bash
cd server
node scripts/seedFullPlatformData.js
cd ..
```

### 5. Run the Application
Open three terminal windows:

```bash
# Terminal 1: Backend API (Port 5000)
cd server && npm run dev

# Terminal 2: Client Traveler App (Port 5173)
cd client && npm run dev

# Terminal 3: Admin Management Portal (Port 5174)
cd admin && npm run dev
```

Visit **http://localhost:5173** to explore the traveler app and **http://localhost:5174** for the admin portal.

---

## 🐳 Docker & Containerized Deployment

Run the complete platform (Client, Admin, Backend, and MongoDB) using a single command:

```bash
docker-compose up --build
```

- **Traveler App**: http://localhost:3000
- **Admin Portal**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **MongoDB**: `localhost:27017`

---

## ☁️ AWS Cloud Deployment

Moulyasree includes full Infrastructure as Code (IaC) for production AWS deployment:

### 1-Click Automated Script

#### On Windows (PowerShell):
```powershell
.\deploy-aws.ps1
```

#### On Linux / macOS (Bash):
```bash
chmod +x deploy-aws.sh
./deploy-aws.sh
```

### Manual CloudFormation Stack Deployment
```bash
aws cloudformation deploy \
  --template-file aws/cloudformation/moulyasree-stack.yml \
  --stack-name moulyasree-stack \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

For complete architectural step-by-step guidance, refer to [AWS_DEPLOYMENT_GUIDE.md](file:///c:/Users/hp/Desktop/Moulyasree/AWS_DEPLOYMENT_GUIDE.md).

---

## 🔒 Environment Variables Reference

### Backend (`server/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | API Server listening port | `5000` |
| `NODE_ENV` | Runtime environment | `development` / `production` |
| `MONGO_URI` | MongoDB / DocumentDB connection string | `mongodb://localhost:27017/moulyasree` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secure_jwt_secret_key` |
| `AWS_REGION` | Target AWS region for Bedrock, S3, DynamoDB | `us-east-1` |
| `AWS_S3_BUCKET_NAME` | Media upload S3 bucket | `moulyasree-media-bucket` |
| `BEDROCK_MODEL_ID` | Amazon Bedrock Claude model ID | `anthropic.claude-3-haiku-20240307-v1:0` |

### Frontend (`client/.env` & `admin/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend REST API endpoint | `http://localhost:5000/api` |
| `VITE_BASE_URL` | Base server URL for uploaded images | `http://localhost:5000` |

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute with attribution.
