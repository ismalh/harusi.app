import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as ArrowLeft, t as X, w as Check } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/regles-D8nH306a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
var DO = [
	"Respecter chaque personne, quelle que soit son histoire",
	"Rechercher sincèrement le mariage",
	"Garder la pudeur dans les échanges (haya)",
	"Impliquer le wali dès que la conversation devient sérieuse",
	"Signaler tout comportement déplacé"
];
var DONT = [
	"Aucun harcèlement, insulte ou pression",
	"Aucun contenu sexuel, suggestif ou inapproprié",
	"Aucun faux profil ou usurpation d'identité",
	"Aucune arnaque, demande d'argent ou de coordonnées hors application",
	"Aucune relation hors cadre du mariage"
];
function ReglesPage() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-14 max-w-md items-center gap-2 px-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => navigate({ to: "/mon-profil" }),
					className: "rounded-full p-2 hover:bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-base",
					children: "Règles de la communauté"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-md space-y-4 px-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Harusi est un espace de mise en relation sérieuse pour le mariage islamique. Notre charte protège chaque membre."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-serif text-base text-emerald-700",
						children: "✓ Ce qu'on attend de toi"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: DO.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r })]
						}, r))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-serif text-base text-red-700",
						children: "✗ Ce qui est strictement interdit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: DONT.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mt-0.5 h-4 w-4 shrink-0 text-red-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r })]
						}, r))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "bg-amber-50 p-4 text-sm text-amber-900",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Sanctions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs",
						children: "Tout manquement peut entraîner une suspension temporaire ou un bannissement définitif, sans préavis."
					})]
				})
			]
		})]
	});
}
//#endregion
export { ReglesPage as component };
