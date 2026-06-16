import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  return (

    <div className="w-full bg-gradient-to-b from-gray-50 to-white">

      {/* ✅ SPACING FIX (IMPORTANT 🔥) */}
      <div className="h-[18vh]"></div>

      {/* ================= HERO ================= */}
      <section
        className="relative h-[85vh] flex items-center justify-center rounded-2xl overflow-hidden mx-auto max-w-7xl"
        style={{
          backgroundImage:
            "url('https://t3.ftcdn.net/jpg/07/80/95/16/360_F_780951672_cJzVeOxybkHkCkFDIOGUAlcq2ADIHVO7.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        {/* CONTENT */}
        <div className="relative text-center text-white px-6 max-w-3xl">

          <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
            Explore India with <span className="text-orange-400">Moulyashree</span>
          </h1>

          <p className="mt-4 text-lg md:text-xl text-gray-200">
            Discover hotels, restaurants, vehicles, guides & events for your perfect journey.
          </p>

          <button
            onClick={() => navigate("/hotels")}
            className="mt-6 px-8 py-3 bg-orange-500 rounded-full text-white font-semibold shadow-lg hover:bg-orange-600 hover:scale-105 transition"
          >
            Explore Now ✈️
          </button>

        </div>

      </section>


      {/* ================= SERVICES ================= */}
      {/* ================= SERVICES ================= */}
<section className="max-w-6xl mx-auto px-6 py-16">

  <h2 className="text-3xl font-bold text-center mb-10">
    Our Services
  </h2>

  <div className="grid md:grid-cols-3 gap-8">

    {[
      { title: "Hotels", desc: "Comfortable stays across India", path: "/hotels" },
      { title: "Vehicles", desc: "Book cars & travel vehicles", path: "/vehicles" },
      { title: "Restaurants", desc: "Discover local food places", path: "/restaurants" },
      { title: "Tour Guides", desc: "Professional travel guides", path: "/guides" },
      { title: "Events", desc: "Explore festivals & events", path: "/events" }
    ].map((item, i) => (

      <div
        key={i}
        onClick={() => navigate(item.path)}
        className="cursor-pointer bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow hover:shadow-xl transition hover:-translate-y-2 hover:bg-white"
      >
        <h3 className="text-xl font-semibold text-orange-600">
          {item.title}
        </h3>

        <p className="mt-2 text-gray-600">
          {item.desc}
        </p>
      </div>

    ))}

  </div>

</section>


      {/* ================= DESTINATIONS ================= */}
      <section className="bg-gray-50 py-16">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-10">
            Popular Destinations
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

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

              <div
                key={i}
                className="group relative rounded-xl overflow-hidden shadow-lg"
              >

                <img
                  src={place.img}
                  className="h-56 w-full object-cover group-hover:scale-110 transition duration-500"
                />

                <div className="absolute inset-0 bg-black/40 flex items-end p-4">

                  <h3 className="text-white text-xl font-bold">
                    {place.name}
                  </h3>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>
      {/* ================= STORY / EXPERIENCE ================= */}
<section className="max-w-6xl mx-auto px-6 py-20">

  <div className="grid md:grid-cols-2 gap-12 items-center">

    {/* TEXT SIDE */}
    <div>

      <h2 className="text-3xl md:text-4xl font-bold leading-snug text-gray-800">
        Not Just Travel… It’s a Feeling 💖
      </h2>

      <p className="mt-6 text-gray-600 leading-relaxed text-lg">
        Travel is not about reaching destinations — it’s about discovering pieces of yourself along the journey. 
        Every road you take, every sunrise you witness, and every breeze you feel tells a story that stays with you forever.
      </p>

      <p className="mt-4 text-gray-600 leading-relaxed">
        Imagine riding through winding roads with your favorite music playing softly, mountains standing tall beside you, 
        and the sky painted in colors you never noticed before. The laughter, the silence, the unexpected stops — 
        these are the moments that turn into memories.
      </p>

      <p className="mt-4 text-gray-600 leading-relaxed">
        With Moulyashree, you don’t just book hotels or vehicles — you create experiences. 
        From peaceful beaches to vibrant cities, from hidden waterfalls to bustling streets, 
        every journey becomes a story worth telling.
      </p>

      <p className="mt-4 text-gray-600 leading-relaxed italic">
        So pack your bags, leave your worries behind, and let the road write your next chapter… ✨
      </p>

    </div>

    {/* IMAGE SIDE */}
    <div className="relative">

      <img
        src="https://www.jeep.com/content/dam/fca-brands/na/jeep/en_us/2024/wrangler/gallery/desktop/MY24-Jeep-Wrangler-Gallery-Capability-3-Desktop.jpg.image.2880.jpg"
        alt="travel"
        className="w-full h-auto rounded-2xl shadow-xl object-cover hover:scale-105 transition duration-500"
      />

      {/* Glass Overlay Card */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/30 backdrop-blur-lg rounded-xl p-4 shadow-md">
        <p className="text-sm text-gray-800">
          “Travel far enough, you meet yourself.”
        </p>
      </div>

    </div>

  </div>

</section>

      {/* ================= CTA ================= */}
      <section className="py-16">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <div className="bg-white/70 backdrop-blur-xl p-10 rounded-2xl shadow-lg">

            <h2 className="text-3xl font-bold">
              Start Your Journey Today ✨
            </h2>

            <button
              onClick={() => navigate("/register")}
              className="mt-6 px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 hover:scale-105 transition shadow"
            >
              Join Moulyasree
            </button>

          </div>

        </div>

      </section>

    </div>

  );
}

export default Home;