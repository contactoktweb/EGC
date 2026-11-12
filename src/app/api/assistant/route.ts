import { getContent } from "@/lib/content";
import {
  ASSISTANT_MODEL,
  buildSystemPrompt,
  QUOTE_TOOL,
  type QuoteToolInput,
} from "@/lib/assistant";
import {
  isLeadPipelineReady,
  isValidEmail,
  isValidPhone,
  submitLead,
} from "@/lib/leads";

/**
 * Asistente de IA de la web (Google Gemini, plan gratuito).
 * - Responde preguntas con el contenido de Sanity (servicios, zonas, horario, preguntas frecuentes).
 * - Registra solicitudes de cotización en Sanity → "Solicitudes de cotización".
 * Requiere GEMINI_API_KEY (Google AI Studio) y SANITY_API_WRITE_TOKEN / RESEND_API_KEY para guardar y avisar.
 */

type ChatMessage = { role: "user" | "assistant"; content: string };

/** Partes de un mensaje de Gemini (texto, llamada a función o su respuesta). */
type Part = {
  text?: string;
  thought?: boolean;
  functionCall?: { id?: string; name: string; args?: Record<string, unknown> };
  functionResponse?: {
    id?: string;
    name: string;
    response: Record<string, unknown>;
  };
  [k: string]: unknown;
};
type GeminiContent = { role: "user" | "model"; parts: Part[] };
type GeminiResponse = {
  candidates?: { content?: { parts?: Part[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
};

class GeminiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function generate(
  system: string,
  contents: GeminiContent[],
): Promise<GeminiResponse> {
  const res = await fetch(
    `${process.env.GEMINI_API_BASE || "https://generativelanguage.googleapis.com"}/v1beta/models/${encodeURIComponent(ASSISTANT_MODEL)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY ?? "",
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        tools: [{ functionDeclarations: [QUOTE_TOOL] }],
        generationConfig: { maxOutputTokens: 1200, temperature: 0.4 },
      }),
      signal: AbortSignal.timeout(30_000),
    },
  );
  if (!res.ok)
    throw new GeminiError(res.status, (await res.text()).slice(0, 500));
  return res.json();
}

const MAX_MESSAGES = 24;
const MAX_CHARS = 2000;
const MAX_TOOL_ROUNDS = 3;

// Límite simple por IP (por instancia del servidor): evita abusos y gastos inesperados.
const hits = new Map<string, number[]>();
function rateLimited(
  ip: string,
  max: number,
  windowMs: number,
  bucket: string,
) {
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

function parseMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES)
    return null;
  const out: ChatMessage[] = [];
  for (const m of raw) {
    if (
      !m ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string"
    )
      return null;
    const content = m.content.trim().slice(0, MAX_CHARS);
    if (content) out.push({ role: m.role, content });
  }
  // La API exige que la conversación empiece con el usuario y termine con su último mensaje.
  while (out.length && out[0].role !== "user") out.shift();
  if (!out.length || out[out.length - 1].role !== "user") return null;
  return out;
}

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { ok: false, error: "assistant_not_configured" },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
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
  if (!history)
    return Response.json(
      { ok: false, error: "invalid_messages" },
      { status: 400 },
    );
  const lang = body.lang === "es" ? "es" : "en";

  const content = await getContent();
  if (!content.settings.assistantEnabled) {
    return Response.json(
      { ok: false, error: "assistant_disabled" },
      { status: 503 },
    );
  }

  const system = buildSystemPrompt(content);
  const contents: GeminiContent[] = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  let quoteCreated = false;

  try {
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const response = await generate(system, contents);
      const candidate = response.candidates?.[0];
      if (
        !candidate ||
        response.promptFeedback?.blockReason ||
        candidate.finishReason === "SAFETY"
      ) {
        return Response.json({ ok: false, error: "refusal" }, { status: 200 });
      }

      const parts = candidate.content?.parts ?? [];
      const calls = parts.flatMap((p) =>
        p.functionCall ? [p.functionCall] : [],
      );
      if (calls.length === 0 || round === MAX_TOOL_ROUNDS) {
        const reply = parts
          .filter((p) => typeof p.text === "string" && !p.thought)
          .map((p) => p.text)
          .join("")
          .trim();
        if (!reply)
          return Response.json(
            { ok: false, error: "no_reply" },
            { status: 500 },
          );
        return Response.json({ ok: true, reply, quoteCreated });
      }

      // Se devuelve el turno del modelo tal cual (incluye sus firmas internas) y luego los resultados.
      contents.push({ role: "model", parts });
      const results: Part[] = [];
      for (const call of calls) {
        const result = await runQuoteTool(call, history, lang, ip);
        if (!result.is_error && call.name === QUOTE_TOOL.name)
          quoteCreated = true;
        results.push({
          functionResponse: {
            ...(call.id ? { id: call.id } : {}),
            name: call.name,
            response: result.is_error
              ? { error: result.content }
              : { result: result.content },
          },
        });
      }
      contents.push({ role: "user", parts: results });
    }
    return Response.json({ ok: false, error: "no_reply" }, { status: 500 });
  } catch (err) {
    if (err instanceof GeminiError) {
      // 429 = se agotó el límite gratuito (por minuto o del día).
      if (err.status === 429)
        return Response.json({ ok: false, error: "busy" }, { status: 429 });
      console.error(`assistant: error de Gemini (${err.status})`, err.message);
    } else {
      console.error("assistant: error", err);
    }
    return Response.json(
      { ok: false, error: "assistant_error" },
      { status: 500 },
    );
  }
}

/** Ejecuta la herramienta: valida los datos y guarda la solicitud en Sanity. */
async function runQuoteTool(
  tool: { name: string; args?: Record<string, unknown> },
  history: ChatMessage[],
  lang: "en" | "es",
  ip: string,
): Promise<{ content: string; is_error?: boolean }> {
  if (tool.name !== QUOTE_TOOL.name)
    return { content: "Unknown tool.", is_error: true };
  const input = (tool.args ?? {}) as Partial<QuoteToolInput>;
  const str = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";
  const data = {
    name: str(input.name, 120),
    phone: str(input.phone, 40),
    email: str(input.email, 200),
    city: str(input.city, 80),
    service: str(input.service, 120),
    details: str(input.details, 4000),
  };

  const missing = Object.entries(data)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length)
    return {
      content: `Missing fields: ${missing.join(", ")}. Ask the visitor for them.`,
      is_error: true,
    };
  if (!isValidEmail(data.email))
    return {
      content: "The email address looks invalid. Ask the visitor to check it.",
      is_error: true,
    };
  if (!isValidPhone(data.phone))
    return {
      content: "The phone number looks invalid. Ask the visitor to check it.",
      is_error: true,
    };
  if (!isLeadPipelineReady()) {
    return {
      content:
        "The request could not be saved right now. Ask the visitor to call the phone number or use the contact form.",
      is_error: true,
    };
  }
  if (rateLimited(ip, 3, 60 * 60_000, "lead")) {
    return {
      content:
        "Too many requests from this visitor. Ask them to call the phone number instead.",
      is_error: true,
    };
  }

  const transcript = history
    .map((m) => `${m.role === "user" ? "Cliente" : "Asistente"}: ${m.content}`)
    .join("\n\n");
  try {
    const result = await submitLead({
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city,
      service: data.service,
      message: data.details,
      language:
        input.language === "es" || input.language === "en"
          ? input.language
          : lang,
      source: "assistant",
      transcript,
    });
    if (!result.ok) throw new Error("lead_not_saved");
    return {
      content:
        "Saved. The team will contact the visitor during business hours.",
    };
  } catch (err) {
    console.error("assistant: no se pudo guardar la solicitud", err);
    return {
      content:
        "Saving failed. Ask the visitor to call the phone number or use the contact form.",
      is_error: true,
    };
  }
}
