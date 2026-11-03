import type { L } from "@/lib/i18n";

export type City = {
  slug: string;
  name: string;
  county: "Snohomish County" | "King County";
  nearby: string[];
  /** Contexto local breve y verificable para evitar páginas duplicadas. */
  note: L;
};

export const cities: City[] = [
  {
    slug: "snohomish",
    name: "Snohomish",
    county: "Snohomish County",
    nearby: ["lake-stevens", "monroe", "everett"],
    note: {
      en: "From historic downtown homes to rural properties along the Snohomish River valley, we help Snohomish property owners with concrete, exterior and maintenance projects.",
      es: "Desde casas del centro histórico hasta propiedades rurales en el valle del río Snohomish, ayudamos a los propietarios de Snohomish con proyectos de concreto, exteriores y mantenimiento.",
    },
  },
  {
    slug: "lake-stevens",
    name: "Lake Stevens",
    county: "Snohomish County",
    nearby: ["snohomish", "marysville", "everett"],
    note: {
      en: "Lake Stevens is one of the fastest-growing communities in Snohomish County, and new homes here often need driveways, patios, garage floors and site work.",
      es: "Lake Stevens es una de las comunidades de mayor crecimiento en el condado de Snohomish, y sus casas nuevas suelen necesitar entradas, patios, pisos de garaje y trabajos de terreno.",
    },
  },
  {
    slug: "everett",
    name: "Everett",
    county: "Snohomish County",
    nearby: ["marysville", "lake-stevens", "snohomish"],
    note: {
      en: "As the Snohomish County seat with a large mix of homes, businesses and industrial facilities, Everett is a key area for our residential and commercial concrete and flooring work.",
      es: "Como sede del condado de Snohomish, con una gran mezcla de casas, negocios e instalaciones industriales, Everett es un área clave para nuestros trabajos residenciales y comerciales de concreto y pisos.",
    },
  },
  {
    slug: "marysville",
    name: "Marysville",
    county: "Snohomish County",
    nearby: ["arlington", "lake-stevens", "everett"],
    note: {
      en: "We serve Marysville homeowners and businesses with concrete driveways, patios, epoxy garage floors, asphalt repairs and property maintenance.",
      es: "Atendemos a propietarios y negocios de Marysville con entradas y patios de concreto, garajes con epoxy, reparación de asfalto y mantenimiento de propiedades.",
    },
  },
  {
    slug: "arlington",
    name: "Arlington",
    county: "Snohomish County",
    nearby: ["marysville", "lake-stevens", "snohomish"],
    note: {
      en: "In Arlington we work on everything from residential concrete and gravel driveways to shop floors, grading and drainage on larger rural lots.",
      es: "En Arlington trabajamos desde concreto residencial y entradas de grava hasta pisos de talleres, nivelación y drenaje en terrenos rurales grandes.",
    },
  },
  {
    slug: "monroe",
    name: "Monroe",
    county: "Snohomish County",
    nearby: ["snohomish", "woodinville", "bothell"],
    note: {
      en: "Monroe property owners count on us for concrete pads, patios, garage and shop floor coatings, excavation and exterior cleaning.",
      es: "Los propietarios de Monroe confían en nosotros para bases de concreto, patios, recubrimientos de pisos de garajes y talleres, excavación y limpieza exterior.",
    },
  },
  {
    slug: "bothell",
    name: "Bothell",
    county: "King County",
    nearby: ["woodinville", "kirkland", "monroe"],
    note: {
      en: "Bothell sits on the line between King and Snohomish counties; we serve both sides with concrete, polished floors, epoxy coatings and maintenance services.",
      es: "Bothell está en el límite entre los condados de King y Snohomish; atendemos ambos lados con concreto, pisos pulidos, recubrimientos epóxicos y mantenimiento.",
    },
  },
  {
    slug: "woodinville",
    name: "Woodinville",
    county: "King County",
    nearby: ["bothell", "redmond", "kirkland"],
    note: {
      en: "From homes to wineries and commercial spaces, Woodinville clients hire us for decorative concrete, polished and coated floors, and exterior improvements.",
      es: "Desde casas hasta bodegas de vino y espacios comerciales, los clientes de Woodinville nos contratan para concreto decorativo, pisos pulidos y recubiertos, y mejoras exteriores.",
    },
  },
  {
    slug: "kirkland",
    name: "Kirkland",
    county: "King County",
    nearby: ["redmond", "bellevue", "bothell"],
    note: {
      en: "We help Kirkland homeowners and businesses with stamped concrete patios, driveways, garage epoxy, polished concrete and pressure washing.",
      es: "Ayudamos a propietarios y negocios de Kirkland con patios de concreto estampado, entradas de autos, epoxy para garajes, concreto pulido y lavado a presión.",
    },
  },
  {
    slug: "redmond",
    name: "Redmond",
    county: "King County",
    nearby: ["kirkland", "bellevue", "woodinville"],
    note: {
      en: "Redmond offices, retail spaces and homes rely on us for floor preparation, polished concrete, protective coatings and concrete repairs.",
      es: "Oficinas, comercios y casas de Redmond confían en nosotros para preparación de pisos, concreto pulido, recubrimientos protectores y reparaciones de concreto.",
    },
  },
  {
    slug: "bellevue",
    name: "Bellevue",
    county: "King County",
    nearby: ["redmond", "kirkland", "seattle"],
    note: {
      en: "In Bellevue we deliver commercial-grade polished concrete and coatings, as well as high-end residential driveways, patios and garage floors.",
      es: "En Bellevue entregamos concreto pulido y recubrimientos de nivel comercial, además de entradas, patios y pisos de garaje residenciales de alta gama.",
    },
  },
  {
    slug: "seattle",
    name: "Seattle",
    county: "King County",
    nearby: ["bellevue", "kirkland", "bothell"],
    note: {
      en: "We support Seattle general contractors, property managers and homeowners with concrete, floor preparation, specialty coatings and site improvements.",
      es: "Apoyamos a contratistas generales, administradores de propiedades y propietarios de Seattle con concreto, preparación de pisos, recubrimientos especiales y mejoras del terreno.",
    },
  },
];

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export const countyName = (county: City["county"], lang: "en" | "es") =>
  lang === "en" ? county : county === "King County" ? "condado de King" : "condado de Snohomish";
