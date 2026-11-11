import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

/**
 * Cliente con permiso de escritura (solo servidor). Lo usan el formulario y el asistente
 * para guardar las solicitudes de cotización en Sanity.
 * Requiere SANITY_API_WRITE_TOKEN (token con rol "Editor") en las variables del servidor.
 */
const token = process.env.SANITY_API_WRITE_TOKEN;

export const sanityWriteClient =
  isSanityConfigured && token
    ? createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" })
    : null;
