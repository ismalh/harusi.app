import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Send, Lock } from "lucide-react";

const DAILY_LIMIT = 10;

export const Route = createFileRoute("/_authenticated/chat/$id")({
  component: ChatPage,
});

function ChatPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [me, setMe] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [other, setOther] = useState<any>(null);
  const [myGender, setMyGender] = useState<string | null>(null);
  const [myPlan, setMyPlan] = useState<string>("free");
  const [messagesSentToday, setMessagesSentToday] = useState(0);
  const [waliLink, setWaliLink] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);

  // ✅ AJOUT
  const [warning, setWarning] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  const limitReached = myPlan === "free" && messagesSentToday >= DAILY_LIMIT;

  async function refreshDailyCount(userId: string) {
    const { data } = await (supabase as any).rpc("count_messages_today", { _user_id: userId });
    setMessagesSentToday((data as number) ?? 0);
  }

  useEffect(() => {
    let channel: any;
    let poll: ReturnType<typeof setInterval> | null = null;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      setMe(auth.user.id);

      const { data: myProf } = await supabase
        .from("profiles")
        .select("gender, plan")
        .eq("id", auth.user.id)
        .maybeSingle();
      setMyGender(myProf?.gender ?? null);
      setMyPlan(myProf?.plan ?? "free");

      await refreshDailyCount(auth.user.id);

      const { data: conv } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!conv) return;

      const otherId = conv.user_a === auth.user.id ? conv.user_b : conv.user_a;
      const { data: prof } = await supabase
        .from("profiles")
        .select("id, first_name")
        .eq("id", otherId)
        .maybeSingle();
      setOther(prof);

      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", id)
        .order("created_at");
      setMessages(msgs ?? []);

      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("conversation_id", id)
        .neq("sender_id", auth.user.id)
        .is("read_at", null);

      if (myProf?.gender === "femme") {
        const { data: existingToken } = await (supabase as any)
          .from("wali_tokens")
          .select("token")
          .eq("wali_user_id", auth.user.id)
          .eq("conversation_id", id)
          .maybeSingle();

        if (existingToken) {
          setWaliLink(`${window.location.origin}/wali/${existingToken.token}`);
        }
      }

      channel = supabase
        .channel(`msg-${id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${id}` },
          (payload) => setMessages((m) => [...m, payload.new])
        )
        .subscribe();

      poll = setInterval(async () => {
        const { data } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", id)
          .order("created_at");
        setMessages(data ?? []);

        await supabase
          .from("messages")
          .update({ read_at: new Date().toISOString() })
          .eq("conversation_id", id)
          .neq("sender_id", auth.user.id)
          .is("read_at", null);
      }, 2000);
    })();

    return () => {
      if (channel) supabase.removeChannel(channel);
      if (poll) clearInterval(poll);
    };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ REMPLACÉ
  async function send(e: React.FormEvent) {
    e.preventDefault();

    if (!text.trim() || !me || limitReached) return;

    const content = text.trim().slice(0, 2000);
    setWarning(null);

    const checkRes = await fetch(
      "https://bxhhotffzetzvmriciiy.supabase.co/functions/v1/check-message",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: me,
          conversationId: id,
          message: content,
        }),
      }
    );

    const check = await checkRes.json();

    if (!check.allowed) {
      setWarning(check.reason);
      return;
    }

    setText("");

    await supabase
      .from("messages")
      .insert({ conversation_id: id, sender_id: me, body: content });

    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", id);

    await refreshDailyCount(me);
  }

  async function generateWaliLink() {
    if (!me) return;
    setGeneratingLink(true);

    const { data } = await (supabase as any)
      .from("wali_tokens")
      .insert({ wali_user_id: me, conversation_id: id })
      .select("token")
      .single();

    if (data) {
      setWaliLink(`${window.location.origin}/wali/${data.token}`);
    }

    setGeneratingLink(false);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 flex items-center gap-2">
        <button onClick={() => navigate({ to: "/conversations" })} className="rounded-md p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-serif text-lg">{other?.first_name ?? "Conversation"}</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-3">
        <div className="mx-auto max-w-2xl space-y-2">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender_id === me ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.sender_id === me
                    ? "bg-amber-800 text-amber-50 dark:bg-amber-900 dark:text-amber-50"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                {m.body}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Lien wali */}
      {myGender === "femme" && (
        <div className="border-t border-border bg-background px-4 py-2">
          <div className="mx-auto max-w-2xl">
            {waliLink ? (
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={waliLink}
                  className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(waliLink)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted"
                >
                  Copier
                </button>
              </div>
            ) : (
              <button
                onClick={generateWaliLink}
                disabled={generatingLink}
                className="text-xs text-muted-foreground underline underline-offset-2 disabled:opacity-50"
              >
                {generatingLink ? "Génération…" : "Partager avec mon wali"}
              </button>
            )}
          </div>
        </div>
      )}

      {limitReached && (
        <div className="border-t border-amber-200 bg-amber-50 px-4 py-3">
          <div className="mx-auto flex max-w-2xl items-center gap-2 text-sm text-amber-800">
            <Lock className="h-4 w-4 shrink-0" />
            <p>
              Tu as atteint la limite de {DAILY_LIMIT} messages gratuits aujourd'hui.{" "}
              <button
                onClick={() => navigate({ to: "/parametres" })}
                className="font-medium underline underline-offset-2"
              >
                Passer en Premium
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ✅ AJOUT WARNING */}
      {warning && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-3">
          <div className="mx-auto max-w-2xl text-sm text-red-800">
            {warning}
          </div>
        </div>
      )}

      <form onSubmit={send} className="sticky bottom-0 border-t border-border bg-background p-2">
        <div className="mx-auto flex max-w-2xl gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={limitReached ? "Limite atteinte…" : "Message…"}
            maxLength={2000}
            disabled={limitReached}
            className="flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={limitReached}
            className="rounded-full bg-primary p-2 text-primary-foreground disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {myPlan === "free" && !limitReached && (
          <p className="mx-auto mt-1.5 max-w-2xl px-2 text-center text-xs text-muted-foreground">
            {messagesSentToday}/{DAILY_LIMIT} messages aujourd'hui
          </p>
        )}
      </form>
    </div>
  );
}