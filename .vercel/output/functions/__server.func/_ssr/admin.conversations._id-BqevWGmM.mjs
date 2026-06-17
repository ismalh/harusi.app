import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as Trash2 } from "../_libs/lucide-react.mjs";
import { a as getConversationDetail, f as useServerFn, n as deleteMessage, t as AdminShell } from "./AdminShell-CryVoPkr.mjs";
import { t as Route } from "./admin.conversations._id-D9LRdFpV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.conversations._id-BqevWGmM.js
var import_jsx_runtime = require_jsx_runtime();
function ConvDetail() {
	const { id } = Route.useParams();
	const qc = useQueryClient();
	const fn = useServerFn(getConversationDetail);
	const delFn = useServerFn(deleteMessage);
	const { data, isLoading } = useQuery({
		queryKey: ["admin-conv", id],
		queryFn: () => fn({ data: { id } })
	});
	if (isLoading || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "…",
		children: "Chargement…"
	});
	const c = data.conversation;
	const aName = c.a?.[0]?.first_name ?? "?";
	const bName = c.b?.[0]?.first_name ?? "?";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: `${aName} ↔ ${bName}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [data.messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 rounded-lg border border-border bg-card p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							m.sender_id === c.user_a ? aName : bName,
							" · ",
							new Date(m.created_at).toLocaleString("fr-FR")
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						children: m.body
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: async () => {
						if (!confirm("Supprimer ce message ?")) return;
						await delFn({ data: { id: m.id } });
						qc.invalidateQueries({ queryKey: ["admin-conv", id] });
					},
					className: "rounded p-1 text-rose-600 hover:bg-rose-50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
				})]
			}, m.id)), data.messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Aucun message."
			})]
		})
	});
}
//#endregion
export { ConvDetail as component };
