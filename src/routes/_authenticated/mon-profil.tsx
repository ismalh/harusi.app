import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Trash2, Settings, Eye, Lock } from "lucide-react";
import { islandLabel } from "@/lib/islands";

type WaliProfile = {
  id: string;
  user_id: string;
  full_name: string | null;
  relation: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
};

export const Route = createFileRoute("/_authenticated/mon-profil")({
  component: MonProfil,
});

function MonProfil() {
  const navigate = useNavigate();
  const [p, setP] = useState<any>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Wali
  const [waliNom, setWaliNom] = useState("");
  const [waliRelation, setWaliRelation] = useState("");
  const [waliTel, setWaliTel] = useState("");
  const [waliEmail, setWaliEmail] = useState("");
  const [waliNotes, setWaliNotes] = useState("");
  const [waliId, setWaliId] = useState<string | null>(null);
  const [savingWali, setSavingWali] = useState(false);

  // Vues de profil
  const [viewsCount, setViewsCount] = useState(0);
  const [viewers, setViewers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle();
      setP(data);
      setBio(data?.bio ?? "");
      if (data?.photo_url) {
        const { data: s } = await supabase.storage.from("profile-photos").createSignedUrl(data.photo_url, 3600);
        setPhoto(s?.signedUrl ?? null);
      }

      // Charger wali si femme
      if (data?.gender === "femme") {
        const { data: wali } = await supabase
          .from("wali")
          .select("*")
          .eq("user_id", auth.user.id)
          .maybeSingle();
        if (wali) {
          setWaliId(wali.user_id);
          setWaliNom(wali.full_name ?? "");
          setWaliRelation(wali.relation ?? "");
          setWaliTel(wali.phone ?? "");
          setWaliEmail(wali.email ?? "");
          setWaliNotes(wali.notes ?? "");
        }
      }

      // Charger les vues de profil
      const { count } = await (supabase as any)
        .from("profile_views")
        .select("id", { count: "exact", head: true })
        .eq("viewed_id", auth.user.id);
      setViewsCount(count ?? 0);

      if (data?.plan === "premium" || data?.plan === "vip") {
        const { data: viewsData } = await (supabase as any)
          .from("profile_views")
          .select("viewer_id, created_at")
          .eq("viewed_id", auth.user.id)
          .order("created_at", { ascending: false })
          .limit(50);

        if (viewsData?.length) {
          const viewerIds = [...new Set(viewsData.map((v: any) => v.viewer_id))] as string[];
          const { data: profs } = await supabase
            .from("profiles")
            .select("id, first_name, age, city, photo_url")
            .in("id", viewerIds);

          const profMap: Record<string, any> = {};
          for (const prof of profs ?? []) profMap[prof.id] = prof;

          const enriched = viewsData.map((v: any) => ({
            ...v,
            profile: profMap[v.viewer_id],
          }));
          setViewers(enriched);
        }
      }
    })();
  }, []);

  async function save() {
    setSaving(true);
    await supabase.from("profiles").update({ bio }).eq("id", p.id);
    setSaving(false);
  }

  async function saveWali() {
    setSavingWali(true);
    const payload = {
      user_id: p.id,
      full_name: waliNom,
      relation: waliRelation as "pere" | "frere" | "oncle" | "tuteur" | "autre",
      phone: waliTel,
      email: waliEmail,
      notes: waliNotes,
    };

    if (waliId) {
      await supabase.from("wali").update(payload).eq("user_id", waliId);
    } else {
      const { data } = await supabase.from("wali").insert(payload).select("user_id").single();
      if (data) setWaliId(data.user_id);
    }

    setSavingWali(false);
  }

  async function deleteAccount() {
    setDeleting(true);
    await supabase.from("profiles").delete().eq("id", p.id);
    await supabase.auth.admin?.deleteUser(p.id).catch(() => {});
    await supabase.auth.signOut();
    navigate({ to: "/connexion" });
  }

  if (!p) return <div className="grid min-h-dvh place-items-center">Chargement…</div>;

  const isPremium = p.plan === "premium" || p.plan === "vip";

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate({ to: "/home" })} className="rounded-md p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Link to="/parametres" className="rounded-md p-1 hover:bg-muted">
          <Settings className="h-5 w-5" />
        </Link>
      </header>
      <main className="mx-auto max-w-md space-y-4 px-4 py-4">
        {photo && <img src={photo} alt="" className="aspect-square w-full rounded-xl object-cover" />}
        {!photo && <div className="aspect-square w-full rounded-xl bg-muted" />}

        <h1 className="font-serif text-2xl">{p.first_name ?? "Mon profil"}{p.age ? `, ${p.age} ans` : ""}</h1>
        {(p.city || p.island) && (
          <p className="text-sm text-muted-foreground">
            {p.city ?? ""}{p.city && p.island ? " · " : ""}{p.island ? islandLabel(p.island) : ""}
          </p>
        )}
        <p className="text-xs text-muted-foreground">Email : {p.email ?? "—"}</p>
        {p.statut_matrimonial && <p className="text-sm text-muted-foreground">Statut : {p.statut_matrimonial}</p>}
        {p.profession && <p className="text-sm text-muted-foreground">Profession : {p.profession}</p>}

        {/* Statut modération */}
        {p.status === "pending" && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
            Ton profil est en cours de vérification. Il sera visible sous 24h.
          </div>
        )}

        {/* Vues de profil */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-serif text-lg">
              {viewsCount} vue{viewsCount !== 1 ? "s" : ""} de profil
            </h2>
          </div>

          {isPremium ? (
            viewers.length > 0 ? (
              <div className="space-y-2">
                {viewers.map((v) => (
                  <Link
                    key={v.viewer_id + v.created_at}
                    to="/profil/$id"
                    params={{ id: v.viewer_id }}
                    className="flex items-center gap-3 rounded-lg border border-border p-2 hover:bg-muted"
                  >
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
                      {v.profile?.photo_url ? (
                        <img src={v.profile.photo_url} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">{v.profile?.first_name ?? "Profil"}{v.profile?.age ? `, ${v.profile.age}` : ""}</p>
                      <p className="text-xs text-muted-foreground">{v.profile?.city}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Personne n'a encore consulté ton profil.</p>
            )
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <p>
                Passe en{" "}
                <Link to="/parametres" className="font-medium text-foreground underline underline-offset-2">
                  Premium
                </Link>{" "}
                pour voir qui a consulté ton profil.
              </p>
            </div>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="mb-1 block text-sm font-medium">Bio</label>
          <textarea rows={4} value={bio} maxLength={1000}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-lg border border-border bg-card p-2 text-sm" />
          <button onClick={save} disabled={saving}
            className="mt-2 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
            {saving ? "Enregistrement…" : "Enregistrer la bio"}
          </button>
        </div>

        {/* Section Wali (femmes uniquement) */}
        {p.gender === "femme" && (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h2 className="font-serif text-lg">Mon wali</h2>
            <p className="text-xs text-muted-foreground">
              Ton wali pourra suivre tes conversations via un lien sécurisé.
            </p>
            <div>
              <label className="mb-1 block text-xs font-medium">Nom complet *</label>
              <input value={waliNom} onChange={(e) => setWaliNom(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Relation *</label>
              <select value={waliRelation} onChange={(e) => setWaliRelation(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value="">Sélectionner…</option>
                <option value="père">Père</option>
                <option value="frère">Frère</option>
                <option value="oncle">Oncle</option>
                <option value="tuteur">Tuteur</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Téléphone</label>
              <input value={waliTel} onChange={(e) => setWaliTel(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Email</label>
              <input type="email" value={waliEmail} onChange={(e) => setWaliEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Notes (facultatif)</label>
              <textarea rows={2} value={waliNotes} onChange={(e) => setWaliNotes(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <button onClick={saveWali} disabled={savingWali || !waliNom || !waliRelation}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
              {savingWali ? "Enregistrement…" : "Enregistrer le wali"}
            </button>
          </div>
        )}

        {/* Suppression de compte */}
        <div className="pt-4 border-t border-border">
          {!showConfirmDelete ? (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="flex items-center gap-2 rounded-lg border border-rose-200 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" /> Supprimer mon compte
            </button>
          ) : (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 space-y-3">
              <p className="text-sm font-medium text-rose-800">Supprimer définitivement ton compte ?</p>
              <p className="text-xs text-rose-700">Cette action est irréversible. Toutes tes données seront supprimées.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 rounded-lg border border-border py-2 text-sm hover:bg-muted"
                >
                  Annuler
                </button>
                <button
                  onClick={deleteAccount}
                  disabled={deleting}
                  className="flex-1 rounded-lg bg-rose-600 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {deleting ? "Suppression…" : "Confirmer"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}