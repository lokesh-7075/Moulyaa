function Footer() {
  return (
    <footer className="mt-16 w-full">

      {/* ✅ FULL WIDTH DARK SKY BLUE BACKGROUND */}
      <div className="w-full bg-sky-900/90 backdrop-blur-xl border-t border-white/10">

        {/* ✅ INNER CONTAINER (ONLY FOR CONTENT ALIGNMENT) */}
        <div className="container mx-auto px-6 lg:px-12 py-12">

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-gray-200">

            {/* About */}
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Moulyashree 💖
              </h3>

              <p className="text-sm text-gray-300 hover:text-white transition">
                Explore the world with Moulyas Tourism Platform. Discover hotels, guides, vehicles and amazing travel experiences.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Quick Links
              </h3>

              <div className="flex flex-col gap-2">
                <a href="/" className="hover:text-pink-400 hover:translate-x-1 transition duration-300">
                  Home
                </a>
                <a href="/hotels" className="hover:text-pink-400 hover:translate-x-1 transition duration-300">
                  Hotels
                </a>
                <a href="/login" className="hover:text-pink-400 hover:translate-x-1 transition duration-300">
                  Login
                </a>
                <a href="/register" className="hover:text-pink-400 hover:translate-x-1 transition duration-300">
                  Register
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Contact
              </h3>

              <p className="text-sm text-gray-300 hover:text-white transition">
                📧 support@moulyas.com
              </p>
              <p className="text-sm text-gray-300 hover:text-white transition mt-2">
                📞 +91 9999999999
              </p>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                Follow Us
              </h3>

              <div className="flex gap-4 text-xl">
                <a className="hover:scale-125 hover:text-sky-300 transition duration-300">🌐</a>
                <a className="hover:scale-125 hover:text-blue-400 transition duration-300">📘</a>
                <a className="hover:scale-125 hover:text-pink-400 transition duration-300">📸</a>
                <a className="hover:scale-125 hover:text-cyan-300 transition duration-300">🐦</a>
              </div>
            </div>

          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mt-10"></div>

          {/* Bottom */}
          <div className="text-center py-6 text-sm text-gray-400">
            © 2026 <span className="text-pink-400 font-semibold">Moulyasree</span> Tourism Platform. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;