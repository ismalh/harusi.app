import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Send } from "lucide-react";

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
  const [waliLink, setWaliLink] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let channel: any;
    let poll: ReturnType<typeof setInterval> | null = null;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      setMe(auth.user.id);

      // Gender du user connecté
      const { data: myProf } = await supabase
        .from("profiles")
        .select("gender")
        .eq("id", auth.user.id)
        .maybeSingle();
      setMyGender(myProf?.gender ?? null);

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

      // Vérifier si token wali existe déjà pour cette conv
      const { data: existingToken } = await supabase
        .from("wali_tokens")
        .select("token")
        .eq("conversation_id", id)
        .maybeSingle();
      if (existingToken) {
        setWaliLink(`${window.location.origin}/wali/${existingToken.token}`);
      }

      channel = supabase
        .channel(`msg-${id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${id}`,
          },
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

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !me) return;
    const content = text.trim().slice(0, 2000);
    setText("");
    await supabase
      .from("messages")
      .insert({ conversation_id: id, sender_id: me, body: content });
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", id);
  }

  async function generateWaliLink() {
    setGeneratingLink(true);
    const { data } = await supabase
      .from("wali_tokens")
      .insert({ conversation_id: id })
      .select("token")
      .single();
    if (data) {
      const link = `${window.location.origin}/wali/${data.token}`;
      setWaliLink(link);
    }
    setGeneratingLink(false);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 flex items-center gap-2">
        <button
          onClick={() => navigate({ to: "/conversations" })}
          className="rounded-md p-1 hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-serif text-lg">{other?.first_name ?? "Conversation"}</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-3">
        <div className="mx-auto max-w-2xl space-y-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender_id === me ? "justify-end" : "justify-start"}`}
            >
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

      {/* Lien wali — femmes uniquement */}
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

      <form
        onSubmit={send}
        className="sticky bottom-0 border-t border-border bg-background p-2"
      >
        <div className="mx-auto flex max-w-2xl gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message…"
            maxLength={2000}
            className="flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-primary p-2 text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}