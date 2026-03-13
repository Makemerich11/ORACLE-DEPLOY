import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_ERROR_MESSAGES: Record<number, string> = {
  401: "Oracle API key is invalid or missing. Contact support.",
  402: "Anthropic API credit balance is exhausted. The Oracle needs a top-up — check your Anthropic billing at console.anthropic.com.",
  403: "Access denied by the Oracle API. Contact support.",
  429: "The Oracle is being asked too many questions at once. Please wait a moment and try again.",
  500: "Anthropic's servers hit an error. Try again in a moment.",
  529: "Anthropic's API is temporarily overloaded. The stars are busy — please try again shortly.",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, system } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: { message: "Invalid request: messages array required." } }, { status: 400 });
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 700,
        system,
        messages,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Pull the most useful error message we can find
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
