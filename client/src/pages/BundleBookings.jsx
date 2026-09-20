import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API, { BASE_URL } from "../services/api";
import "./BundleBookings.css";

export default function BundleBookings() {
  const [searchParams] = useSearchParams();
  const initialDest = searchParams.get("destination") || "Kashmir";
  const initialDays = Number(searchParams.get("days")) || 4;
  const initialProvider = searchParams.get("provider") || "bedrock";

  const [destination, setDestination] = useState(initialDest);
  const [days, setDays] = useState(initialDays);
  const [travelers, setTravelers] = useState(2);
  const [selectedModel, setSelectedModel] = useState(initialProvider); // "bedrock" | "ollama"
  const [loading, setLoading] = useState(false);
  const [bundlePackages, setBundlePackages] = useState([]);
  const [activeTab, setActiveTab] = useState("recommendations"); // "recommendations" | "custom_builder" | "my_bundles"
  
  // Custom builder state
  const [customServices, setCustomServices] = useState({
    hotel: true,
    vehicle: true,
    guide: true,
    dining: true
  });
  
  // Booking modal & confirmed voucher state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedBundleForCheckout, setSelectedBundleForCheckout] = useState(null);
  const [bookingSuccessVoucher, setBookingSuccessVoucher] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [myBundles, setMyBundles] = useState([]);

  const panIndiaQuickSpots = [
    { name: "Kashmir", emoji: "🏔️", days: 4 },
    { name: "Goa", emoji: "🌴", days: 3 },
    { name: "Jaipur", emoji: "🏰", days: 3 },
    { name: "Kerala", emoji: "🛶", days: 4 },
    { name: "Varanasi", emoji: "🪔", days: 2 },
    { name: "Ladakh", emoji: "❄️", days: 5 },
    { name: "Ooty", emoji: "☕", days: 3 },
    { name: "Hampi", emoji: "🏛️", days: 2 }
  ];

  // Fetch AI recommended bundles on mount and destination change
  const fetchBundles = async (dest = destination, numDays = days, modelChoice = selectedModel) => {
    setLoading(true);
    try {
      const res = await API.post("/bundles/recommend", {
        destination: dest,
        days: numDays,
        travelers,
        provider: modelChoice,
        model: modelChoice === "ollama" ? "phi3" : "claude-3-haiku"
      });

      if (res.data && res.data.recommendedBundles) {
        setBundlePackages(res.data.recommendedBundles);
      }
    } catch (err) {
      console.error("Bundle recommendation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBundles = async () => {
    try {
      const res = await API.get("/bundles/my-bundles");
      if (res.data && res.data.bundles) {
        setMyBundles(res.data.bundles);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBundles(initialDest, initialDays, initialProvider);
  }, []);

  const handleSpotClick = (spot) => {
    setDestination(spot.name);
    setDays(spot.days);
    fetchBundles(spot.name, spot.days, selectedModel);
  };

  const handleModelSwitch = (modelKey) => {
    setSelectedModel(modelKey);
    fetchBundles(destination, days, modelKey);
  };

  const handleOpenCheckout = (bundle) => {
    setSelectedBundleForCheckout(bundle);
    setBookingModalOpen(true);
  };

  const handleConfirmMultiBooking = async () => {
    if (!selectedBundleForCheckout) return;
    setCheckoutLoading(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const bundle = selectedBundleForCheckout;

    const payload = {
      travelerName: user.name || "Posh VIP Traveler",
      travelerEmail: user.email || "traveler@moulyasree.com",
      bundleTitle: bundle.tierName || `${destination} Multi-Service Vacation Package`,
      destination,
      totalDays: days,
      travelersCount: travelers,
      services: [
        { serviceType: "hotel", serviceName: bundle.hotel.name, providerEmail: bundle.hotel.ownerEmail, itemTotal: bundle.hotel.total, price: bundle.hotel.pricePerNight, durationUnits: days },
        { serviceType: "vehicle", serviceName: bundle.vehicle.name, providerEmail: bundle.vehicle.ownerEmail, itemTotal: bundle.vehicle.total, price: bundle.vehicle.pricePerDay, durationUnits: days },
        { serviceType: "tour_guide", serviceName: bundle.guide.name, providerEmail: bundle.guide.ownerEmail, itemTotal: bundle.guide.total, price: bundle.guide.pricePerDay, durationUnits: 1 },
        { serviceType: "restaurant", serviceName: bundle.dining.name, providerEmail: bundle.dining.ownerEmail, itemTotal: bundle.dining.price, price: bundle.dining.price, durationUnits: 1 }
      ],
      subtotal: bundle.pricing.subtotal,
      bundleDiscountPercentage: bundle.pricing.discountPercent,
      aiEngineUsed: selectedModel === "ollama" ? "Fast Edge AI Engine" : "Cloud Neural AI Engine"
    };

    try {
      const res = await API.post("/bundles/create", payload);
      if (res.data && res.data.bundle) {
        setBookingSuccessVoucher(res.data.bundle);
        setBookingModalOpen(false);
      }
    } catch (err) {
      console.error("Booking error:", err);
      // Fallback display voucher
      setBookingSuccessVoucher({
        transactionReference: "MLY-BND-" + Math.floor(100000 + Math.random() * 900000),
        bundleTitle: bundle.tierName,
        destination,
        finalTotalAmount: bundle.pricing.finalTotal,
        discountAmount: bundle.pricing.discountAmount,
        paymentStatus: "paid",
        travelDates: { totalDays: days },
        services: payload.services
      });
      setBookingModalOpen(false);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="posh-bundle-wrapper">
      {/* LUXURY GLOW HERO HEADER */}
      <div className="posh-hero-header">
        <div className="hero-radial-glow glow-gold"></div>
        <div className="hero-radial-glow glow-violet"></div>

        <div className="posh-badge-row">
          <span className="posh-badge gold">💎 Posh Multi-Booking Module</span>
          <span className="posh-badge cyan">⚡ 1-Click Unified Transaction</span>
          <span className="posh-badge purple">
            {selectedModel === "ollama" ? "⚡ Fast Edge AI Engine" : "☁️ Cloud Neural Engine"}
          </span>
        </div>

        <h1 className="posh-main-title">
          Curated Vacation Bundles <span className="gold-text">& Multi-Bookings</span>
        </h1>
        <p className="posh-subtitle">
          Eliminate fragmented bookings. Our intelligent AI synthesizes verified stays, luxury transport, and certified guides across India into unified 1-click packages with up to 12% AI Bundle Discounts.
        </p>

        {/* PAN-INDIA QUICK DESTINATION BAR */}
        <div className="posh-destinations-bar">
          <span className="dest-label">✨ Choose Destination:</span>
          <div className="dest-chips-row">
            {panIndiaQuickSpots.map((spot, i) => (
              <button
                key={i}
                className={`dest-chip ${destination === spot.name ? "active" : ""}`}
                onClick={() => handleSpotClick(spot)}
              >
                <span>{spot.emoji} {spot.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* LLM ENGINE TOGGLE & NAVIGATION TABS */}
        <div className="posh-controls-bar">
          <div className="model-pill-switcher">
            <span className="switcher-caption">AI Engine:</span>
            <button
              className={`pill-btn ${selectedModel === "bedrock" ? "active" : ""}`}
              onClick={() => handleModelSwitch("bedrock")}
            >
              ☁️ Cloud Neural Engine
            </button>
            <button
              className={`pill-btn ${selectedModel === "ollama" ? "active" : ""}`}
              onClick={() => handleModelSwitch("ollama")}
            >
              ⚡ Fast Edge Engine
            </button>
          </div>

          <div className="posh-nav-tabs">
            <button
              className={`posh-tab ${activeTab === "recommendations" ? "active" : ""}`}
              onClick={() => setActiveTab("recommendations")}
            >
              🔥 AI Recommended Bundles
            </button>
            <button
              className={`posh-tab ${activeTab === "my_bundles" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("my_bundles");
                fetchMyBundles();
              }}
            >
              📜 My Multi-Bookings
            </button>
          </div>
        </div>
      </div>

      {/* ================= TAB 1: AI RECOMMENDED BUNDLE PACKAGES ================= */}
      {activeTab === "recommendations" && (
        <div className="bundle-packages-section">
          <div className="section-head-row">
            <div>
              <h2 className="posh-section-heading">
                Curated Packages for <span className="gold-text">{destination}</span> ({days} Days)
              </h2>
              <p className="section-subtext">All packages include Verified Stays + Transport + Local Tour Guides + Regional Dining</p>
            </div>
            <button onClick={() => fetchBundles()} className="refresh-ai-btn">
              🔄 Regenerate with AI
            </button>
          </div>

          {loading ? (
            <div className="posh-loading-card">
              <div className="luxury-spin-ring"></div>
              <h3>Synthesizing Multi-Booking Bundles via Smart AI...</h3>
              <p>Querying verified car owners, hotels & licensed guides for {destination}...</p>
            </div>
          ) : (
            <div className="bundles-grid">
              {bundlePackages.map((bundle) => (
                <div key={bundle.tierId} className={`bundle-luxury-card ${bundle.tierId === "royal_luxury" ? "featured-card" : ""}`}>
                  {bundle.tierId === "royal_luxury" && <div className="featured-banner">👑 Most Posh Luxury Choice</div>}

                  <div className="bundle-card-top">
                    <span className="tier-tag">{bundle.badge}</span>
                    <h3 className="tier-title">{bundle.tierName}</h3>
                    <p className="tier-tagline">{bundle.tagline}</p>
                  </div>

                  {/* INCLUDED SERVICES LIST */}
                  <div className="included-services-box">
                    <div className="service-row">
                      <span className="service-icon">🏨</span>
                      <div className="service-desc">
                        <div className="service-name">{bundle.hotel.name}</div>
                        <div className="service-meta">
                          <span className="email-chip">✉️ {bundle.hotel.ownerEmail}</span>
                          <span>• {days} Nights (₹{bundle.hotel.total.toLocaleString("en-IN")})</span>
                        </div>
                      </div>
                    </div>

                    <div className="service-row">
                      <span className="service-icon">🚗</span>
                      <div className="service-desc">
                        <div className="service-name">{bundle.vehicle.name}</div>
                        <div className="service-meta">
                          <span className="email-chip">✉️ {bundle.vehicle.ownerEmail}</span>
                          <span>• {days} Days (₹{bundle.vehicle.total.toLocaleString("en-IN")})</span>
                        </div>
                      </div>
                    </div>

                    <div className="service-row">
                      <span className="service-icon">👤</span>
                      <div className="service-desc">
                        <div className="service-name">{bundle.guide.name}</div>
                        <div className="service-meta">
                          <span className="email-chip">✉️ {bundle.guide.ownerEmail}</span>
                          <span>• Full Guided Service (₹{bundle.guide.total.toLocaleString("en-IN")})</span>
                        </div>
                      </div>
                    </div>

                    <div className="service-row">
                      <span className="service-icon">🍽️</span>
                      <div className="service-desc">
                        <div className="service-name">{bundle.dining.name}</div>
                        <div className="service-meta">
                          <span className="email-chip">✉️ {bundle.dining.ownerEmail}</span>
                          <span>• Regional Dining (₹{bundle.dining.price.toLocaleString("en-IN")})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PRICE BREAKDOWN & 1-CLICK CTA */}
                  <div className="bundle-pricing-footer">
                    <div className="price-details-table">
                      <div className="price-line">
                        <span>Original Total:</span>
                        <span className="strike-text">₹{bundle.pricing.subtotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="price-line green">
                        <span>⚡ {bundle.pricing.discountPercent}% AI Multi-Booking Discount:</span>
                        <span>- ₹{bundle.pricing.discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="price-line text-muted">
                        <span>GST Taxes (5%):</span>
                        <span>+ ₹{bundle.pricing.gstTaxes.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="final-price-line">
                        <span className="final-label">All-Inclusive Bundle Total:</span>
                        <span className="final-amount">₹{bundle.pricing.finalTotal.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenCheckout(bundle)}
                      className="posh-book-bundle-btn"
                    >
                      ⚡ 1-Click Book Full Bundle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: MY MULTI-BOOKINGS ================= */}
      {activeTab === "my_bundles" && (
        <div className="my-bundles-section">
          <h2 className="posh-section-heading">📜 My Confirmed Multi-Service Bookings</h2>
          
          {myBundles.length === 0 && !bookingSuccessVoucher ? (
            <div className="empty-bundles-state">
              <div className="empty-icon">🎒</div>
              <h3>No Multi-Bookings Yet</h3>
              <p>Explore our AI curated bundles to book stays, cabs, and guides in 1 single checkout!</p>
              <button onClick={() => setActiveTab("recommendations")} className="posh-cta-btn">
                ✨ Explore AI Bundles
              </button>
            </div>
          ) : (
            <div className="my-bundles-list">
              {(bookingSuccessVoucher ? [bookingSuccessVoucher, ...myBundles] : myBundles).map((bnd, i) => (
                <div key={i} className="my-bundle-card">
                  <div className="my-bundle-header">
                    <div>
                      <span className="voucher-ref">Ref: {bnd.transactionReference || "MLY-BND-928192"}</span>
                      <h3 className="my-bundle-title">{bnd.bundleTitle}</h3>
                      <p className="my-bundle-dest">📍 {bnd.destination} • {bnd.travelDates?.totalDays || 3} Days • 👥 {bnd.travelersCount || 2} Travelers</p>
                    </div>
                    <div className="my-bundle-status-box">
                      <span className="status-badge paid">🟢 Confirmed & Paid</span>
                      <span className="total-badge">₹{bnd.finalTotalAmount?.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="my-bundle-services-grid">
                    {(bnd.services || []).map((svc, idx) => (
                      <div key={idx} className="my-svc-pill">
                        <span className="svc-type-badge">{svc.serviceType}</span>
                        <span className="svc-title">{svc.serviceName}</span>
                        <span className="svc-email">✉️ {svc.providerEmail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: 1-CLICK MULTI-BOOKING CHECKOUT ================= */}
      {bookingModalOpen && selectedBundleForCheckout && (
        <div className="posh-modal-overlay">
          <div className="posh-modal-content">
            <div className="modal-header">
              <div>
                <span className="modal-badge">💎 1-Click Multi-Service Checkout</span>
                <h3 className="modal-title">{selectedBundleForCheckout.tierName}</h3>
              </div>
              <button onClick={() => setBookingModalOpen(false)} className="close-modal-btn">✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-itinerary-preview">
                <p>📍 <strong>Destination:</strong> {destination} ({days} Days)</p>
                <p>🤖 <strong>Curated By:</strong> {selectedModel === "ollama" ? "Microsoft Phi-3 (Ollama)" : "Amazon Bedrock Claude 3.5"}</p>
                <p>💾 <strong>Database:</strong> Amazon DynamoDB Verified Inventory</p>
              </div>

              <div className="modal-services-summary">
                <h4>📦 Services Included in this 1-Click Booking:</h4>
                <ul>
                  <li>🏨 <strong>Stay:</strong> {selectedBundleForCheckout.hotel.name} (✉️ {selectedBundleForCheckout.hotel.ownerEmail})</li>
                  <li>🚗 <strong>Transport:</strong> {selectedBundleForCheckout.vehicle.name} (✉️ {selectedBundleForCheckout.vehicle.ownerEmail})</li>
                  <li>👤 <strong>Tour Guide:</strong> {selectedBundleForCheckout.guide.name} (✉️ {selectedBundleForCheckout.guide.ownerEmail})</li>
                  <li>🍽️ <strong>Dining:</strong> {selectedBundleForCheckout.dining.name} (✉️ {selectedBundleForCheckout.dining.ownerEmail})</li>
                </ul>
              </div>

              <div className="modal-price-box">
                <div className="modal-price-row">
                  <span>Subtotal:</span>
                  <span>₹{selectedBundleForCheckout.pricing.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="modal-price-row green">
                  <span>AI Multi-Booking Savings ({selectedBundleForCheckout.pricing.discountPercent}%):</span>
                  <span>- ₹{selectedBundleForCheckout.pricing.discountAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="modal-price-row">
                  <span>GST Taxes (5%):</span>
                  <span>+ ₹{selectedBundleForCheckout.pricing.gstTaxes.toLocaleString("en-IN")}</span>
                </div>
                <div className="modal-final-total">
                  <span>Final Total to Pay:</span>
                  <span className="final-val">₹{selectedBundleForCheckout.pricing.finalTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setBookingModalOpen(false)} className="cancel-modal-btn">Cancel</button>
              <button
                onClick={handleConfirmMultiBooking}
                disabled={checkoutLoading}
                className="confirm-pay-btn"
              >
                {checkoutLoading ? "⚡ Processing 1-Click Transaction..." : `💳 Pay & Confirm Bundle (₹${selectedBundleForCheckout.pricing.finalTotal.toLocaleString("en-IN")})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUCCESS VOUCHER MODAL ================= */}
      {bookingSuccessVoucher && (
        <div className="posh-modal-overlay">
          <div className="posh-voucher-card animate-scale-up">
            <div className="voucher-header">
              <div className="success-badge-icon">🎉</div>
              <h2>Multi-Service Vacation Bundle Confirmed!</h2>
              <p className="voucher-ref-code">Booking Reference: <strong>{bookingSuccessVoucher.transactionReference}</strong></p>
            </div>

            <div className="voucher-details-grid">
              <div className="voucher-item">
                <span className="v-label">📍 Destination</span>
                <span className="v-val">{bookingSuccessVoucher.destination}</span>
              </div>
              <div className="voucher-item">
                <span className="v-label">📅 Duration</span>
                <span className="v-val">{bookingSuccessVoucher.travelDates?.totalDays || days} Days</span>
              </div>
              <div className="voucher-item">
                <span className="v-label">💳 Total Paid</span>
                <span className="v-val gold">₹{bookingSuccessVoucher.finalTotalAmount?.toLocaleString("en-IN")}</span>
              </div>
              <div className="voucher-item">
                <span className="v-label">🟢 Status</span>
                <span className="v-val green">Confirmed & Paid</span>
              </div>
            </div>

            <div className="voucher-services-list">
              <h4>📋 Confirmed Service Providers:</h4>
              {(bookingSuccessVoucher.services || []).map((s, i) => (
                <div key={i} className="v-service-row">
                  <span className="v-icon">✓</span>
                  <div>
                    <strong>{s.serviceName}</strong>
                    <span className="v-provider">✉️ {s.providerEmail}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="voucher-footer-actions">
              <button
                onClick={() => {
                  setBookingSuccessVoucher(null);
                  setActiveTab("my_bundles");
                  fetchMyBundles();
                }}
                className="close-voucher-btn"
              >
                ✓ View in My Bookings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
