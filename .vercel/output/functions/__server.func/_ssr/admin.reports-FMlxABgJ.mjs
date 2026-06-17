import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Ban, t as X, u as MessageSquare, w as Check } from "../_libs/lucide-react.mjs";
import { c as listReports, f as useServerFn, l as resolveReport, t as AdminShell, u as setProfileStatus } from "./AdminShell-CryVoPkr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.reports-FMlxABgJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TYPE_LABEL = {
	profile: "Profil",
	photo: "Photo",
	message: "Message"
};
function ReportsPage() {
	const list = useServerFn(listReports);
	const resolve = useServerFn(resolveReport);
	const setStatus = useServerFn(setProfileStatus);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [status, setStatusFilter] = (0, import_react.useState)("pending");
	async function load() {
		try {
			setRows((await list({ data: { status } })).reports);
		} catch (e) {
			alert(e?.message);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [status]);
	async function act(fn) {
		try {
			await fn();
			await load();
		} catch (e) {
			alert(e?.message);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Signalements",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 flex gap-2",
			children: [
				"pending",
				"resolved",
				"dismissed",
				"all"
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setStatusFilter(s),
				className: `rounded-md px-3 py-1.5 text-sm ${status === s ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"}`,
				children: s === "pending" ? "En attente" : s === "resolved" ? "Validés" : s === "dismissed" ? "Rejetés" : "Tous"
			}, s))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "space-y-3",
			children: [rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-muted px-2 py-0.5 text-xs",
								children: TYPE_LABEL[r.target_type] ?? r.target_type
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-xs text-muted-foreground",
								children: new Date(r.created_at).toLocaleString("fr-FR")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: r.reporter?.first_name ?? r.reporter?.email ?? "—" }),
									" a signalé",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/admin/users/$id",
										params: { id: r.reported_id },
										className: "underline",
										children: r.reported?.first_name ?? r.reported?.email ?? "ce compte"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Motif :" }),
									" ",
									r.reason
								]
							}),
							r.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: r.details
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded-full px-2 py-0.5 text-xs ${r.status === "pending" ? "bg-amber-100 text-amber-700" : r.status === "resolved" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`,
							children: r.status
						})]
					}),
					r.target_type === "photo" && r.photo_signed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: r.photo_signed,
						alt: "",
						className: "mt-3 max-h-64 rounded-lg border border-border"
					}),
					r.target_type === "message" && r.message && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-lg border border-border bg-muted/40 p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: ["Message du ", new Date(r.message.created_at).toLocaleString("fr-FR")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 whitespace-pre-wrap",
								children: r.message.content
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin/conversations/$id",
								params: { id: r.message.conversation_id },
								className: "mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3 w-3" }), " Voir la conversation"]
							})
						]
					}),
					r.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => act(() => resolve({ data: {
									id: r.id,
									status: "resolved"
								} })),
								className: "inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " Valider (action prise)"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => act(() => resolve({ data: {
									id: r.id,
									status: "dismissed"
								} })),
								className: "inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" }), " Rejeter (non fondé)"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: async () => {
									if (!confirm("Bannir le compte signalé ?")) return;
									await act(async () => {
										await setStatus({ data: {
											id: r.reported_id,
											status: "banned"
										} });
										await resolve({ data: {
											id: r.id,
											status: "resolved"
										} });
									});
								},
								className: "inline-flex items-center gap-1 rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs text-red-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-3 w-3" }), " Bannir & valider"]
							})
						]
					})
				]
			}, r.id)), !rows.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground",
				children: "Aucun signalement."
			})]
		})]
	});
}
//#endregion
export { ReportsPage as component };
