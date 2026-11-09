import { defineField, defineType } from "sanity";
import { HOME_GROUPS } from "../../dictionary-map";
import { dictionaryGroupField } from "../objects/dictionaryFields";

/** PÁGINA DE INICIO (documento único): textos de cada sección e imágenes principales. */
export const homePage = defineType({
  name: "homePage",
  title: "Página de inicio",
  type: "document",
  fields: [
    defineField({
      name: "heroImage",
      title: "Imagen de portada",
      type: "image",
      options: { hotspot: true },
      description: "Foto grande junto al título principal. Horizontal, mínimo 1600 px de ancho. Usa el punto de enfoque para elegir qué parte se ve.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "aboutImage",
      title: "Imagen de \"Sobre nosotros\"",
      type: "image",
      options: { hotspot: true },
      description: "Foto de la sección Sobre nosotros (formato 4:3).",
      validation: (r) => r.required(),
    }),
    ...HOME_GROUPS.map((g) => dictionaryGroupField(g)),
  ],
  preview: { prepare: () => ({ title: "Página de inicio" }) },
});
