"use client";

/**
 * Configuración del Studio de Sanity.
 * - Integrado en la web en /admin (src/app/admin).
 * - También se puede abrir aparte con `npx sanity dev`.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes, SINGLETONS } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const singletons = new Set<string>(SINGLETONS);

export default defineConfig({
  name: "ecg-construction",
  title: "ECG Construction",
  basePath: "/admin",
  projectId: projectId || "missing-project-id",
  dataset,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
    // Los documentos únicos no aparecen en "Crear nuevo".
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.has(schemaType)),
  },
  document: {
    // Los documentos únicos no se pueden duplicar ni borrar.
    actions: (actions, { schemaType }) =>
      singletons.has(schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
});
