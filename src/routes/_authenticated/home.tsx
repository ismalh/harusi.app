import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HarusiLogo } from "@/components/HarusiLogo";
import { ISLANDS, islandLabel } from "@/lib/islands";
import { MessageCircle, User, Shield, Settings, Bell, SlidersHorizontal, X, BadgeCheck, Home } from "lucide-react";

export const Route = createFileRoute("/_authenticated/home")({
  ssr: false,
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [me, setMe] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [pendingCount, setPendingCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [island, setIsland] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [statutMatrimonial, setStatutMatrimonial] = useState("");
  const [frequencePriere, setFrequencePriere] = useState("");
  const [enHijra, setEnHijra] = useState("");
  const [acceptePolygamie, setAcceptePolygamie] = useState("");

  async function loadProfiles(myProf: any) {
    let q = (supabase
      .from("profiles")
      .select("*")
      .eq("status", "approved")
      .neq("id", myProf.id)
      .not("first_name", "is", null)
      .limit(50)) as any;

    if (myProf?.looking_for) q = q.eq("gender", myProf.looking_for);
    if (island) q = q.eq("island", island as any);
    if (ageMin) q = q.gte("age", parseInt(ageMin));
    if (ageMax) q = q.lte("age", parseInt(ageMax));
    if (statutMatrimonial) q = q.eq("statut_matrimonial", statutMatrimonial);
    if (frequencePriere) q = q.eq("frequence_priere", frequencePriere);
    if (enHijra) q = q.eq("en_hijra", enHijra === "oui");
    if (acceptePolygamie && myProf?.gender === "homme") q = q.eq("accepte_polygamie", acceptePolygamie === "oui");

    q = q.order("plan", { ascending: false }).order("created_at", { ascending: false });

    const { data: list } = await q;
    setProfiles(list ?? []);

    const urls: Record<string, string> = {};
    for (const p of list ?? []) {
      if (p.photo_url) {
        const { data: s } = await supabase.storage.from("profile-photos").createSignedUrl(p.photo_url, 3600);
        if (s?.signedUrl) urls[p.id] = s.signedUrl;
      }
    }
    setPhotoUrls(urls);
  }

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const { data: myProf } = await supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle();
      setMe(myProf);
      const { data: roleData } = await (supabase as any).rpc("has_role", { _user_id: auth.user.id, _role: "admin" });
      const { data: modData } = await (supabase as any).rpc("has_role", { _user_id: auth.user.id, _role: "moderator" });
      setIsAdmin(!!roleData || !!modData);

      const { count } = await supabase
        .from("match_requests")
        .select("id", { count: "exact", head: true })
        .eq("receiver_id", auth.user.id)
        .eq("status", "pending");
      setPendingCount(count ?? 0);

      const { data: myConvs } = await supabase
        .from("conversations")
        .select("id")
        .or(`user_a.eq.${auth.user.id},user_b.eq.${auth.user.id}`);
      const convIds = (myConvs ?? []).map((c: any) => c.id);
      if (convIds.length) {
        const { count: unread } = await supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .in("conversation_id", convIds)
          .neq("sender_id", auth.user.id)
          .is("read_at", null);
        setUnreadCount(unread ?? 0);
      }

      const unreadChannel = supabase
        .channel("unread-badge")
        .on("postgres_changes", { event: "*", schema: "public", table: "messages" },
          async () => {
            const { data: myConvs2 } = await supabase
              .from("conversations")
              .select("id")
              .or(`user_a.eq.${auth.user.id},user_b.eq.${auth.user.id}`);
            const convIds2 = (myConvs2 ?? []).map((c: any) => c.id);
            if (convIds2.length) {
              const { count: unread2 } = await supabase
                .from("messages")
                .select("id", { count: "exact", head: true })
                .in("conversation_id", convIds2)
                .neq("sender_id", auth.user.id)
                .is("read_at", null);
              setUnreadCount(unread2 ?? 0);
            } else {
              setUnreadCount(0);
            }
          }
        )
        .subscribe();

      if (myProf) await loadProfiles(myProf);

      return () => {
        supabase.removeChannel(unreadChannel);
      };
    })();
  }, []);

  useEffect(() => {
    if (me) loadProfiles(me);
  }, [island, ageMin, ageMax, statutMatrimonial, frequencePriere, enHijra, acceptePolygamie]);

  return (
    <div className="min-h-dvh bg-background pb-20">
      {/* Header simplifié */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <HarusiLogo size="sm" />
          {isAdmin && (
            <Link to="/admin" className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted active:bg-muted">
              <Shield className="h-5 w-5" />
            </Link>
          )}
        </div>
      </header>

      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-2xl px-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex w-full items-center justify-between py-2.5 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> Filtres</span>
            {showFilters ? <X className="h-4 w-4" /> : <span className="text-xs">▾</span>}
          </button>

          {showFilters && (
            <div className="pb-4 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium">Île</label>
                <select value={island} onChange={(e) => setIsland(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm">
                  <option value="">Toutes</option>
                  {ISLANDS.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Statut</label>
                <select value={statutMatrimonial} onChange={(e) => setStatutMatrimonial(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm">
                  <option value="">Tous</option>
                  <option value="célibataire">Célibataire</option>
                  <option value="divorcé">Divorcé(e)</option>
                  <option value="veuf">Veuf/Veuve</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Âge min</label>
                <input type="number" min={18} max={99} value={ageMin} onChange={(e) => setAgeMin(e.target.value)}
                  placeholder="18"
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Âge max</label>
                <input type="number" min={18} max={99} value={ageMax} onChange={(e) => setAgeMax(e.target.value)}
                  placeholder="99"
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Prière</label>
                <select value={frequencePriere} onChange={(e) => setFrequencePriere(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm">
                  <option value="">Tous</option>
                  <option value="rarement">Rarement</option>
                  <option value="parfois">Parfois</option>
                  <option value="souvent">Souvent</option>
                  <option value="toujours">Toujours</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">En hijra</label>
                <select value={enHijra} onChange={(e) => setEnHijra(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm">
                  <option value="">Tous</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
              </div>
              {me?.gender === "homme" && (
                <div>
                  <label className="mb-1 block text-xs font-medium">Accepte polygamie</label>
                  <select value={acceptePolygamie} onChange={(e) => setAcceptePolygamie(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm">
                    <option value="">Tous</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {profiles.map((p) => (
            <Link key={p.id} to="/profil/$id" params={{ id: p.id }}
              className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative">
                {photoUrls[p.id] ? (
                  <img src={photoUrls[p.id]} alt="" className="aspect-square w-full object-cover" />
                ) : <div className="aspect-square w-full bg-muted" />}
                {p.plan === "premium" && (
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    Premium
                  </span>
                )}
              </div>
              <div className="p-2">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium">{p.first_name}, {p.age}</p>
                  {p.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-blue-500" />}
                </div>
                <p className="text-xs text-muted-foreground">{p.city} · {islandLabel(p.island)}</p>
                {p.statut_matrimonial && <p className="text-xs text-muted-foreground">{p.statut_matrimonial}</p>}
              </div>
            </Link>
          ))}
        </div>
        {profiles.length === 0 && (
          <p className="mt-8 text-center text-sm text-muted-foreground">Aucun profil pour le moment.</p>
        )}
      </main>

      {/* Tab bar fixe en bas */}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="mx-auto flex max-w-2xl items-stretch justify-around">
          <Link
            to="/home"
            className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-primary"
          >
            <Home className="h-5 w-5" />
            <span className="text-[11px] font-medium">Accueil</span>
          </Link>
          <Link
            to="/conversations"
            className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-muted-foreground active:text-foreground"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-[11px]">Messages</span>
            {unreadCount > 0 && (
              <span className="absolute right-[28%] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link
            to="/demandes"
            className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-muted-foreground active:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="text-[11px]">Demandes</span>
            {pendingCount > 0 && (
              <span className="absolute right-[28%] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {pendingCount}
              </span>
            )}
          </Link>
          <Link
            to="/mon-profil"
            className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-muted-foreground active:text-foreground"
          >
            <User className="h-5 w-5" />
            <span className="text-[11px]">Profil</span>
          </Link>
          <Link
            to="/parametres"
            className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-muted-foreground active:text-foreground"
          >
            <Settings className="h-5 w-5" />
            <span className="text-[11px]">Réglages</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}