import "server-only";
import { sanityWriteClient } from "@/sanity/writeClient";

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
 * Devuelve el id del documento creado.
 */
export async function createLead(input: LeadInput): Promise<string> {
  if (!sanityWriteClient) throw new Error("lead_storage_not_configured");

  const photos = [];
  for (const [i, p] of (input.photos ?? []).slice(0, MAX_PHOTOS).entries()) {
    const asset = await sanityWriteClient.assets.upload("image", p.data, {
      filename: p.filename || `foto-${i + 1}.jpg`,
      contentType: p.contentType,
    });
    photos.push({ _type: "image", _key: `p${i}`, asset: { _type: "reference", _ref: asset._id } });
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
    submittedAt: new Date().toISOString(),
    ...(photos.length ? { photos } : {}),
  });
  return doc._id;
}
