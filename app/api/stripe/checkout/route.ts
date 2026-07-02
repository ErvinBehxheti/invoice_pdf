import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.planTier === "pro") {
    return NextResponse.json({ error: "Already on Pro" }, { status: 400 });
  }

  const priceId = process.env.STRIPE_PRICE_ID_PRO_EUR;
  if (!priceId || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Billing is not configured yet" }, { status: 503 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: user.stripeCustomerId ?? undefined,
      customer_email: user.stripeCustomerId ? undefined : user.email,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/settings/billing?checkout=success`,
      cancel_url: `${appUrl}/settings/billing?checkout=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
