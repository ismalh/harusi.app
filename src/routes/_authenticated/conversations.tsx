import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/conversations")({
  component: ConvsPage,
});

function ConvsPage() {
  const navigate = useNavigate();
  const [convs, setConvs] = useState<any[]>([]);
  const [me, setMe] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Record<string, any>>({});

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      setMe(auth.user.id);
      const { data } = await supabase.from("conversations")
        .select("*").or(`user_a.eq.${auth.user.id},user_b.eq.${auth.user.id}`)
        .order("updated_at", { ascending: false });
      setConvs(data ?? []);
      const otherIds = (data ?? []).map((c: any) => c.user_a === auth.user.id ? c.user_b : c.user_a);
      if (otherIds.length) {
        const { data: profs } = await supabase.from("profiles").select("id, first_name, photo_url").in("id", otherIds);
        const map: Record<string, any> = {};
        for (const p of profs ?? []) {
          let url: string | null = null;
          if (p.photo_url) {
            const { data: s } = await supabase.storage.from("profile-photos").createSignedUrl(p.photo_url, 3600);
            url = s?.signedUrl ?? null;
          }
          map[p.id] = { ...p, photo_signed: url };
        }
        setProfiles(map);
      }
    })();
  }, []);

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 flex items-center gap-2">
        <button onClick={() => navigate({ to: "/home" })} className="rounded-md p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-serif text-lg">Conversations</h1>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-4 space-y-2">
        {convs.length === 0 && <p className="text-sm text-muted-foreground">Aucune conversation.</p>}
        {convs.map((c) => {
          const otherId = c.user_a === me ? c.user_b : c.user_a;
          const other = profiles[otherId];
          return (
            <Link key={c.id} to="/chat/$id" params={{ id: c.id }}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 hover:bg-muted/50">
              {other?.photo_signed ? (
                <img src={other.photo_signed} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : <div className="h-10 w-10 rounded-full bg-muted" />}
              <div>
                <p className="text-sm font-medium">{other?.first_name ?? "Profil"}</p>
                <p className="text-xs text-muted-foreground">{new Date(c.updated_at).toLocaleString("fr-FR")}</p>
              </div>
            </Link>
          );
        })}
      </main>
    </div>
  );
}
