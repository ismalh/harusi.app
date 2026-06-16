import { createFileRoute, Link, Outlet, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/AdminShell";
import { listProfiles } from "@/lib/admin.functions";
import { Eye } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersLayout,
});

function UsersLayout() {
  const params = useParams({ strict: false }) as any;
  if (params?.id) return <Outlet />;
  return <UsersPage />;
}

function UsersPage() {
  const fn = useServerFn(listProfiles);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fn({ data: {} }).then((d) => { setUsers(d.profiles); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <AdminShell title="Utilisateurs">
      {loading && <p className="text-sm text-muted-foreground">Chargement…</p>}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs">
            <tr>
              <th className="p-2 text-left">Prénom</th>
              <th className="p-2 text-left">Statut</th>
              <th className="p-2 text-left">Inscrit le</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                <td className="p-2">{u.first_name ?? "—"}</td>
                <td className="p-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    u.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                    u.status === "pending" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>{u.status}</span>
                </td>
                <td className="p-2 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
                <td className="p-2">
                  <Link to="/admin/users/$id" params={{ id: u.id }}
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