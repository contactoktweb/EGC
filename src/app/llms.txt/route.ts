import { getContent } from "@/lib/content";
import { findCounty } from "@/lib/content/helpers";
import { site } from "@/lib/site";

/**
 * /llms.txt — resumen en Markdown para asistentes y motores de IA (GEO).
 * Formato propuesto en https://llmstxt.org. Se genera con el contenido de Sanity.
 */
export async function GET() {
  const { settings: s, services, counties, cities, faqs } = await getContent();
  const u = site.url;
  const lines = [
    `# ${s.legalName}`,
    "",
    `> ${s.legalName} is a licensed Washington general contractor (WA Contractor Reg # ${s.contractorLicense}) with ${s.yearsExperience}+ years of experience, serving ${counties.map((c) => c.name.en).join(", ")} in Washington State. Services: ${services.map((x) => x.name.en.toLowerCase()).join("; ")}. Website available in English and Spanish.`,
    "",
    "## Contact",
    `- Phone: ${s.phoneDisplay} (${s.phoneE164})`,
    `- Email: ${s.email}`,
    s.contactName ? `- Contact person: ${s.contactName}` : "",
    `- Business hours: ${s.hoursText.en}`,
    `- Service area: ${s.serviceAreaText.en} — ${cities.map((c) => c.name).join(", ")}`,
    `- Free estimates: ${u}/en/contact`,
    "",
    "## Services",
    ...services.map((x) => `- [${x.name.en}](${u}/en/services/${x.slug}): ${x.short.en}`),
    "",
    "## Service areas",
    ...counties.map((c) => `- [${c.name.en}, WA](${u}/en/service-areas/${c.slug})`),
    ...cities.map((c) => `- [${c.name}, WA](${u}/en/service-areas/${c.slug}) — ${findCounty(counties, c.county)?.name.en ?? ""}`),
    "",
    "## FAQ",
    ...faqs.flatMap((f) => [`### ${f.q.en}`, f.a.en, ""]),
    "## Optional",
    `- [Project gallery](${u}/en/projects): photos of poured concrete, polished concrete and epoxy floors`,
    `- [About](${u}/en/about)`,
    `- [Privacy Policy](${u}/en/privacy)`,
    `- [Versión en español](${u}/es)`,
    "",
  ].filter((line, i, arr) => line !== "" || arr[i - 1] !== "");

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
