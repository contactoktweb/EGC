import { services } from "@/content/services";
import { cities, counties, getCounty } from "@/content/cities";
import { generalFaqs } from "@/content/faqs";
import { site } from "@/lib/site";

/**
 * /llms.txt — resumen en Markdown para asistentes y motores de IA (GEO).
 * Formato propuesto en https://llmstxt.org
 */
export function GET() {
  const u = site.url;
  const lines = [
    `# ${site.legalName}`,
    "",
    `> ${site.legalName} is a licensed Washington general contractor (WA Contractor Reg # ${site.contractorLicense}) with ${site.yearsExperience}+ years of experience, serving Snohomish County, Skagit County and North King County in Washington State. Services: concrete construction and repair, concrete polishing and floor preparation, epoxy and protective floor coatings, asphalt, excavation and grading, pressure washing and property maintenance. Website available in English and Spanish.`,
    "",
    "## Contact",
    `- Phone: ${site.phoneDisplay} (${site.phoneE164})`,
    `- Email: ${site.email}`,
    `- Contact person: ${site.contactName}`,
    "- Business hours: Monday–Friday, 9:00 AM–5:00 PM Pacific Time",
    `- Service area: ${site.counties.join(", ")}, Washington — ${cities.map((c) => c.name).join(", ")}`,
    `- Free estimates: ${u}/en/contact`,
    "",
    "## Services",
    ...services.map((s) => `- [${s.name.en}](${u}/en/services/${s.slug}): ${s.short.en}`),
    "",
    "## Service areas",
    ...counties.map((c) => `- [${c.name.en}, WA](${u}/en/service-areas/${c.slug})`),
    ...cities.map((c) => `- [${c.name}, WA](${u}/en/service-areas/${c.slug}) — ${getCounty(c.county)!.name.en}`),
    "",
    "## FAQ",
    ...generalFaqs.flatMap((f) => [`### ${f.q.en}`, f.a.en, ""]),
    "## Optional",
    `- [Project gallery](${u}/en/projects): photos of poured concrete, polished concrete and epoxy floors`,
    `- [About](${u}/en/about)`,
    `- [Versión en español](${u}/es)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
