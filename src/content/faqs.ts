import type { Faq } from "@/lib/content/types";

/** Preguntas generales de la empresa (home + llms.txt). Respuestas directas para GEO. */
export const generalFaqs: Faq[] = [
  {
    q: {
      en: "Is ECG Construction a licensed contractor in Washington?",
      es: "¿ECG Construction es un contratista con licencia en Washington?",
    },
    a: {
      en: "Yes. ECG Construction LLC is a licensed Washington general contractor, WA Contractor Reg # {license}.",
      es: "Sí. ECG Construction LLC es un contratista general con licencia en Washington, registro WA # {license}.",
    },
  },
  {
    q: {
      en: "What areas does ECG Construction serve?",
      es: "¿Qué áreas atiende ECG Construction?",
    },
    a: {
      en: "We serve Snohomish County, Skagit County and North King County, including Everett, Marysville, Lake Stevens, Snohomish, Arlington, Monroe, Mount Vernon, Burlington, Anacortes, Sedro-Woolley, Bothell, Woodinville and Kirkland.",
      es: "Atendemos los condados de Snohomish y Skagit y el norte del condado de King, incluyendo Everett, Marysville, Lake Stevens, Snohomish, Arlington, Monroe, Mount Vernon, Burlington, Anacortes, Sedro-Woolley, Bothell, Woodinville y Kirkland.",
    },
  },
  {
    q: {
      en: "Do you offer free estimates?",
      es: "¿Ofrecen estimados gratis?",
    },
    a: {
      en: "Yes. Call {phone} or send the contact form with your project details and we will prepare a clear, detailed estimate.",
      es: "Sí. Llama al {phone} o envía el formulario de contacto con los detalles de tu proyecto y te prepararemos un estimado claro y detallado.",
    },
  },
  {
    q: {
      en: "What are your business hours?",
      es: "¿Cuál es su horario de atención?",
    },
    a: {
      en: "Monday through Friday, 9:00 AM to 5:00 PM Pacific Time. Weekend work can be scheduled by appointment.",
      es: "De lunes a viernes, de 9:00 a. m. a 5:00 p. m., hora del Pacífico. Los trabajos en fin de semana se pueden programar con cita.",
    },
  },
  {
    q: {
      en: "Do you work with general contractors as a subcontractor?",
      es: "¿Trabajan con contratistas generales como subcontratistas?",
    },
    a: {
      en: "Yes. We partner with general contractors and builders on concrete, floor preparation, specialty coatings and site improvements.",
      es: "Sí. Colaboramos con contratistas generales y constructores en concreto, preparación de pisos, recubrimientos especiales y mejoras del terreno.",
    },
  },
  {
    q: {
      en: "Do you speak Spanish?",
      es: "¿Hablan español?",
    },
    a: {
      en: "Yes. We serve customers in English and Spanish.",
      es: "Sí. Atendemos a nuestros clientes en inglés y en español.",
    },
  },
];
