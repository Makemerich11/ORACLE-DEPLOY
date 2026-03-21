export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const body = await req.text();
    const sig = req.headers.get("stripe-signature") || "";
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
    } catch (err: any) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        console.log(`User ${session.client_reference_id} upgraded to tier ${session.metadata?.tierId}`);
        // TODO (Theo): update Supabase user tier here
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        console.log(`Subscription cancelled for user ${sub.metadata?.userId}`);
        // TODO (Theo): downgrade user to free tier in Supabase
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
