import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

interface PageShellProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  back?: { to: string; label?: string };
}

export function PageShell({ title, subtitle, children, back }: PageShellProps) {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-md items-center gap-3 px-4">
          {back ? (
            <Link
              to={back.to}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← {back.label ?? "Retour"}
            </Link>
          ) : null}
          <h1 className="font-serif text-lg text-foreground">{title}</h1>
        </div>
      </header>
      <main className="mx-auto max-w-md px-4 py-6">
        {subtitle ? (
          <p className="mb-6 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
        {children ?? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="font-serif text-base text-foreground">
              Cette section arrive bientôt
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Nous bâtissons Harusi étape par étape, in shaa Allah.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
