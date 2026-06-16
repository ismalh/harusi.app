import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: any; userId: string };

async function assertStaff(ctx: Ctx, opts: { adminOnly?: boolean } = {}) {
  const { data: isAdmin } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (isAdmin) return "admin" as const;
  if (opts.adminOnly) throw new Error("Accès refusé (admin requis)");
  const { data: isMod } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "moderator",
  });
  if (isMod) return "moderator" as const;
  throw new Error("Accès refusé");
}

// ========== STATS ==========
export const getAdminStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data, error } = await (context.supabase as any).rpc("admin_stats");
    if (error) throw new Error(error.message);
    return data ?? {};
  });

// ========== USERS ==========
export const listProfiles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        status: z
          .enum(["pending", "approved", "rejected", "suspended", "banned", "all"])
          .default("all"),
        search: z.string().max(100).default(""),
        limit: z.number().int().min(1).max(200).default(100),
      })
      .parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status !== "all") q = q.eq("status", data.status);
    if (data.search) {
      const s = `%${data.search}%`;
      q = q.or(`first_name.ilike.${s},city.ilike.${s},email.ilike.${s},whatsapp.ilike.${s}`);
    }
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    // Attach roles
    const ids = (rows ?? []).map((r: any) => r.id);
    const { data: roles } = ids.length
      ? await supabaseAdmin.from("user_roles").select("user_id, role").in("user_id", ids)
      : { data: [] as any[] };
    const rolesMap = new Map<string, string[]>();
    (roles ?? []).forEach((r: any) => {
      const arr = rolesMap.get(r.user_id) ?? [];
      arr.push(r.role);
      rolesMap.set(r.user_id, arr);
    });

    const withExtras = await Promise.all(
      (rows ?? []).map(async (r: any) => {
        let photo_signed: string | null = null;
        if (r.photo_url) {
          const { data: s } = await supabaseAdmin.storage
            .from("profile-photos")
            .createSignedUrl(r.photo_url, 3600);
          photo_signed = s?.signedUrl ?? null;
        }
        return { ...r, photo_signed, roles: rolesMap.get(r.id) ?? ["user"] };
      }),
    );
    return { profiles: withExtras };
  });

export const getProfileDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: prof, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!prof) throw new Error("Introuvable");
    let photo_signed: string | null = null;
    if (prof.photo_url) {
      const { data: s } = await supabaseAdmin.storage
        .from("profile-photos")
        .createSignedUrl(prof.photo_url, 3600);
      photo_signed = s?.signedUrl ?? null;
    }
    const [{ count: msgCount }, { count: reportCount }, { data: roles }] = await Promise.all([
      supabaseAdmin.from("messages").select("id", { count: "exact", head: true }).eq("sender_id", data.id),
      supabaseAdmin.from("reports").select("id", { count: "exact", head: true }).eq("reported_id", data.id),
      supabaseAdmin.from("user_roles").select("role").eq("user_id", data.id),
    ]);
    return {
      profile: { ...prof, photo_signed },
      msg_count: msgCount ?? 0,
      report_count: reportCount ?? 0,
      roles: (roles ?? []).map((r: any) => r.role),
    };
  });

export const setProfileStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["approved", "suspended", "banned"]),
        reason: z.string().max(500).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context); // admins + moderators
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context, { adminOnly: true });
    if (data.id === context.userId) throw new Error("Tu ne peux pas te supprimer toi-même");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        role: z.enum(["user", "moderator", "admin"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context, { adminOnly: true });
    if (data.id === context.userId && data.role !== "admin") {
      throw new Error("Tu ne peux pas retirer tes propres droits admin");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Wipe existing privileged roles, keep 'user'
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.id).in("role", ["admin", "moderator"]);
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: data.id, role: "user" }, { onConflict: "user_id,role" });
    if (data.role !== "user") {
      await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.id, role: data.role }, { onConflict: "user_id,role" });
    }
    return { ok: true };
  });

export const listReports = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ status: z.enum(["pending", "reviewed", "action_taken", "dismissed", "all"]).default("pending") }).parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data.status !== "all") q = q.eq("status", data.status as any);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    const allIds = [...new Set((rows ?? []).flatMap((r: any) => [r.reporter_id, r.reported_id]).filter(Boolean))];
    const { data: profs } = allIds.length
      ? await supabaseAdmin.from("profiles").select("id, first_name, email, photo_url, status").in("id", allIds)
      : { data: [] as any[] };
    const profsMap = new Map((profs ?? []).map((p: any) => [p.id, p]));

    const out = await Promise.all(
      (rows ?? []).map(async (r: any) => {
        const reporter = profsMap.get(r.reporter_id) ?? null;
        const reported = profsMap.get(r.reported_id) ?? null;
        let photo_signed: string | null = null;
        const photoKey = r.target_type === "photo" ? r.photo_url : reported?.photo_url;
        if (photoKey) {
          const { data: s } = await supabaseAdmin.storage
            .from("profile-photos")
            .createSignedUrl(photoKey, 3600);
          photo_signed = s?.signedUrl ?? null;
        }
        let message: any = null;
        if (r.target_type === "message" && r.message_id) {
          const { data: m } = await supabaseAdmin
            .from("messages")
            .select("id, conversation_id, body, created_at, sender_id")
            .eq("id", r.message_id)
            .maybeSingle();
          message = m;
        }
        return { ...r, reporter, reported, photo_signed, message };
      }),
    );
    return { reports: out };
  });

export const resolveReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["action_taken", "dismissed"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("reports")
      .update({
        status: data.status,
        resolved_by: context.userId!,
        resolved_at: new Date().toISOString(),
      } as any)
      .eq("id", data.id);
    return { ok: true };
  });

// ========== CONVERSATIONS (moderation reads) ==========
export const getConversationDetail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: conv } = await supabaseAdmin
      .from("conversations")
      .select(
        ("*"),
      )
      .eq("id", data.id)
      .maybeSingle();
    if (!conv) throw new Error("Introuvable");
    const [{ data: profA }, { data: profB }] = await Promise.all([
  supabaseAdmin.from("profiles").select("first_name, email").eq("id", conv.user_a).maybeSingle(),
  supabaseAdmin.from("profiles").select("first_name, email").eq("id", conv.user_b).maybeSingle(),
]);
(conv as any).a = [profA];
(conv as any).b = [profB];
    const { data: messages } = await supabaseAdmin
      .from("messages")
      .select("*")
      .eq("conversation_id", data.id)
      .order("created_at");
    return { conversation: conv, messages: messages ?? [] };
  });

export const listConversations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("conversations")
      .select("id, user_a, user_b, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);

    const allIds = [...new Set((data ?? []).flatMap((c: any) => [c.user_a, c.user_b]).filter(Boolean))];
const { data: profs } = allIds.length
  ? await supabaseAdmin.from("profiles").select("id, first_name, email").in("id", allIds)
  : { data: [] as any[] };
const profsMap = new Map((profs ?? []).map((p: any) => [p.id, p]));

const conversations = (data ?? []).map((c: any) => ({
  ...c,
  a: profsMap.get(c.user_a) ?? null,
  b: profsMap.get(c.user_b) ?? null,
}));

return { conversations };
  });

export const deleteMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("messages").delete().eq("id", data.id);
    return { ok: true };
  });
