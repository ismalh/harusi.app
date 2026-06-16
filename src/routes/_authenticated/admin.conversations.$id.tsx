import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getConversationDetail, deleteMessage } from "@/lib/admin.functions";
import { AdminShell } from "@/components/AdminShell";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/conversations/$id")({
  component: ConvDetail,
});

function ConvDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const fn = useServerFn(getConversationDetail);
  const delFn = useServerFn(deleteMessage);
  const { data, isLoading } = useQuery({ queryKey: ["admin-conv", id], queryFn: () => fn({ data: { id } }) });
  if (isLoading || !data) return <AdminShell title="…">Chargement…</AdminShell>;
  const c = data.conversation as any;
  const aName = c.a?.[0]?.first_name ?? "?";
  const bName = c.b?.[0]?.first_name ?? "?";
  return (
    <AdminShell title={`${aName} ↔ ${bName}`}>
      <div className="space-y-2">
        {data.messages.map((m: any) => (
          <div key={m.id} className="flex items-start gap-2 rounded-lg border border-border bg-card p-2">
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">
                {m.sender_id === c.user_a ? aName : bName} · {new Date(m.created_at).toLocaleString("fr-FR")}
              </div>
              <p className="mt-1 text-sm">{m.body}</p>
            </div>
            <button onClick={async () => {
              if (!confirm("Supprimer ce message ?")) return;
              await delFn({ data: { id: m.id } });
              qc.invalidateQueries({ queryKey: ["admin-conv", id] });
            }} className="rounded p-1 text-rose-600 hover:bg-rose-50">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
        {data.messages.length === 0 && <p className="text-sm text-muted-foreground">Aucun message.</p>}
      </div>
    </AdminShell>
  );
}
