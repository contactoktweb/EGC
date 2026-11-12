import { getContent } from "@/lib/content";
import { isValidEmail } from "@/lib/leads";
import { isEmailReady, sendReviewEmail } from "@/lib/email";
import { sanityWriteClient } from "@/sanity/writeClient";

/**
 * Reseñas que dejan los clientes desde la web.
 * Se guardan en Sanity → Reseñas con estado "Pendiente": NO se publican hasta que el equipo
 * las apruebe en el panel. Se avisa por correo (Resend) al correo de notificaciones.
 * Requiere SANITY_API_WRITE_TOKEN.
 */

const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 3;
}

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Bots que llenan el campo oculto: respondemos OK sin guardar nada.
  if (str(body.company, 200)) return Response.json({ ok: true });

  const data = {
    author: str(body.name, 80),
    city: str(body.city, 80),
    email: str(body.email, 200),
    service: str(body.service, 120),
    text: str(body.text, 2000),
    rating: Math.round(Number(body.rating)),
    lang: body.lang === "es" ? "es" : "en",
  };
  if (
    !data.author ||
    data.text.length < 10 ||
    !(data.rating >= 1 && data.rating <= 5)
  ) {
    return Response.json(
      { ok: false, error: "missing_fields" },
      { status: 422 },
    );
  }
  if (data.email && !isValidEmail(data.email)) {
    return Response.json(
      { ok: false, error: "invalid_email" },
      { status: 422 },
    );
  }
  if (!sanityWriteClient) {
    return Response.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip))
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const content = await getContent();
  const service = content.services.find((s) => s.slug === data.service);
  const submittedAt = new Date();

  try {
    const serviceId = service
      ? await sanityWriteClient.fetch<string | null>(
          `*[_type == "service" && slug.current == $slug][0]._id`,
          { slug: service.slug },
        )
      : null;
    const doc = await sanityWriteClient.create({
      _type: "review",
      status: "pending",
      author: data.author,
      rating: data.rating,
      // Se guarda en su idioma original; si es español, también como texto principal (obligatorio).
      text: {
        _type: "localeText",
        en: data.text,
        ...(data.lang === "es" ? { es: data.text } : {}),
      },
      source: "Web",
      date: submittedAt.toISOString().slice(0, 10),
      city: data.city || undefined,
      email: data.email || undefined,
      submittedAt: submittedAt.toISOString(),
      order: 10,
      ...(serviceId
        ? { service: { _type: "reference", _ref: serviceId } }
        : {}),
    });

    if (isEmailReady()) {
      await sendReviewEmail(
        {
          id: doc._id,
          author: data.author,
          rating: data.rating,
          text: data.text,
          email: data.email || undefined,
          city: data.city || undefined,
          service: service?.name.es,
          submittedAt,
        },
        content.settings,
      );
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("reviews: no se pudo guardar la reseña", err);
    return Response.json({ ok: false, error: "save_failed" }, { status: 500 });
  }
}
