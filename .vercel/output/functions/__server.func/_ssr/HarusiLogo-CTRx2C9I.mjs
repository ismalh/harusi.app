import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/HarusiLogo-CTRx2C9I.js
var import_jsx_runtime = require_jsx_runtime();
var sizes = {
	sm: "text-xl",
	md: "text-3xl",
	lg: "text-5xl",
	xl: "text-7xl"
};
function HarusiLogo({ size = "md", className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `harusi-wordmark inline-flex items-baseline ${sizes[size]} ${className}`,
		children: [
			"H",
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "relative inline-block",
				children: ["A", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					"aria-hidden": true,
					viewBox: "0 0 40 12",
					className: "absolute left-1/2 -translate-x-1/2 top-[55%] w-[0.7em] h-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M2 8 Q 12 0, 22 6 T 38 4",
						stroke: "var(--color-gold)",
						strokeWidth: "2.2",
						strokeLinecap: "round",
						fill: "none"
					})
				})]
			}),
			"RUSI"
		]
	});
}
//#endregion
export { HarusiLogo as t };
