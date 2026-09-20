import React, { useState, useRef, useEffect } from "react";
import API from "../services/api";
import "./AIChatWidget.css";

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatModel, setChatModel] = useState("bedrock"); // "bedrock" | "ollama"
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      engine: "Amazon Bedrock",
      text: "👋 Hi! I'm Moulya AI, your smart travel concierge. Switch between Amazon Bedrock (Claude 3.5) and Ollama (Microsoft Phi-3) anytime right here!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    "Plan a 2-day Ooty trip under ₹20k",
    "Top heritage places in Hampi?",
    "How to book a verified local guide?"
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || loading) return;

    const newMessages = [...messages, { sender: "user", text: textToSend }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/ai/chat", {
        message: textToSend,
        provider: chatModel,
        model: chatModel === "ollama" ? "phi3" : "claude-3-haiku"
      });
      if (res.data && res.data.reply) {
        setMessages([
          ...newMessages,
          {
            sender: "ai",
            text: res.data.reply,
            engine: res.data.engine || (chatModel === "ollama" ? "Fast Edge AI Engine" : "Cloud Neural AI Engine")
          }
        ]);
      }
    } catch (err) {
      console.error("AI Chat error:", err);
      setMessages([
        ...newMessages,
        {
          sender: "ai",
          text: "I am having trouble connecting to the AI backend right now. Please ensure the server is running."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text, idx) => {
    if ("speechSynthesis" in window) {
      if (speakingIdx === idx) {
        window.speechSynthesis.cancel();
        setSpeakingIdx(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setSpeakingIdx(null);
      setSpeakingIdx(idx);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="ai-widget-container">
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ai-widget-trigger"
          title="Chat with Moulya AI Concierge"
        >
          <span className="trigger-badge">24/7 Live</span>
          <div className="trigger-icon">✨</div>
          <span className="trigger-text">AI Concierge</span>
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* HEADER */}
          <div className="chat-window-header">
            <div className="header-agent-info">
              <div className="agent-avatar">
                {chatModel === "ollama" ? "⚡" : "🤖"}
              </div>
              <div>
                <h4 className="agent-name">Moulya AI Concierge</h4>
                <span className="agent-status">
                  <span className="online-dot"></span>
                  {chatModel === "ollama" ? "Fast Edge AI Engine" : "Cloud Neural AI Engine"}
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="close-chat-btn">
              ✕
            </button>
          </div>

          {/* MODEL SWITCHER BAR */}
          <div className="chat-model-switcher">
            <span className="switcher-label">Engine:</span>
            <button
              className={`switcher-btn ${chatModel === "bedrock" ? "active" : ""}`}
              onClick={() => setChatModel("bedrock")}
            >
              ☁️ Cloud Neural AI
            </button>
            <button
              className={`switcher-btn ${chatModel === "ollama" ? "active" : ""}`}
              onClick={() => setChatModel("ollama")}
            >
              ⚡ Fast Edge AI
            </button>
          </div>

          {/* MESSAGES BODY */}
          <div className="chat-messages-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble-row ${msg.sender}`}>
                <div className={`chat-bubble ${msg.sender}`}>
                  {msg.sender === "ai" && msg.engine && (
                    <div className="bubble-engine-tag">
                      {msg.engine.includes("Edge") || msg.engine.includes("Local") || msg.engine.includes("Phi") ? "⚡ Fast Edge AI" : "☁️ Cloud Neural AI"}
                    </div>
                  )}
                  <p className="bubble-text">{msg.text}</p>
                  {msg.sender === "ai" && (
                    <button
                      onClick={() => speakText(msg.text, i)}
                      className="bubble-audio-btn"
                      title="Listen with Text-to-Speech"
                    >
                      {speakingIdx === i ? "⏹️ Stop" : "🔊 Listen"}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-bubble-row ai">
                <div className="chat-bubble ai typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* QUICK PROMPTS */}
          <div className="quick-prompts-bar">
            {quickPrompts.map((q, i) => (
              <button key={i} onClick={() => handleSend(q)} className="quick-prompt-btn">
                {q}
              </button>
            ))}
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="chat-input-bar"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${chatModel === "ollama" ? "Phi-3" : "Bedrock"} about trips, cabs, stays...`}
              className="chat-input"
            />
            <button type="submit" disabled={!input.trim() || loading} className="chat-send-btn">
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
