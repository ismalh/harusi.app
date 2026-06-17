import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-B98Drrw5.mjs";
import { D as ArrowLeft } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conversations-CIfJdOmn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ConvsPage() {
	const navigate = useNavigate();
	const [convs, setConvs] = (0, import_react.useState)([]);
	const [me, setMe] = (0, import_react.useState)(null);
	const [profiles, setProfiles] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user) return;
			setMe(auth.user.id);
			const { data } = await supabase.from("conversations").select("*").or(`user_a.eq.${auth.user.id},user_b.eq.${auth.user.id}`).order("updated_at", { ascending: false });
			setConvs(data ?? []);
			const otherIds = (data ?? []).map((c) => c.user_a === auth.user.id ? c.user_b : c.user_a);
			if (otherIds.length) {
				const { data: profs } = await supabase.from("profiles").select("id, first_name, photo_url").in("id", otherIds);
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
		})();
	}, []);
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
				children: "Conversations"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-2xl px-4 py-4 space-y-2",
			children: [convs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Aucune conversation."
			}), convs.map((c) => {
				const other = profiles[c.user_a === me ? c.user_b : c.user_a];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/chat/$id",
					params: { id: c.id },
					className: "flex items-center gap-3 rounded-lg border border-border bg-card p-3 hover:bg-muted/50",
					children: [other?.photo_signed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: other.photo_signed,
						alt: "",
						className: "h-10 w-10 rounded-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-10 rounded-full bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: other?.first_name ?? "Profil"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: new Date(c.updated_at).toLocaleString("fr-FR")
					})] })]
				}, c.id);
			})]
		})]
	});
}
//#endregion
export { ConvsPage as component };
