import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Users, MessageSquare, Flag, Home, LogOut } from "lucide-react";
const items = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Utilisateurs", icon: Users },
  { to: "/admin/reports", label: "Signalements", icon: Flag },
  { to: "/admin/conversations", label: "Conversations", icon: MessageSquare },
];
export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/connexion" });
  }
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/admin" className="font-serif text-lg">Harusi · Admin</Link>
          <div className="flex items-center gap-2 text-xs">
            <Link to="/home" className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:bg-muted">
              <Home className="h-3 w-3" /> App
            </Link>
            <button onClick={logout} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:bg-muted">
              <LogOut className="h-3 w-3" /> Déconnexion
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl gap-4 px-4 py-4">
        <nav className="hidden w-56 shrink-0 md:block">
          <ul className="space-y-1">
            {items.map((it) => {
              const active = it.end ? pathname === it.to : pathname.startsWith(it.to);
              const Icon = it.icon;
              return (
                <li key={it.to}>
                  <Link
                    to={it.to as any}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                      active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <main className="flex-1 min-w-0">
          <div className="mb-3 md:hidden">
            <select
              value={pathname}
              onChange={(e) => navigate({ to: e.target.value as any })}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
              {items.map((it) => (
                <option key={it.to} value={it.to}>{it.label}</option>
              ))}
            </select>
          </div>
          <h1 className="mb-4 font-serif text-2xl">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}