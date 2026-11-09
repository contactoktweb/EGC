import { defineArrayMember, defineField, defineType } from "sanity";

/** CONDADO: tiene su propia página, p. ej. /service-areas/skagit. */
export const county = defineType({
  name: "county",
  title: "Condado",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "localeString",
      description: 'Ejemplo: "Skagit County" / "Condado de Skagit".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "URL (slug)",
      type: "slug",
      options: { source: "name.en" },
      description: 'Ejemplo: "skagit" → /service-areas/skagit.',
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Orden", type: "number", validation: (r) => r.required().integer() }),
    defineField({
      name: "schemaName",
      title: "Nombre para Google",
      type: "string",
      description: 'Ejemplo: "Skagit County, Washington".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "mapQuery",
      title: "Búsqueda del mapa",
      type: "string",
      description: 'Lugar que centra el mapa. Ejemplo: "Skagit County, WA".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "note",
      title: "Descripción del condado",
      type: "localeText",
      description: "2–3 frases con contexto local real (ciudades, tipo de propiedades).",
      validation: (r) => r.required(),
    }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name.en", subtitle: "slug.current" } },
});

/** CIUDAD: tiene su propia página, p. ej. /service-areas/mount-vernon. */
export const city = defineType({
  name: "city",
  title: "Ciudad",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      description: 'Igual en ambos idiomas. Ejemplo: "Mount Vernon".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "URL (slug)",
      type: "slug",
      options: { source: "name" },
      description: 'Ejemplo: "mount-vernon".',
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Orden", type: "number", validation: (r) => r.required().integer() }),
    defineField({
      name: "county",
      title: "Condado",
      type: "reference",
      to: [{ type: "county" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "note",
      title: "Descripción local",
      type: "localeText",
      description: 'Ejemplo: "Mount Vernon is the Skagit County seat; we help its homeowners and businesses with…"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "nearby",
      title: "Ciudades cercanas",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "city" }] })],
      validation: (r) => r.unique(),
    }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "county.name.en" } },
});
