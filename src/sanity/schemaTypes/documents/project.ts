import { defineField, defineType } from "sanity";
import { PROJECT_CATEGORIES } from "./service";

/** PROYECTO de la galería: una foto, o un video con su foto de portada. */
export const project = defineType({
  name: "project",
  title: "Proyecto (galería)",
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: { list: PROJECT_CATEGORIES, layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Foto (o portada del video)",
      type: "image",
      options: { hotspot: true },
      description: "Sube la foto del trabajo terminado. Si el proyecto es un video, esta imagen se usa como portada.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "video",
      title: "Video (opcional)",
      type: "file",
      options: { accept: "video/mp4,video/webm,video/quicktime" },
      description: "MP4 recomendado, menos de 50 MB y de 15–60 segundos. Si subes un video, se reproduce al abrir el proyecto.",
    }),
    defineField({
      name: "alt",
      title: "Descripción",
      type: "localeString",
      description: 'Describe el trabajo (también es el texto alternativo). Ejemplo: "Stamped concrete patio with stone pattern" / "Patio de concreto estampado con patrón de piedra".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      description: "Los primeros 12 aparecen en la página de inicio.",
      validation: (r) => r.required().integer(),
    }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "alt.en", subtitle: "category", media: "image", video: "video.asset" },
    prepare: ({ title, subtitle, media, video }) => ({ title, subtitle: `${subtitle}${video ? " · video" : ""}`, media }),
  },
});
