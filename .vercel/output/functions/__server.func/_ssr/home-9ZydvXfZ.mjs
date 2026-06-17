import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-B98Drrw5.mjs";
import { T as Bell, d as MessageCircle, o as SlidersHorizontal, p as LogOut, r as User, s as Shield, t as X } from "../_libs/lucide-react.mjs";
import { t as HarusiLogo } from "./HarusiLogo-CTRx2C9I.mjs";
import { n as islandLabel, t as ISLANDS } from "./islands-C3q311l1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/home-9ZydvXfZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HomePage() {
	const navigate = useNavigate();
	const [me, setMe] = (0, import_react.useState)(null);
	const [profiles, setProfiles] = (0, import_react.useState)([]);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [photoUrls, setPhotoUrls] = (0, import_react.useState)({});
	const [pendingCount, setPendingCount] = (0, import_react.useState)(0);
	const [showFilters, setShowFilters] = (0, import_react.useState)(false);
	const [unreadCount, setUnreadCount] = (0, import_react.useState)(0);
	const [island, setIsland] = (0, import_react.useState)("");
	const [ageMin, setAgeMin] = (0, import_react.useState)("");
	const [ageMax, setAgeMax] = (0, import_react.useState)("");
	const [statutMatrimonial, setStatutMatrimonial] = (0, import_react.useState)("");
	const [frequencePriere, setFrequencePriere] = (0, import_react.useState)("");
	const [enHijra, setEnHijra] = (0, import_react.useState)("");
	const [acceptePolygamie, setAcceptePolygamie] = (0, import_react.useState)("");
	async function loadProfiles(myProf) {
		let q = supabase.from("profiles").select("*").eq("status", "approved").neq("id", myProf.id).not("first_name", "is", null).limit(50);
		if (myProf?.looking_for) q = q.eq("gender", myProf.looking_for);
		if (island) q = q.eq("island", island);
		if (ageMin) q = q.gte("age", parseInt(ageMin));
		if (ageMax) q = q.lte("age", parseInt(ageMax));
		if (statutMatrimonial) q = q.eq("statut_matrimonial", statutMatrimonial);
		if (frequencePriere) q = q.eq("frequence_priere", frequencePriere);
		if (enHijra) q = q.eq("en_hijra", enHijra === "oui");
		if (acceptePolygamie && myProf?.gender === "homme") q = q.eq("accepte_polygamie", acceptePolygamie === "oui");
		const { data: list } = await q;
		setProfiles(list ?? []);
		const urls = {};
		for (const p of list ?? []) if (p.photo_url) {
			const { data: s } = await supabase.storage.from("profile-photos").createSignedUrl(p.photo_url, 3600);
			if (s?.signedUrl) urls[p.id] = s.signedUrl;
		}
		setPhotoUrls(urls);
	}
	(0, import_react.useEffect)(() => {
		let unreadChannel;
		(async () => {
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user) return;
			const { data: myProf } = await supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle();
			setMe(myProf);
			const { data: roleData } = await supabase.rpc("has_role", {
				_user_id: auth.user.id,
				_role: "admin"
			});
			const { data: modData } = await supabase.rpc("has_role", {
				_user_id: auth.user.id,
				_role: "moderator"
			});
			setIsAdmin(!!roleData || !!modData);
			const { count } = await supabase.from("match_requests").select("id", {
				count: "exact",
				head: true
			}).eq("receiver_id", auth.user.id).eq("status", "pending");
			setPendingCount(count ?? 0);
			const { data: myConvs } = await supabase.from("conversations").select("id").or(`user_a.eq.${auth.user.id},user_b.eq.${auth.user.id}`);
			const convIds = (myConvs ?? []).map((c) => c.id);
			if (convIds.length) {
				const { count: unread } = await supabase.from("messages").select("id", {
					count: "exact",
					head: true
				}).in("conversation_id", convIds).neq("sender_id", auth.user.id).is("read_at", null);
				setUnreadCount(unread ?? 0);
			}
			supabase.channel("unread-badge").on("postgres_changes", {
				event: "*",
				schema: "public",
				table: "messages"
			}, async () => {
				const { data: myConvs } = await supabase.from("conversations").select("id").or(`user_a.eq.${auth.user.id},user_b.eq.${auth.user.id}`);
				const convIds = (myConvs ?? []).map((c) => c.id);
				if (convIds.length) {
					const { count: unread } = await supabase.from("messages").select("id", {
						count: "exact",
						head: true
					}).in("conversation_id", convIds).neq("sender_id", auth.user.id).is("read_at", null);
					setUnreadCount(unread ?? 0);
				} else setUnreadCount(0);
			}).subscribe();
			if (myProf) await loadProfiles(myProf);
		})();
		return () => {
			supabase.removeChannel(unreadChannel);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (me) loadProfiles(me);
	}, [
		island,
		ageMin,
		ageMax,
		statutMatrimonial,
		frequencePriere,
		enHijra,
		acceptePolygamie
	]);
	async function logout() {
		await supabase.auth.signOut();
		navigate({ to: "/connexion" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-2xl items-center justify-between px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HarusiLogo, { size: "sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex items-center gap-1 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/mon-profil",
								className: "rounded-md p-2 hover:bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/conversations",
								className: "relative rounded-md p-2 hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground",
									children: unreadCount
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/demandes",
								className: "relative rounded-md p-2 hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), pendingCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground",
									children: pendingCount
								})]
							}),
							isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin",
								className: "rounded-md p-2 hover:bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: logout,
								className: "rounded-md p-2 hover:bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-2xl px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowFilters(!showFilters),
						className: "flex w-full items-center justify-between py-2.5 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4" }), " Filtres"]
						}), showFilters ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs",
							children: "▾"
						})]
					}), showFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pb-4 grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Île"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: island,
								onChange: (e) => setIsland(e.target.value),
								className: "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Toutes"
								}), ISLANDS.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: i.value,
									children: i.label
								}, i.value))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Statut"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: statutMatrimonial,
								onChange: (e) => setStatutMatrimonial(e.target.value),
								className: "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Tous"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "célibataire",
										children: "Célibataire"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "divorcé",
										children: "Divorcé(e)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "veuf",
										children: "Veuf/Veuve"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Âge min"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 18,
								max: 99,
								value: ageMin,
								onChange: (e) => setAgeMin(e.target.value),
								placeholder: "18",
								className: "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Âge max"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 18,
								max: 99,
								value: ageMax,
								onChange: (e) => setAgeMax(e.target.value),
								placeholder: "99",
								className: "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Prière"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: frequencePriere,
								onChange: (e) => setFrequencePriere(e.target.value),
								className: "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Tous"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "rarement",
										children: "Rarement"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "parfois",
										children: "Parfois"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "souvent",
										children: "Souvent"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "toujours",
										children: "Toujours"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "En hijra"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: enHijra,
								onChange: (e) => setEnHijra(e.target.value),
								className: "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Tous"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "oui",
										children: "Oui"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "non",
										children: "Non"
									})
								]
							})] }),
							me?.gender === "homme" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium",
								children: "Accepte polygamie"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: acceptePolygamie,
								onChange: (e) => setAcceptePolygamie(e.target.value),
								className: "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Tous"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "oui",
										children: "Oui"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "non",
										children: "Non"
									})
								]
							})] })
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-2xl px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3",
					children: profiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/profil/$id",
						params: { id: p.id },
						className: "overflow-hidden rounded-xl border border-border bg-card",
						children: [photoUrls[p.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: photoUrls[p.id],
							alt: "",
							className: "aspect-square w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-square w-full bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-medium",
									children: [
										p.first_name,
										", ",
										p.age
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										p.city,
										" · ",
										islandLabel(p.island)
									]
								}),
								p.statut_matrimonial && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: p.statut_matrimonial
								})
							]
						})]
					}, p.id))
				}), profiles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-center text-sm text-muted-foreground",
					children: "Aucun profil pour le moment."
				})]
			})
		]
	});
}
//#endregion
export { HomePage as component };
