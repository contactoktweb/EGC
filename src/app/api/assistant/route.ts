import Anthropic from "@anthropic-ai/sdk";
import { getContent } from "@/lib/content";
import { ASSISTANT_MODEL, buildSystemPrompt, QUOTE_TOOL, type QuoteToolInput } from "@/lib/assistant";
import { createLead, isLeadStorageReady, isValidEmail, isValidPhone } from "@/lib/leads";

/**
 * Asistente de IA de la web (Claude).
 * - Responde preguntas con el contenido de Sanity (servicios, zonas, horario, preguntas frecuentes).
 * - Registra solicitudes de cotización en Sanity → "Solicitudes de cotización".
 * Requiere ANTHROPIC_API_KEY (y SANITY_API_WRITE_TOKEN para guardar las solicitudes).
 */

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 24;
const MAX_CHARS = 2000;
const MAX_TOOL_ROUNDS = 3;

// Límite simple por IP (por instancia del servidor): evita abusos y gastos inesperados.
const hits = new Map<string, number[]>();
function rateLimited(ip: string, max: number, windowMs: number, bucket: string) {
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

function parseMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) return null;
  const out: ChatMessage[] = [];
  for (const m of raw) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return null;
    const content = m.content.trim().slice(0, MAX_CHARS);
    if (content) out.push({ role: m.role, content });
  }
  // La API exige que la conversación empiece con el usuario y termine con su último mensaje.
  while (out.length && out[0].role !== "user") out.shift();
  if (!out.length || out[out.length - 1].role !== "user") return null;
  return out;
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ ok: false, error: "assistant_not_configured" }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip, 30, 10 * 60_000, "chat")) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: { messages?: unknown; lang?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const history = parseMessages(body.messages);
  if (!history) return Response.json({ ok: false, error: "invalid_messages" }, { status: 400 });
  const lang = body.lang === "es" ? "es" : "en";

  const content = await getContent();
  if (!content.settings.assistantEnabled) {
    return Response.json({ ok: false, error: "assistant_disabled" }, { status: 503 });
  }

  const client = new Anthropic();
  const messages: Anthropic.Beta.BetaMessageParam[] = history.map((m) => ({ role: m.role, content: m.content }));
  let quoteCreated = false;

  try {
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const response = await client.beta.messages.create({
        model: ASSISTANT_MODEL,
        max_tokens: 4000,
        // Chat de atención: esfuerzo bajo = respuestas rápidas y económicas.
        output_config: { effort: "low" },
        // Si el modelo rechaza una consulta por seguridad, la API la reintenta con el modelo recomendado.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        cache_control: { type: "ephemeral" },
        system: buildSystemPrompt(content),
        tools: [QUOTE_TOOL],
        messages,
      });

      if (response.stop_reason === "refusal") {
        return Response.json({ ok: false, error: "refusal" }, { status: 200 });
      }

      const toolUses = response.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
      if (response.stop_reason !== "tool_use" || toolUses.length === 0 || round === MAX_TOOL_ROUNDS) {
        const reply = response.content
          .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
          .map((b) => b.text)
          .join("\n")
          .trim();
        return Response.json({ ok: true, reply, quoteCreated });
      }

      messages.push({ role: "assistant", content: response.content });
      const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
      for (const tool of toolUses) {
        results.push({ type: "tool_result", tool_use_id: tool.id, ...(await runQuoteTool(tool, history, lang, ip)) });
        if (!results[results.length - 1].is_error && tool.name === QUOTE_TOOL.name) quoteCreated = true;
      }
      messages.push({ role: "user", content: results });
    }
    return Response.json({ ok: false, error: "no_reply" }, { status: 500 });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return Response.json({ ok: false, error: "busy" }, { status: 429 });
    }
    if (err instanceof Anthropic.APIError) {
      console.error(`assistant: error de la API (${err.status})`, err.message);
    } else {
      console.error("assistant: error", err);
    }
    return Response.json({ ok: false, error: "assistant_error" }, { status: 500 });
  }
}

/** Ejecuta la herramienta: valida los datos y guarda la solicitud en Sanity. */
async function runQuoteTool(
  tool: Anthropic.Beta.BetaToolUseBlock,
  history: ChatMessage[],
  lang: "en" | "es",
  ip: string,
): Promise<{ content: string; is_error?: boolean }> {
  if (tool.name !== QUOTE_TOOL.name) return { content: "Unknown tool.", is_error: true };
  const input = tool.input as Partial<QuoteToolInput>;
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const data = {
    name: str(input.name, 120),
    phone: str(input.phone, 40),
    email: str(input.email, 200),
    city: str(input.city, 80),
    service: str(input.service, 120),
    details: str(input.details, 4000),
  };

  const missing = Object.entries(data).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) return { content: `Missing fields: ${missing.join(", ")}. Ask the visitor for them.`, is_error: true };
  if (!isValidEmail(data.email)) return { content: "The email address looks invalid. Ask the visitor to check it.", is_error: true };
  if (!isValidPhone(data.phone)) return { content: "The phone number looks invalid. Ask the visitor to check it.", is_error: true };
  if (!isLeadStorageReady()) {
    return { content: "The request could not be saved right now. Ask the visitor to call the phone number or use the contact form.", is_error: true };
  }
  if (rateLimited(ip, 3, 60 * 60_000, "lead")) {
    return { content: "Too many requests from this visitor. Ask them to call the phone number instead.", is_error: true };
  }

  const transcript = history.map((m) => `${m.role === "user" ? "Cliente" : "Asistente"}: ${m.content}`).join("\n\n");
  try {
    await createLead({
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city,
      service: data.service,
      message: data.details,
      language: input.language === "es" || input.language === "en" ? input.language : lang,
      source: "assistant",
      transcript,
    });
    return { content: "Saved. The team will contact the visitor during business hours." };
  } catch (err) {
    console.error("assistant: no se pudo guardar la solicitud", err);
    return { content: "Saving failed. Ask the visitor to call the phone number or use the contact form.", is_error: true };
  }
}
