import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, g as Link, k as isRedirect, l as useRouterState, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-Bwxz4H7t.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dpn8S0gM.mjs";
import { t as supabase } from "./client-B98Drrw5.mjs";
import { i as stringType, n as numberType, r as objectType, t as enumType } from "../_libs/zod.mjs";
import { _ as House, h as LayoutDashboard, n as Users, p as LogOut, u as MessageSquare, y as Flag } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminShell-CryVoPkr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getAdminStats = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4fec70c92c2624b017310f557d52373f6e45b4f5283a3272a864213d4d65e68d"));
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
}).parse(d ?? {})).handler(createSsrRpc("fc60fc6843004350f7fc65d85fae1e4cfbf6e67f55873a7f9c5b9831e502d690"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("44a442e24df564db814099bdefded66185ad933c3fe7a6d7445d2db5ab6fe8d3"));
var setProfileStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	status: enumType([
		"approved",
		"suspended",
		"banned"
	]),
	reason: stringType().max(500).optional()
}).parse(d)).handler(createSsrRpc("28f3886079b4dde9535b8afa97285ae3c0d990e6dd01e64101bfc42bffc9ba6c"));
var deleteProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("2c884943555fa36a59d4f6e18ac21cd996cccec87cba75409091aaa552ecbf54"));
var setUserRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	role: enumType([
		"user",
		"moderator",
		"admin"
	])
}).parse(d)).handler(createSsrRpc("db980dd7fbef43d3fc13d10ddc5f8ed5aae0f52362aa36d741670b7c62aab77f"));
var listReports = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ status: enumType([
	"pending",
	"reviewed",
	"action_taken",
	"dismissed",
	"all"
]).default("pending") }).parse(d ?? {})).handler(createSsrRpc("c9956b44cec3c1fce949ecfd38437e467b57699a11f341d5b3196cf08648be73"));
var resolveReport = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	status: enumType(["action_taken", "dismissed"])
}).parse(d)).handler(createSsrRpc("6fac58f2682ac346176b61a1647ce58c52925ac2e4c76d5ec29c62561a8ac845"));
var getConversationDetail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("271d0f13bb1c176f2e6fa30ef36bfb1f4e0392b64ac8f1c65b1722ef94b16e6c"));
var listConversations = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("9336f9d0a0666159ab9d1770f2d11b34b16a5433dc46b4f63da6c87251f1d48d"));
var deleteMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("4cabc708488eefa9661f79f77b1bd15cec3556dd3899aea80f261cc84bc7b25f"));
var items = [
	{
		to: "/admin",
		label: "Tableau de bord",
		icon: LayoutDashboard,
		end: true
	},
	{
		to: "/admin/users",
		label: "Utilisateurs",
		icon: Users
	},
	{
		to: "/admin/reports",
		label: "Signalements",
		icon: Flag
	},
	{
		to: "/admin/conversations",
		label: "Conversations",
		icon: MessageSquare
	}
];
function AdminShell({ children, title }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	async function logout() {
		await supabase.auth.signOut();
		navigate({ to: "/connexion" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl items-center justify-between px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					className: "font-serif text-lg",
					children: "Harusi · Admin"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/home",
						className: "inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-3 w-3" }), " App"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: logout,
						className: "inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3 w-3" }), " Déconnexion"]
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl gap-4 px-4 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "hidden w-56 shrink-0 md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: items.map((it) => {
						const active = it.end ? pathname === it.to : pathname.startsWith(it.to);
						const Icon = it.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: it.to,
							className: `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }),
								" ",
								it.label
							]
						}) }, it.to);
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 md:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: pathname,
							onChange: (e) => navigate({ to: e.target.value }),
							className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm",
							children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: it.to,
								children: it.label
							}, it.to))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mb-4 font-serif text-2xl",
						children: title
					}),
					children
				]
			})]
		})]
	});
}
//#endregion
export { getConversationDetail as a, listReports as c, setUserRole as d, useServerFn as f, getAdminStats as i, resolveReport as l, deleteMessage as n, listConversations as o, deleteProfile as r, listProfiles as s, AdminShell as t, setProfileStatus as u };
