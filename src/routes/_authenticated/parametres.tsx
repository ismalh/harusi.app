import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, LogOut, FileText, Shield, Lock, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/parametres")({
  component: ParametresPage,
});

function ParametresPage() {
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/connexion" });
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
