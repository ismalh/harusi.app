import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HarusiLogo } from "@/components/HarusiLogo";
import { Mail, KeyRound, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/connexion")({
  head: () => ({ meta: [{ title: "Connexion — Harusi" }] }),
  component: ConnexionPage,
});

function ConnexionPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: true },
      });
      if (err) throw err;
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code,
        type: "email",
      });
      if (err) throw err;
      await supabase
        .from("profiles")
        .update({ last_login_at: new Date().toISOString() })
        .eq("email", email.trim().toLowerCase());
      navigate({ to: "/home" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Code incorrect ou expiré");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <HarusiLogo size="lg" />
          <h1 className="mt-3 font-serif text-2xl">
            {step === "email" ? "Se connecter" : "Entre ton code"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === "email"
              ? "Entre ton email, un code à 6 chiffres te sera envoyé."
              : `Code envoyé à ${email}.`}
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={ask} className="space-y-3 rounded-xl border border-border bg-card p-5">
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                <Mail className="h-3.5 w-3.5" /> Email
              </span>
              <input
                required
                type="email"
                autoFocus
                autoComplete="email"
                placeholder="ton@email.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground disabled:opacity-50"
            >
              {loading ? "Envoi…" : "Recevoir un code"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Pas encore inscrit ? Ton compte sera créé automatiquement.
            </p>
          </form>
        ) : (
          <form onSubmit={verify} className="space-y-3 rounded-xl border border-border bg-card p-5">
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                <KeyRound className="h-3.5 w-3.5" /> Code à 6 chiffres
              </span>
              <input
                required
                inputMode="numeric"
                maxLength={6}
                pattern="\d{6}"
                autoFocus
                placeholder="------"
                className="w-full rounded-lg border border-border bg-background px-3 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-primary/30"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              disabled={loading || code.length !== 6}
              className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground disabled:opacity-50"
            >
              {loading ? "Vérification…" : "Valider"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setError(null);
              }}
              className="inline-flex w-full items-center justify-center gap-1 text-center text-xs text-muted-foreground hover:underline"
            >
              <ArrowLeft className="h-3 w-3" /> Changer d'email
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
