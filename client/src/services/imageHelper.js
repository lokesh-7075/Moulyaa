/**
 * 🌟 Smart Image URL Resolver & Curated Online CDN Images for Moulyasree
 */

const BASE_URL = import.meta.env.VITE_BASE_URL || "";

// Curated high-resolution online photography for each category
export const DEFAULT_ONLINE_IMAGES = {
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  room: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
  vehicle: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80",
  car: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80",
  jeep: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80",
  bike: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80",
  bus: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80",
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
  food: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1000&q=80",
  guide: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  guidePost: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
  event: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
};

/**
 * Returns a valid online image URL
 * @param {string|string[]} path - Image path, URL or array of paths
 * @param {string} category - Fallback category ('hotel', 'vehicle', 'restaurant', 'guide', 'event', 'food', 'avatar')
 * @returns {string} - Complete valid online URL
 */
export const getServiceImage = (path, category = "hotel") => {
  let imgPath = path;

  // If array, grab first image
  if (Array.isArray(path)) {
    imgPath = path.length > 0 ? path[0] : null;
  }

  // If empty or null, return curated category online image
  if (!imgPath || typeof imgPath !== "string" || imgPath.trim() === "") {
    return DEFAULT_ONLINE_IMAGES[category] || DEFAULT_ONLINE_IMAGES.hotel;
  }

  const clean = imgPath.trim();

  // If already an absolute HTTPS/HTTP URL (e.g. Unsplash or CloudFront)
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  // If relative path from uploads folder
  const relative = clean.replace(/^\/+/, "").replace(/^uploads\//, "");
  return BASE_URL ? `${BASE_URL}/uploads/${relative}` : `/uploads/${relative}`;
};

export default getServiceImage;
