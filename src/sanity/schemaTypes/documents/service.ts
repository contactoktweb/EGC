import { defineArrayMember, defineField, defineType } from "sanity";

export const SERVICE_ICONS = [
  { title: "Concreto (casa)", value: "concrete" },
  { title: "Pulido (disco)", value: "polish" },
  { title: "Epoxy (capas)", value: "epoxy" },
  { title: "Asfalto (carretera)", value: "asphalt" },
  { title: "Excavación (máquina)", value: "excavation" },
  { title: "Lavado a presión", value: "washing" },
  { title: "Mantenimiento (llave)", value: "maintenance" },
];

export const PROJECT_CATEGORIES = [
  { title: "Vaciado de concreto (Pour concrete)", value: "pour" },
  { title: "Concreto pulido (Polishing)", value: "polish" },
  { title: "Epoxy", value: "epoxy" },
];

/** SERVICIO: cada uno tiene su página /services/[slug]. */
export const service = defineType({
  name: "service",
  title: "Servicio",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "localeString",
      description: 'Ejemplo: "Concrete Construction & Repair" / "Construcción y reparación de concreto".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "URL (slug)",
      type: "slug",
      options: { source: "name.en", maxLength: 80 },
      description: 'Parte final de la dirección, en inglés y sin espacios. Ejemplo: "concrete-construction-repair". Evita cambiarlo una vez publicado (afecta a Google).',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      description: "Posición en las listas (1 = primero).",
      validation: (r) => r.required().integer().min(1),
    }),
    defineField({
      name: "icon",
      title: "Icono",
      type: "string",
      options: { list: SERVICE_ICONS, layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "featured",
      title: "Nombre destacado (opcional)",
      type: "localeString",
      description: 'Solo para los servicios que aparecen en "Lo que mejor hacemos" y en la portada. Ejemplo: "Pour Concrete" / "Vaciado de concreto". Déjalo vacío si no es destacado.',
    }),
    defineField({
      name: "short",
      title: "Resumen corto",
      type: "localeText",
      description: 'Una línea para tarjetas. Ejemplo: "Driveways, patios, sidewalks, stairs, slabs, foundations and stamped decorative concrete."',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "intro",
      title: "Introducción (respuesta directa)",
      type: "localeText",
      description: 'Primer párrafo de la página. Di quién, qué y dónde en la primera frase. Ejemplo: "ECG Construction pours, replaces and repairs concrete for homes and businesses in Snohomish County…"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "items",
      title: "Lista de sub-servicios",
      type: "localeStringList",
      description: 'Ejemplo: "Concrete driveways, patios and sidewalks", "Stamped and decorative concrete"…',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Imagen principal",
      type: "image",
      options: { hotspot: true },
      description: "Foto horizontal del servicio (mínimo 1200 px de ancho).",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "imageAlt",
      title: "Texto alternativo de la imagen",
      type: "localeString",
      description: 'Describe la foto. Ejemplo: "Stamped concrete patio poured by ECG Construction".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "gallery",
      title: "Categoría de fotos a mostrar",
      type: "string",
      options: { list: PROJECT_CATEGORIES },
      description: "Muestra en la página del servicio los proyectos de esta categoría (opcional).",
    }),
    defineField({
      name: "faqs",
      title: "Preguntas frecuentes del servicio",
      type: "array",
      of: [defineArrayMember({ type: "faqItem" })],
    }),
    defineField({
      name: "related",
      title: "Servicios relacionados",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
      validation: (r) => r.unique(),
    }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name.en", subtitle: "name.es", media: "image", order: "order" },
    prepare: ({ title, subtitle, media, order }) => ({ title: `${order ?? "?"}. ${title}`, subtitle, media }),
  },
});
