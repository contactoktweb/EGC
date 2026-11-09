import { defineType } from "sanity";
import { UI_GROUPS } from "../../dictionary-map";
import { dictionaryGroupField } from "../objects/dictionaryFields";

/** TEXTOS GENERALES (documento único): menú, botones, formulario y SEO de cada página. */
export const uiTexts = defineType({
  name: "uiTexts",
  title: "Textos generales",
  type: "document",
  fields: UI_GROUPS.map((g) => dictionaryGroupField(g)),
  preview: { prepare: () => ({ title: "Textos generales" }) },
});
