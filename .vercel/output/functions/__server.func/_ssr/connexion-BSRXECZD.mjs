import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-B98Drrw5.mjs";
import { D as ArrowLeft, f as Mail, g as KeyRound } from "../_libs/lucide-react.mjs";
import { t as HarusiLogo } from "./HarusiLogo-CTRx2C9I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/connexion-BSRXECZD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ConnexionPage() {
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)("email");
	const [email, setEmail] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function ask(e) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const { error: err } = await supabase.auth.signInWithOtp({
				email: email.trim().toLowerCase(),
				options: { shouldCreateUser: true }
			});
			if (err) throw err;
			setStep("code");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur");
		} finally {
			setLoading(false);
		}
	}
	async function verify(e) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const { error: err } = await supabase.auth.verifyOtp({
				email: email.trim().toLowerCase(),
				token: code,
				type: "email"
			});
			if (err) throw err;
			await supabase.from("profiles").update({ last_login_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("email", email.trim().toLowerCase());
			navigate({ to: "/home" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Code incorrect ou expiré");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HarusiLogo, { size: "lg" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-serif text-2xl",
						children: step === "email" ? "Se connecter" : "Entre ton code"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: step === "email" ? "Entre ton email, un code à 6 chiffres te sera envoyé." : `Code envoyé à ${email}.`
					})
				]
			}), step === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: ask,
				className: "space-y-3 rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mb-1 flex items-center gap-1.5 text-sm font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }), " Email"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "email",
							autoFocus: true,
							autoComplete: "email",
							placeholder: "ton@email.com",
							className: "w-full rounded-lg border border-border bg-background px-3 py-3 outline-none focus:ring-2 focus:ring-primary/30",
							value: email,
							onChange: (e) => setEmail(e.target.value)
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: loading,
						className: "w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground disabled:opacity-50",
						children: loading ? "Envoi…" : "Recevoir un code"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-xs text-muted-foreground",
						children: "Pas encore inscrit ? Ton compte sera créé automatiquement."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: verify,
				className: "space-y-3 rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mb-1 flex items-center gap-1.5 text-sm font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-3.5 w-3.5" }), " Code à 6 chiffres"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							inputMode: "numeric",
							maxLength: 6,
							pattern: "\\d{6}",
							autoFocus: true,
							placeholder: "------",
							className: "w-full rounded-lg border border-border bg-background px-3 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-primary/30",
							value: code,
							onChange: (e) => setCode(e.target.value.replace(/\D/g, ""))
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: loading || code.length !== 6,
						className: "w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground disabled:opacity-50",
						children: loading ? "Vérification…" : "Valider"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setStep("email");
							setCode("");
							setError(null);
						},
						className: "inline-flex w-full items-center justify-center gap-1 text-center text-xs text-muted-foreground hover:underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), " Changer d'email"]
					})
				]
			})]
		})
	});
}
//#endregion
export { ConnexionPage as component };
