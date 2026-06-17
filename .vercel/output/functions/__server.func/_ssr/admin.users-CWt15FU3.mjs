import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as Outlet, g as Link, v as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { x as Eye } from "../_libs/lucide-react.mjs";
import { f as useServerFn, s as listProfiles, t as AdminShell } from "./AdminShell-CryVoPkr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.users-CWt15FU3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UsersLayout() {
	if (useParams({ strict: false })?.id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersPage, {});
}
function UsersPage() {
	const fn = useServerFn(listProfiles);
	const [users, setUsers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		fn({ data: {} }).then((d) => {
			setUsers(d.profiles);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Utilisateurs",
		children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Chargement…"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-lg border border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/50 text-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-left",
							children: "Prénom"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-left",
							children: "Statut"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-left",
							children: "Inscrit le"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-2" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border hover:bg-muted/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: u.first_name ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2 py-0.5 text-xs ${u.status === "approved" ? "bg-emerald-100 text-emerald-700" : u.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`,
								children: u.status
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2 text-xs text-muted-foreground",
							children: new Date(u.created_at).toLocaleDateString("fr-FR")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin/users/$id",
								params: { id: u.id },
								className: "inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" }), " Voir"]
							})
						})
					]
				}, u.id)) })]
			})
		})]
	});
}
//#endregion
export { UsersLayout as component };
