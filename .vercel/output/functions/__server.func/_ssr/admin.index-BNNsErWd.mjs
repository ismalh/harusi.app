import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { E as Ban, O as Activity, i as UserPlus, n as Users, u as MessageSquare, y as Flag } from "../_libs/lucide-react.mjs";
import { f as useServerFn, i as getAdminStats, t as AdminShell } from "./AdminShell-CryVoPkr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-BNNsErWd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Card({ icon: Icon, label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-muted-foreground" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-2xl font-semibold",
				children: value ?? "—"
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function AdminHome() {
	const fn = useServerFn(getAdminStats);
	const [s, setS] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		fn().then(setS).catch(() => setS({}));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Tableau de bord",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					icon: Users,
					label: "Inscrits",
					value: s?.total_users
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					icon: UserPlus,
					label: "Aujourd'hui",
					value: s?.new_today
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					icon: UserPlus,
					label: "7 derniers jours",
					value: s?.new_week
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					icon: UserPlus,
					label: "30 derniers jours",
					value: s?.new_month
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					icon: Activity,
					label: "Actifs (7j)",
					value: s?.active_week,
					hint: `${s?.active_today ?? 0} aujourd'hui`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					icon: Flag,
					label: "Signalements en attente",
					value: s?.pending_reports
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					icon: Ban,
					label: "Bannis",
					value: s?.banned,
					hint: `${s?.suspended ?? 0} suspendus`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					icon: MessageSquare,
					label: "Conversations",
					value: s?.conversations_total,
					hint: `${s?.messages_total ?? 0} messages`
				})
			]
		})
	});
}
//#endregion
export { AdminHome as component };
