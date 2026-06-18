import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Heart, Flag, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { islandLabel } from "@/lib/islands";

export const Route = createFileRoute("/_authenticated/profil/$id")({
  component: ProfilPage,
});

function ProfilPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [p, setP] = useState<any>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [me, setMe] = useState<string | null>(null);
  const [demandeStatus, setDemandeStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      setMe(auth.user.id);

      const { data } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
      setP(data);

      // Charger toutes les photos approuvées, triées par position
      const { data: photosData } = await (supabase as any)
        .from("profile_photos")
        .select("url, position")
        .eq("user_id", id)
        .eq("status", "approved")
        .order("position");

      const urls: string[] = [];
      for (const photo of photosData ?? []) {
        const { data: s } = await supabase.storage.from("profile-photos").createSignedUrl(photo.url, 3600);
        if (s?.signedUrl) urls.push(s.signedUrl);
      }

      // Fallback : si pas de photos dans profile_photos, utiliser photo_url
      if (urls.length === 0 && data?.photo_url) {
        const { data: s } = await supabase.storage.from("profile-photos").createSignedUrl(data.photo_url, 3600);
        if (s?.signedUrl) urls.push(s.signedUrl);
      }
      setPhotos(urls);

      const { data: req } = await supabase
        .from("match_requests")
        .select("status")
        .eq("sender_id", auth.user.id)
        .eq("receiver_id", id)
        .maybeSingle();
      if (req) setDemandeStatus(req.status);

      if (auth.user.id !== id) {
        await (supabase as any).from("profile_views").insert({
          viewer_id: auth.user.id,
          viewed_id: id,
        });
      }
    })();
  }, [id]);

  async function envoyerDemande() {
    if (!me || !id) return;
    setSending(true);
    const { error } = await supabase.from("match_requests").insert({
      sender_id: me,
      receiver_id: id,
      status: "pending",
    });
    if (!error) setDemandeStatus("pending");
    setSending(false);
  }

  async function report() {
    const reason = prompt("Motif du signalement :");
    if (!reason || !me || !id) return;
    await supabase.from("reports").insert({ reporter_id: me, reported_id: id, reason });
    alert("Merci, le signalement a été envoyé.");
  }

  function nextPhoto() {
    setPhotoIndex((i) => (i + 1) % photos.length);
  }

  function prevPhoto() {
    setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
  }

  if (!p) return <div className="grid min-h-dvh place-items-center">Chargement…</div>;

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3">
        <button onClick={() => navigate({ to: "/home" })} className="rounded-md p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
      </header>
      <main className="mx-auto max-w-md px-4 py-4">
        <div className="relative">
          {photos.length > 0 ? (
            <img src={photos[photoIndex]} alt="" className="aspect-square w-full rounded-xl object-cover" />
          ) : (
            <div className="aspect-square w-full rounded-xl bg-muted" />
          )}

          {p.plan === "premium" && (
            <span className="absolute right-2 top-2 rounded-full bg-amber-500 px-2 py-1 text-xs font-bold text-white">
              Premium
            </span>
          )}

          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white hover:bg-black/60"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                {photos.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${i === photoIndex ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <h1 className="font-serif text-2xl">{p.first_name}, {p.age} ans</h1>
          {p.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-blue-500" />}
        </div>
        <p className="text-sm text-muted-foreground">{p.city} · {islandLabel(p.island)}</p>

        <div className="mt-4 space-y-2 rounded-xl border border-border bg-card p-4 text-sm">
          {p.origine_principale && <p><span className="font-medium">Origine :</span> {p.origine_principale}{p.origine_secondaire ? ` / ${p.origine_secondaire}` : ""}</p>}
          {p.nationalite && <p><span className="font-medium">Nationalité :</span> {p.nationalite}</p>}
          {p.statut_matrimonial && <p><span className="font-medium">Statut :</span> {p.statut_matrimonial}</p>}
          {p.profession && <p><span className="font-medium">Profession :</span> {p.profession}</p>}
          {p.frequence_priere && <p><span className="font-medium">Prière :</span> {p.frequence_priere}</p>}
          {p.taille && <p><span className="font-medium">Taille :</span> {p.taille}</p>}
          {p.en_hijra !== null && p.en_hijra !== undefined && <p><span className="font-medium">En hijra :</span> {p.en_hijra ? "Oui" : "Non"}</p>}
          {p.langues?.length > 0 && <p><span className="font-medium">Langues :</span> {p.langues.join(", ")}</p>}
        </div>

        {p.bio && (
          <div className="mt-4 rounded-xl border border-border bg-card p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">À propos</p>
            <p className="text-sm">{p.bio}</p>
          </div>
        )}

        {p.description_recherche && (
          <div className="mt-3 rounded-xl border border-border bg-card p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Profil recherché</p>
            <p className="text-sm">{p.description_recherche}</p>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {demandeStatus === null && (
            <button
              onClick={envoyerDemande}
              disabled={sending}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              <Heart className="h-4 w-4" /> Envoyer une demande
            </button>
          )}
          {demandeStatus === "pending" && (
            <div className="flex-1 rounded-lg border border-border bg-muted py-3 text-center text-sm text-muted-foreground">
              Demande envoyée — en attente
            </div>
          )}
          {demandeStatus === "accepted" && (
            <div className="flex-1 rounded-lg border border-border bg-emerald-50 py-3 text-center text-sm text-emerald-700">
              Demande acceptée ✓
            </div>
          )}
          {demandeStatus === "declined" && (
            <div className="flex-1 rounded-lg border border-border bg-muted py-3 text-center text-sm text-muted-foreground">
              Demande refusée
            </div>
          )}
          <button onClick={report} className="rounded-lg border border-border px-3 py-3 text-sm text-rose-600">
            <Flag className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}