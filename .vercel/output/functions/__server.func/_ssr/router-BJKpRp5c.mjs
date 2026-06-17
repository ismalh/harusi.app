import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime, n as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { M as redirect, _ as useNavigate, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-B98Drrw5.mjs";
import { C as ChevronLeft, S as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Route$18 } from "./admin.conversations._id-D9LRdFpV.mjs";
import { t as Route$19 } from "./admin.users._id-DNtbV_UM.mjs";
import { t as Route$20 } from "./chat._id-BLWTts_2.mjs";
import { t as HarusiLogo } from "./HarusiLogo-CTRx2C9I.mjs";
import { t as ISLANDS } from "./islands-C3q311l1.mjs";
import { t as Route$21 } from "./profil._id-Cx7XhBFH.mjs";
import { t as Route$22 } from "./wali._token-BPGKe-s-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BJKpRp5c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BzDGj6sR.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$17 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{
				name: "theme-color",
				content: "#1B5E3B"
			},
			{ title: "Harusi — Mariage islamique comorien" },
			{
				name: "description",
				content: "Harusi : mise en relation pour le mariage islamique comorien. Sérieux, pudeur, intention."
			},
			{
				property: "og:title",
				content: "Harusi — Mariage islamique comorien"
			},
			{
				property: "og:description",
				content: "Mise en relation pour le mariage islamique comorien."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:title",
				content: "Harusi — Mariage islamique comorien"
			},
			{
				name: "description",
				content: "Harusi is a mobile-first web app connecting Muslims for Islamic marriage."
			},
			{
				property: "og:description",
				content: "Harusi is a mobile-first web app connecting Muslims for Islamic marriage."
			},
			{
				name: "twitter:description",
				content: "Harusi is a mobile-first web app connecting Muslims for Islamic marriage."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/91a965f1-0099-4fd9-b7fa-f555e2f10c35/id-preview-1833590f--d80dd5c0-50e1-484b-b311-bfbe8f17edfb.lovable.app-1781239231780.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/91a965f1-0099-4fd9-b7fa-f555e2f10c35/id-preview-1833590f--d80dd5c0-50e1-484b-b311-bfbe8f17edfb.lovable.app-1781239231780.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$17.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$15 = () => import("./regles-D8nH306a.mjs");
var Route$16 = createFileRoute("/regles")({
	head: () => ({ meta: [{ title: "Règles de la communauté — Harusi" }, {
		name: "description",
		content: "Charte de respect, pudeur et sincérité de la communauté Harusi."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./privacy-atZ7sVvo.mjs");
var Route$15 = createFileRoute("/privacy")({
	head: () => ({ meta: [{ title: "Politique de confidentialité — Halal Match" }, {
		name: "description",
		content: "Comment nous traitons vos données personnelles."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./connexion-BSRXECZD.mjs");
var Route$14 = createFileRoute("/connexion")({
	head: () => ({ meta: [{ title: "Connexion — Harusi" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./cgu-B2qHBtqA.mjs");
var Route$13 = createFileRoute("/cgu")({
	head: () => ({ meta: [{ title: "Conditions générales d'utilisation — Harusi" }, {
		name: "description",
		content: "Les règles d'utilisation de Harusi."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./route-Di7iQBCH.mjs");
var Route$12 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async ({ location }) => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/connexion" });
		const { data: prof } = await supabase.from("profiles").select("status, onboarding_completed").eq("id", data.user.id).maybeSingle();
		if (prof?.status === "banned" || prof?.status === "suspended") {
			await supabase.auth.signOut();
			throw redirect({ to: "/connexion" });
		}
		if (prof && !prof.onboarding_completed && !location.pathname.startsWith("/onboarding")) throw redirect({ to: "/onboarding" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./routes-HNy9PUGe.mjs");
var Route$11 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Harusi — Mariage islamique comorien" }, {
		name: "description",
		content: "Harusi : mise en relation pour le mariage islamique comorien."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./parametres-C1hG61g5.mjs");
var Route$10 = createFileRoute("/_authenticated/parametres")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var Route$9 = createFileRoute("/_authenticated/onboarding")({ component: OnboardingPage });
var TOTAL_STEPS = 6;
var LANGUES_OPTIONS = [
	"Shikomori",
	"Français",
	"Arabe",
	"Anglais",
	"Autres"
];
function ProgressBar({ step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between text-xs text-muted-foreground mb-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				"Étape ",
				step,
				" / ",
				TOTAL_STEPS
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [Math.round(step / TOTAL_STEPS * 100), "%"] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1.5 w-full rounded-full bg-muted overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full bg-primary transition-all duration-300",
				style: { width: `${step / TOTAL_STEPS * 100}%` }
			})
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block mb-1 text-sm font-medium",
			children: label
		}), children]
	});
}
function Input(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		className: "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
	});
}
function Select(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		...props,
		className: "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
	});
}
function OnboardingPage() {
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(1);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [photoFile, setPhotoFile] = (0, import_react.useState)(null);
	const [photoPreview, setPhotoPreview] = (0, import_react.useState)(null);
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [gender, setGender] = (0, import_react.useState)("");
	const [dateNaissance, setDateNaissance] = (0, import_react.useState)("");
	const [originePrincipale, setOriginePrincipale] = (0, import_react.useState)("");
	const [origineSecondaire, setOrigineSecondaire] = (0, import_react.useState)("");
	const [nationalite, setNationalite] = (0, import_react.useState)("");
	const [nationaliteSecondaire, setNationaliteSecondaire] = (0, import_react.useState)("");
	const [island, setIsland] = (0, import_react.useState)("");
	const [lieuNaissance, setLieuNaissance] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [langues, setLangues] = (0, import_react.useState)([]);
	const [statutMatrimonial, setStatutMatrimonial] = (0, import_react.useState)("");
	const [aDesEnfants, setADesEnfants] = (0, import_react.useState)(null);
	const [nbEnfants, setNbEnfants] = (0, import_react.useState)("");
	const [accepteEnfants, setAccepteEnfants] = (0, import_react.useState)(null);
	const [nbEnfantsSouhaites, setNbEnfantsSouhaites] = (0, import_react.useState)("");
	const [profession, setProfession] = (0, import_react.useState)("");
	const [taille, setTaille] = (0, import_react.useState)("");
	const [corpulence, setCorpulence] = (0, import_react.useState)("");
	const [tenueVestimentaire, setTenueVestimentaire] = (0, import_react.useState)("");
	const [porteHijab, setPorteHijab] = (0, import_react.useState)(null);
	const [porteBarbe, setPorteBarbe] = (0, import_react.useState)(null);
	const [frequencePriere, setFrequencePriere] = (0, import_react.useState)("");
	const [priereVendredi, setPriereVendredi] = (0, import_react.useState)(null);
	const [rapportMosquee, setRapportMosquee] = (0, import_react.useState)("");
	const [rapportCoran, setRapportCoran] = (0, import_react.useState)("");
	const [rapportArabe, setRapportArabe] = (0, import_react.useState)("");
	const [niveauInstruction, setNiveauInstruction] = (0, import_react.useState)("");
	const [ecoleJurisprudence, setEcoleJurisprudence] = (0, import_react.useState)("");
	const [enHijra, setEnHijra] = (0, import_react.useState)(null);
	const [souhaitHijra, setSouhaitHijra] = (0, import_react.useState)(null);
	const [hijraQuand, setHijraQuand] = (0, import_react.useState)("");
	const [accepteDemenager, setAccepteDemenager] = (0, import_react.useState)(null);
	const [situationSante, setSituationSante] = (0, import_react.useState)("");
	const [enPolygamie, setEnPolygamie] = (0, import_react.useState)(null);
	const [acceptePolygamie, setAcceptePolygamie] = (0, import_react.useState)(null);
	const [descriptionRecherche, setDescriptionRecherche] = (0, import_react.useState)("");
	const [criteresRedhibitoires, setCriteresRedhibitoires] = (0, import_react.useState)("");
	const [bio, setBio] = (0, import_react.useState)("");
	function toggleLangue(l) {
		setLangues((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]);
	}
	function calcAge(dob) {
		if (!dob) return null;
		const diff = Date.now() - new Date(dob).getTime();
		return Math.floor(diff / (1e3 * 60 * 60 * 24 * 365.25));
	}
	async function saveStep(nextStep) {
		setSaving(true);
		setError(null);
		try {
			const { data: userData } = await supabase.auth.getUser();
			const uid = userData.user?.id;
			if (!uid) throw new Error("Utilisateur non connecté.");
			let patch = { onboarding_step: nextStep - 1 };
			if (step === 1) {
				if (!firstName || !gender || !dateNaissance || !originePrincipale || !nationalite || !island || !lieuNaissance || !city) {
					setError("Merci de remplir tous les champs obligatoires.");
					setSaving(false);
					return;
				}
				patch = {
					...patch,
					first_name: firstName,
					gender,
					date_naissance: dateNaissance,
					age: calcAge(dateNaissance),
					origine_principale: originePrincipale,
					origine_secondaire: origineSecondaire || null,
					nationalite,
					nationalite_secondaire: nationaliteSecondaire || null,
					island,
					lieu_naissance: lieuNaissance,
					city,
					langues,
					looking_for: gender === "homme" ? "femme" : "homme"
				};
			} else if (step === 2) {
				if (!statutMatrimonial || !profession) {
					setError("Merci de remplir tous les champs obligatoires.");
					setSaving(false);
					return;
				}
				patch = {
					...patch,
					statut_matrimonial: statutMatrimonial,
					a_des_enfants: aDesEnfants,
					nb_enfants: aDesEnfants ? nbEnfants ? parseInt(nbEnfants) : null : null,
					accepte_enfants: accepteEnfants,
					nb_enfants_souhaites: nbEnfantsSouhaites ? parseInt(nbEnfantsSouhaites) : null,
					profession
				};
			} else if (step === 3) patch = {
				...patch,
				taille: taille || null,
				corpulence: corpulence || null,
				tenue_vestimentaire: tenueVestimentaire || null,
				porte_hijab: gender === "femme" ? porteHijab : null,
				porte_barbe: gender === "homme" ? porteBarbe : null
			};
			else if (step === 4) patch = {
				...patch,
				frequence_priere: frequencePriere || null,
				priere_vendredi: gender === "homme" ? priereVendredi : null,
				rapport_mosquee: gender === "homme" ? rapportMosquee || null : null,
				rapport_coran: rapportCoran || null,
				rapport_arabe: rapportArabe || null,
				niveau_instruction_religieuse: niveauInstruction || null,
				ecole_jurisprudence: ecoleJurisprudence || null,
				en_hijra: enHijra,
				souhaite_hijra: souhaitHijra,
				hijra_quand: souhaitHijra ? hijraQuand || null : null
			};
			else if (step === 5) patch = {
				...patch,
				accepte_demenager: accepteDemenager,
				situation_sante: situationSante || null,
				en_polygamie: gender === "homme" ? enPolygamie : null,
				accepte_polygamie: gender === "femme" ? acceptePolygamie : null
			};
			else if (step === 6) {
				let photoUrl;
				if (photoFile) {
					const path = `${uid}/profile.${photoFile.name.split(".").pop()}`;
					const { error: upErr } = await supabase.storage.from("profile-photos").upload(path, photoFile, { upsert: true });
					if (upErr) throw upErr;
					photoUrl = path;
				}
				patch = {
					...patch,
					bio: bio || null,
					description_recherche: descriptionRecherche || null,
					criteres_redhibitoires: criteresRedhibitoires || null,
					onboarding_completed: true,
					onboarding_step: 6,
					status: "pending"
				};
				if (photoUrl) patch.photo_url = photoUrl;
			}
			const { error: dbErr } = await supabase.from("profiles").update(patch).eq("id", uid);
			if (dbErr) {
				console.log("ERREUR SUPABASE:", dbErr);
				throw dbErr;
			}
			if (step === 6) navigate({ to: "/home" });
			else {
				setStep(nextStep);
				window.scrollTo(0, 0);
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "Erreur lors de la sauvegarde.");
		} finally {
			setSaving(false);
		}
	}
	function handlePhotoChange(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		setPhotoFile(file);
		setPhotoPreview(URL.createObjectURL(file));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-background px-4 py-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HarusiLogo, { size: "md" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, { step }),
				step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 font-serif text-xl",
						children: "Identité & Origine"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Prénom *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: firstName,
							onChange: (e) => setFirstName(e.target.value),
							placeholder: "Ton prénom"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Genre *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: gender,
							onChange: (e) => setGender(e.target.value),
							className: "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Sélectionner..."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "homme",
									children: "Homme"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "femme",
									children: "Femme"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Date de naissance *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: dateNaissance,
							onChange: (e) => setDateNaissance(e.target.value),
							max: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Origine principale *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: originePrincipale,
							onChange: (e) => setOriginePrincipale(e.target.value),
							placeholder: "ex: Comorienne, Mahoraise…"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Deuxième origine (facultatif)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: origineSecondaire,
							onChange: (e) => setOrigineSecondaire(e.target.value),
							placeholder: "ex: Française, Malgache…"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nationalité *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: nationalite,
							onChange: (e) => setNationalite(e.target.value),
							placeholder: "ex: Française, Comorienne…"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Deuxième nationalité (facultatif)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: nationaliteSecondaire,
							onChange: (e) => setNationaliteSecondaire(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Île comorienne *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: island,
							onChange: (e) => setIsland(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Sélectionner…"
							}), ISLANDS.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: i.value,
								children: i.label
							}, i.value))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Lieu de naissance *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: lieuNaissance,
							onChange: (e) => setLieuNaissance(e.target.value),
							placeholder: "Ville, pays"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Ville de résidence *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: city,
							onChange: (e) => setCity(e.target.value),
							placeholder: "Paris, Marseille…"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Langues parlées",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: LANGUES_OPTIONS.map((l) => {
								const selected = langues.includes(l);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: `
            cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition-colors
            ${selected ? "border-border bg-gray-200 text-foreground hover:bg-gray-300" : "border-border bg-white text-foreground hover:bg-muted"}
          `,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										className: "hidden",
										checked: selected,
										onChange: () => toggleLangue(l)
									}), l]
								}, l);
							})
						})
					})
				] }),
				step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 font-serif text-xl",
						children: "Situation personnelle"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Statut matrimonial *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setStatutMatrimonial("célibataire"),
									className: `px-4 py-2 rounded-xl border text-sm transition-all ${statutMatrimonial === "célibataire" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
									children: "Célibataire"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setStatutMatrimonial("divorcé"),
									className: `px-4 py-2 rounded-xl border text-sm transition-all ${statutMatrimonial === "divorcé" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
									children: "Divorcé(e)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setStatutMatrimonial("veuf"),
									className: `px-4 py-2 rounded-xl border text-sm transition-all ${statutMatrimonial === "veuf" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
									children: "Veuf/Veuve"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "As-tu des enfants ?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setADesEnfants(true),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${aDesEnfants === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Oui"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setADesEnfants(false),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${aDesEnfants === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Non"
							})]
						})]
					}),
					aDesEnfants && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Nombre d'enfants"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 1,
							value: nbEnfants,
							onChange: (e) => setNbEnfants(e.target.value),
							className: "border border-gray-300 rounded-xl px-3 py-2 text-sm w-24 bg-white"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Acceptes-tu les enfants de l'autre ?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAccepteEnfants(true),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${accepteEnfants === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Oui"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAccepteEnfants(false),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${accepteEnfants === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Non"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Nombre d'enfants souhaités"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 0,
							value: nbEnfantsSouhaites,
							onChange: (e) => setNbEnfantsSouhaites(e.target.value),
							placeholder: "0",
							className: "border border-gray-300 rounded-xl px-3 py-2 text-sm w-24 bg-white"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Profession *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: profession,
							onChange: (e) => setProfession(e.target.value),
							placeholder: "Infirmière, Ingénieur…",
							className: "border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white"
						})]
					})
				] }),
				step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 font-serif text-xl",
						children: "Physique & Apparence"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Taille"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setTaille("petit"),
									className: `px-4 py-2 rounded-xl border text-sm transition-all ${taille === "petit" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
									children: "Petit(e)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setTaille("moyen"),
									className: `px-4 py-2 rounded-xl border text-sm transition-all ${taille === "moyen" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
									children: "Moyen(ne)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setTaille("grand"),
									className: `px-4 py-2 rounded-xl border text-sm transition-all ${taille === "grand" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
									children: "Grand(e)"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Corpulence"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setCorpulence("mince"),
									className: `px-4 py-2 rounded-xl border text-sm transition-all ${corpulence === "mince" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
									children: "Mince"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setCorpulence("normale"),
									className: `px-4 py-2 rounded-xl border text-sm transition-all ${corpulence === "normale" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
									children: "Normale"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setCorpulence("sportive"),
									className: `px-4 py-2 rounded-xl border text-sm transition-all ${corpulence === "sportive" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
									children: "Sportive"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setCorpulence("en surpoids"),
									className: `px-4 py-2 rounded-xl border text-sm transition-all ${corpulence === "en surpoids" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
									children: "En surpoids"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Tenue vestimentaire habituelle"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: tenueVestimentaire,
							onChange: (e) => setTenueVestimentaire(e.target.value),
							placeholder: "ex: Abaya, Costume, Jeans…",
							className: "border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white"
						})]
					}),
					gender === "femme" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Portes-tu le hijab ?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPorteHijab(true),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${porteHijab === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Oui"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPorteHijab(false),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${porteHijab === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Non"
							})]
						})]
					}),
					gender === "homme" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Portes-tu la barbe ?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPorteBarbe(true),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${porteBarbe === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Oui"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPorteBarbe(false),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${porteBarbe === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Non"
							})]
						})]
					})
				] }),
				step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 font-serif text-xl",
						children: "Religion & Pratique"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Fréquence de prière"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setFrequencePriere("rarement"),
									className: `px-4 py-2 rounded-xl border text-sm transition-all ${frequencePriere === "rarement" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
									children: "Rarement"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setFrequencePriere("parfois"),
									className: `px-4 py-2 rounded-xl border text-sm transition-all ${frequencePriere === "parfois" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
									children: "Parfois"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setFrequencePriere("souvent"),
									className: `px-4 py-2 rounded-xl border text-sm transition-all ${frequencePriere === "souvent" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
									children: "Souvent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setFrequencePriere("toujours"),
									className: `px-4 py-2 rounded-xl border text-sm transition-all ${frequencePriere === "toujours" ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
									children: "Toujours"
								})
							]
						})]
					}),
					gender === "homme" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Prières le vendredi à la mosquée ?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPriereVendredi(true),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${priereVendredi === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Oui"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPriereVendredi(false),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${priereVendredi === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Non"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Ton rapport à la mosquée"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 2,
							value: rapportMosquee,
							onChange: (e) => setRapportMosquee(e.target.value),
							placeholder: "Ex: J'y vais régulièrement…",
							className: "border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white resize-none"
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Ton rapport au Coran"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 2,
							value: rapportCoran,
							onChange: (e) => setRapportCoran(e.target.value),
							placeholder: "Ex: Je le récite chaque soir…",
							className: "border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white resize-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Ton rapport à la langue arabe"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 2,
							value: rapportArabe,
							onChange: (e) => setRapportArabe(e.target.value),
							placeholder: "Ex: Notions de base, j'apprends…",
							className: "border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white resize-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Niveau d'instruction religieuse"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: niveauInstruction,
							onChange: (e) => setNiveauInstruction(e.target.value),
							placeholder: "Ex: Autodidacte, cours à la mosquée…",
							className: "border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block mb-2 font-semibold",
							children: ["Es-tu en hijra ? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gray-400 text-xs font-normal",
								children: "(Quitter un pays non-musulman pour vivre en terre d'Islam)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setEnHijra(true),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${enHijra === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Oui"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setEnHijra(false),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${enHijra === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Non"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Souhaites-tu faire la hijra ?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSouhaitHijra(true),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${souhaitHijra === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Oui"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSouhaitHijra(false),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${souhaitHijra === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Non"
							})]
						})]
					}),
					souhaitHijra && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Quand envisages-tu la hijra ?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: hijraQuand,
							onChange: (e) => setHijraQuand(e.target.value),
							placeholder: "Ex: Dans 2 ans, bientôt…",
							className: "border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white"
						})]
					})
				] }),
				step === 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 font-serif text-xl",
						children: "Projet de vie"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Acceptes-tu de déménager ?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAccepteDemenager(true),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${accepteDemenager === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Oui"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAccepteDemenager(false),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${accepteDemenager === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Non"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Situation de santé particulière (facultatif)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: situationSante,
							onChange: (e) => setSituationSante(e.target.value),
							placeholder: "Rien à signaler, ou préciser…",
							className: "border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white"
						})]
					}),
					gender === "homme" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Es-tu actuellement en situation de polygamie ?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setEnPolygamie(true),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${enPolygamie === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Oui"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setEnPolygamie(false),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${enPolygamie === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Non"
							})]
						})]
					}),
					gender === "femme" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block mb-2 font-semibold",
							children: "Acceptes-tu la polygamie ?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAcceptePolygamie(true),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${acceptePolygamie === true ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Oui"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAcceptePolygamie(false),
								className: `px-4 py-2 rounded-xl border text-sm transition-all ${acceptePolygamie === false ? "bg-gray-200 text-gray-800 border-gray-300" : "bg-white text-gray-500 border-gray-300"}`,
								children: "Non"
							})]
						})]
					})
				] }),
				step === 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 font-serif text-xl",
						children: "Présentation libre"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block mb-2 font-semibold",
								children: "Présentation personnelle (max 1000 caractères)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 4,
								maxLength: 1e3,
								value: bio,
								onChange: (e) => setBio(e.target.value),
								placeholder: "Parle un peu de toi…",
								className: "border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white resize-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 text-xs text-gray-400",
								children: [bio.length, "/1000"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block mb-2 font-semibold",
								children: "Profil recherché (max 1000 caractères)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 4,
								maxLength: 1e3,
								value: descriptionRecherche,
								onChange: (e) => setDescriptionRecherche(e.target.value),
								placeholder: "Décris la personne que tu recherches…",
								className: "border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white resize-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 text-xs text-gray-400",
								children: [descriptionRecherche.length, "/1000"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block mb-2 font-semibold",
								children: "Critères rédhibitoires (max 500 caractères)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								maxLength: 500,
								value: criteresRedhibitoires,
								onChange: (e) => setCriteresRedhibitoires(e.target.value),
								placeholder: "Ce que tu ne peux pas accepter…",
								className: "border border-gray-300 rounded-xl px-3 py-2 text-sm w-full bg-white resize-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 text-xs text-gray-400",
								children: [criteresRedhibitoires.length, "/500"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block mb-2 font-semibold",
								children: "Photo de profil"
							}),
							photoPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: photoPreview,
									alt: "Aperçu",
									className: "aspect-square w-32 rounded-xl object-cover"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 flex aspect-square w-32 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400",
								children: "Aucune photo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: handlePhotoChange
								}), "Choisir une photo"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-400",
						children: "Ton profil sera examiné par notre équipe avant d'être visible. Cela prend généralement 24h."
					})
				] }),
				")",
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex gap-3",
					children: [step > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setStep(step - 1);
							window.scrollTo(0, 0);
						},
						className: "flex items-center gap-1 rounded-lg border border-border px-4 py-3 text-sm hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" }), " Retour"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => saveStep(step + 1),
						disabled: saving,
						className: "flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground disabled:opacity-50",
						children: [saving ? "Enregistrement…" : step === TOTAL_STEPS ? "Terminer" : "Suivant", !saving && step < TOTAL_STEPS && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
					})]
				})
			]
		})
	});
}
var $$splitComponentImporter$8 = () => import("./mon-profil-c2Yraz6y.mjs");
var Route$8 = createFileRoute("/_authenticated/mon-profil")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./home-9ZydvXfZ.mjs");
var Route$7 = createFileRoute("/_authenticated/home")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./demandes-C22Ee5it.mjs");
var Route$6 = createFileRoute("/_authenticated/demandes")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./conversations-CIfJdOmn.mjs");
var Route$5 = createFileRoute("/_authenticated/conversations")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./admin-C8bzTTbr.mjs");
var Route$4 = createFileRoute("/_authenticated/admin")({
	beforeLoad: async ({ context }) => {
		const { data: auth } = await supabase.auth.getUser();
		const userId = auth.user?.id;
		if (!userId) throw redirect({ to: "/connexion" });
		const [{ data: isAdmin }, { data: isMod }] = await Promise.all([supabase.rpc("has_role", {
			_user_id: userId,
			_role: "admin"
		}), supabase.rpc("has_role", {
			_user_id: userId,
			_role: "moderator"
		})]);
		if (!isAdmin && !isMod) throw redirect({ to: "/home" });
		return { role: isAdmin ? "admin" : "moderator" };
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.index-BNNsErWd.mjs");
var Route$3 = createFileRoute("/_authenticated/admin/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.users-CWt15FU3.mjs");
var Route$2 = createFileRoute("/_authenticated/admin/users")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.reports-FMlxABgJ.mjs");
var Route$1 = createFileRoute("/_authenticated/admin/reports")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.conversations-Bbxk1SO7.mjs");
var Route = createFileRoute("/_authenticated/admin/conversations")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var ReglesRoute = Route$16.update({
	id: "/regles",
	path: "/regles",
	getParentRoute: () => Route$17
});
var PrivacyRoute = Route$15.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$17
});
var ConnexionRoute = Route$14.update({
	id: "/connexion",
	path: "/connexion",
	getParentRoute: () => Route$17
});
var CguRoute = Route$13.update({
	id: "/cgu",
	path: "/cgu",
	getParentRoute: () => Route$17
});
var AuthenticatedRouteRoute = Route$12.update({
	id: "/_authenticated",
	getParentRoute: () => Route$17
});
var IndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$17
});
var WaliTokenRoute = Route$22.update({
	id: "/wali/$token",
	path: "/wali/$token",
	getParentRoute: () => Route$17
});
var AuthenticatedParametresRoute = Route$10.update({
	id: "/parametres",
	path: "/parametres",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedOnboardingRoute = Route$9.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMonProfilRoute = Route$8.update({
	id: "/mon-profil",
	path: "/mon-profil",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedHomeRoute = Route$7.update({
	id: "/home",
	path: "/home",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDemandesRoute = Route$6.update({
	id: "/demandes",
	path: "/demandes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedConversationsRoute = Route$5.update({
	id: "/conversations",
	path: "/conversations",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminRoute = Route$4.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedProfilIdRoute = Route$21.update({
	id: "/profil/$id",
	path: "/profil/$id",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedChatIdRoute = Route$20.update({
	id: "/chat/$id",
	path: "/chat/$id",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminUsersRoute = Route$2.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminReportsRoute = Route$1.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminConversationsRoute = Route.update({
	id: "/conversations",
	path: "/conversations",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminUsersIdRoute = Route$19.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AuthenticatedAdminUsersRoute
});
var AuthenticatedAdminConversationsRouteChildren = { AuthenticatedAdminConversationsIdRoute: Route$18.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AuthenticatedAdminConversationsRoute
}) };
var AuthenticatedAdminConversationsRouteWithChildren = AuthenticatedAdminConversationsRoute._addFileChildren(AuthenticatedAdminConversationsRouteChildren);
var AuthenticatedAdminUsersRouteChildren = { AuthenticatedAdminUsersIdRoute };
var AuthenticatedAdminRouteChildren = {
	AuthenticatedAdminConversationsRoute: AuthenticatedAdminConversationsRouteWithChildren,
	AuthenticatedAdminReportsRoute,
	AuthenticatedAdminUsersRoute: AuthenticatedAdminUsersRoute._addFileChildren(AuthenticatedAdminUsersRouteChildren),
	AuthenticatedAdminIndexRoute
};
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRoute: AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren),
	AuthenticatedConversationsRoute,
	AuthenticatedDemandesRoute,
	AuthenticatedHomeRoute,
	AuthenticatedMonProfilRoute,
	AuthenticatedOnboardingRoute,
	AuthenticatedParametresRoute,
	AuthenticatedChatIdRoute,
	AuthenticatedProfilIdRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	CguRoute,
	ConnexionRoute,
	PrivacyRoute,
	ReglesRoute,
	WaliTokenRoute
};
var routeTree = Route$17._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
