import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!user.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account yet — subscribe first" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Billing is not configured yet" }, { status: 503 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/settings/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to open billing portal";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
