import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Check, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/demandes")({
  component: DemandesPage,
});

function DemandesPage() {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    const { data } = await supabase
      .from("match_requests")
      .select("*")
      .eq("receiver_id", auth.user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    setDemandes(data ?? []);

    const ids = (data ?? []).map((d: any) => d.sender_id);
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, first_name, age, city, photo_url")
        .in("id", ids);

      const map: Record<string, any> = {};
      for (const p of profs ?? []) {
        let url = null;
        if (p.photo_url) {
          const { data: s } = await supabase.storage
            .from("profile-photos")
            .createSignedUrl(p.photo_url, 3600);
          url = s?.signedUrl ?? null;
        }
        map[p.id] = { ...p, photo_signed: url };
      }
      setProfiles(map);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function accepter(demande: any) {
    // Mettre à jour le statut
    await supabase
      .from("match_requests")
      .update({ status: "accepted" })
      .eq("id", demande.id);

    // Créer la conversation
    const [a, b] =
      demande.sender_id < demande.receiver_id
        ? [demande.sender_id, demande.receiver_id]
        : [demande.receiver_id, demande.sender_id];

    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("user_a", a)
      .eq("user_b", b)
      .maybeSingle();

    if (!existing) {
      await supabase.from("conversations").insert({ user_a: a, user_b: b });
    }

    load();
  }

  async function refuser(id: string) {
    await supabase
      .from("match_requests")
      .update({ status: "refused" })
      .eq("id", id);
    load();
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 flex items-center gap-2">
        <button onClick={() => navigate({ to: "/home" })} className="rounded-md p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-serif text-lg">Demandes reçues</h1>
      </header>
      <main className="mx-auto max-w-md px-4 py-4 space-y-3">
        {loading && <p className="text-sm text-muted-foreground">Chargement…</p>}
        {!loading && demandes.length === 0 && (
          <p className="mt-8 text-center text-sm text-muted-foreground">Aucune demande en attente.</p>
        )}
        {demandes.map((d) => {
          const p = profiles[d.sender_id];
          return (
            <div key={d.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              {p?.photo_signed ? (
                <img src={p.photo_signed} alt="" className="h-14 w-14 rounded-full object-cover shrink-0" />
              ) : (
                <div className="h-14 w-14 rounded-full bg-muted shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{p?.first_name ?? "—"}{p?.age ? `, ${p.age} ans` : ""}</p>
                <p className="text-xs text-muted-foreground truncate">{p?.city ?? ""}</p>
                <p className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString("fr-FR")}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => accepter(d)}
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => refuser(d.id)}
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
