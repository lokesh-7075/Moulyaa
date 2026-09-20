import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Premium Custom Toast override for window.alert
window.alert = function (message) {
  let container = document.getElementById("custom-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "custom-toast-container";
    container.style.cssText = "position: fixed; top: 20px; right: 20px; z-index: 99999; display: flex; flex-direction: column; gap: 12px; pointer-events: none;";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.style.cssText = `
    padding: 16px 24px;
    border-radius: 16px;
    color: white;
    font-weight: 500;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
    pointer-events: auto;
    font-family: system-ui, -apple-system, sans-serif;
    transform: translateX(50px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  const isError = 
    message.toLowerCase().includes("fail") || 
    message.toLowerCase().includes("error") || 
    message.includes("❌");

  if (isError) {
    toast.style.background = "linear-gradient(to right, #ef4444, #f43f5e)";
    toast.style.border = "1px solid rgba(239, 68, 68, 0.2)";
    toast.innerHTML = `<span style="font-size: 20px;">❌</span> <span>${message}</span>`;
  } else {
    toast.style.background = "linear-gradient(to right, #10b981, #14b8a6)";
    toast.style.border = "1px solid rgba(16, 185, 129, 0.2)";
    toast.innerHTML = `<span style="font-size: 20px;">✅</span> <span>${message}</span>`;
  }

  container.appendChild(toast);

  // Trigger anim
  setTimeout(() => {
    toast.style.transform = "translateX(0)";
    toast.style.opacity = "1";
  }, 50);

  // Auto-remove
  setTimeout(() => {
    toast.style.transform = "translateX(50px)";
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
      if (container.childNodes.length === 0) {
        container.remove();
      }
    }, 300);
  }, 3500);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
