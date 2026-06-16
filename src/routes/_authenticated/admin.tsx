import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id;
    if (!userId) throw redirect({ to: "/connexion" });
    const [{ data: isAdmin }, { data: isMod }] = await Promise.all([
      (supabase as any).rpc("has_role", { _user_id: userId, _role: "admin" }),
      (supabase as any).rpc("has_role", { _user_id: userId, _role: "moderator" }),
    ]);
    if (!isAdmin && !isMod) throw redirect({ to: "/home" });
    return { role: isAdmin ? ("admin" as const) : ("moderator" as const) };
  },
  component: () => <Outlet />,
});