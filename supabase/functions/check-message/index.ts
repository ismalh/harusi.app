// supabase/functions/check-message/index.ts
// À appeler AVANT d'insérer un message dans "messages".
// Renvoie { allowed: true } si le message est clean,
// ou { allowed: false, reason: "..." } si bloqué (+ log en base).

import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// ⚠️ optionnel : clé Anthropic si tu veux la couche IA en plus de la regex
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

// --- Étape 1 : détection regex (rapide, gratuite) ---
const PATTERNS = [
  /\b0[\s.-]?[1-9]([\s.-]?\d{2}){4}\b/, // numéros français (06 12 34 56 78, variantes)
  /\b(?:\+33|0033)[\s.-]?[1-9]([\s.-]?\d{2}){4}\b/, // numéros +33
  /[\w.+-]+@[\w-]+\.[a-z]{2,}/i, // emails
  /\b(insta(gram)?|snap(chat)?|telegram|whatsapp|tiktok|fb|facebook)\b[\s:]*@?\w+/i,
  /\b(ajoute[\s-]?moi|dm[\s-]?moi|contacte[\s-]?moi)\b.*\b(insta|snap|whatsapp|telegram)\b/i,
  /@[a-z0-9_.]{3,}/i, // handles génériques type @pseudo
];

function regexFlag(text: string): boolean {
  return PATTERNS.some((p) => p.test(text));
}

// --- Étape 2 : couche IA pour les contournements malins (optionnelle) ---
async function aiFlag(text: string): Promise<boolean> {
  if (!ANTHROPIC_API_KEY) return false;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 10,
        messages: [
          {
            role: "user",
            content: `Message d'un utilisateur d'une app de rencontre : "${text}"

Ce message contient-il une tentative de partager un moyen de contact externe à la plateforme (numéro, réseau social, pseudo déguisé, lettres espacées pour contourner un filtre, etc) ? Réponds uniquement par "oui" ou "non".`,
          },
        ],
      }),
    });

    const data = await res.json();
    const answer = data.content?.[0]?.text?.toLowerCase().trim();
    return answer?.startsWith("oui") ?? false;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Erreur appel IA modération:", errorMessage);
    return false; // en cas d'erreur API, on ne bloque pas sur l'IA seule
  }
}

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, conversationId, message } = await req.json();

    if (!userId || !conversationId || !message) {
      throw new Error("userId, conversationId et message requis");
    }

    const isRegexFlagged = regexFlag(message);
    const isAiFlagged = !isRegexFlagged && (await aiFlag(message));

    if (isRegexFlagged || isAiFlagged) {
      await supabase.from("contact_violations").insert({
        user_id: userId,
        conversation_id: conversationId,
        attempted_message: message,
        detection_reason: isRegexFlagged ? "regex" : "ai",
      });

      return new Response(
        JSON.stringify({
          allowed: false,
          reason:
            "Ce message contient des informations de contact externes. Pour la sécurité de tous, les échanges doivent rester sur la plateforme.",
        }),
        { headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ allowed: true }), {
      headers: corsHeaders,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
});