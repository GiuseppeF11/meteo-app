import React from "react";
import { useLang } from "../contexts/LangContext";

export default function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="Switch language"
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 300,
        display: "flex", alignItems: "center",
        borderRadius: 20,
        border: "1px solid var(--card-stroke)",
        background: "var(--card)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        boxShadow: "0 4px 20px rgba(0,0,0,.15)",
        padding: 3,
      }}
    >
      {/* Sliding thumb */}
      <span style={{
        position: "absolute",
        top: 3, left: 3,
        width: "calc(50% - 3px)",
        bottom: 3,
        borderRadius: 14,
        background: "var(--accent)",
        opacity: 0.9,
        transform: lang === "en" ? "translateX(100%)" : "translateX(0)",
        transition: "transform 0.22s cubic-bezier(.4,0,.2,1)",
        pointerEvents: "none",
      }} />
      {["it", "en"].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          style={{
            position: "relative", zIndex: 1,
            width: 36, height: 28,
            border: "none", background: "transparent", cursor: "pointer",
            fontFamily: "var(--font-mono)", fontSize: 11,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: lang === l ? "var(--bg-1)" : "var(--ink-2)",
            fontWeight: lang === l ? 700 : 400,
            transition: "color 0.22s",
            borderRadius: 14,
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
