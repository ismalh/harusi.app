import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe((globalThis as any).Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-04-10",
});

(globalThis as any).Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  try {
    const { user_id, email } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: "price_1TjcZaGWOjUdDwZYbS3IFnFm", quantity: 1 }],
      success_url: `${req.headers.get("origin")}/parametres?success=true`,
      cancel_url: `${req.headers.get("origin")}/parametres?canceled=true`,
      client_reference_id: user_id,
      customer_email: email,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});