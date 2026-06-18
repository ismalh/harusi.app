import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe((globalThis as any).Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-04-10",
});

const supabase = createClient(
  (globalThis as any).Deno.env.get("SUPABASE_URL")!,
  (globalThis as any).Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

(globalThis as any).Deno.serve(async (req: Request) => {
  const signature = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      (globalThis as any).Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch (err: any) {
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    const userId = session.client_reference_id;

    if (userId) {
      await supabase
        .from("profiles")
        .update({ plan: "premium" })
        .eq("id", userId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    if ((customer as any).email) {
      await supabase
        .from("profiles")
        .update({ plan: "free" })
        .eq("email", (customer as any).email);
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});