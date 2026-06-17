import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-B98Drrw5.mjs";
import { D as ArrowLeft, a as Trash2, b as FileText, m as Lock, p as LogOut, s as Shield } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parametres-C1hG61g5.js
var import_jsx_runtime = require_jsx_runtime();
function ParametresPage() {
	const navigate = useNavigate();
	async function logout() {
		await supabase.auth.signOut();
		navigate({ to: "/connexion" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => navigate({ to: "/mon-profil" }),
				className: "rounded-md p-1 hover:bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-lg",
				children: "Paramètres"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-md px-4 py-4 space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: logout,
					className: "flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Se déconnecter" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/cgu",
					className: "flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Conditions générales d'utilisation" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/regles",
					className: "flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Règles de la communauté" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/privacy",
					className: "flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Politique de confidentialité" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-4 border-t border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/mon-profil",
						className: "flex w-full items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-600 hover:bg-rose-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Supprimer mon compte" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 px-1 text-xs text-muted-foreground",
						children: "La suppression se fait depuis ton profil pour confirmation."
					})]
				})
			]
		})]
	});
}
//#endregion
export { ParametresPage as component };
