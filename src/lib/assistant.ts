import "server-only";
import type { SiteContent } from "./content/types";
import { contractorRegText } from "./content/helpers";

/**
 * Modelo del asistente (Google Gemini, plan gratuito de Google AI Studio).
 * Se puede cambiar sin tocar código con la variable GEMINI_MODEL.
 */
export const ASSISTANT_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

/** Instrucciones del asistente, armadas con el contenido actual de la web (Sanity). */
export function buildSystemPrompt(c: SiteContent): string {
  const s = c.settings;
  const services = c.services
    .map(
      (x) =>
        `- ${x.name.en} (${x.name.es}): ${x.short.en}\n  Includes: ${x.items.en.join("; ")}`,
    )
    .join("\n");
  const areas = c.counties
    .map((county) => {
      const cities = c.cities
        .filter((city) => city.county === county.slug)
        .map((city) => city.name);
      return `- ${county.name.en}: ${cities.join(", ")}`;
    })
    .join("\n");
  const faqs = c.faqs.map((f) => `Q: ${f.q.en}\nA: ${f.a.en}`).join("\n\n");

  return `You are the website assistant for ${s.legalName}, a construction company in Washington State. You talk with visitors on the company website, answer their questions and help them request a free estimate.

<company>
Name: ${s.legalName}
${contractorRegText(s)} (licensed Washington general contractor)
Experience: ${s.yearsExperience}+ years
Phone: ${s.phoneDisplay}
Email: ${s.email}
Business hours: ${s.hoursText.en}
Service area: ${s.serviceAreaText.en}
${areas}
Languages: English and Spanish
</company>

<services>
${services}
</services>

<faq>
${faqs}
</faq>

How to reply:
- Answer in the visitor's language (English or Spanish), in a warm, professional tone.
- Keep replies short: 1 to 4 sentences, or a short list when it truly helps. Plain text only, no markdown, headings or bold.
- Use only the information above. If you don't know something, say so and offer a free estimate or the phone number.
- Never quote prices, costs or exact timelines: every project needs an on-site free estimate. You may share the general ranges that the FAQ above states.
- If a location is outside the service area, say so kindly and give the phone number in case the team can help.
- Stay on topic (the company, its services and estimates). Politely decline unrelated requests.

Requesting a free estimate:
1. Collect: full name, phone, email, city, the service needed and a short description of the project (size, location, timeline).
2. Ask for missing details one or two at a time, never all at once.
3. Before saving, show a one-line summary and ask the visitor to confirm.
4. Only after they confirm, call create_quote_request once. Never call it with invented or placeholder data.
5. After it succeeds, tell them the team will contact them during business hours. They can also attach photos through the contact form on the website.`;
}

/** Herramienta (function calling de Gemini) para guardar la solicitud de estimado. */
export const QUOTE_TOOL = {
  name: "create_quote_request",
  description:
    "Saves a free-estimate request for the ECG Construction team, who will contact the visitor. Call it only after the visitor has given all fields and confirmed the summary.",
  parameters: {
    type: "object",
    properties: {
      name: { type: "string", description: "Visitor's full name" },
      phone: {
        type: "string",
        description: "Phone number as the visitor wrote it",
      },
      email: { type: "string", description: "Email address" },
      city: {
        type: "string",
        description: "City where the project is located",
      },
      service: {
        type: "string",
        description: "Service needed, e.g. Epoxy & Protective Floor Coatings",
      },
      details: {
        type: "string",
        description:
          "Project description: size, location, timeline and any notes",
      },
      language: {
        type: "string",
        enum: ["en", "es"],
        description: "Language of the conversation",
      },
    },
    required: [
      "name",
      "phone",
      "email",
      "city",
      "service",
      "details",
      "language",
    ],
  },
} as const;

export type QuoteToolInput = {
  name: string;
  phone: string;
  email: string;
  city: string;
  service: string;
  details: string;
  language: "en" | "es";
};
