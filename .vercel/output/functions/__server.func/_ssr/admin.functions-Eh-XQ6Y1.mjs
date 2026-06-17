import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dpn8S0gM.mjs";
import { i as stringType, n as numberType, r as objectType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-Eh-XQ6Y1.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
async function assertStaff(ctx, opts = {}) {
	const { data: isAdmin } = await ctx.supabase.rpc("has_role", {
		_user_id: ctx.userId,
		_role: "admin"
	});
	if (isAdmin) return "admin";
	if (opts.adminOnly) throw new Error("Accès refusé (admin requis)");
	const { data: isMod } = await ctx.supabase.rpc("has_role", {
		_user_id: ctx.userId,
		_role: "moderator"
	});
	if (isMod) return "moderator";
	throw new Error("Accès refusé");
}
var getAdminStats_createServerFn_handler = createServerRpc({
	id: "4fec70c92c2624b017310f557d52373f6e45b4f5283a3272a864213d4d65e68d",
	name: "getAdminStats",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getAdminStats.__executeServer(opts));
var getAdminStats = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getAdminStats_createServerFn_handler, async ({ context }) => {
	await assertStaff(context);
	const { data, error } = await context.supabase.rpc("admin_stats");
	if (error) throw new Error(error.message);
	return data ?? {};
});
var listProfiles_createServerFn_handler = createServerRpc({
	id: "fc60fc6843004350f7fc65d85fae1e4cfbf6e67f55873a7f9c5b9831e502d690",
	name: "listProfiles",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listProfiles.__executeServer(opts));
var listProfiles = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	status: enumType([
		"pending",
		"approved",
		"rejected",
		"suspended",
		"banned",
		"all"
	]).default("all"),
	search: stringType().max(100).default(""),
	limit: numberType().int().min(1).max(200).default(100)
}).parse(d ?? {})).handler(listProfiles_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context);
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	let q = supabaseAdmin.from("profiles").select("*").order("created_at", { ascending: false }).limit(data.limit);
	if (data.status !== "all") q = q.eq("status", data.status);
	if (data.search) {
		const s = `%${data.search}%`;
		q = q.or(`first_name.ilike.${s},city.ilike.${s},email.ilike.${s},whatsapp.ilike.${s}`);
	}
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	const ids = (rows ?? []).map((r) => r.id);
	const { data: roles } = ids.length ? await supabaseAdmin.from("user_roles").select("user_id, role").in("user_id", ids) : { data: [] };
	const rolesMap = /* @__PURE__ */ new Map();
	(roles ?? []).forEach((r) => {
		const arr = rolesMap.get(r.user_id) ?? [];
		arr.push(r.role);
		rolesMap.set(r.user_id, arr);
	});
	return { profiles: await Promise.all((rows ?? []).map(async (r) => {
		let photo_signed = null;
		if (r.photo_url) {
			const { data: s } = await supabaseAdmin.storage.from("profile-photos").createSignedUrl(r.photo_url, 3600);
			photo_signed = s?.signedUrl ?? null;
		}
		return {
			...r,
			photo_signed,
			roles: rolesMap.get(r.id) ?? ["user"]
		};
	})) };
});
var getProfileDetail_createServerFn_handler = createServerRpc({
	id: "44a442e24df564db814099bdefded66185ad933c3fe7a6d7445d2db5ab6fe8d3",
	name: "getProfileDetail",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getProfileDetail.__executeServer(opts));
var getProfileDetail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(getProfileDetail_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context);
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	const { data: prof, error } = await supabaseAdmin.from("profiles").select("*").eq("id", data.id).maybeSingle();
	if (error) throw new Error(error.message);
	if (!prof) throw new Error("Introuvable");
	let photo_signed = null;
	if (prof.photo_url) {
		const { data: s } = await supabaseAdmin.storage.from("profile-photos").createSignedUrl(prof.photo_url, 3600);
		photo_signed = s?.signedUrl ?? null;
	}
	const [{ count: msgCount }, { count: reportCount }, { data: roles }] = await Promise.all([
		supabaseAdmin.from("messages").select("id", {
			count: "exact",
			head: true
		}).eq("sender_id", data.id),
		supabaseAdmin.from("reports").select("id", {
			count: "exact",
			head: true
		}).eq("reported_id", data.id),
		supabaseAdmin.from("user_roles").select("role").eq("user_id", data.id)
	]);
	return {
		profile: {
			...prof,
			photo_signed
		},
		msg_count: msgCount ?? 0,
		report_count: reportCount ?? 0,
		roles: (roles ?? []).map((r) => r.role)
	};
});
var setProfileStatus_createServerFn_handler = createServerRpc({
	id: "28f3886079b4dde9535b8afa97285ae3c0d990e6dd01e64101bfc42bffc9ba6c",
	name: "setProfileStatus",
	filename: "src/lib/admin.functions.ts"
}, (opts) => setProfileStatus.__executeServer(opts));
var setProfileStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	status: enumType([
		"approved",
		"suspended",
		"banned"
	]),
	reason: stringType().max(500).optional()
}).parse(d)).handler(setProfileStatus_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context);
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	const { error } = await supabaseAdmin.from("profiles").update({ status: data.status }).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var deleteProfile_createServerFn_handler = createServerRpc({
	id: "2c884943555fa36a59d4f6e18ac21cd996cccec87cba75409091aaa552ecbf54",
	name: "deleteProfile",
	filename: "src/lib/admin.functions.ts"
}, (opts) => deleteProfile.__executeServer(opts));
var deleteProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteProfile_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context, { adminOnly: true });
	if (data.id === context.userId) throw new Error("Tu ne peux pas te supprimer toi-même");
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	const { error } = await supabaseAdmin.auth.admin.deleteUser(data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var setUserRole_createServerFn_handler = createServerRpc({
	id: "db980dd7fbef43d3fc13d10ddc5f8ed5aae0f52362aa36d741670b7c62aab77f",
	name: "setUserRole",
	filename: "src/lib/admin.functions.ts"
}, (opts) => setUserRole.__executeServer(opts));
var setUserRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	role: enumType([
		"user",
		"moderator",
		"admin"
	])
}).parse(d)).handler(setUserRole_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context, { adminOnly: true });
	if (data.id === context.userId && data.role !== "admin") throw new Error("Tu ne peux pas retirer tes propres droits admin");
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	await supabaseAdmin.from("user_roles").delete().eq("user_id", data.id).in("role", ["admin", "moderator"]);
	await supabaseAdmin.from("user_roles").upsert({
		user_id: data.id,
		role: "user"
	}, { onConflict: "user_id,role" });
	if (data.role !== "user") await supabaseAdmin.from("user_roles").upsert({
		user_id: data.id,
		role: data.role
	}, { onConflict: "user_id,role" });
	return { ok: true };
});
var listReports_createServerFn_handler = createServerRpc({
	id: "c9956b44cec3c1fce949ecfd38437e467b57699a11f341d5b3196cf08648be73",
	name: "listReports",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listReports.__executeServer(opts));
var listReports = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ status: enumType([
	"pending",
	"reviewed",
	"action_taken",
	"dismissed",
	"all"
]).default("pending") }).parse(d ?? {})).handler(listReports_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context);
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	let q = supabaseAdmin.from("reports").select("*").order("created_at", { ascending: false }).limit(200);
	if (data.status !== "all") q = q.eq("status", data.status);
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	const allIds = [...new Set((rows ?? []).flatMap((r) => [r.reporter_id, r.reported_id]).filter(Boolean))];
	const { data: profs } = allIds.length ? await supabaseAdmin.from("profiles").select("id, first_name, email, photo_url, status").in("id", allIds) : { data: [] };
	const profsMap = new Map((profs ?? []).map((p) => [p.id, p]));
	return { reports: await Promise.all((rows ?? []).map(async (r) => {
		const reporter = profsMap.get(r.reporter_id) ?? null;
		const reported = profsMap.get(r.reported_id) ?? null;
		let photo_signed = null;
		const photoKey = r.target_type === "photo" ? r.photo_url : reported?.photo_url;
		if (photoKey) {
			const { data: s } = await supabaseAdmin.storage.from("profile-photos").createSignedUrl(photoKey, 3600);
			photo_signed = s?.signedUrl ?? null;
		}
		let message = null;
		if (r.target_type === "message" && r.message_id) {
			const { data: m } = await supabaseAdmin.from("messages").select("id, conversation_id, body, created_at, sender_id").eq("id", r.message_id).maybeSingle();
			message = m;
		}
		return {
			...r,
			reporter,
			reported,
			photo_signed,
			message
		};
	})) };
});
var resolveReport_createServerFn_handler = createServerRpc({
	id: "6fac58f2682ac346176b61a1647ce58c52925ac2e4c76d5ec29c62561a8ac845",
	name: "resolveReport",
	filename: "src/lib/admin.functions.ts"
}, (opts) => resolveReport.__executeServer(opts));
var resolveReport = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	status: enumType(["action_taken", "dismissed"])
}).parse(d)).handler(resolveReport_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context);
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	await supabaseAdmin.from("reports").update({
		status: data.status,
		resolved_by: context.userId,
		resolved_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.id);
	return { ok: true };
});
var getConversationDetail_createServerFn_handler = createServerRpc({
	id: "271d0f13bb1c176f2e6fa30ef36bfb1f4e0392b64ac8f1c65b1722ef94b16e6c",
	name: "getConversationDetail",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getConversationDetail.__executeServer(opts));
var getConversationDetail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(getConversationDetail_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context);
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	const { data: conv } = await supabaseAdmin.from("conversations").select("*").eq("id", data.id).maybeSingle();
	if (!conv) throw new Error("Introuvable");
	const [{ data: profA }, { data: profB }] = await Promise.all([supabaseAdmin.from("profiles").select("first_name, email").eq("id", conv.user_a).maybeSingle(), supabaseAdmin.from("profiles").select("first_name, email").eq("id", conv.user_b).maybeSingle()]);
	conv.a = [profA];
	conv.b = [profB];
	const { data: messages } = await supabaseAdmin.from("messages").select("*").eq("conversation_id", data.id).order("created_at");
	return {
		conversation: conv,
		messages: messages ?? []
	};
});
var listConversations_createServerFn_handler = createServerRpc({
	id: "9336f9d0a0666159ab9d1770f2d11b34b16a5433dc46b4f63da6c87251f1d48d",
	name: "listConversations",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listConversations.__executeServer(opts));
var listConversations = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listConversations_createServerFn_handler, async ({ context }) => {
	await assertStaff(context);
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	const { data, error } = await supabaseAdmin.from("conversations").select("id, user_a, user_b, created_at, updated_at").order("updated_at", { ascending: false }).limit(100);
	if (error) throw new Error(error.message);
	const allIds = [...new Set((data ?? []).flatMap((c) => [c.user_a, c.user_b]).filter(Boolean))];
	const { data: profs } = allIds.length ? await supabaseAdmin.from("profiles").select("id, first_name, email").in("id", allIds) : { data: [] };
	const profsMap = new Map((profs ?? []).map((p) => [p.id, p]));
	return { conversations: (data ?? []).map((c) => ({
		...c,
		a: profsMap.get(c.user_a) ?? null,
		b: profsMap.get(c.user_b) ?? null
	})) };
});
var deleteMessage_createServerFn_handler = createServerRpc({
	id: "4cabc708488eefa9661f79f77b1bd15cec3556dd3899aea80f261cc84bc7b25f",
	name: "deleteMessage",
	filename: "src/lib/admin.functions.ts"
}, (opts) => deleteMessage.__executeServer(opts));
var deleteMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteMessage_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context);
	const { supabaseAdmin } = await import("./client.server-D1oHePJa.mjs");
	await supabaseAdmin.from("messages").delete().eq("id", data.id);
	return { ok: true };
});
//#endregion
export { deleteMessage_createServerFn_handler, deleteProfile_createServerFn_handler, getAdminStats_createServerFn_handler, getConversationDetail_createServerFn_handler, getProfileDetail_createServerFn_handler, listConversations_createServerFn_handler, listProfiles_createServerFn_handler, listReports_createServerFn_handler, resolveReport_createServerFn_handler, setProfileStatus_createServerFn_handler, setUserRole_createServerFn_handler };
