import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

/** Cliente de lectura (contenido publicado). */
export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Sin CDN: Next ya cachea el contenido (getContent) y así, al publicar, el webhook
      // regenera la web con la versión recién guardada (el CDN de Sanity tarda unos segundos).
      useCdn: false,
      perspective: "published",
      token: process.env.SANITY_API_READ_TOKEN,
    })
  : null;
