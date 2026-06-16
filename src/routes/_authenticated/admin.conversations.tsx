import { createFileRoute, Link, Outlet, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listConversations } from "@/lib/admin.functions";
import { AdminShell } from "@/components/AdminShell";
import { Eye } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/conversations")({
  component: ConvsLayout,
});

function ConvsLayout() {
  const params = useParams({ strict: false }) as any;
  if (params?.id) return <Outlet />;
  return <ConvsPage />;
}

function ConvsPage() {
  useQueryClient();
  const fn = useServerFn(listConversations);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-convs"], queryFn: () => fn(),
  });
  return (
    <AdminShell title="Conversations">
      {isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs">
            <tr><th className="p-2 text-left">Participants</th><th className="p-2 text-left">Mise à jour</th><th className="p-2"></th></tr>
          </thead>
          <tbody>
            {data?.conversations.map((c: any) => (
              <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                <td className="p-2">{c.a?.first_name ?? "?"} ↔ {c.b?.first_name ?? "?"}</td>
                <td className="p-2 text-xs text-muted-foreground">{new Date(c.updated_at).toLocaleString("fr-FR")}</td>
                <td className="p-2">
                  <Link to="/admin/conversations/$id" params={{ id: c.id }}
                    className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs">
                    <Eye className="h-3 w-3" /> Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}