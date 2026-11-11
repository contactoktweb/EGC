import { createLead, isAllowedPhoto, isLeadStorageReady, isValidEmail, isValidPhone, MAX_PHOTOS } from "@/lib/leads";

/**
 * Formulario de estimado.
 *
 * Guarda cada solicitud (con sus fotos) en Sanity → "Solicitudes de cotización", donde el equipo
 * le da seguimiento. Requiere SANITY_API_WRITE_TOKEN en el servidor.
 *
 * PENDIENTE (opcional): aviso por correo con Resend al recibir una solicitud.
 *   npm install resend · RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
 */

const clean = (v: FormDataEntryValue | null, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // Bots que llenan el campo oculto: respondemos OK sin guardar nada.
  if (clean(form.get("company"))) return Response.json({ ok: true });

  const data = {
    name: clean(form.get("name"), 120),
    phone: clean(form.get("phone"), 40),
    email: clean(form.get("email"), 200),
    city: clean(form.get("city"), 80),
    service: clean(form.get("service"), 120),
    message: clean(form.get("message"), 4000),
    language: clean(form.get("lang"), 5),
  };

  if (!data.name || !isValidPhone(data.phone) || !isValidEmail(data.email) || !data.message) {
    return Response.json({ ok: false, error: "missing_fields" }, { status: 422 });
  }

  const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_PHOTOS || files.some((f) => !isAllowedPhoto(f))) {
    return Response.json({ ok: false, error: "invalid_photos" }, { status: 422 });
  }

  if (!isLeadStorageReady()) {
    return Response.json({ ok: false, error: "lead_storage_not_configured" }, { status: 503 });
  }

  try {
    const photos = await Promise.all(
      files.map(async (f) => ({ data: Buffer.from(await f.arrayBuffer()), filename: f.name, contentType: f.type })),
    );
    await createLead({ ...data, source: "form", photos });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("contact: no se pudo guardar la solicitud", err);
    return Response.json({ ok: false, error: "save_failed" }, { status: 500 });
  }
}
