import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { BASE_URL } from "../services/api";
import "./SnapAndExplore.css";

export default function SnapAndExplore() {
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recommendedGuides, setRecommendedGuides] = useState([]);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Preset sample landmarks for instant 1-click test in demo
  const sampleLandmarks = [
    {
      name: "Taj Mahal, Agra",
      url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
      query: "Explain the architectural style, history, and visitor etiquette for Taj Mahal."
    },
    {
      name: "Meenakshi Temple, Madurai",
      url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
      query: "Identify this temple, explain its gopuram architecture and temple customs."
    },
    {
      name: "Traditional South Indian Thali Menu",
      url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800",
      query: "Explain each item in this traditional thali and suggest local restaurant specialties."
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMimeType(file.type || "image/jpeg");

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setImagePreview(uploadEvent.target.result);
      setImageBase64(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleClick = async (sample) => {
    setImagePreview(sample.url);
    setUserQuery(sample.query);
    setLoading(true);
    setResult(null);

    // Convert sample image URL to base64
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result;
        setImageBase64(base64data);
        await executeAnalysis(base64data, sample.query, "image/jpeg");
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.warn("Direct fetch CORS, simulating sample payload", err);
      // Fallback base64 placeholder
      await executeAnalysis("sample_base64_demo", sample.query, "image/jpeg");
    }
  };

  const executeAnalysis = async (base64Data, queryText, mime) => {
    setLoading(true);
    try {
      const res = await API.post("/ai/snap-explore", {
        imageBase64: base64Data || imageBase64,
        mimeType: mime || mimeType,
        userQuery: queryText || userQuery
      });

      if (res.data && res.data.data) {
        setResult(res.data.data);
        setRecommendedGuides(res.data.recommendedGuides || []);
      }
    } catch (err) {
      console.error("Snap and explore error:", err);
      alert("Failed to analyze image with Vision AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imageBase64 && !imagePreview) {
      alert("Please upload an image or select a sample landmark.");
      return;
    }
    executeAnalysis(imageBase64, userQuery, mimeType);
  };

  const playVoiceNarrator = (text) => {
    if ("speechSynthesis" in window) {
      if (audioPlaying) {
        window.speechSynthesis.cancel();
        setAudioPlaying(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setAudioPlaying(false);
      setAudioPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getMediaUrl = (path) => {
    if (!path) return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/uploads/${path.replace(/^uploads\//, "")}`;
  };

  return (
    <div className="snap-wrapper">
      <div className="snap-hero">
        <div className="snap-tag">
          <span>📸 Multimodal Vision Heritage & Menu Guide</span>
        </div>
        <h1 className="snap-title">Snap & Explore: AI Visual Heritage & Menu Guide</h1>
        <p className="snap-desc">
          Upload any photo of a heritage monument, ancient temple, scenic viewpoint, or regional restaurant menu. Our Vision AI decodes the historical backstory, culture, and etiquette in seconds.
        </p>
      </div>

      <div className="snap-grid">
        {/* LEFT: UPLOAD & CONTROLS */}
        <div className="snap-card-input">
          <h3 className="section-title">📷 Upload Photo or Select Sample</h3>

          <form onSubmit={handleSubmit} className="snap-form">
            <div className="upload-dropzone">
              <input
                type="file"
                accept="image/*"
                id="camera-upload"
                onChange={handleFileChange}
                className="hidden-file-input"
              />
              <label htmlFor="camera-upload" className="dropzone-label">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="preview-img" />
                ) : (
                  <div className="dropzone-content">
                    <span className="camera-icon">📸</span>
                    <span className="drop-title">Click to Upload Photo</span>
                    <span className="drop-sub">JPG, PNG, WEBP supported</span>
                  </div>
                )}
              </label>
            </div>

            <div className="form-group">
              <label>💬 Specific Question (Optional)</label>
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="e.g. What is the history of this monument? What are the dress code rules?"
                className="snap-input"
              />
            </div>

            <button type="submit" disabled={loading || (!imagePreview && !imageBase64)} className="snap-btn">
              {loading ? "🔍 Vision AI Analyzing Image..." : "✨ Analyze with Vision AI"}
            </button>
          </form>

          {/* SAMPLES */}
          <div className="sample-section">
            <p className="sample-label">⚡ Try Quick Sample Photos:</p>
            <div className="sample-grid">
              {sampleLandmarks.map((sample, idx) => (
                <div
                  key={idx}
                  className="sample-item"
                  onClick={() => handleSampleClick(sample)}
                >
                  <img src={sample.url} alt={sample.name} />
                  <span>{sample.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: AI INSIGHTS RESULT */}
        <div className="snap-card-results">
          {!result && !loading && (
            <div className="snap-placeholder">
              <div className="placeholder-icon">🏛️</div>
              <h3>Visual Intelligence Awaiting Photo</h3>
              <p>Upload a landmark, monument, or local food photo on the left to unlock instant AI historical narratives and verified local guide recommendations.</p>
            </div>
          )}

          {loading && (
            <div className="snap-loading">
              <div className="radar-spinner"></div>
              <h3>Amazon Bedrock Multimodal Vision Engine Active</h3>
              <p>Detecting architectural elements, cultural context, and platform local guides...</p>
            </div>
          )}

          {result && (
            <div className="analysis-view">
              <div className="analysis-header">
                <div>
                  <span className="category-tag">{result.category || "Heritage Landmark"}</span>
                  <h2 className="subject-title">{result.identifiedSubject}</h2>
                </div>
                <button
                  onClick={() => playVoiceNarrator(`${result.identifiedSubject}. ${result.historicalSignificance}. Etiquette: ${(result.visitorEtiquetteAndTips || []).join(". ")}`)}
                  className={`voice-narrator-btn ${audioPlaying ? "playing" : ""}`}
                >
                  {audioPlaying ? "⏸️ Pause Voice" : "🎙️ Listen Audio Story"}
                </button>
              </div>

              <div className="insight-block">
                <h4>📜 Historical & Cultural Significance</h4>
                <p>{result.historicalSignificance}</p>
              </div>

              {result.architecturalOrCulinaryDetails && (
                <div className="insight-block">
                  <h4>🏛️ Architecture & Specialty Details</h4>
                  <p>{result.architecturalOrCulinaryDetails}</p>
                </div>
              )}

              {result.visitorEtiquetteAndTips && (
                <div className="insight-block tips">
                  <h4>💡 Visitor Etiquette & Practical Tips</h4>
                  <ul>
                    {result.visitorEtiquetteAndTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* RECOMMENDED GUIDES */}
              {recommendedGuides.length > 0 && (
                <div className="guides-recommendation-box">
                  <div className="guides-head">
                    <h4>👤 Recommended Certified Guides for this Spot</h4>
                    <button onClick={() => navigate("/guides")} className="view-all-link">View All Guides ➔</button>
                  </div>

                  <div className="guides-list">
                    {recommendedGuides.map((guide) => (
                      <div key={guide._id} className="guide-mini-card" onClick={() => navigate(`/guide/${guide._id}`)}>
                        <img src={getMediaUrl(guide.images?.[0])} alt={guide.guideName} className="guide-mini-avatar" />
                        <div>
                          <div className="guide-mini-name">{guide.guideName}</div>
                          <div className="guide-mini-exp">🗣️ {guide.languages?.join(", ")} • ⭐ {guide.rating || 4.9}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
