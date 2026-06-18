import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HarusiLogo } from "@/components/HarusiLogo";

export const Route = createFileRoute("/wali/$token")({
  component: WaliPage,
});

function WaliPage() {
  const { token } = Route.useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: tokenRow } = await (supabase as any)
        .from("wali_tokens")
        .select("expires_at, wali_user_id, conversation_id")
        .eq("token", token)
        .maybeSingle();

      if (!tokenRow) {
        setError("Lien invalide ou expiré.");
        setLoading(false);
        return;
      }
      if (new Date(tokenRow.expires_at) < new Date()) {
        setError("Ce lien a expiré (valide 30 jours).");
        setLoading(false);
        return;
      }

      const convId = tokenRow.conversation_id;

      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", convId)
        .order("created_at");

      setMessages(msgs ?? []);

      const ids = [...new Set((msgs ?? []).map((m: any) => m.sender_id))] as string[];
      if (ids.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, first_name")
          .in("id", ids);
        const map: Record<string, any> = {};
        for (const p of profs ?? []) map[p.id] = p;
        setProfiles(map);
      }

      setLoading(false);
    })();
  }, [token]);

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border px-4 py-3">
        <HarusiLogo size="sm" />
        <p className="mt-1 text-xs text-muted-foreground">Vue wali — lecture seule</p>
      </header>
      <main className="mx-auto max-w-md px-4 py-4">
        {loading && <p className="text-sm text-muted-foreground">Chargement…</p>}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        {!loading && !error && (
          <>
            <div className="mb-4 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              Cette page vous donne accès en lecture seule à la conversation, conformément aux exigences islamiques de supervision.
            </div>
            <div className="space-y-3">
              {messages.map((m) => {
                const sender = profiles[m.sender_id];
                return (
                  <div key={m.id} className="rounded-xl border border-border bg-card px-4 py-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium">{sender?.first_name ?? "—"}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(m.created_at).toLocaleString("fr-FR")}
                      </span>
                    </div>
                    <p className="text-sm">{m.body}</p>
                  </div>
                );
              })}
              {messages.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">Aucun message pour l'instant.</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}