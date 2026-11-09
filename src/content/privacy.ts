import type { Locale } from "@/lib/i18n";
import type { PrivacySource } from "@/lib/content/types";

// {email}, {phone} y {license} se reemplazan con los datos de "Configuración general".
const EMAIL = "{email}";
const PHONE = "{phone}";

/** Política de privacidad (requerida por Google Ads cuando la página tiene un formulario). */
export const privacy: Record<Locale, PrivacySource> = {
  en: {
    title: "Privacy Policy",
    description:
      "How ECG Construction LLC collects, uses and protects the information you share through our website and estimate request form.",
    updated: "Last updated: November 9, 2026",
    intro:
      "ECG Construction LLC (“ECG Construction”, “we”, “us”) respects your privacy. This policy explains what information we collect when you visit our website or request an estimate, how we use it and the choices you have.",
    sections: [
      {
        title: "Information we collect",
        paragraphs: ["When you fill out our estimate request form, call or email us, we may collect:"],
        bullets: [
          "Your name, phone number and email address.",
          "Your city and the service you are interested in.",
          "The project details you choose to share with us.",
        ],
      },
      {
        title: "Information collected automatically",
        paragraphs: [
          "Like most websites, our hosting provider may record basic technical data such as your IP address, browser type, device and the pages you visit, to keep the site secure and working properly.",
          "We may use advertising and analytics tools, such as Google Ads and Google Analytics, which use cookies or similar technologies to measure visits and the performance of our ads. Our pages also include an embedded Google Maps map, which may set its own cookies.",
        ],
      },
      {
        title: "How we use your information",
        bullets: [
          "To respond to your request and prepare estimates.",
          "To schedule, perform and follow up on our work.",
          "To improve our website and measure the results of our advertising.",
          "To comply with legal obligations.",
        ],
      },
      {
        title: "How we share your information",
        paragraphs: [
          "We do not sell or rent your personal information. We only share it with service providers that help us operate the website, deliver email and measure advertising (for example, hosting, email delivery and Google), when required by law, or to protect our rights.",
        ],
      },
      {
        title: "Your choices",
        bullets: [
          "You can ask us to access, correct or delete the personal information you sent us by contacting us.",
          "You can block or delete cookies in your browser settings.",
          "You can manage personalized ads from Google at adssettings.google.com.",
        ],
      },
      {
        title: "Data retention and security",
        paragraphs: [
          "We keep your information only as long as needed to respond to you, provide our services and meet legal or accounting requirements, and we use reasonable measures to protect it. No method of transmission over the internet is 100% secure.",
        ],
      },
      {
        title: "Children’s privacy",
        paragraphs: ["Our website is not directed to children under 13 and we do not knowingly collect their information."],
      },
      {
        title: "Changes to this policy",
        paragraphs: ["We may update this policy from time to time. The date at the top shows the latest version."],
      },
      {
        title: "Contact us",
        paragraphs: [
          `ECG Construction LLC · WA Contractor Reg # {license} · Phone: ${PHONE} · Email: ${EMAIL}`,
        ],
      },
    ],
  },
  es: {
    title: "Política de privacidad",
    description:
      "Cómo ECG Construction LLC recopila, usa y protege la información que compartes en nuestro sitio web y en el formulario de estimado.",
    updated: "Última actualización: 9 de noviembre de 2026",
    intro:
      "ECG Construction LLC (“ECG Construction”, “nosotros”) respeta tu privacidad. Esta política explica qué información recopilamos cuando visitas nuestro sitio o solicitas un estimado, cómo la usamos y qué opciones tienes.",
    sections: [
      {
        title: "Información que recopilamos",
        paragraphs: ["Cuando llenas nuestro formulario de estimado, nos llamas o nos escribes, podemos recopilar:"],
        bullets: [
          "Tu nombre, teléfono y correo electrónico.",
          "Tu ciudad y el servicio que te interesa.",
          "Los detalles del proyecto que decidas compartir.",
        ],
      },
      {
        title: "Información que se recopila automáticamente",
        paragraphs: [
          "Como la mayoría de los sitios web, nuestro proveedor de hosting puede registrar datos técnicos básicos como tu dirección IP, tipo de navegador, dispositivo y las páginas que visitas, para mantener el sitio seguro y funcionando.",
          "Podemos usar herramientas de publicidad y analítica, como Google Ads y Google Analytics, que usan cookies o tecnologías similares para medir las visitas y el rendimiento de nuestros anuncios. Nuestras páginas también incluyen un mapa de Google Maps, que puede usar sus propias cookies.",
        ],
      },
      {
        title: "Cómo usamos tu información",
        bullets: [
          "Para responder a tu solicitud y preparar estimados.",
          "Para programar, realizar y dar seguimiento a nuestros trabajos.",
          "Para mejorar nuestro sitio web y medir los resultados de nuestra publicidad.",
          "Para cumplir con obligaciones legales.",
        ],
      },
      {
        title: "Con quién compartimos tu información",
        paragraphs: [
          "No vendemos ni alquilamos tu información personal. Solo la compartimos con proveedores que nos ayudan a operar el sitio, enviar correos y medir la publicidad (por ejemplo, hosting, envío de correo y Google), cuando la ley lo exige o para proteger nuestros derechos.",
        ],
      },
      {
        title: "Tus opciones",
        bullets: [
          "Puedes pedirnos acceder, corregir o eliminar la información personal que nos enviaste contactándonos.",
          "Puedes bloquear o borrar las cookies desde la configuración de tu navegador.",
          "Puedes administrar los anuncios personalizados de Google en adssettings.google.com.",
        ],
      },
      {
        title: "Conservación y seguridad de los datos",
        paragraphs: [
          "Conservamos tu información solo el tiempo necesario para responderte, prestar nuestros servicios y cumplir requisitos legales o contables, y usamos medidas razonables para protegerla. Ningún método de transmisión por internet es 100 % seguro.",
        ],
      },
      {
        title: "Privacidad de menores",
        paragraphs: ["Nuestro sitio no está dirigido a menores de 13 años y no recopilamos su información de forma intencional."],
      },
      {
        title: "Cambios a esta política",
        paragraphs: ["Podemos actualizar esta política ocasionalmente. La fecha al inicio indica la versión más reciente."],
      },
      {
        title: "Contacto",
        paragraphs: [
          `ECG Construction LLC · Registro de contratista WA # {license} · Teléfono: ${PHONE} · Correo: ${EMAIL}`,
        ],
      },
    ],
  },
};
