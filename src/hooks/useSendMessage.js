// useSendMessage.js
// Hook à utiliser dans ton composant de chat pour envoyer un message
// en passant d'abord par le filtre anti-contact.

import { useState } from "react";
import { supabase } from "./supabaseClient"; // ⚠️ adapte le chemin

// ⚠️ remplace <projet> par la ref de ton projet Supabase
const CHECK_MESSAGE_URL =
  "https://supabase.com/dashboard/project/bxhhotffzetzvmriciiy";

export function useSendMessage({ userId, conversationId }) {
  const [warning, setWarning] = useState(null);
  const [sending, setSending] = useState(false);

  async function sendMessage(text) {
    setSending(true);
    setWarning(null);

    try {
      const checkRes = await fetch(CHECK_MESSAGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, conversationId, message: text }),
      });
      const check = await checkRes.json();

      if (!check.allowed) {
        setWarning(check.reason);
        setSending(false);
        return false; // message PAS envoyé
      }

      // ⚠️ adapte "messages" / "sender_id" / "content" à ton schéma réel
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
    sender_id: userId,
        body: text,
      });

      if (error) throw error;

      setSending(false);
      return true; // message envoyé
    } catch (err) {
      console.error("Erreur envoi message:", err.message);
      setSending(false);
      return false;
    }
  }

  return { sendMessage, warning, sending, clearWarning: () => setWarning(null) };
}