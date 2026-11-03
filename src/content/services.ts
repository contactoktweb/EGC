import type { StaticImageData } from "next/image";
import type { L, LList } from "@/lib/i18n";
import imgStamped from "./images/stamped-concrete-patio-curved-border.jpg";
import imgPolished from "./images/polished-concrete-hallway.jpg";
import imgEpoxy from "./images/decorative-flake-epoxy-garage-floor.jpg";
import imgDriveway from "./images/concrete-driveway-broom-finish.jpg";
import imgSite from "./images/concrete-walkway-forming.jpg";
import imgPatio from "./images/broom-finish-concrete-patio.jpg";
import imgPorch from "./images/stamped-concrete-entry-porch.jpg";

export type ServiceIcon =
  | "concrete"
  | "polish"
  | "epoxy"
  | "asphalt"
  | "excavation"
  | "washing"
  | "maintenance";

export type Faq = { q: L; a: L };

export type Service = {
  slug: string;
  icon: ServiceIcon;
  image: StaticImageData;
  imageAlt: L;
  name: L;
  /** Nombre corto para tarjetas destacadas (Pour concrete, Polishing, Epoxy). */
  featured?: L;
  short: L;
  /** Primer párrafo con respuesta directa: optimizado para motores de IA (GEO). */
  intro: L;
  items: LList;
  /** Categoría de fotos asociada (galería). */
  gallery?: "pour" | "polish" | "epoxy";
  faqs: Faq[];
  related: string[];
};

export const services: Service[] = [
  {
    slug: "concrete-construction-repair",
    icon: "concrete",
    image: imgStamped,
    imageAlt: {
      en: "Stamped concrete patio with curved border poured by ECG Construction",
      es: "Patio de concreto estampado con borde curvo vaciado por ECG Construction",
    },
    name: { en: "Concrete Construction & Repair", es: "Construcción y reparación de concreto" },
    featured: { en: "Pour Concrete", es: "Vaciado de concreto" },
    short: {
      en: "Driveways, patios, sidewalks, stairs, slabs, foundations and stamped decorative concrete.",
      es: "Entradas de autos, patios, banquetas, escaleras, losas, cimientos y concreto estampado decorativo.",
    },
    intro: {
      en: "ECG Construction pours, replaces and repairs concrete for homes and businesses in Snohomish County and King County, WA. We form, place and finish driveways, patios, sidewalks, stairs, slabs, footings and stamped decorative concrete with 20+ years of hands-on experience.",
      es: "ECG Construction vacía, reemplaza y repara concreto para casas y negocios en los condados de Snohomish y King, WA. Cimbramos, colocamos y damos acabado a entradas de autos, patios, banquetas, escaleras, losas, zapatas y concreto estampado decorativo con más de 20 años de experiencia práctica.",
    },
    items: {
      en: [
        "Concrete driveways, patios and sidewalks",
        "Concrete stairs, steps and walkways",
        "Concrete slabs and equipment pads",
        "Concrete demolition and replacement",
        "Stamped and decorative concrete",
        "Concrete surface repairs and restoration",
        "Concrete foundations and footings",
        "Retaining walls and site concrete improvements",
      ],
      es: [
        "Entradas de autos, patios y banquetas de concreto",
        "Escaleras, escalones y andadores de concreto",
        "Losas de concreto y bases para equipos",
        "Demolición y reemplazo de concreto",
        "Concreto estampado y decorativo",
        "Reparación y restauración de superficies de concreto",
        "Cimientos y zapatas de concreto",
        "Muros de contención y mejoras de concreto en el terreno",
      ],
    },
    gallery: "pour",
    faqs: [
      {
        q: {
          en: "Do you pour new concrete driveways and patios?",
          es: "¿Hacen entradas de autos y patios de concreto nuevos?",
        },
        a: {
          en: "Yes. We handle the full process: excavation and base preparation, forming, reinforcement, pouring and finishing (broom, smooth or stamped), for residential and commercial properties in Snohomish and King County.",
          es: "Sí. Nos encargamos de todo el proceso: excavación y preparación de la base, cimbra, refuerzo, vaciado y acabado (escobillado, liso o estampado), para propiedades residenciales y comerciales en los condados de Snohomish y King.",
        },
      },
      {
        q: {
          en: "Can you repair cracked or damaged concrete instead of replacing it?",
          es: "¿Pueden reparar concreto agrietado o dañado en lugar de reemplazarlo?",
        },
        a: {
          en: "Often, yes. After inspecting the slab we recommend surface repair and restoration when the base is sound, or demolition and replacement when the damage is structural.",
          es: "Muchas veces sí. Después de inspeccionar la losa recomendamos reparación y restauración superficial cuando la base está en buen estado, o demolición y reemplazo cuando el daño es estructural.",
        },
      },
      {
        q: {
          en: "Do you offer stamped and decorative concrete?",
          es: "¿Ofrecen concreto estampado y decorativo?",
        },
        a: {
          en: "Yes. We install stamped concrete patterns such as stone, slate and wood plank, with color and borders, for patios, entries and walkways.",
          es: "Sí. Instalamos concreto estampado con patrones de piedra, pizarra y tablón de madera, con color y bordes, para patios, entradas y andadores.",
        },
      },
    ],
    related: ["concrete-floor-preparation-polishing", "excavation-grading-site-work", "asphalt-exterior-surfaces"],
  },
  {
    slug: "concrete-floor-preparation-polishing",
    icon: "polish",
    image: imgPolished,
    imageAlt: {
      en: "Polished concrete hallway floor finished by ECG Construction",
      es: "Pasillo con piso de concreto pulido terminado por ECG Construction",
    },
    name: {
      en: "Concrete Floor Preparation & Finishing",
      es: "Preparación y acabado de pisos de concreto",
    },
    featured: { en: "Polishing Concrete", es: "Pulido de concreto" },
    short: {
      en: "Concrete grinding, polished concrete, grind-and-seal, self-leveling underlayments and surface prep.",
      es: "Desbaste de concreto, concreto pulido, desbaste y sellado, autonivelantes y preparación de superficies.",
    },
    intro: {
      en: "ECG Construction grinds, polishes and prepares concrete floors for homes, retail spaces, offices and warehouses in Snohomish and King County, WA. We deliver polished concrete, grind-and-seal systems, densified and burnished floors, and properly prepared surfaces ready for any flooring installation.",
      es: "ECG Construction desbasta, pule y prepara pisos de concreto para casas, locales comerciales, oficinas y bodegas en los condados de Snohomish y King, WA. Entregamos concreto pulido, sistemas de desbaste y sellado, pisos densificados y abrillantados, y superficies bien preparadas para cualquier instalación de piso.",
    },
    items: {
      en: [
        "Concrete grinding and surface preparation",
        "Polished concrete floors",
        "Grind-and-seal concrete systems",
        "Self-leveling concrete underlayments",
        "Concrete densification and burnishing",
        "Concrete joint and crack repairs",
        "Surface preparation for flooring installations",
        "Removal of existing floor coatings and adhesives",
      ],
      es: [
        "Desbaste y preparación de superficies de concreto",
        "Pisos de concreto pulido",
        "Sistemas de desbaste y sellado de concreto",
        "Bases autonivelantes de concreto",
        "Densificado y abrillantado de concreto",
        "Reparación de juntas y grietas en concreto",
        "Preparación de superficies para instalación de pisos",
        "Remoción de recubrimientos y adhesivos existentes",
      ],
    },
    gallery: "polish",
    faqs: [
      {
        q: {
          en: "What is the difference between polished concrete and grind-and-seal?",
          es: "¿Cuál es la diferencia entre concreto pulido y desbaste y sellado?",
        },
        a: {
          en: "Polished concrete is mechanically ground and refined with progressively finer diamonds plus a densifier, creating a durable, glossy surface. Grind-and-seal grinds the slab and then applies a topical sealer; it costs less but the sealer needs periodic maintenance.",
          es: "El concreto pulido se desbasta y refina mecánicamente con diamantes cada vez más finos y un densificador, logrando una superficie brillante y muy duradera. El desbaste y sellado desbasta la losa y luego aplica un sellador superficial; cuesta menos, pero el sellador requiere mantenimiento periódico.",
        },
      },
      {
        q: {
          en: "Can you remove old coatings, glue or adhesives from concrete?",
          es: "¿Pueden quitar recubrimientos viejos, pegamento o adhesivos del concreto?",
        },
        a: {
          en: "Yes. We grind off existing coatings, mastic and adhesives to leave a clean, profiled surface ready for polishing, coatings or new flooring.",
          es: "Sí. Desbastamos recubrimientos, mastique y adhesivos existentes para dejar una superficie limpia y con el perfil adecuado para pulir, recubrir o instalar piso nuevo.",
        },
      },
      {
        q: {
          en: "Is polished concrete a good option for commercial spaces?",
          es: "¿El concreto pulido es buena opción para espacios comerciales?",
        },
        a: {
          en: "Yes. Polished concrete is low-maintenance, resists heavy foot traffic and reflects light, which is why it is popular in retail stores, offices, showrooms, hallways and warehouses.",
          es: "Sí. El concreto pulido requiere poco mantenimiento, resiste el tráfico intenso y refleja la luz; por eso es muy usado en tiendas, oficinas, salas de exhibición, pasillos y bodegas.",
        },
      },
    ],
    related: ["epoxy-floor-coatings", "concrete-construction-repair"],
  },
  {
    slug: "epoxy-floor-coatings",
    icon: "epoxy",
    image: imgEpoxy,
    imageAlt: {
      en: "Garage floor with decorative flake epoxy system by ECG Construction",
      es: "Piso de garaje con sistema de epoxy decorativo tipo flake de ECG Construction",
    },
    name: { en: "Epoxy & Protective Floor Coatings", es: "Epoxy y recubrimientos protectores para pisos" },
    featured: { en: "Epoxy Work", es: "Trabajos en epoxy" },
    short: {
      en: "Garage epoxy, decorative flake and metallic epoxy, commercial coatings, sealers and waterproofing.",
      es: "Epoxy para garajes, epoxy decorativo tipo flake y metálico, recubrimientos comerciales, selladores e impermeabilización.",
    },
    intro: {
      en: "ECG Construction installs epoxy and protective floor coatings in garages, shops, commercial kitchens, warehouses and industrial spaces across Snohomish and King County, WA. Every system starts with mechanical surface preparation and moisture evaluation, so the coating bonds correctly and lasts.",
      es: "ECG Construction instala epoxy y recubrimientos protectores para pisos en garajes, talleres, cocinas comerciales, bodegas y espacios industriales en los condados de Snohomish y King, WA. Cada sistema comienza con preparación mecánica de la superficie y evaluación de humedad, para que el recubrimiento se adhiera correctamente y dure.",
    },
    items: {
      en: [
        "Garage epoxy flooring",
        "Commercial and industrial floor coatings",
        "Decorative flake epoxy systems",
        "Metallic epoxy flooring",
        "Concrete sealers and protective coatings",
        "Floor coating removal and replacement",
        "Surface preparation and moisture evaluation",
        "Waterproofing and specialty coating applications",
      ],
      es: [
        "Pisos de epoxy para garajes",
        "Recubrimientos para pisos comerciales e industriales",
        "Sistemas de epoxy decorativo tipo flake",
        "Pisos de epoxy metálico",
        "Selladores y recubrimientos protectores para concreto",
        "Remoción y reemplazo de recubrimientos",
        "Preparación de superficie y evaluación de humedad",
        "Impermeabilización y recubrimientos especiales",
      ],
    },
    gallery: "epoxy",
    faqs: [
      {
        q: {
          en: "How long does a garage epoxy floor take to install?",
          es: "¿Cuánto tarda la instalación de un piso de epoxy en un garaje?",
        },
        a: {
          en: "A typical residential garage takes about 1 to 3 days depending on size, surface condition and the system chosen, plus curing time before parking vehicles. We confirm the schedule in your written estimate.",
          es: "Un garaje residencial típico toma de 1 a 3 días según el tamaño, el estado de la superficie y el sistema elegido, más el tiempo de curado antes de estacionar vehículos. Confirmamos los tiempos en tu estimado por escrito.",
        },
      },
      {
        q: {
          en: "What is a flake epoxy floor?",
          es: "¿Qué es un piso de epoxy tipo flake?",
        },
        a: {
          en: "A flake system broadcasts colored vinyl chips into the base coat and seals them with a clear topcoat. It hides imperfections, adds texture for slip resistance and is one of the most popular choices for garages.",
          es: "Un sistema flake esparce chips de vinil de colores sobre la capa base y los sella con una capa transparente. Disimula imperfecciones, agrega textura antiderrapante y es una de las opciones más populares para garajes.",
        },
      },
      {
        q: {
          en: "Polished concrete or epoxy: which is better?",
          es: "¿Concreto pulido o epoxy: cuál es mejor?",
        },
        a: {
          en: "Polished concrete is ideal for low-maintenance, high-traffic interiors. Epoxy offers more color options, chemical and stain resistance and a sealed surface, making it a great fit for garages, shops and commercial kitchens. We help you choose based on use and budget.",
          es: "El concreto pulido es ideal para interiores de alto tráfico y poco mantenimiento. El epoxy ofrece más opciones de color, resistencia a químicos y manchas y una superficie sellada, ideal para garajes, talleres y cocinas comerciales. Te ayudamos a elegir según el uso y el presupuesto.",
        },
      },
    ],
    related: ["concrete-floor-preparation-polishing", "concrete-construction-repair"],
  },
  {
    slug: "asphalt-exterior-surfaces",
    icon: "asphalt",
    image: imgDriveway,
    imageAlt: {
      en: "Residential driveway exterior surface project by ECG Construction",
      es: "Proyecto de superficie exterior en entrada residencial por ECG Construction",
    },
    name: { en: "Asphalt & Exterior Surface Services", es: "Asfalto y superficies exteriores" },
    short: {
      en: "Asphalt patching, resurfacing, overlays, sealcoating, parking lots and driveway restoration.",
      es: "Bacheo, repavimentación, sobrecarpetas, sellado de asfalto, estacionamientos y restauración de entradas.",
    },
    intro: {
      en: "ECG Construction repairs, resurfaces and maintains asphalt driveways and parking lots for homeowners, businesses and property managers in Snohomish and King County, WA, including patching, overlays, sealcoating and demolition.",
      es: "ECG Construction repara, repavimenta y mantiene entradas y estacionamientos de asfalto para propietarios, negocios y administradores de propiedades en los condados de Snohomish y King, WA, incluyendo bacheo, sobrecarpetas, sellado y demolición.",
    },
    items: {
      en: [
        "Asphalt repairs and patching",
        "Asphalt resurfacing and overlays",
        "Asphalt sealcoating",
        "Parking lot improvements",
        "Driveway maintenance and restoration",
        "Concrete and asphalt demolition",
        "Exterior surface preparation",
      ],
      es: [
        "Reparación y bacheo de asfalto",
        "Repavimentación y sobrecarpetas de asfalto",
        "Sellado de asfalto (sealcoating)",
        "Mejoras en estacionamientos",
        "Mantenimiento y restauración de entradas de autos",
        "Demolición de concreto y asfalto",
        "Preparación de superficies exteriores",
      ],
    },
    faqs: [
      {
        q: {
          en: "Do you repair commercial parking lots?",
          es: "¿Reparan estacionamientos comerciales?",
        },
        a: {
          en: "Yes. We patch potholes, resurface worn areas, sealcoat and make general improvements to parking lots for businesses, retail centers and residential communities.",
          es: "Sí. Bacheamos, repavimentamos zonas desgastadas, sellamos y hacemos mejoras generales en estacionamientos de negocios, centros comerciales y comunidades residenciales.",
        },
      },
      {
        q: {
          en: "How often should asphalt be sealcoated?",
          es: "¿Cada cuánto se debe sellar el asfalto?",
        },
        a: {
          en: "As a general guideline, every 2 to 3 years helps protect asphalt from water, UV and wear. Traffic and Pacific Northwest weather can change that interval; we can inspect and advise.",
          es: "Como referencia general, cada 2 a 3 años ayuda a proteger el asfalto del agua, el sol y el desgaste. El tráfico y el clima del noroeste del Pacífico pueden cambiar ese intervalo; podemos inspeccionarlo y aconsejarte.",
        },
      },
    ],
    related: ["concrete-construction-repair", "excavation-grading-site-work", "pressure-washing"],
  },
  {
    slug: "excavation-grading-site-work",
    icon: "excavation",
    image: imgSite,
    imageAlt: {
      en: "Site preparation and walkway forming by ECG Construction",
      es: "Preparación del terreno y cimbrado de andador por ECG Construction",
    },
    name: { en: "Excavation, Grading & Site Improvements", es: "Excavación, nivelación y mejoras del terreno" },
    short: {
      en: "Light excavation, grading, gravel driveways, site prep, retaining walls and drainage.",
      es: "Excavación ligera, nivelación, entradas de grava, preparación de terreno, muros de contención y drenaje.",
    },
    intro: {
      en: "ECG Construction provides light excavation, grading and site preparation in Snohomish and King County, WA: gravel driveways and parking areas, leveling, retaining walls, drainage improvements, clearing and small demolition.",
      es: "ECG Construction ofrece excavación ligera, nivelación y preparación de terrenos en los condados de Snohomish y King, WA: entradas y estacionamientos de grava, nivelación, muros de contención, mejoras de drenaje, desmonte y demoliciones pequeñas.",
    },
    items: {
      en: [
        "Light excavation and grading",
        "Gravel driveway and parking area installation",
        "Site preparation and leveling",
        "Retaining wall installation",
        "Landscape grading and drainage improvements",
        "Brush and vegetation clearing",
        "Small demolition and debris removal",
      ],
      es: [
        "Excavación ligera y nivelación",
        "Instalación de entradas y estacionamientos de grava",
        "Preparación y nivelación de terrenos",
        "Instalación de muros de contención",
        "Nivelación de jardines y mejoras de drenaje",
        "Desmonte de maleza y vegetación",
        "Demoliciones pequeñas y retiro de escombros",
      ],
    },
    faqs: [
      {
        q: {
          en: "Can you fix drainage problems in my yard?",
          es: "¿Pueden resolver problemas de drenaje en mi jardín?",
        },
        a: {
          en: "Yes. We regrade landscapes and improve drainage to move water away from structures, driveways and walkways, a common need with Western Washington rain.",
          es: "Sí. Renivelamos jardines y mejoramos el drenaje para alejar el agua de construcciones, entradas y andadores, algo muy común con las lluvias del oeste de Washington.",
        },
      },
      {
        q: {
          en: "Do you prepare the site before pouring concrete?",
          es: "¿Preparan el terreno antes de vaciar concreto?",
        },
        a: {
          en: "Yes. Proper excavation, compaction and base material are the foundation of a long-lasting slab, so we handle site prep as part of our concrete projects.",
          es: "Sí. Una buena excavación, compactación y material de base son clave para una losa duradera, por eso la preparación del terreno es parte de nuestros proyectos de concreto.",
        },
      },
    ],
    related: ["concrete-construction-repair", "asphalt-exterior-surfaces", "property-maintenance-repairs"],
  },
  {
    slug: "pressure-washing",
    icon: "washing",
    image: imgPatio,
    imageAlt: {
      en: "Clean concrete patio and exterior surfaces",
      es: "Patio de concreto y superficies exteriores limpias",
    },
    name: { en: "Pressure Washing & Exterior Cleaning", es: "Lavado a presión y limpieza exterior" },
    short: {
      en: "Residential and commercial pressure washing, soft washing, driveways, decks, fences and pavers.",
      es: "Lavado a presión residencial y comercial, lavado suave, entradas, terrazas, cercas y adoquines.",
    },
    intro: {
      en: "ECG Construction offers residential and commercial pressure washing and soft washing in Snohomish and King County, WA, for houses, buildings, driveways, sidewalks, pavers, decks, patios, fences, trailers and recreational properties.",
      es: "ECG Construction ofrece lavado a presión y lavado suave residencial y comercial en los condados de Snohomish y King, WA, para casas, edificios, entradas, banquetas, adoquines, terrazas, patios, cercas, remolques y propiedades recreativas.",
    },
    items: {
      en: [
        "Residential and commercial pressure washing",
        "House and building soft washing",
        "Driveway and sidewalk cleaning",
        "Concrete and paver cleaning",
        "Deck and patio washing",
        "Fence cleaning",
        "Trailer and recreational property washing",
        "Exterior surface cleaning and maintenance",
      ],
      es: [
        "Lavado a presión residencial y comercial",
        "Lavado suave de casas y edificios",
        "Limpieza de entradas y banquetas",
        "Limpieza de concreto y adoquines",
        "Lavado de terrazas y patios",
        "Limpieza de cercas",
        "Lavado de remolques y propiedades recreativas",
        "Limpieza y mantenimiento de superficies exteriores",
      ],
    },
    faqs: [
      {
        q: {
          en: "What is the difference between pressure washing and soft washing?",
          es: "¿Cuál es la diferencia entre lavado a presión y lavado suave?",
        },
        a: {
          en: "Pressure washing uses high-pressure water for hard surfaces like concrete and pavers. Soft washing uses low pressure with cleaning solutions to safely clean siding, roofs and delicate surfaces.",
          es: "El lavado a presión usa agua a alta presión para superficies duras como concreto y adoquines. El lavado suave usa baja presión con soluciones limpiadoras para limpiar con seguridad fachadas, techos y superficies delicadas.",
        },
      },
      {
        q: {
          en: "Do you clean moss and algae from driveways and walkways?",
          es: "¿Limpian musgo y algas de entradas y andadores?",
        },
        a: {
          en: "Yes. Moss and algae are common in the Pacific Northwest; cleaning them improves appearance and reduces slip hazards on concrete, pavers and decks.",
          es: "Sí. El musgo y las algas son comunes en el noroeste del Pacífico; limpiarlos mejora la apariencia y reduce el riesgo de resbalones en concreto, adoquines y terrazas.",
        },
      },
    ],
    related: ["property-maintenance-repairs", "asphalt-exterior-surfaces"],
  },
  {
    slug: "property-maintenance-repairs",
    icon: "maintenance",
    image: imgPorch,
    imageAlt: {
      en: "Residential entry with stamped concrete porch",
      es: "Entrada residencial con porche de concreto estampado",
    },
    name: { en: "Property Maintenance & Repairs", es: "Mantenimiento y reparación de propiedades" },
    short: {
      en: "Fences, decks, sheds, minor carpentry, gutters, yard cleanup, tree trimming and stump grinding.",
      es: "Cercas, terrazas, cobertizos, carpintería menor, canaletas, limpieza de jardines, poda y destoconado.",
    },
    intro: {
      en: "ECG Construction handles property maintenance and exterior repairs for homeowners, property managers, communities and recreational parks in Snohomish and King County, WA, from fence and deck repairs to gutter cleaning, yard cleanup, tree trimming and stump grinding.",
      es: "ECG Construction realiza mantenimiento de propiedades y reparaciones exteriores para propietarios, administradores, comunidades y parques recreativos en los condados de Snohomish y King, WA, desde reparación de cercas y terrazas hasta limpieza de canaletas, limpieza de jardines, poda y destoconado.",
    },
    items: {
      en: [
        "Fence installation and repairs",
        "Deck repairs and improvements",
        "Shed repairs and maintenance",
        "Minor exterior carpentry",
        "Gutter cleaning and maintenance",
        "Yard and property cleanup",
        "Tree and brush trimming",
        "Stump removal and grinding",
        "General property improvement projects",
      ],
      es: [
        "Instalación y reparación de cercas",
        "Reparación y mejora de terrazas (decks)",
        "Reparación y mantenimiento de cobertizos",
        "Carpintería exterior menor",
        "Limpieza y mantenimiento de canaletas",
        "Limpieza de jardines y propiedades",
        "Poda de árboles y arbustos",
        "Remoción y triturado de tocones",
        "Proyectos generales de mejora de propiedades",
      ],
    },
    faqs: [
      {
        q: {
          en: "Do you offer ongoing maintenance for property managers?",
          es: "¿Ofrecen mantenimiento continuo para administradores de propiedades?",
        },
        a: {
          en: "Yes. We work with property management companies, residential communities and recreational parks on recurring maintenance, repairs and improvement projects.",
          es: "Sí. Trabajamos con empresas administradoras, comunidades residenciales y parques recreativos en mantenimiento recurrente, reparaciones y proyectos de mejora.",
        },
      },
      {
        q: {
          en: "Can you handle several small repairs in one visit?",
          es: "¿Pueden hacer varias reparaciones pequeñas en una sola visita?",
        },
        a: {
          en: "Yes. Send us your list (fence, deck, gutters, cleanup) and we will prepare a single detailed estimate and schedule the work efficiently.",
          es: "Sí. Envíanos tu lista (cerca, terraza, canaletas, limpieza) y prepararemos un solo estimado detallado para programar el trabajo de forma eficiente.",
        },
      },
    ],
    related: ["pressure-washing", "excavation-grading-site-work"],
  },
];

export const featuredServices = services.filter((s) => s.featured);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
