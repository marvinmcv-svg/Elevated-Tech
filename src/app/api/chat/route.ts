import Anthropic from "@anthropic-ai/sdk";
import { eliasSystemPrompt } from "@/lib/elias";

/**
 * El-IAs chat endpoint. Streams plain text back to the browser.
 *
 * Needs ANTHROPIC_API_KEY (server-only). Without it, returns 503 { unavailable: true } and the
 * widget falls back to WhatsApp, so the site never breaks.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-opus-5-5";
const MAX_TURNS = 24; // messages kept per conversation
const MAX_CHARS = 1500; // per user message

// Best-effort per-instance rate limit (serverless instances don't share memory; good enough to stop
// casual abuse; put a WAF/rate-limit rule in front for anything stronger).
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 30;
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

type ChatTurn = { role: "user" | "assistant"; content: string };

function parse(body: unknown): ChatTurn[] | null {
  if (!body || typeof body !== "object") return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const turns: ChatTurn[] = [];
  for (const m of raw.slice(-MAX_TURNS)) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, role === "user" ? MAX_CHARS : 6000);
    if (!text) continue;
    // merge accidental consecutive same-role turns
    const last = turns[turns.length - 1];
    if (last && last.role === role) last.content += `\n${text}`;
    else turns.push({ role, content: text });
  }
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return null;
  return turns;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ unavailable: true }, { status: 503 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (limited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  let turns: ChatTurn[] | null = null;
  try {
    turns = parse(await req.json());
  } catch {
    turns = null;
  }
  if (!turns) return Response.json({ error: "bad_request" }, { status: 400 });

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let wrote = false;
      try {
        const s = client.beta.messages.stream(
          {
            model: MODEL,
            max_tokens: 2048, // short receptionist replies; caps cost per answer
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            output_config: { effort: "low" }, // chat: fast and concise
            system: [{ type: "text", text: eliasSystemPrompt, cache_control: { type: "ephemeral" } }],
            messages: turns,
          },
          { signal: req.signal },
        );
        for await (const event of s) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            wrote = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await s.finalMessage();
        if (final.stop_reason === "refusal" && !wrote) {
          controller.enqueue(encoder.encode("__ELIAS_HANDOFF__"));
        }
      } catch (err) {
        if (err instanceof Anthropic.RateLimitError) {
          console.warn("[elias] rate limited by API");
        } else if (err instanceof Anthropic.APIError) {
          console.error(`[elias] API error ${err.status}:`, err.message);
        } else if (!(err instanceof Error && err.name === "AbortError")) {
          console.error("[elias] stream failed:", err);
        }
        if (!wrote) controller.enqueue(encoder.encode("__ELIAS_HANDOFF__"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
