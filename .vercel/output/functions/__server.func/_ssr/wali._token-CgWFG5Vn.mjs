import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-B98Drrw5.mjs";
import { t as HarusiLogo } from "./HarusiLogo-CTRx2C9I.mjs";
import { t as Route } from "./wali._token-BPGKe-s-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wali._token-CgWFG5Vn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WaliPage() {
	const { token } = Route.useParams();
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [profiles, setProfiles] = (0, import_react.useState)({});
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: tokenRow, error: tokenErr } = await supabase.from("wali_tokens").select("*").eq("token", token).maybeSingle();
			if (tokenErr || !tokenRow) {
				setError("Lien invalide ou expiré.");
				setLoading(false);
				return;
			}
			if (new Date(tokenRow.expires_at) < /* @__PURE__ */ new Date()) {
				setError("Ce lien a expiré (valide 30 jours).");
				setLoading(false);
				return;
			}
			const { data: msgs } = await supabase.from("messages").select("*").eq("conversation_id", tokenRow.conversation_id).order("created_at");
			setMessages(msgs ?? []);
			const ids = [...new Set((msgs ?? []).map((m) => m.sender_id))];
			if (ids.length) {
				const { data: profs } = await supabase.from("profiles").select("id, first_name, gender").in("id", ids);
				const map = {};
				for (const p of profs ?? []) map[p.id] = p;
				setProfiles(map);
			}
			setLoading(false);
		})();
	}, [token]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HarusiLogo, { size: "sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Vue wali — lecture seule"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-md px-4 py-4",
			children: [
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Chargement…"
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700",
					children: error
				}),
				!loading && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground",
					children: "Cette page vous donne accès en lecture seule à la conversation, conformément aux exigences islamiques de supervision."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [messages.map((m) => {
						const sender = profiles[m.sender_id];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium",
									children: sender?.first_name ?? "—"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: new Date(m.created_at).toLocaleString("fr-FR")
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: m.body
							})]
						}, m.id);
					}), messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm text-muted-foreground",
						children: "Aucun message pour l'instant."
					})]
				})] })
			]
		})]
	});
}
//#endregion
export { WaliPage as component };
