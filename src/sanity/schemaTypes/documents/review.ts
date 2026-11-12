import { defineField, defineType } from "sanity";

/**
 * RESEÑA de un cliente real. Se muestran en Inicio, Nosotros y en la página del servicio.
 * - Las que deja el cliente desde la web llegan como "Pendiente" y solo se publican al aprobarlas.
 * - Las que agrega el equipo (copiadas de Google, Facebook…) quedan "Aprobada" por defecto.
 */
export const review = defineType({
  name: "review",
  title: "Reseña",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      description:
        'Solo las reseñas "Aprobada" se ven en la web. Las que llegan desde la web empiezan como "Pendiente": léela y cámbiala a Aprobada o Rechazada.',
      options: {
        list: [
          { title: "⏳ Pendiente de aprobación", value: "pending" },
          { title: "✅ Aprobada (se ve en la web)", value: "approved" },
          { title: "⛔ Rechazada (no se muestra)", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "approved",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      title: "Nombre del cliente",
      type: "string",
      description:
        'Como aparece en la reseña. Ejemplo: "Maria G." o "John Smith".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "rating",
      title: "Estrellas (1 a 5)",
      type: "number",
      options: {
        list: [5, 4, 3, 2, 1],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: 5,
      validation: (r) => r.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "text",
      title: "Texto de la reseña",
      type: "localeText",
      description:
        "Copia el texto tal como lo escribió el cliente, en su idioma original. La traducción es opcional; si la dejas vacía se muestra el original.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "source",
      title: "Dónde la publicó",
      type: "string",
      options: {
        list: [
          "Google",
          "Facebook",
          "Yelp",
          "Nextdoor",
          "Angi",
          "Web",
          "Directa",
        ],
        layout: "radio",
      },
      description: '"Web" = la dejó el cliente desde el formulario de la web.',
      initialValue: "Google",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      title: "Fecha de la reseña",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
    }),
    defineField({
      name: "link",
      title: "Enlace a la reseña (opcional)",
      type: "url",
      description:
        "Si la reseña está publicada en Google u otro sitio, pega aquí su enlace.",
    }),
    defineField({
      name: "service",
      title: "Servicio (opcional)",
      type: "reference",
      to: [{ type: "service" }],
      description:
        "El trabajo que se hizo. Si se elige, la reseña también aparece en la página de ese servicio.",
    }),
    defineField({
      name: "email",
      title: "Correo del cliente (privado)",
      type: "string",
      description:
        "Solo para el equipo, nunca se muestra en la web. Ejemplo: cliente@gmail.com",
    }),
    defineField({
      name: "city",
      title: "Ciudad (opcional)",
      type: "string",
      description: 'Se muestra junto al nombre. Ejemplo: "Everett".',
    }),
    defineField({
      name: "submittedAt",
      title: "Recibida desde la web",
      type: "datetime",
      readOnly: true,
      hidden: ({ document }) => !document?.submittedAt,
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      description: "Las de número más bajo salen primero.",
      initialValue: 10,
    }),
  ],
  orderings: [
    {
      title: "Orden",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Más recientes",
      name: "dateDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "author",
      rating: "rating",
      source: "source",
      subtitle: "text.en",
      status: "status",
    },
    prepare: ({ title, rating, source, subtitle, status }) => ({
      title: `${status === "pending" ? "⏳ " : status === "rejected" ? "⛔ " : ""}${"★".repeat(rating ?? 0)} ${title}`,
      subtitle: `${source ?? ""} · ${subtitle ?? ""}`,
    }),
  },
});
