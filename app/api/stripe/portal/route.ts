export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const { customerId } = await req.json();
    if (!customerId) return NextResponse.json({ error: "Customer ID required" }, { status: 400 });
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://myoracle.me";
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/oracle`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create portal" }, { status: 500 });
  }
}
