/**
 * Mapa entre el diccionario de textos de la web (src/content/dictionary.ts) y Sanity.
 *
 * Una sola fuente para:
 *  - generar los campos del Studio ("Página de inicio" y "Textos generales"),
 *  - usar el diccionario estático como respaldo de cada campo,
 *  - y reconstruir el diccionario a partir de Sanity (src/lib/content/sanity.ts).
 *
 * En Sanity cada texto se guarda como { en, es }.
 */

/** Grupos del diccionario que van en el documento "Página de inicio". */
export const HOME_GROUPS = ["hero", "featured", "services", "projects", "why", "reviews", "about", "serve", "area", "cta"] as const;
/** Grupos del diccionario que van en el documento "Textos generales". */
export const UI_GROUPS = ["nav", "common", "form", "assistant", "pages"] as const;

/**
 * Claves que NO se editan aquí porque vienen de "Configuración general"
 * (horario y área de servicio).
 */
export const EXCLUDED_KEYS = new Set(["common.hoursValue", "common.hoursShort", "common.weekend", "common.serviceAreaValue"]);

/** Listas de pares en el diccionario ([título, texto]) y sus nombres de campo en Sanity. */
export const TUPLES: Record<string, [string, string]> = {
  "why.items": ["title", "text"],
  "about.stats": ["value", "label"],
  "serve.items": ["title", "text"],
};

export const GROUP_TITLES: Record<string, string> = {
  hero: "Portada (hero)",
  featured: "Servicios destacados",
  services: "Sección de servicios",
  projects: "Galería de proyectos",
  why: "Por qué elegirnos",
  about: "Sobre nosotros",
  serve: "A quién servimos",
  area: "Área de servicio",
  reviews: "Reseñas",
  cta: "Llamado a la acción (estimado gratis)",
  assistant: "Asistente de IA (chat)",
  nav: "Menú y navegación",
  common: "Textos comunes",
  form: "Formulario de estimado",
  pages: "SEO de las páginas (títulos y descripciones)",
};

/** Títulos en español de cada campo. Si falta uno, se usa la clave. */
export const FIELD_TITLES: Record<string, string> = {
  // Portada
  "hero.eyebrow": "Texto pequeño sobre el título",
  "hero.title": "Título principal (H1)",
  "hero.lead": "Párrafo introductorio",
  "hero.badges": "Insignias bajo los botones",
  "hero.imageAlt": "Texto alternativo de la imagen de portada",
  // Destacados
  "featured.eyebrow": "Texto pequeño",
  "featured.title": "Título",
  "featured.lead": "Descripción",
  // Servicios
  "services.eyebrow": "Texto pequeño",
  "services.title": "Título",
  "services.lead": "Descripción",
  "services.count": "Palabra para contar servicios (\"servicios\")",
  "services.notSure": "Tarjeta final: título",
  "services.notSureCta": "Tarjeta final: texto",
  // Proyectos
  "projects.eyebrow": "Texto pequeño",
  "projects.title": "Título",
  "projects.lead": "Descripción",
  "projects.all": "Filtro: todos",
  "projects.pour": "Filtro: vaciado de concreto",
  "projects.polish": "Filtro: concreto pulido",
  "projects.epoxy": "Filtro: epoxy",
  "projects.close": "Botón cerrar (visor)",
  "projects.open": "Texto accesible: abrir imagen",
  // Por qué elegirnos
  "why.eyebrow": "Texto pequeño",
  "why.title": "Título",
  "why.items": "Razones",
  // Sobre nosotros
  "about.eyebrow": "Texto pequeño",
  "about.title": "Título",
  "about.p1": "Párrafo 1",
  "about.p2": "Párrafo 2",
  "about.p3": "Párrafo 3 (solo en la página Nosotros)",
  "about.p4": "Párrafo 4 (solo en la página Nosotros)",
  "about.stats": "Cifras (se animan contando)",
  "about.imageAlt": "Texto alternativo de la imagen",
  // A quién servimos
  "serve.eyebrow": "Texto pequeño",
  "serve.title": "Título",
  "serve.items": "Tipos de cliente",
  // Área
  "area.eyebrow": "Texto pequeño",
  "area.title": "Título",
  "area.lead": "Descripción",
  "area.mapTitle": "Título accesible del mapa",
  "area.andMore": "Texto bajo las ciudades",
  // Reseñas
  "reviews.eyebrow": "Texto pequeño",
  "reviews.title": "Título",
  "reviews.lead": "Descripción",
  "reviews.leaveReview": "Botón para dejar reseña en Google",
  "reviews.readReview": "Enlace \"ver la reseña\"",
  "reviews.outOf": "Texto accesible de las estrellas (\"de 5 estrellas\")",
  "reviews.empty": "Texto cuando aún no hay reseñas",
  "reviews.write": "Botón \"Escribir una reseña\"",
  "reviews.formTitle": "Formulario de reseña: título",
  "reviews.formLead": "Formulario de reseña: aviso de aprobación",
  "reviews.formRating": "Formulario de reseña: estrellas",
  "reviews.formName": "Formulario de reseña: nombre",
  "reviews.formCity": "Formulario de reseña: ciudad",
  "reviews.formEmail": "Formulario de reseña: correo",
  "reviews.formService": "Formulario de reseña: servicio",
  "reviews.formText": "Formulario de reseña: texto",
  "reviews.formTextPlaceholder": "Formulario de reseña: ejemplo dentro del texto",
  "reviews.formSubmit": "Formulario de reseña: botón enviar",
  "reviews.formSending": "Formulario de reseña: enviando",
  "reviews.formSuccess": "Formulario de reseña: mensaje de éxito",
  "reviews.formError": "Formulario de reseña: mensaje de error",
  // Asistente
  "assistant.open": "Botón para abrir el chat",
  "assistant.title": "Nombre del asistente",
  "assistant.subtitle": "Texto bajo el nombre",
  "assistant.greeting": "Saludo inicial",
  "assistant.placeholder": "Texto de ayuda de la caja de mensaje",
  "assistant.send": "Botón enviar",
  "assistant.close": "Botón cerrar",
  "assistant.reset": "Botón nueva conversación",
  "assistant.typing": "Texto mientras responde",
  "assistant.suggestions": "Sugerencias rápidas (botones)",
  "assistant.error": "Mensaje de error",
  "assistant.quoteSaved": "Mensaje al registrar una solicitud",
  "assistant.disclaimer": "Aviso bajo el chat",
  // CTA
  "cta.title": "Título",
  "cta.lead": "Descripción",
  // Menú
  "nav.home": "Inicio",
  "nav.services": "Servicios",
  "nav.allServices": "Todos los servicios",
  "nav.projects": "Proyectos",
  "nav.about": "Nosotros",
  "nav.areas": "Área de servicio",
  "nav.contact": "Contacto",
  "nav.estimate": "Botón de estimado",
  "nav.menu": "Botón menú (móvil)",
  "nav.close": "Botón cerrar (móvil)",
  "nav.language": "Etiqueta del selector de idioma",
  "nav.skip": "Enlace \"saltar al contenido\" (accesibilidad)",
  "nav.privacy": "Política de privacidad",
  // Comunes
  "common.call": "Botón llamar",
  "common.viewService": "Enlace ver servicio",
  "common.learnMore": "Enlace saber más",
  "common.requestEstimate": "Botón solicitar estimado",
  "common.seeAllProjects": "Botón ver todos los proyectos",
  "common.seeAllServices": "Botón ver todos los servicios",
  "common.whatWeOffer": "Título \"lo que ofrecemos\"",
  "common.relatedServices": "Título servicios relacionados",
  "common.faq": "Título preguntas frecuentes",
  "common.breadcrumbHome": "Migas de pan: inicio",
  "common.hours": "Etiqueta horario",
  "common.phone": "Etiqueta teléfono",
  "common.email": "Etiqueta correo",
  "common.contactPerson": "Etiqueta persona de contacto",
  "common.serviceArea": "Etiqueta área de servicio",
  "common.licensed": "Frase de licencia",
  "common.rights": "Derechos reservados",
  "common.generalConstruction": "Lema del footer",
  "common.servicesIn": "Título \"servicios en\" (páginas de ciudad)",
  "common.nearby": "Título comunidades cercanas",
  // Formulario
  "form.title": "Título del formulario",
  "form.name": "Campo nombre",
  "form.phone": "Campo teléfono",
  "form.email": "Campo correo",
  "form.city": "Campo ciudad",
  "form.cityPlaceholder": "Ciudad: texto de ayuda",
  "form.other": "Opción \"otra\"",
  "form.service": "Campo servicio",
  "form.servicePlaceholder": "Servicio: texto de ayuda",
  "form.message": "Campo detalles",
  "form.messagePlaceholder": "Detalles: texto de ayuda",
  "form.submit": "Botón enviar",
  "form.sending": "Texto mientras envía",
  "form.success": "Mensaje de éxito",
  "form.error": "Mensaje de error",
  "form.required": "Texto \"obligatorio\"",
  "form.privacy": "Aviso de privacidad (antes del enlace)",
  "form.photos": "Campo fotos",
  "form.photosHelp": "Fotos: texto de ayuda",
  "form.photosTooMany": "Fotos: mensaje si son demasiadas",
  // SEO
  "pages.servicesTitle": "Servicios: título",
  "pages.servicesDescription": "Servicios: meta descripción",
  "pages.projectsTitle": "Proyectos: título",
  "pages.projectsDescription": "Proyectos: meta descripción",
  "pages.aboutTitle": "Nosotros: título",
  "pages.aboutDescription": "Nosotros: meta descripción",
  "pages.areasTitle": "Áreas de servicio: título",
  "pages.areasDescription": "Áreas de servicio: meta descripción",
  "pages.contactTitle": "Contacto: título",
  "pages.contactDescription": "Contacto: meta descripción",
  "pages.homeTitle": "Inicio: título (pestaña del navegador y Google)",
  "pages.homeDescription": "Inicio: meta descripción",
  "pages.notFoundTitle": "Página 404: título",
  "pages.notFoundText": "Página 404: texto",
  "pages.backHome": "Página 404: botón volver",
};

export const TUPLE_FIELD_TITLES: Record<string, string> = {
  title: "Título",
  text: "Texto",
  value: "Cifra (ej. 20+)",
  label: "Etiqueta",
};

/** Un texto se edita como "texto largo" (área de texto) si su ejemplo supera 90 caracteres. */
export const isLongText = (value: string) => value.length > 90;

/** Variables disponibles dentro de los textos. */
export const TOKENS_HELP =
  "Puedes usar {phone}, {email}, {license} y {years}: se reemplazan por los datos de Configuración general.";
