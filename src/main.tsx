import React from "react";
import { createRoot } from "react-dom/client";
// No runtime routing required in this single-page app wrapper. Removing react-router-dom
// dependency to avoid build-time resolution errors when the package isn't installed.
import App from "./App";
import "./index.css";

/**
 * Standard React entry (Vite / CRA).
 * - Wraps App with BrowserRouter for the routes defined in App.tsx.
 * - If your repo already exposes a different root (Next.js, Remix, etc.), use the Next.js instructions below.
 */

const container = document.getElementById("root");
if (!container) throw new Error("#root element not found");

// Temporary global error overlay to help trace runtime exceptions that cause a white screen in dev.
// This will display uncaught exceptions and unhandled promise rejections directly in the page body.
function installGlobalErrorOverlay() {
  const overlayId = "__dev_global_error_overlay__";
  function showError(message: string, stack?: string) {
    let el = document.getElementById(overlayId) as HTMLDivElement | null;
    if (!el) {
      el = document.createElement("div");
      el.id = overlayId;
      Object.assign(el.style, {
        position: "fixed",
        left: "0",
        right: "0",
        top: "0",
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        padding: "16px",
        zIndex: "99999",
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
        maxHeight: "50vh",
        overflow: "auto",
      } as Partial<CSSStyleDeclaration>);
      document.body.appendChild(el);
    }
    el.innerText = `Runtime error:\n${message}\n\n${stack || ""}`;
  }

  window.addEventListener("error", (ev) => {
    try {
      const msg = ev?.error?.message || ev?.message || String(ev.error || "Unknown error");
      const stack = ev?.error?.stack || "";
      console.error("Global error captured:", ev.error || ev.message, ev);
      showError(msg, stack);
    } catch (e) {
      console.error("Error showing global overlay", e);
    }
  });

  window.addEventListener("unhandledrejection", (ev: any) => {
    try {
      const reason = ev?.reason || "Unhandled rejection";
      const msg = reason?.message || String(reason);
      const stack = reason?.stack || "";
      console.error("Unhandled rejection:", reason);
      showError(`Unhandled rejection: ${msg}`, stack);
    } catch (e) {
      console.error("Error showing rejection overlay", e);
    }
  });
}

if (typeof window !== "undefined") {
  installGlobalErrorOverlay();
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);