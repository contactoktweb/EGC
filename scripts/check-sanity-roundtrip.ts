/**
 * Prueba de ida y vuelta (sin conexión): lo que sube `sanity:seed`, leído como lo devuelve
 * la consulta GROQ y convertido por la web, debe ser idéntico al contenido estático.
 *   npx tsx scripts/check-sanity-roundtrip.ts
 */
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= "test1234";

// Node no entiende `import foto from "./x.jpg"` (eso lo hace Next): se simula para la prueba.
for (const ext of [".jpg", ".png"]) {
  require.extensions[ext] = (m: NodeJS.Module, filename: string) => {
    m.exports = { __esModule: true, default: { src: filename, width: 1600, height: 1200, blurDataURL: "data:x" } };
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function run() {
  const { buildDocuments } = await import("./seed-sanity");
  const { mapSanityData } = await import("../src/lib/content/sanity");
  const { staticContent } = await import("../src/lib/content/static");

  const docs: any[] = await buildDocuments();
  const byId = new Map(docs.map((d) => [d._id, d]));
  const slugOf = (r: any) => byId.get(r._ref)?.slug?.current;
  const img = (i: any) => i && { asset: { _id: i.asset._ref, metadata: { lqip: "data:x", dimensions: { width: 1600, height: 1200 } } } };
  const ofType = (t: string) => docs.filter((d) => d._type === t).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const one = (id: string) => byId.get(id);

  const s = one("siteSettings");
  const h = one("homePage");
  const data = {
    settings: { ...s, logo: img(s.logo), logoSquare: img(s.logoSquare), ogImage: img(s.ogImage) },
    home: { ...h, heroImage: img(h.heroImage), aboutImage: img(h.aboutImage) },
    ui: one("uiTexts"),
    privacy: one("privacyPolicy"),
    services: ofType("service").map((d) => ({ ...d, slug: d.slug.current, image: img(d.image), related: d.related.map(slugOf) })),
    counties: ofType("county").map((d) => ({ ...d, slug: d.slug.current })),
    cities: ofType("city").map((d) => ({ ...d, slug: d.slug.current, county: slugOf(d.county), nearby: d.nearby.map(slugOf) })),
    projects: ofType("project").map((d) => ({ _id: d._id, category: d.category, alt: d.alt, image: img(d.image), video: null })),
    faqs: ofType("faq").map((d) => ({ question: d.question, answer: d.answer })),
  };

  const fromSanity = mapSanityData(data);
  const fromStatic = staticContent();
  const strip = (x: any) => JSON.parse(JSON.stringify(x, (k, v) => (["image", "logo", "logoSquare", "ogImage", "id"].includes(k) ? undefined : v)));

  let failed = 0;
  for (const part of ["dict", "services", "counties", "cities", "faqs", "privacy", "settings", "projects"] as const) {
    const a = JSON.stringify(strip(fromSanity[part]));
    const b = JSON.stringify(strip(fromStatic[part]));
    if (a === b) console.log(`✔ ${part}`);
    else {
      failed++;
      let i = 0;
      while (a[i] === b[i]) i++;
      console.log(`✖ ${part} difiere cerca de:\n  sanity: …${a.slice(Math.max(0, i - 80), i + 80)}\n  static: …${b.slice(Math.max(0, i - 80), i + 80)}`);
    }
  }
  const imgs = fromSanity.services[0].image.src;
  console.log(`\nEjemplo de URL de imagen desde el CDN: ${imgs}`);
  process.exit(failed ? 1 : 0);
}
run();
