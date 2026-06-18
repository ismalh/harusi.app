import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HarusiLogo } from "@/components/HarusiLogo";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/wali/$token")({
  component: WaliPage,
});

function WaliPage() {
  const { token } = Route.useParams();
  const [conversations, setConversations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Vérifier token d'abord
      const { data: tokenRow } = await (supabase as any)
        .from("wali_tokens")
        .select("expires_at, wali_user_id")
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

      // Récupérer les conversations de ce wali
      const { data: convs } = await supabase
        .from("conversations")
        .select("id, user_a, user_b, updated_at")
        .or(`user_a.eq.${tokenRow.wali_user_id},user_b.eq.${tokenRow.wali_user_id}`)
        .order("updated_at", { ascending: false });

      if (!convs || convs.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Récupérer les profils de l'autre personne
      const otherIds = convs.map((c: any) =>
        c.user_a === tokenRow.wali_user_id ? c.user_b : c.user_a
      );

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name")
        .in("id", otherIds);

      const profileMap: Record<string, any> = {};
      for (const p of profiles ?? []) profileMap[p.id] = p;

      const enriched = convs.map((c: any) => {
        const otherId = c.user_a === tokenRow.wali_user_id ? c.user_b : c.user_a;
        return {
          conversation_id: c.id,
          other_first_name: profileMap[otherId]?.first_name ?? "Inconnu",
          updated_at: c.updated_at,
        };
      });

      setConversations(enriched);
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
              Cette page vous donne accès en lecture seule aux conversations, conformément aux exigences islamiques de supervision.
            </div>
            {conversations.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">Aucune conversation pour l'instant.</p>
            ) : (
              <div className="space-y-2">
                {conversations.map((c) => (
                  <Link
                    key={c.conversation_id}
                    to="/wali/$token/$convId"
                    params={{ token, convId: c.conversation_id }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:bg-muted"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{c.other_first_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Dernière activité : {new Date(c.updated_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}