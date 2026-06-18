import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, LogOut, FileText, Shield, Lock, Trash2, Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/parametres")({
  component: ParametresPage,
});

function ParametresPage() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<string>("free");
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") setSuccess(true);

    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      setUserId(auth.user.id);
      setEmail(auth.user.email ?? null);
      const { data } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", auth.user.id)
        .maybeSingle();
      setPlan(data?.plan ?? "free");
    })();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/connexion" });
  }

  async function goToPremium() {
    if (!userId || !email) return;
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ user_id: userId, email }),
      }
    );
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(false);
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 flex items-center gap-2">
        <button onClick={() => navigate({ to: "/mon-profil" })} className="rounded-md p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-serif text-lg">Paramètres</h1>
      </header>
      <main className="mx-auto max-w-md px-4 py-4 space-y-2">

        {/* Succès paiement */}
        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            🎉 Ton abonnement Premium est actif !
          </div>
        )}

        {/* Bloc Premium */}
        {plan === "free" ? (
          <button
            onClick={goToPremium}
            disabled={loading}
            className="flex w-full items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3.5 text-sm text-amber-800 hover:bg-amber-100 disabled:opacity-50"
          >
            <Star className="h-4 w-4 text-amber-500" />
            <div className="flex-1 text-left">
              <p className="font-medium">{loading ? "Redirection…" : "Passer en Premium"}</p>
              <p className="text-xs text-amber-600">Messages illimités · Voir qui visite ton profil</p>
            </div>
          </button>
        ) : (
          <div className="flex w-full items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3.5 text-sm text-amber-800">
            <Star className="h-4 w-4 text-amber-500" />
            <div>
              <p className="font-medium">Premium actif ✓</p>
              <p className="text-xs text-amber-600">Merci pour ton soutien !</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm hover:bg-muted"
        >
          <LogOut className="h-4 w-4 text-muted-foreground" />
          <span>Se déconnecter</span>
        </button>

        <Link
          to="/cgu"
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm hover:bg-muted"
        >
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>Conditions générales d'utilisation</span>
        </Link>

        <Link
          to="/regles"
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm hover:bg-muted"
        >
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span>Règles de la communauté</span>
        </Link>

        <Link
          to="/privacy"
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm hover:bg-muted"
        >
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span>Politique de confidentialité</span>
        </Link>

        <div className="pt-4 border-t border-border">
          <Link
            to="/mon-profil"
            className="flex w-full items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-600 hover:bg-rose-100"
          >
            <Trash2 className="h-4 w-4" />
            <span>Supprimer mon compte</span>
          </Link>
          <p className="mt-1 px-1 text-xs text-muted-foreground">
            La suppression se fait depuis ton profil pour confirmation.
          </p>
        </div>
      </main>
    </div>
  );
}