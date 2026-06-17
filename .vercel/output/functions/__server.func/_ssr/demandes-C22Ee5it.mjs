import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-B98Drrw5.mjs";
import { D as ArrowLeft, t as X, w as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/demandes-C22Ee5it.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DemandesPage() {
	const navigate = useNavigate();
	const [demandes, setDemandes] = (0, import_react.useState)([]);
	const [profiles, setProfiles] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(true);
	async function load() {
		const { data: auth } = await supabase.auth.getUser();
		if (!auth.user) return;
		const { data } = await supabase.from("match_requests").select("*").eq("receiver_id", auth.user.id).eq("status", "pending").order("created_at", { ascending: false });
		setDemandes(data ?? []);
		const ids = (data ?? []).map((d) => d.sender_id);
		if (ids.length) {
			const { data: profs } = await supabase.from("profiles").select("id, first_name, age, city, photo_url").in("id", ids);
			const map = {};
			for (const p of profs ?? []) {
				let url = null;
				if (p.photo_url) {
					const { data: s } = await supabase.storage.from("profile-photos").createSignedUrl(p.photo_url, 3600);
					url = s?.signedUrl ?? null;
				}
				map[p.id] = {
					...p,
					photo_signed: url
				};
			}
			setProfiles(map);
		}
		setLoading(false);
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function accepter(demande) {
		await supabase.from("match_requests").update({ status: "accepted" }).eq("id", demande.id);
		const [a, b] = demande.sender_id < demande.receiver_id ? [demande.sender_id, demande.receiver_id] : [demande.receiver_id, demande.sender_id];
		const { data: existing } = await supabase.from("conversations").select("id").eq("user_a", a).eq("user_b", b).maybeSingle();
		if (!existing) await supabase.from("conversations").insert({
			user_a: a,
			user_b: b
		});
		load();
	}
	async function refuser(id) {
		await supabase.from("match_requests").update({ status: "refused" }).eq("id", id);
		load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => navigate({ to: "/home" }),
				className: "rounded-md p-1 hover:bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-lg",
				children: "Demandes reçues"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-md px-4 py-4 space-y-3",
			children: [
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Chargement…"
				}),
				!loading && demandes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-center text-sm text-muted-foreground",
					children: "Aucune demande en attente."
				}),
				demandes.map((d) => {
					const p = profiles[d.sender_id];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-card p-3",
						children: [
							p?.photo_signed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.photo_signed,
								alt: "",
								className: "h-14 w-14 rounded-full object-cover shrink-0"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 w-14 rounded-full bg-muted shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-medium text-sm",
										children: [p?.first_name ?? "—", p?.age ? `, ${p.age} ans` : ""]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground truncate",
										children: p?.city ?? ""
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: new Date(d.created_at).toLocaleDateString("fr-FR")
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => accepter(d),
									className: "flex items-center justify-center h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => refuser(d.id),
									className: "flex items-center justify-center h-9 w-9 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
								})]
							})
						]
					}, d.id);
				})
			]
		})]
	});
}
//#endregion
export { DemandesPage as component };
