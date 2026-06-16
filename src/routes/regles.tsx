import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/regles")({
  head: () => ({
    meta: [
      { title: "Règles de la communauté — Harusi" },
      { name: "description", content: "Charte de respect, pudeur et sincérité de la communauté Harusi." },
    ],
  }),
  component: ReglesPage,
});

const DO = [
  "Respecter chaque personne, quelle que soit son histoire",
  "Rechercher sincèrement le mariage",
  "Garder la pudeur dans les échanges (haya)",
  "Impliquer le wali dès que la conversation devient sérieuse",
  "Signaler tout comportement déplacé",
];

const DONT = [
  "Aucun harcèlement, insulte ou pression",
  "Aucun contenu sexuel, suggestif ou inapproprié",
  "Aucun faux profil ou usurpation d'identité",
  "Aucune arnaque, demande d'argent ou de coordonnées hors application",
  "Aucune relation hors cadre du mariage",
];

function ReglesPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-dvh bg-background pb-12">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-md items-center gap-2 px-3">
          <button onClick={() => navigate({ to: "/mon-profil" })} className="rounded-full p-2 hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-serif text-base">Règles de la communauté</h1>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-4 px-4 pt-6">
        <p className="text-sm text-muted-foreground">
          Harusi est un espace de mise en relation sérieuse pour le mariage islamique. Notre charte protège chaque membre.
        </p>

        <Card className="p-4">
          <h2 className="mb-3 font-serif text-base text-emerald-700">✓ Ce qu'on attend de toi</h2>
          <ul className="space-y-2">
            {DO.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 font-serif text-base text-red-700">✗ Ce qui est strictement interdit</h2>
          <ul className="space-y-2">
            {DONT.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">Sanctions</p>
          <p className="mt-1 text-xs">
            Tout manquement peut entraîner une suspension temporaire ou un bannissement définitif, sans préavis.
          </p>
        </Card>
      </main>
    </div>
  );
}
