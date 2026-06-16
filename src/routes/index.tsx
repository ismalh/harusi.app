import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { HarusiLogo } from "@/components/HarusiLogo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Harusi — Mariage islamique comorien" },
      { name: "description", content: "Harusi : mise en relation pour le mariage islamique comorien." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      if (data.user) navigate({ to: "/home" });
      else setTimeout(() => navigate({ to: "/connexion" }), 800);
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6">
      <div className="text-center">
        <HarusiLogo size="xl" />
        <p className="mt-6 font-serif italic text-foreground/70">
          Avec sérieux, pudeur et intention.
        </p>
      </div>
    </main>
  );
}
