import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {

  const navigate = useNavigate();

  return (

    <div className="home-container">

      <div className="home-spacing"></div>

      {/* ================= HERO ================= */}
      <section
        className="hero-section"
        style={{
          backgroundImage:
            "url('https://t3.ftcdn.net/jpg/07/80/95/16/360_F_780951672_cJzVeOxybkHkCkFDIOGUAlcq2ADIHVO7.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <h1 className="hero-title">
            Explore India with <span className="hero-title-highlight">Moulyashree</span>
          </h1>

          <p className="hero-desc">
            Discover hotels, restaurants, vehicles, guides & events for your perfect journey.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <button
              onClick={() => navigate("/bundle-bookings")}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white font-extrabold shadow-2xl hover:scale-105 transition duration-300 flex items-center gap-2 border border-white/40"
            >
              <span>💎 1-Click Multi-Service Bundles</span>
            </button>
            <button
              onClick={() => navigate("/ai-planner")}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold shadow-xl hover:scale-105 transition duration-300 flex items-center gap-2 border border-white/30"
            >
              <span>✨ AI Trip Architect</span>
            </button>
            <button
              onClick={() => navigate("/hotels")}
              className="hero-btn"
            >
              Explore Stays ✈️
            </button>
          </div>

        </div>

      </section>

      {/* ================= AI TRAVEL ARCHITECT & BUNDLE SHOWCASE ================= */}
      <section className="max-w-7xl mx-auto px-6 py-10 -mt-12 relative z-20">
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-2xl border border-purple-500/30 flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-xl">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
                🚀 Cloud Neural AI
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs font-bold uppercase tracking-wider">
                ⚡ High Speed Edge AI
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                💎 1-Click Multi-Booking
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-400 via-pink-300 to-purple-200 bg-clip-text text-transparent">
              Generative AI Pan-India Travel Architect & Bundle Packages
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Experience next-gen tourism: 1-click travel package bundler with verified provider accounts across India, multimodal vision monument guide, and unified multi-booking transactions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button
              onClick={() => navigate("/bundle-bookings")}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white font-extrabold hover:scale-105 transition shadow-lg text-center"
            >
              💎 Explore Bundles
            </button>
            <button
              onClick={() => navigate("/ai-planner")}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold hover:scale-105 transition shadow-lg text-center"
            >
              ✨ AI Planner
            </button>
            <button
              onClick={() => navigate("/snap-explore")}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold transition text-center"
            >
              📸 Snap & Explore
            </button>
          </div>
        </div>
      </section>


      {/* ================= SERVICES ================= */}
      <section className="services-section">

        <h2 className="section-title">
          Our Premium Services
        </h2>

        <div className="services-grid">

          {[
            { title: "💎 Multi-Service Bundles", desc: "1-Click Hotel + Cab + Guide + Dining combos", path: "/bundle-bookings" },
            { title: "Hotels", desc: "Comfortable stays across India", path: "/hotels" },
            { title: "Vehicles", desc: "Book cars & travel vehicles", path: "/vehicles" },
            { title: "Restaurants", desc: "Discover local food places", path: "/restaurants" },
            { title: "Tour Guides", desc: "Professional travel guides", path: "/guides" },
            { title: "Events", desc: "Explore festivals & events", path: "/events" }
          ].map((item, i) => (

            <div
              key={i}
              onClick={() => navigate(item.path)}
              className="service-card"
            >
              <h3 className="service-title">
                {item.title}
              </h3>

              <p className="service-desc">
                {item.desc}
              </p>
            </div>

          ))}

        </div>

      </section>


      {/* ================= DESTINATIONS ================= */}
      <section className="destinations-section">

        <div className="destinations-wrapper">

          <h2 className="section-title">
            Popular Destinations
          </h2>

          <div className="destinations-grid">

            {[
              {
                name: "Goa",
                img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2"
              },
              {
                name: "Kerala",
                img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944"
              },
              {
                name: "Kashmir",
                img: "https://images.unsplash.com/photo-1598091383021-15ddea10925d"
              },
              {
                name: "Ladakh",
                img: "https://images.unsplash.com/photo-1587474260584-136574528ed5"
              }
            ].map((place, i) => (

              <div key={i} className="destination-card">

                <img
                  src={place.img}
                  className="destination-img"
                />

                <div className="destination-overlay">
                  <h3 className="destination-name">
                    {place.name}
                  </h3>
                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= STORY / EXPERIENCE ================= */}
      <section className="story-section">

        <div className="story-grid">

          {/* TEXT SIDE */}
          <div>

            <h2 className="story-title">
              Not Just Travel… It’s a Feeling 💖
            </h2>

            <p className="story-desc">
              Travel is not about reaching destinations — it’s about discovering pieces of yourself along the journey. 
              Every road you take, every sunrise you witness, and every breeze you feel tells a story that stays with you forever.
            </p>

            <p className="story-desc">
              Imagine riding through winding roads with your favorite music playing softly, mountains standing tall beside you, 
              and the sky painted in colors you never noticed before. The laughter, the silence, the unexpected stops — 
              these are the moments that turn into memories.
            </p>

            <p className="story-desc">
              With Moulyashree, you don’t just book hotels or vehicles — you create experiences. 
              From peaceful beaches to vibrant cities, from hidden waterfalls to bustling streets, 
              every journey becomes a story worth telling.
            </p>

            <p className="story-desc-italic">
              So pack your bags, leave your worries behind, and let the road write your next chapter… ✨
            </p>

          </div>

          {/* IMAGE SIDE */}
          <div className="story-img-wrapper">

            <img
              src="https://www.jeep.com/content/dam/fca-brands/na/jeep/en_us/2024/wrangler/gallery/desktop/MY24-Jeep-Wrangler-Gallery-Capability-3-Desktop.jpg.image.2880.jpg"
              alt="travel"
              className="story-img"
            />

            {/* Glass Overlay Card */}
            <div className="story-glass-card">
              <p className="story-glass-text">
                “Travel far enough, you meet yourself.”
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="cta-section">

        <div className="cta-card">

          <h2 className="cta-title">
            Start Your Journey Today ✨
          </h2>

          <button
            onClick={() => navigate("/register")}
            className="cta-btn"
          >
            Join Moulyasree
          </button>

        </div>

      </section>

    </div>

  );
}

export default Home;