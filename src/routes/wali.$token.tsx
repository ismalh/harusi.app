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
      const { data, error: rpcError } = await (supabase as any).rpc("get_wali_conversations", {
        _token: token,
      });

      if (rpcError || !data || data.length === 0) {
        // Vérifier si le token existe mais sans conversation, ou s'il n'existe pas / a expiré
        const { data: tokenRow } = await (supabase as any)
          .from("wali_tokens")
          .select("expires_at")
          .eq("token", token)
          .is("conversation_id", null)
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
        // Token valide mais aucune conversation encore
        setConversations([]);
        setLoading(false);
        return;
      }

      setConversations(data);
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
                      <p className="text-sm font-medium">{c.other_first_name ?? "Conversation"}</p>
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