import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/connexion" });

    const { data: prof } = await supabase
      .from("profiles")
      .select("status, onboarding_completed")
      .eq("id", data.user.id)
      .maybeSingle();

    if (prof?.status === "banned" || prof?.status === "suspended") {
      await supabase.auth.signOut();
      throw redirect({ to: "/connexion" });
    }

    // Redirige vers onboarding si pas complété (sauf si déjà sur /onboarding)
    if (
      prof &&
      !prof.onboarding_completed &&
      !location.pathname.startsWith("/onboarding")
    ) {
      throw redirect({ to: "/onboarding" });
    }

    return { user: data.user };
  },
  component: () => <Outlet />,
});
