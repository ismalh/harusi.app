import { useEffect, useState } from "react";
import { X, Share, PlusSquare } from "lucide-react";

const STORAGE_KEY = "harusi_pwa_prompt_dismissed";

function isIos() {
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
}

function isInStandaloneMode() {
  return (
    "standalone" in window.navigator &&
    (window.navigator as any).standalone === true
  ) || window.matchMedia("(display-mode: standalone)").matches;
}

export function InstallPwaPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;
    if (isInStandaloneMode()) return;
    if (!isIos()) return;

    const timer = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, "1");
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300 px-4 pb-4">
      <div className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-4 shadow-lg">
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="pr-6 font-serif text-base text-foreground">
          Installe Harusi sur ton téléphone
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Appuie sur <Share className="inline h-4 w-4 -mt-0.5" /> puis sur{" "}
          <PlusSquare className="inline h-4 w-4 -mt-0.5" /> "Sur l'écran d'accueil"
        </p>
      </div>
    </div>
  );
}