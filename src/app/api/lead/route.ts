import { NextResponse } from "next/server";

/**
 * Stores every lead so none is lost if the visitor closes WhatsApp before sending.
 * Forwards to LEAD_WEBHOOK_URL (n8n webhook, Google Apps Script → Sheet, Zapier…).
 * TODO(launch): set LEAD_WEBHOOK_URL in Vercel → Project → Settings → Environment Variables.
 */
const MAX = 300;
const clean = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, MAX) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: pretend success for bots.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const lead = {
    name: clean(body.name),
    business: clean(body.business),
    need: clean(body.need),
    budget: clean(body.budget),
    locale: clean(body.locale),
    location: clean(body.location),
    page: clean(body.page),
    userAgent: clean(request.headers.get("user-agent")),
    createdAt: new Date().toISOString(),
  };

  if (!lead.name || !lead.business || !lead.need) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 422 });
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    console.warn("[lead] LEAD_WEBHOOK_URL is not set. Lead logged only:", lead);
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.error("[lead] Failed to forward lead:", err, lead);
    return NextResponse.json({ ok: false, error: "webhook_failed" }, { status: 502 });
  }
}
