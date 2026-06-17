import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-B98Drrw5.mjs";
import { D as ArrowLeft, v as Heart, y as Flag } from "../_libs/lucide-react.mjs";
import { n as islandLabel } from "./islands-C3q311l1.mjs";
import { t as Route } from "./profil._id-Cx7XhBFH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profil._id-DfipFMI8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const [p, setP] = (0, import_react.useState)(null);
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const [me, setMe] = (0, import_react.useState)(null);
	const [demandeStatus, setDemandeStatus] = (0, import_react.useState)(null);
	const [sending, setSending] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user) return;
			setMe(auth.user.id);
			const { data } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
			setP(data);
			if (data?.photo_url) {
				const { data: s } = await supabase.storage.from("profile-photos").createSignedUrl(data.photo_url, 3600);
				setPhoto(s?.signedUrl ?? null);
			}
			const { data: req } = await supabase.from("match_requests").select("status").eq("sender_id", auth.user.id).eq("receiver_id", id).maybeSingle();
			if (req) setDemandeStatus(req.status);
		})();
	}, [id]);
	async function envoyerDemande() {
		if (!me || !id) return;
		setSending(true);
		const { error } = await supabase.from("match_requests").insert({
			sender_id: me,
			receiver_id: id,
			status: "pending"
		});
		if (!error) setDemandeStatus("pending");
		setSending(false);
	}
	async function report() {
		const reason = prompt("Motif du signalement :");
		if (!reason || !me || !id) return;
		await supabase.from("reports").insert({
			reporter_id: me,
			reported_id: id,
			reason
		});
		alert("Merci, le signalement a été envoyé.");
	}
	if (!p) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center",
		children: "Chargement…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => navigate({ to: "/home" }),
				className: "rounded-md p-1 hover:bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-md px-4 py-4",
			children: [
				photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: photo,
					alt: "",
					className: "aspect-square w-full rounded-xl object-cover"
				}),
				!photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-square w-full rounded-xl bg-muted" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-3 font-serif text-2xl",
					children: [
						p.first_name,
						", ",
						p.age,
						" ans"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						p.city,
						" · ",
						islandLabel(p.island)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-2 rounded-xl border border-border bg-card p-4 text-sm",
					children: [
						p.origine_principale && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Origine :"
							}),
							" ",
							p.origine_principale,
							p.origine_secondaire ? ` / ${p.origine_secondaire}` : ""
						] }),
						p.nationalite && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Nationalité :"
							}),
							" ",
							p.nationalite
						] }),
						p.statut_matrimonial && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Statut :"
							}),
							" ",
							p.statut_matrimonial
						] }),
						p.profession && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Profession :"
							}),
							" ",
							p.profession
						] }),
						p.frequence_priere && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Prière :"
							}),
							" ",
							p.frequence_priere
						] }),
						p.taille && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Taille :"
							}),
							" ",
							p.taille
						] }),
						p.en_hijra !== null && p.en_hijra !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "En hijra :"
							}),
							" ",
							p.en_hijra ? "Oui" : "Non"
						] }),
						p.langues?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Langues :"
							}),
							" ",
							p.langues.join(", ")
						] })
					]
				}),
				p.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground",
						children: "À propos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: p.bio
					})]
				}),
				p.description_recherche && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground",
						children: "Profil recherché"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: p.description_recherche
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [
						demandeStatus === null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: envoyerDemande,
							disabled: sending,
							className: "flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-4 w-4" }), " Envoyer une demande"]
						}),
						demandeStatus === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 rounded-lg border border-border bg-muted py-3 text-center text-sm text-muted-foreground",
							children: "Demande envoyée — en attente"
						}),
						demandeStatus === "accepted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 rounded-lg border border-border bg-emerald-50 py-3 text-center text-sm text-emerald-700",
							children: "Demande acceptée ✓"
						}),
						demandeStatus === "declined" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 rounded-lg border border-border bg-muted py-3 text-center text-sm text-muted-foreground",
							children: "Demande refusée"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: report,
							className: "rounded-lg border border-border px-3 py-3 text-sm text-rose-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-4 w-4" })
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { ProfilPage as component };
