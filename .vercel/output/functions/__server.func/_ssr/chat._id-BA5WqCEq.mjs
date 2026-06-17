import { r as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-B98Drrw5.mjs";
import { D as ArrowLeft, l as Send } from "../_libs/lucide-react.mjs";
import { t as Route } from "./chat._id-BLWTts_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat._id-BA5WqCEq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChatPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [me, setMe] = (0, import_react.useState)(null);
	const [text, setText] = (0, import_react.useState)("");
	const [other, setOther] = (0, import_react.useState)(null);
	const [myGender, setMyGender] = (0, import_react.useState)(null);
	const [waliLink, setWaliLink] = (0, import_react.useState)(null);
	const [generatingLink, setGeneratingLink] = (0, import_react.useState)(false);
	const bottomRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let channel;
		let poll = null;
		(async () => {
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user) return;
			setMe(auth.user.id);
			const { data: myProf } = await supabase.from("profiles").select("gender").eq("id", auth.user.id).maybeSingle();
			setMyGender(myProf?.gender ?? null);
			const { data: conv } = await supabase.from("conversations").select("*").eq("id", id).maybeSingle();
			if (!conv) return;
			const otherId = conv.user_a === auth.user.id ? conv.user_b : conv.user_a;
			const { data: prof } = await supabase.from("profiles").select("id, first_name").eq("id", otherId).maybeSingle();
			setOther(prof);
			const { data } = await supabase.from("messages").select("*").eq("conversation_id", id).order("created_at");
			setMessages(data ?? []);
			await supabase.from("messages").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("conversation_id", id).neq("sender_id", auth.user.id).is("read_at", null);
			const { data: existingToken } = await supabase.from("wali_tokens").select("token").eq("conversation_id", id).maybeSingle();
			if (existingToken) setWaliLink(`${window.location.origin}/wali/${existingToken.token}`);
			channel = supabase.channel(`msg-${id}`).on("postgres_changes", {
				event: "INSERT",
				schema: "public",
				table: "messages",
				filter: `conversation_id=eq.${id}`
			}, (payload) => setMessages((m) => [...m, payload.new])).subscribe();
			poll = setInterval(async () => {
				const { data } = await supabase.from("messages").select("*").eq("conversation_id", id).order("created_at");
				setMessages(data ?? []);
				await supabase.from("messages").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("conversation_id", id).neq("sender_id", auth.user.id).is("read_at", null);
			}, 2e3);
		})();
		return () => {
			if (channel) supabase.removeChannel(channel);
			if (poll) clearInterval(poll);
		};
	}, [id]);
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	async function send(e) {
		e.preventDefault();
		if (!text.trim() || !me) return;
		const content = text.trim().slice(0, 2e3);
		setText("");
		await supabase.from("messages").insert({
			conversation_id: id,
			sender_id: me,
			body: content
		});
		await supabase.from("conversations").update({ updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
	}
	async function generateWaliLink() {
		setGeneratingLink(true);
		const { data } = await supabase.from("wali_tokens").insert({ conversation_id: id }).select("token").single();
		if (data) setWaliLink(`${window.location.origin}/wali/${data.token}`);
		setGeneratingLink(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => navigate({ to: "/conversations" }),
					className: "rounded-md p-1 hover:bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-lg",
					children: other?.first_name ?? "Conversation"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 overflow-y-auto px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-2xl space-y-2",
					children: [messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `flex ${m.sender_id === me ? "justify-end" : "justify-start"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.sender_id === me ? "bg-amber-800 text-amber-50 dark:bg-amber-900 dark:text-amber-50" : "bg-card border border-border text-foreground"}`,
							children: m.body
						})
					}, m.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })]
				})
			}),
			myGender === "femme" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border bg-background px-4 py-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-2xl",
					children: waliLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							readOnly: true,
							value: waliLink,
							className: "flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => navigator.clipboard.writeText(waliLink),
							className: "rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted",
							children: "Copier"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: generateWaliLink,
						disabled: generatingLink,
						className: "text-xs text-muted-foreground underline underline-offset-2 disabled:opacity-50",
						children: generatingLink ? "Génération…" : "Partager avec mon wali"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				onSubmit: send,
				className: "sticky bottom-0 border-t border-border bg-background p-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-2xl gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: text,
						onChange: (e) => setText(e.target.value),
						placeholder: "Message…",
						maxLength: 2e3,
						className: "flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm outline-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "rounded-full bg-primary p-2 text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
					})]
				})
			})
		]
	});
}
//#endregion
export { ChatPage as component };
