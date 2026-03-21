export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

const PRICE_MAP: Record<string, string> = {
  "1": process.env.STRIPE_PRICE_BASIC || "",
  "2": process.env.STRIPE_PRICE_PLUS  || "",
  "3": process.env.STRIPE_PRICE_PRO   || "",
  "4": process.env.STRIPE_PRICE_PROPLUS || "",
};
const TIER_NAMES: Record<string, string> = {
  "1":"Basic","2":"Plus","3":"Pro","4":"Pro+",
};

export async function POST(req: NextRequest) {
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const { tierId, userId, email } = await req.json();
    if (!tierId || !PRICE_MAP[tierId]) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    const priceId = PRICE_MAP[tierId];
    if (!priceId) return NextResponse.json({ error: "Price not configured" }, { status: 500 });
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://myoracle.me";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      ...(email && { customer_email: email }),
      client_reference_id: userId || undefined,
      metadata: { tierId, tierName: TIER_NAMES[tierId] },
      success_url: `${baseUrl}/oracle?upgraded=${TIER_NAMES[tierId]}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/oracle?cancelled=true`,
      subscription_data: { metadata: { tierId, userId: userId || "" } },
      allow_promotion_codes: true,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create checkout" }, { status: 500 });
  }
}
