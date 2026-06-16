import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/AdminShell";
import { listReports, resolveReport, setProfileStatus } from "@/lib/admin.functions";
import { Check, X, Ban, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/reports")({
  component: ReportsPage,
});

const TYPE_LABEL: Record<string, string> = {
  profile: "Profil",
  photo: "Photo",
  message: "Message",
};

function ReportsPage() {
  const list = useServerFn(listReports);
  const resolve = useServerFn(resolveReport);
  const setStatus = useServerFn(setProfileStatus);

  const [rows, setRows] = useState<any[]>([]);
  const [status, setStatusFilter] = useState<any>("pending");

  async function load() {
    try {
      const r = await list({ data: { status } });
      setRows(r.reports);
    } catch (e: any) { alert(e?.message); }
  }
  useEffect(() => { load(); }, [status]);

  async function act(fn: () => Promise<any>) {
    try { await fn(); await load(); } catch (e: any) { alert(e?.message); }
  }

  return (
    <AdminShell title="Signalements">
      <div className="mb-3 flex gap-2">
        {(["pending", "resolved", "dismissed", "all"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              status === s ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"
            }`}
          >
            {s === "pending" ? "En attente" : s === "resolved" ? "Validés" : s === "dismissed" ? "Rejetés" : "Tous"}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {TYPE_LABEL[r.target_type] ?? r.target_type}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleString("fr-FR")}
                </span>
                <p className="mt-1 text-sm">
                  <b>{r.reporter?.first_name ?? r.reporter?.email ?? "—"}</b> a signalé{" "}
                  <Link to="/admin/users/$id" params={{ id: r.reported_id }} className="underline">
                    {r.reported?.first_name ?? r.reported?.email ?? "ce compte"}
                  </Link>
                </p>
                <p className="mt-1 text-sm"><b>Motif :</b> {r.reason}</p>
                {r.details && <p className="mt-1 text-xs text-muted-foreground">{r.details}</p>}
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs ${
                r.status === "pending" ? "bg-amber-100 text-amber-700" :
                r.status === "resolved" ? "bg-emerald-100 text-emerald-700" :
                "bg-zinc-200 text-zinc-700"
              }`}>{r.status}</span>
            </div>

            {r.target_type === "photo" && r.photo_signed && (
              <img src={r.photo_signed} alt="" className="mt-3 max-h-64 rounded-lg border border-border" />
            )}
            {r.target_type === "message" && r.message && (
              <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3 text-sm">
                <p className="text-xs text-muted-foreground">
                  Message du {new Date(r.message.created_at).toLocaleString("fr-FR")}
                </p>
                <p className="mt-1 whitespace-pre-wrap">{r.message.content}</p>
                <Link
                  to="/admin/conversations/$id"
                  params={{ id: r.message.conversation_id }}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <MessageSquare className="h-3 w-3" /> Voir la conversation
                </Link>
              </div>
            )}

            {r.status === "pending" && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => act(() => resolve({ data: { id: r.id, status: "resolved" } }))}
                  className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700"
                >
                  <Check className="h-3 w-3" /> Valider (action prise)
                </button>
                <button
                  onClick={() => act(() => resolve({ data: { id: r.id, status: "dismissed" } }))}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted"
                >
                  <X className="h-3 w-3" /> Rejeter (non fondé)
                </button>
                <button
                  onClick={async () => {
                    if (!confirm("Bannir le compte signalé ?")) return;
                    await act(async () => {
                      await setStatus({ data: { id: r.reported_id, status: "banned" } });
                      await resolve({ data: { id: r.id, status: "resolved" } });
                    });
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs text-red-700"
                >
                  <Ban className="h-3 w-3" /> Bannir & valider
                </button>
              </div>
            )}
          </li>
        ))}
        {!rows.length && (
          <li className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Aucun signalement.
          </li>
        )}
      </ul>
    </AdminShell>
  );
}
