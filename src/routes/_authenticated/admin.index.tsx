import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/AdminShell";
import { getAdminStats } from "@/lib/admin.functions";
import { Users, UserPlus, Flag, MessageSquare, Activity, Ban } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function Card({ icon: Icon, label, value, hint }: any) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-semibold">{value ?? "—"}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function AdminHome() {
  const fn = useServerFn(getAdminStats);
  const [s, setS] = useState<any>(null);
  useEffect(() => {
    fn().then(setS).catch(() => setS({}));
  }, []);
  return (
    <AdminShell title="Tableau de bord">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card icon={Users} label="Inscrits" value={s?.total_users} />
        <Card icon={UserPlus} label="Aujourd'hui" value={s?.new_today} />
        <Card icon={UserPlus} label="7 derniers jours" value={s?.new_week} />
        <Card icon={UserPlus} label="30 derniers jours" value={s?.new_month} />
        <Card icon={Activity} label="Actifs (7j)" value={s?.active_week} hint={`${s?.active_today ?? 0} aujourd'hui`} />
        <Card icon={Flag} label="Signalements en attente" value={s?.pending_reports} />
        <Card icon={Ban} label="Bannis" value={s?.banned} hint={`${s?.suspended ?? 0} suspendus`} />
        <Card icon={MessageSquare} label="Conversations" value={s?.conversations_total} hint={`${s?.messages_total ?? 0} messages`} />
      </div>
    </AdminShell>
  );
}
