// Carica lo script Google Maps una sola volta e restituisce lo stato di caricamento
let scriptPromise = null;

function loadGoogleMapsScript(apiKey) {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (window.google?.maps?.places) { resolve(); return; }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=it`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => { scriptPromise = null; reject(new Error("Google Maps load failed")); };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

import { useState, useEffect } from "react";

export function useGooglePlaces() {
  const [ready, setReady] = useState(!!window.google?.maps?.places);
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_KEY;

  useEffect(() => {
    if (ready) return;
    if (!apiKey || apiKey === "INSERISCI_QUI_LA_TUA_API_KEY") return;
    loadGoogleMapsScript(apiKey)
      .then(() => setReady(true))
      .catch(console.error);
  }, [apiKey]);

  return ready;
}
