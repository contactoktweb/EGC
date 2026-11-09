/**
 * SUBIDA COMPLETA DE CONTENIDO A SANITY
 * =====================================
 * Sube a Sanity toda la información de la web (textos EN/ES, servicios, condados, ciudades,
 * proyectos, preguntas frecuentes, política de privacidad, configuración general) y todas las
 * fotos/videos. Después de ejecutarlo, la web deja de usar el contenido estático y lee todo
 * desde Sanity.
 *
 * Uso:
 *   npm run sanity:seed              → sube / actualiza todo
 *   npm run sanity:seed -- --dry-run → muestra qué se subiría, sin escribir nada
 *   npm run sanity:seed -- --prune   → además borra servicios, ciudades, etc. que ya no existan aquí
 *
 * Requiere en .env.local:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET y SANITY_API_WRITE_TOKEN
 *   (token con permiso "Editor": sanity.io/manage → API → Tokens → Add API token).
 *
 * Es seguro ejecutarlo varias veces: los documentos tienen IDs fijos (createOrReplace) y Sanity
 * no duplica imágenes idénticas. OJO: sobrescribe los cambios hechos a mano en el Studio para
 * los documentos que sube; úsalo para la carga inicial o para restaurar el contenido.
 */
import { createHash } from "node:crypto";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { createClient, type SanityClient } from "@sanity/client";
import { dictionaries } from "../src/content/dictionary";
import { serviceData } from "../src/content/services";
import { projectData } from "../src/content/projects";
import { cities, counties } from "../src/content/cities";
import { generalFaqs } from "../src/content/faqs";
import { privacy } from "../src/content/privacy";
import { settingsData } from "../src/content/settings";
import { homeImages } from "../src/content/home";
import { EXCLUDED_KEYS, HOME_GROUPS, TUPLES, UI_GROUPS, isLongText } from "../src/sanity/dictionary-map";
import type { L, LList } from "../src/lib/i18n";

/* ------------------------------------------------------------------ */
/* Configuración                                                       */
/* ------------------------------------------------------------------ */

try {
  process.loadEnvFile(".env.local");
} catch {
  /* sin .env.local: se usan las variables del entorno */
}

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run") || !process.argv[1]?.endsWith("seed-sanity.ts");
const PRUNE = args.has("--prune");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN ?? "";

const ROOT = process.cwd();
const IMAGES_DIR = path.join(ROOT, "src/content/images");
const VIDEOS_DIR = path.join(ROOT, "public/videos");

if (!DRY_RUN && (!projectId || !token)) {
  console.error(
    "\n✖ Faltan claves. Agrega en .env.local:\n" +
      "  NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx\n" +
      "  NEXT_PUBLIC_SANITY_DATASET=production\n" +
      "  SANITY_API_WRITE_TOKEN=sk...   (token con rol Editor)\n" +
      "O prueba primero con: npm run sanity:seed -- --dry-run\n",
  );
  process.exit(1);
}

const client: SanityClient | null = DRY_RUN
  ? null
  : createClient({ projectId, dataset, token, apiVersion: "2026-11-01", useCdn: false });

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

type Doc = { _id: string; _type: string; [key: string]: unknown };
let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36).padStart(4, "0")}`;
const ref = (id: string) => ({ _type: "reference", _ref: id, _key: key() });
const ls = ({ en, es }: L) => ({ _type: "localeString", en, es });
const lt = ({ en, es }: L) => ({ _type: "localeText", en, es });
const ll = ({ en, es }: LList) => ({ _type: "localeStringList", en, es });

const uploaded = new Map<string, string>();

/** En simulación, un ID con el mismo formato que los de Sanity (image-<hash>-<ancho>x<alto>-<ext>). */
function fakeAssetId(kind: "image" | "file", full: string) {
  const hash = createHash("sha1").update(full).digest("hex");
  const ext = path.extname(full).slice(1);
  return kind === "image" ? `image-${hash}-1600x1200-${ext}` : `file-${hash}-${ext}`;
}

/** Sube una imagen de src/content/images y devuelve el campo de imagen de Sanity. */
async function image(file: string) {
  const full = path.join(IMAGES_DIR, file);
  if (!existsSync(full)) throw new Error(`No existe la imagen: ${full}`);
  if (!uploaded.has(full)) {
    if (DRY_RUN) uploaded.set(full, fakeAssetId("image", full));
    else {
      const asset = await client!.assets.upload("image", createReadStream(full), { filename: path.basename(file) });
      uploaded.set(full, asset._id);
      console.log(`  ↑ imagen ${file}`);
    }
  }
  return { _type: "image", asset: { _type: "reference", _ref: uploaded.get(full)! } };
}

/** Sube un video de public/videos y devuelve el campo de archivo de Sanity. */
async function video(file: string) {
  const full = path.join(VIDEOS_DIR, file);
  if (!existsSync(full)) throw new Error(`No existe el video: ${full}`);
  if (!uploaded.has(full)) {
    if (DRY_RUN) uploaded.set(full, fakeAssetId("file", full));
    else {
      const asset = await client!.assets.upload("file", createReadStream(full), { filename: path.basename(file) });
      uploaded.set(full, asset._id);
      console.log(`  ↑ video ${file}`);
    }
  }
  return { _type: "file", asset: { _type: "reference", _ref: uploaded.get(full)! } };
}

/** Convierte un grupo del diccionario ("hero", "nav"…) al formato de Sanity { en, es }. */
function dictionaryGroup(group: string) {
  const en = (dictionaries.en as unknown as Record<string, Record<string, unknown>>)[group];
  const es = (dictionaries.es as unknown as Record<string, Record<string, unknown>>)[group];
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(en)) {
    const p = `${group}.${k}`;
    if (EXCLUDED_KEYS.has(p)) continue;
    const vEn = en[k];
    const vEs = es[k];
    if (typeof vEn === "string") {
      const v = { en: vEn, es: String(vEs) };
      out[k] = isLongText(vEn) ? lt(v) : ls(v);
    } else if (Array.isArray(vEn) && TUPLES[p]) {
      const [a, b] = TUPLES[p];
      out[k] = (vEn as string[][]).map((pair, i) => ({
        _key: key(),
        _type: `${group}${k.charAt(0).toUpperCase()}${k.slice(1)}Item`,
        [a]: ls({ en: pair[0], es: (vEs as string[][])[i]?.[0] ?? pair[0] }),
        [b]: ls({ en: pair[1], es: (vEs as string[][])[i]?.[1] ?? pair[1] }),
      }));
    } else if (Array.isArray(vEn)) {
      out[k] = ll({ en: vEn as string[], es: vEs as string[] });
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Documentos                                                          */
/* ------------------------------------------------------------------ */

export async function buildDocuments(): Promise<Doc[]> {
  const docs: Doc[] = [];
  const s = settingsData;

  // 1. Configuración general
  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    legalName: s.legalName,
    name: s.name,
    slogan: s.slogan,
    tagline: s.tagline,
    ...(s.logo ? { logo: await image(s.logo) } : {}),
    ...(s.logoSquare ? { logoSquare: await image(s.logoSquare) } : {}),
    ...(s.ogImage ? { ogImage: await image(s.ogImage) } : {}),
    contactName: s.contactName,
    phoneDisplay: s.phoneDisplay,
    phoneE164: s.phoneE164,
    email: s.email,
    hours: { _type: "object", days: s.hours.days, opens: s.hours.opens, closes: s.hours.closes },
    hoursText: ls(s.hoursText),
    hoursShort: ls(s.hoursShort),
    weekendText: ls(s.weekendText),
    serviceAreaText: ls(s.serviceAreaText),
    mapQuery: s.mapQuery,
    contractorLicense: s.contractorLicense,
    yearsExperience: s.yearsExperience,
    social: s.social.map((x) => ({ _key: key(), _type: "socialLink", platform: x.platform, url: x.url })),
  });

  // 2. Página de inicio (imágenes + textos de cada sección)
  docs.push({
    _id: "homePage",
    _type: "homePage",
    heroImage: await image(homeImages.hero),
    aboutImage: await image(homeImages.about),
    ...Object.fromEntries(HOME_GROUPS.map((g) => [g, dictionaryGroup(g)])),
  });

  // 3. Textos generales (menú, botones, formulario, SEO)
  docs.push({
    _id: "uiTexts",
    _type: "uiTexts",
    ...Object.fromEntries(UI_GROUPS.map((g) => [g, dictionaryGroup(g)])),
  });

  // 4. Política de privacidad
  docs.push({
    _id: "privacyPolicy",
    _type: "privacyPolicy",
    title: ls({ en: privacy.en.title, es: privacy.es.title }),
    description: lt({ en: privacy.en.description, es: privacy.es.description }),
    updated: ls({ en: privacy.en.updated, es: privacy.es.updated }),
    intro: lt({ en: privacy.en.intro, es: privacy.es.intro }),
    sections: privacy.en.sections.map((sec, i) => {
      const esSec = privacy.es.sections[i];
      return {
        _key: key(),
        _type: "privacySection",
        title: ls({ en: sec.title, es: esSec?.title ?? sec.title }),
        ...(sec.paragraphs ? { paragraphs: { _type: "localeTextList", en: sec.paragraphs, es: esSec?.paragraphs ?? [] } } : {}),
        ...(sec.bullets ? { bullets: ll({ en: sec.bullets, es: esSec?.bullets ?? [] }) } : {}),
      };
    }),
  });

  // 5. Servicios
  for (const [i, sv] of serviceData.entries()) {
    docs.push({
      _id: `service-${sv.slug}`,
      _type: "service",
      name: ls(sv.name),
      slug: { _type: "slug", current: sv.slug },
      order: i + 1,
      icon: sv.icon,
      ...(sv.featured ? { featured: ls(sv.featured) } : {}),
      short: lt(sv.short),
      intro: lt(sv.intro),
      items: ll(sv.items),
      image: await image(sv.image),
      imageAlt: ls(sv.imageAlt),
      ...(sv.gallery ? { gallery: sv.gallery } : {}),
      faqs: sv.faqs.map((f) => ({ _key: key(), _type: "faqItem", q: ls(f.q), a: lt(f.a) })),
      related: sv.related.map((slug) => ref(`service-${slug}`)),
    });
  }

  // 6. Condados y ciudades
  for (const [i, c] of counties.entries()) {
    docs.push({
      _id: `county-${c.slug}`,
      _type: "county",
      name: ls(c.name),
      slug: { _type: "slug", current: c.slug },
      order: i + 1,
      schemaName: c.schemaName,
      mapQuery: c.mapQuery,
      note: lt(c.note),
    });
  }
  for (const [i, c] of cities.entries()) {
    docs.push({
      _id: `city-${c.slug}`,
      _type: "city",
      name: c.name,
      slug: { _type: "slug", current: c.slug },
      order: i + 1,
      county: { _type: "reference", _ref: `county-${c.county}` },
      note: lt(c.note),
      nearby: c.nearby.map((slug) => ref(`city-${slug}`)),
    });
  }

  // 7. Proyectos (galería)
  for (const [i, p] of projectData.entries()) {
    docs.push({
      _id: `project-${p.id}`,
      _type: "project",
      category: p.category,
      image: await image(p.image),
      ...(p.video ? { video: await video(p.video) } : {}),
      alt: ls(p.alt),
      order: i + 1,
    });
  }

  // 8. Preguntas frecuentes generales
  for (const [i, f] of generalFaqs.entries()) {
    docs.push({ _id: `faq-${i + 1}`, _type: "faq", question: ls(f.q), answer: lt(f.a), order: i + 1 });
  }

  return docs;
}

/* ------------------------------------------------------------------ */
/* Ejecución                                                           */
/* ------------------------------------------------------------------ */

const MANAGED_TYPES = ["service", "county", "city", "project", "faq"];

async function main() {
  console.log(`\nSanity → proyecto "${projectId || "(dry-run)"}", dataset "${dataset}"${DRY_RUN ? " · SIMULACIÓN" : ""}\n`);
  console.log("1/3 Preparando documentos y subiendo imágenes…");
  const docs = await buildDocuments();

  const count = docs.reduce<Record<string, number>>((acc, d) => ((acc[d._type] = (acc[d._type] ?? 0) + 1), acc), {});
  console.log("\n2/3 Documentos:", count, `· archivos: ${uploaded.size}`);

  if (DRY_RUN) {
    console.log("\nSimulación terminada. No se escribió nada en Sanity.\n");
    return;
  }

  // Una sola transacción: las referencias entre documentos se resuelven juntas.
  console.log("\n3/3 Guardando en Sanity…");
  const tx = client!.transaction();
  for (const doc of docs) tx.createOrReplace(doc);
  await tx.commit({ visibility: "sync" });

  if (PRUNE) {
    const keep = new Set(docs.map((d) => d._id));
    const existing: string[] = await client!.fetch(`*[_type in $types && !(_id in path("drafts.**"))]._id`, { types: MANAGED_TYPES });
    const stale = existing.filter((id) => !keep.has(id));
    if (stale.length) {
      const tx = client!.transaction();
      for (const id of stale) tx.delete(id);
      await tx.commit();
      console.log(`  ✂ eliminados ${stale.length} documentos que ya no existen: ${stale.join(", ")}`);
    }
  }

  console.log(`\n✔ Listo: ${docs.length} documentos y ${uploaded.size} archivos en Sanity.`);
  console.log("  La web ya lee todo desde Sanity. Si está publicada, se actualiza con el webhook o en máximo 1 hora.\n");
}

// Solo se ejecuta al llamarlo directamente (no al importarlo desde las pruebas).
if (process.argv[1]?.endsWith("seed-sanity.ts")) {
  main().catch((err) => {
    console.error("\n✖ Error:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
