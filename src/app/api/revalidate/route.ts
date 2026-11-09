import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CONTENT_TAG } from "@/lib/content";

/**
 * Webhook de Sanity: al publicar cualquier cambio, la web se actualiza en segundos.
 *
 * Configuración en sanity.io/manage → API → Webhooks → "Create webhook":
 *   URL:      https://TU-DOMINIO/api/revalidate
 *   Dataset:  production · Trigger on: Create, Update, Delete · Método: POST
 *   Secret:   el mismo valor que SANITY_REVALIDATE_SECRET
 * Sin webhook, el contenido igual se actualiza solo cada hora.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return Response.json({ ok: false, error: "SANITY_REVALIDATE_SECRET no configurado" }, { status: 500 });

  try {
    const { isValidSignature } = await parseBody(req, secret, true);
    if (!isValidSignature) return Response.json({ ok: false, error: "Firma inválida" }, { status: 401 });
    revalidateTag(CONTENT_TAG, "max");
    return Response.json({ ok: true, revalidated: CONTENT_TAG });
  } catch (err) {
    return Response.json({ ok: false, error: err instanceof Error ? err.message : "error" }, { status: 400 });
  }
}
