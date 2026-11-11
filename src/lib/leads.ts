import "server-only";
import { sanityWriteClient } from "@/sanity/writeClient";
import { getContent } from "@/lib/content";
import { isEmailReady, sendLeadEmails } from "@/lib/email";

export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  city?: string;
  service?: string;
  message: string;
  language?: string;
  source: "form" | "assistant";
  transcript?: string;
  photos?: { data: Buffer; filename: string; contentType: string }[];
};

export const MAX_PHOTOS = 5;
export const MAX_PHOTO_BYTES = 6 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export const isLeadStorageReady = () => sanityWriteClient !== null;

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isValidPhone = (v: string) => v.replace(/\D/g, "").length >= 7;

export function isAllowedPhoto(file: { size: number; type: string }) {
  return file.size > 0 && file.size <= MAX_PHOTO_BYTES && PHOTO_TYPES.includes(file.type);
}

/**
 * Guarda una solicitud de cotización en Sanity (Solicitudes de cotización), con sus fotos.
 * Devuelve el id del documento y los enlaces públicos de las fotos.
 */
export async function createLead(input: LeadInput, submittedAt: Date): Promise<{ id: string; photoUrls: string[] }> {
  if (!sanityWriteClient) throw new Error("lead_storage_not_configured");

  const photos = [];
  const photoUrls: string[] = [];
  for (const [i, p] of (input.photos ?? []).slice(0, MAX_PHOTOS).entries()) {
    const asset = await sanityWriteClient.assets.upload("image", p.data, {
      filename: p.filename || `foto-${i + 1}.jpg`,
      contentType: p.contentType,
    });
    photos.push({ _type: "image", _key: `p${i}`, asset: { _type: "reference", _ref: asset._id } });
    photoUrls.push(asset.url);
  }

  const doc = await sanityWriteClient.create({
    _type: "lead",
    status: "new",
    name: input.name,
    phone: input.phone,
    email: input.email,
    city: input.city || undefined,
    service: input.service || undefined,
    message: input.message,
    language: input.language || undefined,
    source: input.source,
    transcript: input.transcript || undefined,
    submittedAt: submittedAt.toISOString(),
    ...(photos.length ? { photos } : {}),
  });
  return { id: doc._id, photoUrls };
}

/** Hay al menos un destino para la solicitud: el panel (Sanity) o el correo (Resend). */
export const isLeadPipelineReady = () => isLeadStorageReady() || isEmailReady();

/**
 * Procesa una solicitud nueva: la guarda en Sanity y avisa por correo (Resend) al equipo,
 * con confirmación al cliente. Es correcta si al menos una de las dos cosas salió bien.
 */
export async function submitLead(input: LeadInput): Promise<{ ok: boolean; saved: boolean; notified: boolean }> {
  const submittedAt = new Date();
  let saved: { id: string; photoUrls: string[] } | null = null;

  if (isLeadStorageReady()) {
    try {
      saved = await createLead(input, submittedAt);
    } catch (err) {
      console.error("leads: no se pudo guardar en Sanity", err);
    }
  }

  let notified = false;
  if (isEmailReady()) {
    const { settings } = await getContent();
    notified = await sendLeadEmails(
      {
        id: saved?.id,
        name: input.name,
        phone: input.phone,
        email: input.email,
        city: input.city,
        service: input.service,
        message: input.message,
        language: input.language,
        source: input.source,
        transcript: input.transcript,
        submittedAt,
        photoUrls: saved?.photoUrls,
        // Si no se pudo guardar, las fotos viajan adjuntas para no perderlas.
        photoFiles: saved ? undefined : input.photos,
      },
      settings,
    );
  }

  return { ok: Boolean(saved) || notified, saved: Boolean(saved), notified };
}
