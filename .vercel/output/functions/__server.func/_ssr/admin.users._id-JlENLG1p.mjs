import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-B98Drrw5.mjs";
import { D as ArrowLeft } from "../_libs/lucide-react.mjs";
import { d as setUserRole, f as useServerFn, r as deleteProfile, t as AdminShell, u as setProfileStatus } from "./AdminShell-CryVoPkr.mjs";
import { t as Route } from "./admin.users._id-DNtbV_UM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.users._id-JlENLG1p.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UserDetail() {
	const { id } = Route.useParams();
	const setStatus = useServerFn(setProfileStatus);
	const setRole = useServerFn(setUserRole);
	const del = useServerFn(deleteProfile);
	const navigate = useNavigate();
	const [d, setD] = (0, import_react.useState)(null);
	async function load() {
		const { data: prof } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
		if (!prof) return;
		let photo_signed = null;
		if (prof.photo_url) {
			const { data: s } = await supabase.storage.from("profile-photos").createSignedUrl(prof.photo_url, 3600);
			photo_signed = s?.signedUrl ?? null;
		}
		const [{ count: msg_count }, { count: report_count }] = await Promise.all([supabase.from("messages").select("id", {
			count: "exact",
			head: true
		}).eq("sender_id", id), supabase.from("reports").select("id", {
			count: "exact",
			head: true
		}).eq("reported_id", id)]);
		const { data: roles } = await supabase.rpc("has_role", {
			_user_id: id,
			_role: "admin"
		});
		setD({
			profile: {
				...prof,
				photo_signed
			},
			msg_count: msg_count ?? 0,
			report_count: report_count ?? 0,
			roles: roles ? ["admin"] : []
		});
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [id]);
	if (!d) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Utilisateur",
		children: "Chargement…"
	});
	const p = d.profile;
	const currentRole = d.roles?.includes("admin") ? "admin" : d.roles?.includes("moderator") ? "moderator" : "user";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: p.first_name ?? p.email ?? "Utilisateur",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/users",
				className: "mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), " Retour"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-1",
					children: p.photo_signed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.photo_signed,
						alt: "",
						className: "aspect-square w-full rounded-xl object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-square w-full rounded-xl bg-muted" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-sm md:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Email :" }),
							" ",
							p.email ?? "—"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Téléphone :" }),
							" ",
							p.whatsapp ?? "—"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Prénom :" }),
							" ",
							p.first_name ?? "—",
							" ",
							p.age ? `(${p.age} ans)` : ""
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Statut :" }),
							" ",
							p.status
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Inscrit le :" }),
							" ",
							new Date(p.created_at).toLocaleString("fr-FR")
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Dernière connexion :" }),
							" ",
							p.last_login_at ? new Date(p.last_login_at).toLocaleString("fr-FR") : "—"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Messages envoyés :" }),
							" ",
							d.msg_count
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Signalements reçus :" }),
							" ",
							d.report_count
						] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-3 rounded-xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Actions de modération"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: async () => {
									await setStatus({ data: {
										id,
										status: "approved"
									} });
									load();
								},
								className: "rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700",
								children: "Réactiver"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: async () => {
									await setStatus({ data: {
										id,
										status: "suspended"
									} });
									load();
								},
								className: "rounded-md border border-orange-300 bg-orange-50 px-3 py-1.5 text-sm text-orange-700",
								children: "Suspendre"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: async () => {
									await setStatus({ data: {
										id,
										status: "banned"
									} });
									load();
								},
								className: "rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-700",
								children: "Bannir"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "Rôle (admin uniquement)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: currentRole,
						onChange: async (e) => {
							try {
								await setRole({ data: {
									id,
									role: e.target.value
								} });
								load();
							} catch (err) {
								alert(err?.message);
							}
						},
						className: "mt-1 block rounded-md border border-border bg-background px-2 py-1.5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "user",
								children: "user"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "moderator",
								children: "moderator"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "admin",
								children: "admin"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: async () => {
							if (!confirm("Supprimer définitivement ce compte ?")) return;
							try {
								await del({ data: { id } });
								navigate({ to: "/admin/users" });
							} catch (e) {
								alert(e?.message);
							}
						},
						className: "rounded-md border border-red-400 bg-red-100 px-3 py-1.5 text-sm text-red-800",
						children: "Supprimer définitivement"
					})
				]
			})
		]
	});
}
//#endregion
export { UserDetail as component };
