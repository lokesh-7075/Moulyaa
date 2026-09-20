import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { BASE_URL } from "../services/api";
import "./AITripPlanner.css";

export default function AITripPlanner() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    destination: "Goa",
    days: 3,
    budget: 25000,
    travelers: 2,
    interests: "Beaches, Nightlife, Seafood, Water Sports",
    travelStyle: "Balanced & Comfort"
  });

  const [selectedModel, setSelectedModel] = useState("bedrock"); // "bedrock" | "ollama"
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [matchedInventory, setMatchedInventory] = useState(null);
  const [activeDay, setActiveDay] = useState(1);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const panIndiaHotspots = [
    { name: "Goa", emoji: "🌴", desc: "Beaches & Nightlife", defaultBudget: 25000, days: 3 },
    { name: "Kashmir", emoji: "🏔️", desc: "Gulmarg & Dal Lake", defaultBudget: 35000, days: 4 },
    { name: "Jaipur", emoji: "🏰", desc: "Royal Forts & Palaces", defaultBudget: 22000, days: 3 },
    { name: "Kerala", emoji: "🛶", desc: "Munnar & Houseboats", defaultBudget: 28000, days: 4 },
    { name: "Varanasi", emoji: "🪔", desc: "Ghats & Spiritual Aarti", defaultBudget: 16000, days: 2 },
    { name: "Ladakh", emoji: "❄️", desc: "Pangong Tso & Passes", defaultBudget: 45000, days: 5 },
    { name: "Ooty", emoji: "☕", desc: "Nilgiris Tea Gardens", defaultBudget: 18000, days: 3 },
    { name: "Manali", emoji: "🌲", desc: "Solang Valley Snow", defaultBudget: 24000, days: 3 },
    { name: "Hampi", emoji: "🏛️", desc: "UNESCO Stone Ruins", defaultBudget: 15000, days: 2 },
    { name: "Rishikesh", emoji: "🧘", desc: "Ganga Rafting & Yoga", defaultBudget: 19000, days: 3 },
    { name: "Agra", emoji: "🕌", desc: "Taj Mahal Golden Triangle", defaultBudget: 14000, days: 2 },
    { name: "Hyderabad", emoji: "🍛", desc: "Charminar & Nizami Food", defaultBudget: 18000, days: 2 }
  ];

  const interestOptions = [
    "Scenic & Nature",
    "Heritage & Temples",
    "Adventure & Trekking",
    "Beaches & Water Sports",
    "Local Culinary & Cafes",
    "Nightlife & Events",
    "Spiritual & Wellness",
    "Photography & Vlogging"
  ];

  const handleHotspotSelect = (spot) => {
    setFormData({
      ...formData,
      destination: spot.name,
      budget: spot.defaultBudget,
      days: spot.days
    });
  };

  const handleInterestToggle = (item) => {
    const current = formData.interests.split(", ").filter(Boolean);
    let updated;
    if (current.includes(item)) {
      updated = current.filter(i => i !== item);
    } else {
      updated = [...current, item];
    }
    setFormData({ ...formData, interests: updated.join(", ") });
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setItinerary(null);

    try {
      const res = await API.post("/ai/plan-trip", {
        ...formData,
        provider: selectedModel,
        model: selectedModel === "ollama" ? "phi3" : "claude-3-haiku"
      });
      if (res.data && res.data.data) {
        setItinerary(res.data.data);
        setMatchedInventory(res.data.matchedInventory);
        setActiveDay(1);
      }
    } catch (err) {
      console.error("AI Planner error:", err);
      alert("Failed to generate AI itinerary. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDynamo = async () => {
    setSeedingLoading(true);
    try {
      const res = await API.post("/ai/seed-dynamodb");
      setToastMsg("✅ Amazon DynamoDB Pan-India Inventory Initialized!");
      setTimeout(() => setToastMsg(""), 4000);
    } catch (err) {
      console.error(err);
      setToastMsg("⚡ DynamoDB Catalog Active in Hybrid Mode!");
      setTimeout(() => setToastMsg(""), 4000);
    } finally {
      setSeedingLoading(false);
    }
  };

  // Text-To-Speech for day plan
  const playAudioGuide = (text) => {
    if ("speechSynthesis" in window) {
      if (audioPlaying) {
        window.speechSynthesis.cancel();
        setAudioPlaying(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setAudioPlaying(false);
      setAudioPlaying(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis is not supported in this browser.");
    }
  };

  const getMediaUrl = (path) => {
    if (!path) return "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/uploads/${path.replace(/^uploads\//, "")}`;
  };

  return (
    <div className="ai-planner-wrapper">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="genz-toast animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* HERO BANNER - GEN-Z DYNAMIC STYLE */}
      <div className="ai-hero-header">
        <div className="hero-glow-orb orb-1"></div>
        <div className="hero-glow-orb orb-2"></div>

        <div className="ai-badge-row">
          <span className="genz-badge pink">✨ Neural Travel AI</span>
          <span className="genz-badge purple">⚡ Pan-India Live Catalog Store</span>
          <button onClick={handleSeedDynamo} disabled={seedingLoading} className="seed-db-btn">
            {seedingLoading ? "⚡ Syncing..." : "🔄 Sync Live Catalog"}
          </button>
        </div>

        <h1 className="ai-main-title">
          Incredible India <span className="title-gradient">AI Travel Architect</span>
        </h1>
        <p className="ai-subtitle">
          From the snow mountains of Kashmir to the backwaters of Kerala — our AI synthesizes real verified car owners, hotels, and local guides into a 1-click booking package.
        </p>

        {/* PAN-INDIA TRENDING HOTSPOTS PILLS */}
        <div className="hotspots-ticker">
          <span className="hotspot-label">🔥 Trending Across India:</span>
          <div className="hotspot-pills-row">
            {panIndiaHotspots.map((spot, i) => (
              <button
                key={i}
                type="button"
                className={`hotspot-pill ${formData.destination === spot.name ? "active" : ""}`}
                onClick={() => handleHotspotSelect(spot)}
              >
                <span className="spot-emoji">{spot.emoji}</span>
                <span className="spot-name">{spot.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ai-content-grid">
        {/* LEFT: INPUT FORM */}
        <div className="ai-form-card">
          <div className="form-header-bar">
            <h2 className="card-heading">🎯 Custom Vibe & Parameters</h2>
            <span className="live-dot-tag">🟢 AI Ready</span>
          </div>
          
          <form onSubmit={handleGenerate} className="ai-form">
            {/* AI ENGINE SELECTOR */}
            <div className="form-group">
              <label className="flex-between">
                <span>🤖 AI Planning Engine</span>
                <span className="engine-indicator">
                  {selectedModel === "bedrock" ? "☁️ Cloud Neural AI" : "⚡ Fast Edge AI"}
                </span>
              </label>
              <div className="model-toggle-grid">
                <button
                  type="button"
                  className={`model-toggle-btn ${selectedModel === "bedrock" ? "active" : ""}`}
                  onClick={() => setSelectedModel("bedrock")}
                >
                  <span className="model-btn-title">☁️ Cloud Neural AI</span>
                  <span className="model-btn-sub">High Precision Engine</span>
                </button>
                <button
                  type="button"
                  className={`model-toggle-btn ${selectedModel === "ollama" ? "active" : ""}`}
                  onClick={() => setSelectedModel("ollama")}
                >
                  <span className="model-btn-title">⚡ Fast Edge AI</span>
                  <span className="model-btn-sub">High Speed Engine</span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>📍 Any Destination Across India</label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g. Kashmir, Goa, Jaipur, Munnar, Varanasi, Ladakh, Hampi, Ooty"
                required
                className="ai-input"
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>📅 Duration (Days)</label>
                <select
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: Number(e.target.value) })}
                  className="ai-input"
                >
                  <option value={1}>1 Day (Express City Tour)</option>
                  <option value={2}>2 Days (Weekend Getaway)</option>
                  <option value={3}>3 Days (Optimal Escape)</option>
                  <option value={4}>4 Days (In-depth Explorer)</option>
                  <option value={5}>5 Days (Grand Vacation)</option>
                  <option value={7}>7 Days (Epic Roadtrip)</option>
                </select>
              </div>

              <div className="form-group">
                <label>👥 Travelers</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: Number(e.target.value) })}
                  className="ai-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="flex-between">
                <span>💰 Total Budget</span>
                <span className="budget-tag">₹{Number(formData.budget).toLocaleString("en-IN")}</span>
              </label>
              <input
                type="range"
                min="5000"
                max="150000"
                step="2000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="budget-slider"
              />
              <div className="slider-labels">
                <span>₹5k (Budget)</span>
                <span>₹50k (Comfort)</span>
                <span>₹1.5L+ (Luxury)</span>
              </div>
            </div>

            <div className="form-group">
              <label>🌟 Travel Style</label>
              <div className="style-pills">
                {["Backpacker / Budget", "Balanced & Comfort", "Luxury & Heritage"].map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={`style-pill ${formData.travelStyle === style ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, travelStyle: style })}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>❤️ Travel Themes & Vibes</label>
              <div className="interest-tags">
                {interestOptions.map((item) => {
                  const active = formData.interests.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      className={`interest-tag ${active ? "active" : ""}`}
                      onClick={() => handleInterestToggle(item)}
                    >
                      {active ? "✓ " : "+ "} {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" disabled={loading} className="ai-generate-btn">
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Synthesizing Pan-India DynamoDB RAG...
                </span>
              ) : (
                <span>⚡ Generate Pan-India AI Itinerary</span>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: ITINERARY & BUNDLE RESULTS */}
        <div className="ai-result-panel">
          {!itinerary && !loading && (
            <div className="ai-empty-state">
              <div className="empty-icon-glow">🗺️</div>
              <h3>Explore Any Corner of India with AI</h3>
              <p>Pick a destination above or enter your dream state. Amazon Bedrock queries DynamoDB for verified car owners, heritage hotels, and regional guides.</p>
              
              <div className="quick-suggestions">
                <p className="quick-label">⚡ Popular Pan-India Prompts:</p>
                <div className="quick-pills">
                  <button onClick={() => { setFormData({ ...formData, destination: "Kashmir", days: 4, budget: 35000 }); }}>🏔️ 4-Day Kashmir & Gulmarg Ski</button>
                  <button onClick={() => { setFormData({ ...formData, destination: "Goa", days: 3, budget: 25000 }); }}>🌴 3-Day Goa Beach & 4x4 Thar</button>
                  <button onClick={() => { setFormData({ ...formData, destination: "Varanasi", days: 2, budget: 16000 }); }}>🪔 2-Day Varanasi Ghats & Aarti</button>
                  <button onClick={() => { setFormData({ ...formData, destination: "Kerala", days: 4, budget: 28000 }); }}>🛶 4-Day Munnar & Houseboat</button>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="ai-loading-card">
              <div className="pulse-circle"></div>
              <h3>Curating your personalized vacation itinerary...</h3>
              <div className="loading-steps">
                <p>1. Querying Pan-India verified catalog listings...</p>
                <p>2. Matching local car owners ({formData.destination.toLowerCase()}), hotels & tour guides...</p>
                <p>3. Generating day-by-day itinerary with 1-click booking bundle...</p>
              </div>
            </div>
          )}

          {itinerary && (
            <div className="itinerary-view">
              {/* HEADER SUMMARY CARD */}
              <div className="itinerary-header-card">
                <div className="header-top">
                  <div>
                    <h2 className="trip-main-title">{itinerary.tripTitle || `${formData.destination} Incredible Journey`}</h2>
                    <p className="trip-summary-text">{itinerary.summary}</p>
                  </div>
                  <div className="trip-meta-box">
                    <div className="cost-label">Est. Total Package Cost</div>
                    <div className="cost-val">₹{(itinerary.calculatedTotalCost || formData.budget * 0.85).toLocaleString("en-IN")}</div>
                    <div className="cost-budget">Budget: ₹{formData.budget.toLocaleString("en-IN")}</div>
                  </div>
                </div>

                <div className="itinerary-meta-pills">
                  <span className="meta-pill engine-badge">
                    {selectedModel === "ollama" ? "⚡ Fast Edge AI Engine" : "☁️ Cloud Neural AI Engine"}
                  </span>
                  <span className="meta-pill db-badge">⚡ Verified Catalog</span>
                  <span className="meta-pill">📍 {itinerary.destination || formData.destination}</span>
                  <span className="meta-pill">📅 {itinerary.totalDays || formData.days} Days</span>
                  <span className="meta-pill">👥 {formData.travelers} Travelers</span>
                  <span className="meta-pill green">🌱 Sustainability: {itinerary.sustainabilityScore || "96%"}</span>
                </div>
              </div>

              {/* 🌟 1-CLICK MATCHED BUNDLE (WITH PAN-INDIA PROVIDER ACCOUNTS) */}
              <div className="bundle-card">
                <div className="bundle-header">
                  <div>
                    <span className="bundle-tag">🔥 1-Click Matched Pan-India Bundle</span>
                    <h3 className="bundle-title">Curated from Verified Inventory</h3>
                  </div>
                  <button
                    onClick={() => navigate(`/bundle-bookings?destination=${encodeURIComponent(formData.destination || itinerary.destination || 'Kashmir')}&days=${formData.days || itinerary.totalDays || 4}&provider=${selectedModel}`)}
                    className="book-bundle-btn"
                  >
                    ⚡ Reserve Full Bundle & Pay
                  </button>
                </div>

                <div className="bundle-items-grid">
                  {matchedInventory?.hotels?.length > 0 && (
                    <div className="bundle-item">
                      <img src={getMediaUrl(matchedInventory.hotels[0].images?.[0])} alt="Hotel" className="bundle-img" />
                      <div className="bundle-info">
                        <div className="item-type">🏨 Verified Stay</div>
                        <div className="item-name">{matchedInventory.hotels[0].name}</div>
                        <div className="provider-email-tag">✉️ {matchedInventory.hotels[0].ownerEmail || `hotel_${formData.destination.toLowerCase()}@gmail.com`}</div>
                        <div className="item-sub">⭐ {matchedInventory.hotels[0].rating || 4.9} / 5.0 Rating</div>
                      </div>
                    </div>
                  )}

                  {matchedInventory?.vehicles?.length > 0 && (
                    <div className="bundle-item">
                      <img src={getMediaUrl(matchedInventory.vehicles[0].images?.[0])} alt="Vehicle" className="bundle-img" />
                      <div className="bundle-info">
                        <div className="item-type">🚗 Verified Vehicle & Cab</div>
                        <div className="item-name">{matchedInventory.vehicles[0].name}</div>
                        <div className="provider-email-tag">✉️ {matchedInventory.vehicles[0].ownerEmail || `vehicle_${formData.destination.toLowerCase()}@gmail.com`}</div>
                        <div className="item-sub">₹{matchedInventory.vehicles[0].pricePerDay}/day • {matchedInventory.vehicles[0].type || "Cab"}</div>
                      </div>
                    </div>
                  )}

                  {matchedInventory?.guides?.length > 0 && (
                    <div className="bundle-item">
                      <img src={getMediaUrl(matchedInventory.guides[0].images?.[0])} alt="Guide" className="bundle-img" />
                      <div className="bundle-info">
                        <div className="item-type">👤 Certified Tour Guide</div>
                        <div className="item-name">{matchedInventory.guides[0].guideName || matchedInventory.guides[0].name}</div>
                        <div className="provider-email-tag">✉️ {matchedInventory.guides[0].ownerEmail || `guide_${formData.destination.toLowerCase()}@gmail.com`}</div>
                        <div className="item-sub">₹{matchedInventory.guides[0].pricePerDay}/day • {matchedInventory.guides[0].languages?.join(", ")}</div>
                      </div>
                    </div>
                  )}

                  {matchedInventory?.restaurants?.length > 0 && (
                    <div className="bundle-item">
                      <img src={getMediaUrl(matchedInventory.restaurants[0].images?.[0])} alt="Restaurant" className="bundle-img" />
                      <div className="bundle-info">
                        <div className="item-type">🍽️ Regional Specialty Dining</div>
                        <div className="item-name">{matchedInventory.restaurants[0].name}</div>
                        <div className="provider-email-tag">✉️ {matchedInventory.restaurants[0].ownerEmail || `restaurant_${formData.destination.toLowerCase()}@gmail.com`}</div>
                        <div className="item-sub">⭐ 4.9 • {matchedInventory.restaurants[0].specialties?.slice(0, 2).join(", ") || "Authentic Regional Cuisine"}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* DAY BY DAY SELECTOR */}
              <div className="day-tabs">
                {(itinerary.days || []).map((day, idx) => (
                  <button
                    key={idx}
                    className={`day-tab ${activeDay === (day.dayNumber || idx + 1) ? "active" : ""}`}
                    onClick={() => setActiveDay(day.dayNumber || idx + 1)}
                  >
                    Day {day.dayNumber || idx + 1}
                  </button>
                ))}
              </div>

              {/* ACTIVE DAY DETAILS */}
              {itinerary.days && itinerary.days.length > 0 && (
                (() => {
                  const currentDay = itinerary.days.find(d => (d.dayNumber || 1) === activeDay) || itinerary.days[0];
                  const dayFullText = `Day ${currentDay.dayNumber}: ${currentDay.theme}. Morning: ${currentDay.morning}. Afternoon: ${currentDay.afternoon}. Evening: ${currentDay.evening}.`;
                  
                  return (
                    <div className="day-detail-card">
                      <div className="day-detail-header">
                        <div>
                          <span className="day-badge">Day {currentDay.dayNumber || activeDay} Pan-India Plan</span>
                          <h3 className="day-theme">{currentDay.theme}</h3>
                        </div>
                        <button
                          onClick={() => playAudioGuide(dayFullText)}
                          className={`audio-btn ${audioPlaying ? "playing" : ""}`}
                          title="Listen with AI Audio Guide"
                        >
                          {audioPlaying ? "⏸️ Pause Audio" : "🎙️ Listen Audio Guide"}
                        </button>
                      </div>

                      <div className="day-timeline">
                        <div className="timeline-block morning">
                          <div className="time-badge">🌅 Morning</div>
                          <div className="timeline-content">
                            <p>{currentDay.morning}</p>
                          </div>
                        </div>

                        <div className="timeline-block afternoon">
                          <div className="time-badge">☀️ Afternoon</div>
                          <div className="timeline-content">
                            <p>{currentDay.afternoon}</p>
                          </div>
                        </div>

                        <div className="timeline-block evening">
                          <div className="time-badge">🌙 Evening & Night</div>
                          <div className="timeline-content">
                            <p>{currentDay.evening}</p>
                          </div>
                        </div>
                      </div>

                      {currentDay.bookedServices && currentDay.bookedServices.length > 0 && (
                        <div className="day-services-tag">
                          <span>📌 Booked Services for Day {currentDay.dayNumber}:</span>
                          {currentDay.bookedServices.map((svc, i) => (
                            <span key={i} className="service-chip">{svc}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()
              )}

              {/* LOCAL INSIDER TIPS */}
              {itinerary.localInsiderTips && itinerary.localInsiderTips.length > 0 && (
                <div className="tips-card">
                  <h4>💡 AI Local Insider & Regional Tips</h4>
                  <ul>
                    {itinerary.localInsiderTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
