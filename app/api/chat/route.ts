import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limit: 20 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

const ANTHROPIC_ERROR_MESSAGES: Record<number, string> = {
  401: "Oracle API key is invalid or missing. Contact support.",
  402: "Anthropic API credit balance is exhausted. The Oracle needs a top-up.",
  403: "Access denied by the Oracle API. Contact support.",
  429: "The Oracle is being asked too many questions at once. Please wait a moment and try again.",
  500: "Anthropic's servers hit an error. Try again in a moment.",
  529: "Anthropic's API is temporarily overloaded. The stars are busy — please try again shortly.",
};

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: { message: "Too many requests. Please wait a minute before asking again." } },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { messages, system } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: { message: "Invalid request: messages array required." } },
        { status: 400 }
      );
    }

    // Limit message history to last 10 to control token usage
    const trimmedMessages = messages.slice(-10);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system,
        messages: trimmedMessages,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const apiMsg =
        data?.error?.message ||
        data?.message ||
        ANTHROPIC_ERROR_MESSAGES[res.status] ||
        `Anthropic API error (status ${res.status})`;

      const friendlyMsg = ANTHROPIC_ERROR_MESSAGES[res.status] || apiMsg;

      return NextResponse.json(
        { error: { message: friendlyMsg, status: res.status, detail: apiMsg } },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: { message: `Server error: ${err?.message || "Unknown error"}` } },
      { status: 500 }
    );
  }
}
