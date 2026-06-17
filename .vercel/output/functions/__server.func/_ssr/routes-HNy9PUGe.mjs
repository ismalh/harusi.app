import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-B98Drrw5.mjs";
import { t as HarusiLogo } from "./HarusiLogo-CTRx2C9I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-HNy9PUGe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Splash() {
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (cancelled) return;
			if (data.user) navigate({ to: "/home" });
			else setTimeout(() => navigate({ to: "/connexion" }), 800);
		})();
		return () => {
			cancelled = true;
		};
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HarusiLogo, { size: "xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 font-serif italic text-foreground/70",
				children: "Avec sérieux, pudeur et intention."
			})]
		})
	});
}
//#endregion
export { Splash as component };
