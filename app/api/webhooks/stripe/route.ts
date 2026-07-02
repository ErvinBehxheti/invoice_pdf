import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency: Stripe retries deliveries on timeout/failure, so the same
  // event.id can arrive more than once. Recording it first and skipping on
  // a duplicate insert avoids reprocessing — this insert-as-lock approach
  // has no race window, unlike a separate find-then-create check.
  try {
    await db.stripeEvent.create({ data: { eventId: event.id } });
  } catch (error) {
    const isDuplicate =
      error instanceof Error && "code" in error && error.code === "P2002";
    if (isDuplicate) {
      return NextResponse.json({ received: true, duplicate: true });
    }
    throw error;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const customerId = session.customer as string | null;
      const subscriptionId = session.subscription as string | null;
      if (userId && customerId) {
        await db.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            planTier: "pro",
            subscriptionStatus: "active",
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const isActive = subscription.status === "active" || subscription.status === "trialing";
      await db.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          subscriptionStatus: subscription.status,
          stripeSubscriptionId: subscription.id,
          planTier: isActive ? "pro" : "free",
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      await db.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          planTier: "free",
          subscriptionStatus: "canceled",
        },
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      await db.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { subscriptionStatus: "past_due" },
      });
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
