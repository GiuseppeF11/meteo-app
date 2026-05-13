import { useEffect, useState } from "react";
import { useCity } from "../contexts/CityContext";
import { useLang } from "../contexts/LangContext";

export default function Toast() {
  const { error, setError } = useCity();
  const { t } = useLang();
  const [closing, setClosing] = useState(false);

  // Quando arriva un nuovo errore, resetta lo stato di chiusura
  useEffect(() => {
    if (error) setClosing(false);
  }, [error]);

  // Auto-dismiss dopo 4 secondi
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => handleClose(), 4000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleClose = () => {
    setClosing(true);
    // Attendi che l'animazione di uscita finisca prima di azzerare l'errore
    setTimeout(() => setError(null), 220);
  };

  if (!error) return null;

  // Mappa chiavi semantiche → testo tradotto; fallback su networkError
  const message = t(error) !== error ? t(error) : t("networkError");

  return (
    <div
      className={`toast glass${closing ? " toast--closing" : ""}`}
      role="alert"
      aria-live="polite"
    >
      <span className="toast-message">{message}</span>
      <button
        type="button"
        className="toast-close"
        onClick={handleClose}
        aria-label={t("toastClose")}
      >
        ×
      </button>
    </div>
  );
}
