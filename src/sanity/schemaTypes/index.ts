import { faqItem, localeString, localeStringList, localeText, localeTextList } from "./objects/locale";
import { siteSettings } from "./documents/siteSettings";
import { homePage } from "./documents/homePage";
import { uiTexts } from "./documents/uiTexts";
import { service } from "./documents/service";
import { city, county } from "./documents/area";
import { project } from "./documents/project";
import { faq } from "./documents/faq";
import { privacyPolicy } from "./documents/privacyPolicy";

export const schemaTypes = [
  // Objetos reutilizables
  localeString,
  localeText,
  localeStringList,
  localeTextList,
  faqItem,
  // Documentos
  siteSettings,
  homePage,
  uiTexts,
  privacyPolicy,
  service,
  project,
  county,
  city,
  faq,
];

/** Documentos únicos (no se pueden crear ni borrar más). Su _id es igual a su tipo. */
export const SINGLETONS = ["siteSettings", "homePage", "uiTexts", "privacyPolicy"] as const;
