/**
 * Recibe el formulario de estimado.
 *
 * PENDIENTE (etapa final): enviar el correo con Resend.
 *   1. npm install resend
 *   2. Variables de entorno: RESEND_API_KEY, CONTACT_TO_EMAIL (Mane18882@gmail.com) y CONTACT_FROM_EMAIL
 *      (un remitente de un dominio verificado en Resend).
 *   3. Reemplazar el bloque marcado con TODO por:
 *        const resend = new Resend(process.env.RESEND_API_KEY);
 *        await resend.emails.send({ from, to, replyTo: data.email, subject, text });
 *
 * Mientras no esté configurado responde 503 y el formulario muestra el teléfono y el correo
 * para que el cliente no pierda la solicitud.
 */

type ContactPayload = {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  service?: string;
  message?: string;
  company?: string; // honeypot
  lang?: string;
};

const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Bots que llenan el campo oculto: respondemos OK sin hacer nada.
  if (clean(body.company)) return Response.json({ ok: true });

  const data = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 40),
    email: clean(body.email, 200),
    city: clean(body.city, 80),
    service: clean(body.service, 120),
    message: clean(body.message, 4000),
    lang: clean(body.lang, 5),
  };

  if (!data.name || !data.phone || !data.message) {
    return Response.json({ ok: false, error: "missing_fields" }, { status: 422 });
  }

  // TODO(Resend): enviar el correo aquí.
  if (!process.env.RESEND_API_KEY) {
    return Response.json({ ok: false, error: "email_not_configured" }, { status: 503 });
  }

  return Response.json({ ok: false, error: "email_not_implemented" }, { status: 501 });
}
