import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/AdminShell";
import { setProfileStatus, deleteProfile, setUserRole } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Check, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users/$id")({
  component: UserDetail,
});

function UserDetail() {
  const { id } = Route.useParams();
  const setStatus = useServerFn(setProfileStatus);
  const setRole = useServerFn(setUserRole);
  const del = useServerFn(deleteProfile);
  const navigate = useNavigate();
  const [d, setD] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);

  async function load() {
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
    if (!prof) return;
    let photo_signed: string | null = null;
    if (prof.photo_url) {
      const { data: s } = await supabase.storage.from("profile-photos").createSignedUrl(prof.photo_url, 3600);
      photo_signed = s?.signedUrl ?? null;
    }
    const [{ count: msg_count }, { count: report_count }] = await Promise.all([
      supabase.from("messages").select("id", { count: "exact", head: true }).eq("sender_id", id),
      supabase.from("reports").select("id", { count: "exact", head: true }).eq("reported_id", id),
    ]);
    const { data: roles } = await (supabase as any).rpc("has_role", { _user_id: id, _role: "admin" });
    setD({ profile: { ...prof, photo_signed }, msg_count: msg_count ?? 0, report_count: report_count ?? 0, roles: roles ? ["admin"] : [] });

    // Charger toutes les photos avec URL signée
    const { data: photosData } = await (supabase as any)
      .from("profile_photos")
      .select("*")
      .eq("user_id", id)
      .order("position");

    const enriched = [];
    for (const photo of photosData ?? []) {
      const { data: s } = await supabase.storage.from("profile-photos").createSignedUrl(photo.url, 3600);
      enriched.push({ ...photo, signedUrl: s?.signedUrl ?? null });
    }
    setPhotos(enriched);
  }

  async function setPhotoStatus(photoId: string, status: "approved" | "rejected") {
    await (supabase as any).from("profile_photos").update({ status }).eq("id", photoId);
    load();
  }

  useEffect(() => { load(); }, [id]);

  if (!d) return <AdminShell title="Utilisateur">Chargement…</AdminShell>;
  const p = d.profile;
  const currentRole = d.roles?.includes("admin") ? "admin" : d.roles?.includes("moderator") ? "moderator" : "user";

  return (
    <AdminShell title={p.first_name ?? p.email ?? "Utilisateur"}>
      <Link to="/admin/users" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline">
        <ArrowLeft className="h-3 w-3" /> Retour
      </Link>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          {p.photo_signed ? (
            <img src={p.photo_signed} alt="" className="aspect-square w-full rounded-xl object-cover" />
          ) : (
            <div className="aspect-square w-full rounded-xl bg-muted" />
          )}
        </div>
        <div className="space-y-2 text-sm md:col-span-2">
          <p><b>Email :</b> {p.email ?? "—"}</p>
          <p><b>Téléphone :</b> {p.whatsapp ?? "—"}</p>
          <p><b>Prénom :</b> {p.first_name ?? "—"} {p.age ? `(${p.age} ans)` : ""}</p>
          <p><b>Statut :</b> {p.status}</p>
          <p><b>Inscrit le :</b> {new Date(p.created_at).toLocaleString("fr-FR")}</p>
          <p><b>Dernière connexion :</b> {p.last_login_at ? new Date(p.last_login_at).toLocaleString("fr-FR") : "—"}</p>
          <p><b>Messages envoyés :</b> {d.msg_count}</p>
          <p><b>Signalements reçus :</b> {d.report_count}</p>
        </div>
      </div>

      {/* Modération des photos */}
      {photos.length > 0 && (
        <div className="mt-6 rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-medium">Photos à modérer ({photos.length})</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {photos.map((photo) => (
              <div key={photo.id} className="space-y-2">
                <div className="relative aspect-square overflow-hidden rounded-lg border border-border">
                  {photo.signedUrl ? (
                    <img src={photo.signedUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                  {photo.is_main && (
                    <span className="absolute left-1 top-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      Principale
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${
                      photo.status === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : photo.status === "rejected"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {photo.status === "approved" ? "Approuvée" : photo.status === "rejected" ? "Rejetée" : "En attente"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPhotoStatus(photo.id, "approved")}
                    disabled={photo.status === "approved"}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 py-1 text-xs text-emerald-700 disabled:opacity-40"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => setPhotoStatus(photo.id, "rejected")}
                    disabled={photo.status === "rejected"}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-red-300 bg-red-50 py-1 text-xs text-red-700 disabled:opacity-40"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3 rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-medium">Actions de modération</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={async () => { await setStatus({ data: { id, status: "approved" } }); load(); }}
            className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700">
            Réactiver
          </button>
          <button onClick={async () => { await setStatus({ data: { id, status: "suspended" } }); load(); }}
            className="rounded-md border border-orange-300 bg-orange-50 px-3 py-1.5 text-sm text-orange-700">
            Suspendre
          </button>
          <button onClick={async () => { await setStatus({ data: { id, status: "banned" } }); load(); }}
            className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-700">
            Bannir
          </button>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Rôle (admin uniquement)</label>
          <select value={currentRole}
            onChange={async (e) => {
              try { await setRole({ data: { id, role: e.target.value as any } }); load(); }
              catch (err: any) { alert(err?.message); }
            }}
            className="mt-1 block rounded-md border border-border bg-background px-2 py-1.5 text-sm">
            <option value="user">user</option>
            <option value="moderator">moderator</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <button
          onClick={async () => {
            if (!confirm("Supprimer définitivement ce compte ?")) return;
            try { await del({ data: { id } }); navigate({ to: "/admin/users" }); }
            catch (e: any) { alert(e?.message); }
          }}
          className="rounded-md border border-red-400 bg-red-100 px-3 py-1.5 text-sm text-red-800">
          Supprimer définitivement
        </button>
      </div>
    </AdminShell>
  );
}