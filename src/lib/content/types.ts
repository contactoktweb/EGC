import type { PortableTextBlock } from "next-sanity";
import type { Dictionary } from "@/content/dictionary";
import type { L, LList, Locale } from "@/lib/i18n";

/**
 * Tipos del contenido de la web. Son los mismos venga el contenido de Sanity o del respaldo
 * estático (src/content), así los componentes no saben de dónde sale la información.
 */

/** Imagen lista para next/image (compatible con StaticImageData). */
export type Img = {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

/** Video subido a Sanity (archivo). */
export type Video = { url: string; mimeType: string };

export type ServiceIcon = "concrete" | "polish" | "epoxy" | "asphalt" | "excavation" | "washing" | "maintenance";
export type ProjectCategory = "pour" | "polish" | "epoxy";

export type Faq = { q: L; a: L };

export type Service = {
  slug: string;
  icon: ServiceIcon;
  image: Img;
  imageAlt: L;
  name: L;
  /** Nombre corto para las tarjetas destacadas (Pour Concrete, Polishing, Epoxy). */
  featured?: L;
  short: L;
  /** Primer párrafo con respuesta directa: optimizado para motores de IA (GEO). */
  intro: L;
  items: LList;
  gallery?: ProjectCategory;
  faqs: Faq[];
  related: string[];
};

export type CountyKey = string;

export type County = {
  slug: CountyKey;
  name: L;
  /** Nombre para schema.org, p. ej. "Skagit County, Washington". */
  schemaName: string;
  /** Búsqueda para centrar el mapa, p. ej. "Mount Vernon, WA". */
  mapQuery: string;
  note: L;
};

export type City = {
  slug: string;
  name: string;
  county: CountyKey;
  nearby: string[];
  note: L;
};

export type Project = {
  id: string;
  category: ProjectCategory;
  /** Foto del proyecto (o portada si es un video). */
  image: Img;
  alt: L;
  video?: Video;
};

/** Política tal como se escribe en el respaldo estático (se convierte a texto con formato). */
export type PrivacySection = { title: string; paragraphs?: string[]; bullets?: string[] };
export type PrivacySource = {
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: PrivacySection[];
};

/** Política lista para mostrar: el cuerpo es texto con formato (Portable Text, editor WYSIWYG). */
export type PrivacyContent = {
  title: string;
  description: string;
  updated: string;
  body: PortableTextBlock[];
};

export type SocialLink = { platform: string; url: string };

/** "Configuración general": datos que cambian seguido (logos, contacto, horario…). */
export type Settings = {
  legalName: string;
  name: string;
  slogan: string;
  tagline: string;
  contactName: string;
  phoneDisplay: string;
  phoneE164: string;
  email: string;
  contractorLicense: string;
  yearsExperience: number;
  hours: { days: string[]; opens: string; closes: string };
  /** Textos visibles del horario y del área (se usan en contacto, footer, etc.). */
  hoursText: L;
  hoursShort: L;
  weekendText: L;
  serviceAreaText: L;
  /** Búsqueda del mapa general, p. ej. "Arlington, WA". */
  mapQuery: string;
  /** Logo horizontal para header/footer (si no hay, se usa el logo SVG del código). */
  logo: Img | null;
  /** Logo cuadrado (schema.org, buscadores). */
  logoSquare: Img | null;
  /** Imagen para compartir en redes (1200×630). */
  ogImage: Img | null;
  social: SocialLink[];
};

export type SiteContent = {
  source: "sanity" | "static";
  settings: Settings;
  dict: Record<Locale, Dictionary>;
  images: { hero: Img; about: Img };
  services: Service[];
  counties: County[];
  cities: City[];
  projects: Project[];
  faqs: Faq[];
  privacy: Record<Locale, PrivacyContent>;
};
