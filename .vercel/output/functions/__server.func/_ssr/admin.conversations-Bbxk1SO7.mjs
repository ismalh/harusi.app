import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { f as Outlet, g as Link, v as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { x as Eye } from "../_libs/lucide-react.mjs";
import { f as useServerFn, o as listConversations, t as AdminShell } from "./AdminShell-CryVoPkr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.conversations-Bbxk1SO7.js
var import_jsx_runtime = require_jsx_runtime();
function ConvsLayout() {
	if (useParams({ strict: false })?.id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConvsPage, {});
}
function ConvsPage() {
	useQueryClient();
	const fn = useServerFn(listConversations);
	const { data, isLoading } = useQuery({
		queryKey: ["admin-convs"],
		queryFn: () => fn()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Conversations",
		children: [isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
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
							children: "Participants"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-2 text-left",
							children: "Mise à jour"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-2" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data?.conversations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border hover:bg-muted/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "p-2",
							children: [
								c.a?.first_name ?? "?",
								" ↔ ",
								c.b?.first_name ?? "?"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2 text-xs text-muted-foreground",
							children: new Date(c.updated_at).toLocaleString("fr-FR")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin/conversations/$id",
								params: { id: c.id },
								className: "inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" }), " Voir"]
							})
						})
					]
				}, c.id)) })]
			})
		})]
	});
}
//#endregion
export { ConvsLayout as component };
