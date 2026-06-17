import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-B98Drrw5.mjs";
import { D as ArrowLeft, a as Trash2, c as Settings } from "../_libs/lucide-react.mjs";
import { n as islandLabel } from "./islands-C3q311l1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mon-profil-c2Yraz6y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MonProfil() {
	const navigate = useNavigate();
	const [p, setP] = (0, import_react.useState)(null);
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const [bio, setBio] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const [showConfirmDelete, setShowConfirmDelete] = (0, import_react.useState)(false);
	const [waliNom, setWaliNom] = (0, import_react.useState)("");
	const [waliRelation, setWaliRelation] = (0, import_react.useState)("");
	const [waliTel, setWaliTel] = (0, import_react.useState)("");
	const [waliEmail, setWaliEmail] = (0, import_react.useState)("");
	const [waliNotes, setWaliNotes] = (0, import_react.useState)("");
	const [waliId, setWaliId] = (0, import_react.useState)(null);
	const [savingWali, setSavingWali] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user) return;
			const { data } = await supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle();
			setP(data);
			setBio(data?.bio ?? "");
			if (data?.photo_url) {
				const { data: s } = await supabase.storage.from("profile-photos").createSignedUrl(data.photo_url, 3600);
				setPhoto(s?.signedUrl ?? null);
			}
			if (data?.gender === "femme") {
				const { data: wali } = await supabase.from("wali").select("*").eq("user_id", auth.user.id).maybeSingle();
				if (wali) {
					setWaliId(wali.user_id);
					setWaliNom(wali.full_name ?? "");
					setWaliRelation(wali.relation ?? "");
					setWaliTel(wali.phone ?? "");
					setWaliEmail(wali.email ?? "");
					setWaliNotes(wali.notes ?? "");
				}
			}
		})();
	}, []);
	async function save() {
		setSaving(true);
		await supabase.from("profiles").update({ bio }).eq("id", p.id);
		setSaving(false);
	}
	async function saveWali() {
		setSavingWali(true);
		const payload = {
			user_id: p.id,
			full_name: waliNom,
			relation: waliRelation,
			phone: waliTel,
			email: waliEmail,
			notes: waliNotes
		};
		if (waliId) await supabase.from("wali").update(payload).eq("user_id", waliId);
		else {
			const { data } = await supabase.from("wali").insert(payload).select("user_id").single();
			if (data) setWaliId(data.user_id);
		}
		setSavingWali(false);
	}
	async function deleteAccount() {
		setDeleting(true);
		await supabase.from("profiles").delete().eq("id", p.id);
		await supabase.auth.admin?.deleteUser(p.id).catch(() => {});
		await supabase.auth.signOut();
		navigate({ to: "/connexion" });
	}
	if (!p) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center",
		children: "Chargement…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => navigate({ to: "/home" }),
				className: "rounded-md p-1 hover:bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/parametres",
				className: "rounded-md p-1 hover:bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-5 w-5" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-md space-y-4 px-4 py-4",
			children: [
				photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: photo,
					alt: "",
					className: "aspect-square w-full rounded-xl object-cover"
				}),
				!photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-square w-full rounded-xl bg-muted" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-serif text-2xl",
					children: [p.first_name ?? "Mon profil", p.age ? `, ${p.age} ans` : ""]
				}),
				(p.city || p.island) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						p.city ?? "",
						p.city && p.island ? " · " : "",
						p.island ? islandLabel(p.island) : ""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: ["Email : ", p.email ?? "—"]
				}),
				p.statut_matrimonial && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: ["Statut : ", p.statut_matrimonial]
				}),
				p.profession && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: ["Profession : ", p.profession]
				}),
				p.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800",
					children: "Ton profil est en cours de vérification. Il sera visible sous 24h."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-sm font-medium",
						children: "Bio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 4,
						value: bio,
						maxLength: 1e3,
						onChange: (e) => setBio(e.target.value),
						className: "w-full rounded-lg border border-border bg-card p-2 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: save,
						disabled: saving,
						className: "mt-2 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50",
						children: saving ? "Enregistrement…" : "Enregistrer la bio"
					})
				] }),
				p.gender === "femme" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-lg",
							children: "Mon wali"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Ton wali pourra suivre tes conversations via un lien sécurisé."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium",
							children: "Nom complet *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: waliNom,
							onChange: (e) => setWaliNom(e.target.value),
							className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium",
							children: "Relation *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: waliRelation,
							onChange: (e) => setWaliRelation(e.target.value),
							className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Sélectionner…"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "père",
									children: "Père"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "frère",
									children: "Frère"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "oncle",
									children: "Oncle"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "tuteur",
									children: "Tuteur"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "autre",
									children: "Autre"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium",
							children: "Téléphone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: waliTel,
							onChange: (e) => setWaliTel(e.target.value),
							className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: waliEmail,
							onChange: (e) => setWaliEmail(e.target.value),
							className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium",
							children: "Notes (facultatif)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 2,
							value: waliNotes,
							onChange: (e) => setWaliNotes(e.target.value),
							className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: saveWali,
							disabled: savingWali || !waliNom || !waliRelation,
							className: "w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50",
							children: savingWali ? "Enregistrement…" : "Enregistrer le wali"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-4 border-t border-border",
					children: !showConfirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowConfirmDelete(true),
						className: "flex items-center gap-2 rounded-lg border border-rose-200 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), " Supprimer mon compte"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-rose-200 bg-rose-50 p-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-rose-800",
								children: "Supprimer définitivement ton compte ?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-rose-700",
								children: "Cette action est irréversible. Toutes tes données seront supprimées."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowConfirmDelete(false),
									className: "flex-1 rounded-lg border border-border py-2 text-sm hover:bg-muted",
									children: "Annuler"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: deleteAccount,
									disabled: deleting,
									className: "flex-1 rounded-lg bg-rose-600 py-2 text-sm font-medium text-white disabled:opacity-50",
									children: deleting ? "Suppression…" : "Confirmer"
								})]
							})
						]
					})
				})
			]
		})]
	});
}
//#endregion
export { MonProfil as component };
