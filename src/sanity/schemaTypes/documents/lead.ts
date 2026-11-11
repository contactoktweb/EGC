import { defineArrayMember, defineField, defineType } from "sanity";

export const LEAD_STATUSES = [
  { title: "🆕 Nueva", value: "new" },
  { title: "📞 Contactado", value: "contacted" },
  { title: "📝 Cotización enviada", value: "quoted" },
  { title: "✅ Ganado", value: "won" },
  { title: "❌ Perdido", value: "lost" },
];

/**
 * SOLICITUD DE COTIZACIÓN: la crea la web (formulario o asistente de IA).
 * El equipo actualiza el estado y agrega notas para dar seguimiento al cliente.
 */
export const lead = defineType({
  name: "lead",
  title: "Solicitud de cotización",
  type: "document",
  groups: [
    { name: "client", title: "Cliente", default: true },
    { name: "followup", title: "Seguimiento" },
  ],
  fields: [
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      group: "followup",
      options: { list: LEAD_STATUSES, layout: "radio" },
      initialValue: "new",
    }),
    defineField({
      name: "notes",
      title: "Notas internas",
      type: "text",
      rows: 4,
      group: "followup",
      description: 'Solo las ve el equipo. Ejemplo: "Llamé el lunes, visita el jueves 10 a. m."',
    }),
    defineField({ name: "name", title: "Nombre", type: "string", group: "client", readOnly: true }),
    defineField({ name: "phone", title: "Teléfono", type: "string", group: "client", readOnly: true }),
    defineField({ name: "email", title: "Correo", type: "string", group: "client", readOnly: true }),
    defineField({ name: "city", title: "Ciudad", type: "string", group: "client", readOnly: true }),
    defineField({ name: "service", title: "Servicio", type: "string", group: "client", readOnly: true }),
    defineField({ name: "message", title: "Detalles del proyecto", type: "text", rows: 5, group: "client", readOnly: true }),
    defineField({
      name: "photos",
      title: "Fotos enviadas por el cliente",
      type: "array",
      group: "client",
      of: [defineArrayMember({ type: "image" })],
      readOnly: true,
    }),
    defineField({
      name: "source",
      title: "Origen",
      type: "string",
      group: "client",
      options: {
        list: [
          { title: "Formulario de la web", value: "form" },
          { title: "Asistente de IA", value: "assistant" },
        ],
      },
      readOnly: true,
    }),
    defineField({ name: "language", title: "Idioma del cliente", type: "string", group: "client", readOnly: true }),
    defineField({ name: "submittedAt", title: "Fecha de la solicitud", type: "datetime", group: "client", readOnly: true }),
    defineField({
      name: "transcript",
      title: "Conversación con el asistente",
      type: "text",
      rows: 10,
      group: "client",
      readOnly: true,
      hidden: ({ document }) => !document?.transcript,
    }),
  ],
  orderings: [{ title: "Más recientes", name: "dateDesc", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: {
    select: { name: "name", service: "service", city: "city", status: "status", date: "submittedAt", media: "photos.0" },
    prepare: ({ name, service, city, status, date, media }) => {
      const label = LEAD_STATUSES.find((s) => s.value === status)?.title ?? "🆕 Nueva";
      const when = date ? new Date(date).toLocaleDateString("es-US") : "";
      return { title: `${label} · ${name ?? "Sin nombre"}`, subtitle: [service, city, when].filter(Boolean).join(" · "), media };
    },
  },
});
