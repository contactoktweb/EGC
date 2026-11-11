import type { StructureResolver } from "sanity/structure";

/** Menú del Studio: documentos únicos arriba y listas ordenadas abajo. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido de la web")
    .items([
      S.listItem()
        .title("Solicitudes de cotización")
        .id("leads")
        .child(S.documentTypeList("lead").title("Solicitudes de cotización").defaultOrdering([{ field: "submittedAt", direction: "desc" }])),
      S.divider(),
      S.listItem().title("Configuración general").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem().title("Página de inicio").id("homePage").child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem().title("Textos generales").id("uiTexts").child(S.document().schemaType("uiTexts").documentId("uiTexts")),
      S.divider(),
      S.documentTypeListItem("service").title("Servicios"),
      S.documentTypeListItem("project").title("Proyectos (galería)"),
      S.documentTypeListItem("faq").title("Preguntas frecuentes"),
      S.documentTypeListItem("review").title("Reseñas"),
      S.divider(),
      S.documentTypeListItem("county").title("Condados"),
      S.documentTypeListItem("city").title("Ciudades"),
      S.divider(),
      S.listItem().title("Política de privacidad").id("privacyPolicy").child(S.document().schemaType("privacyPolicy").documentId("privacyPolicy")),
    ]);
