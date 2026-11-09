import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

/** Cliente de lectura (contenido publicado). */
export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: !process.env.SANITY_API_READ_TOKEN,
      perspective: "published",
      token: process.env.SANITY_API_READ_TOKEN,
    })
  : null;
