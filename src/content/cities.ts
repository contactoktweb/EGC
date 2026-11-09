import type { City, County } from "@/lib/content/types";

/** Condados del área de servicio (cada uno tiene su página: /service-areas/[slug]). */
export const counties: County[] = [
  {
    slug: "snohomish-county",
    name: { en: "Snohomish County", es: "Condado de Snohomish" },
    schemaName: "Snohomish County, Washington",
    mapQuery: "Snohomish County, WA",
    note: {
      en: "Snohomish County is our home base. We work in Everett, Marysville, Lake Stevens, Snohomish, Arlington and Monroe on residential, commercial and contractor projects.",
      es: "El condado de Snohomish es nuestra base. Trabajamos en Everett, Marysville, Lake Stevens, Snohomish, Arlington y Monroe en proyectos residenciales, comerciales y para contratistas.",
    },
  },
  {
    slug: "skagit",
    name: { en: "Skagit County", es: "Condado de Skagit" },
    schemaName: "Skagit County, Washington",
    mapQuery: "Skagit County, WA",
    note: {
      en: "North of Snohomish County along I-5, we serve Mount Vernon, Burlington, Anacortes and Sedro-Woolley with concrete, floor coatings, site work and property maintenance.",
      es: "Al norte del condado de Snohomish, por la I-5, atendemos Mount Vernon, Burlington, Anacortes y Sedro-Woolley con concreto, recubrimientos de pisos, trabajos de terreno y mantenimiento.",
    },
  },
  {
    slug: "north-king-county",
    name: { en: "North King County", es: "Norte del condado de King" },
    schemaName: "North King County, Washington",
    mapQuery: "Bothell, WA",
    note: {
      en: "In the north end of King County we serve Bothell, Woodinville and Kirkland, for homeowners, businesses and general contractors.",
      es: "En el norte del condado de King atendemos Bothell, Woodinville y Kirkland, para propietarios, negocios y contratistas generales.",
    },
  },
];

export const cities: City[] = [
  {
    slug: "everett",
    name: "Everett",
    county: "snohomish-county",
    nearby: ["marysville", "lake-stevens", "snohomish"],
    note: {
      en: "As the Snohomish County seat with a large mix of homes, businesses and industrial facilities, Everett is a key area for our residential and commercial concrete and flooring work.",
      es: "Como sede del condado de Snohomish, con una gran mezcla de casas, negocios e instalaciones industriales, Everett es un área clave para nuestros trabajos residenciales y comerciales de concreto y pisos.",
    },
  },
  {
    slug: "marysville",
    name: "Marysville",
    county: "snohomish-county",
    nearby: ["arlington", "lake-stevens", "everett"],
    note: {
      en: "We serve Marysville homeowners and businesses with concrete driveways, patios, epoxy garage floors, asphalt repairs and property maintenance.",
      es: "Atendemos a propietarios y negocios de Marysville con entradas y patios de concreto, garajes con epoxy, reparación de asfalto y mantenimiento de propiedades.",
    },
  },
  {
    slug: "lake-stevens",
    name: "Lake Stevens",
    county: "snohomish-county",
    nearby: ["snohomish", "marysville", "everett"],
    note: {
      en: "Lake Stevens is one of the fastest-growing communities in Snohomish County, and new homes here often need driveways, patios, garage floors and site work.",
      es: "Lake Stevens es una de las comunidades de mayor crecimiento en el condado de Snohomish, y sus casas nuevas suelen necesitar entradas, patios, pisos de garaje y trabajos de terreno.",
    },
  },
  {
    slug: "snohomish",
    name: "Snohomish",
    county: "snohomish-county",
    nearby: ["lake-stevens", "monroe", "everett"],
    note: {
      en: "From historic downtown homes to rural properties along the Snohomish River valley, we help Snohomish property owners with concrete, exterior and maintenance projects.",
      es: "Desde casas del centro histórico hasta propiedades rurales en el valle del río Snohomish, ayudamos a los propietarios de Snohomish con proyectos de concreto, exteriores y mantenimiento.",
    },
  },
  {
    slug: "arlington",
    name: "Arlington",
    county: "snohomish-county",
    nearby: ["marysville", "mount-vernon", "lake-stevens"],
    note: {
      en: "In Arlington we work on everything from residential concrete and gravel driveways to shop floors, grading and drainage on larger rural lots.",
      es: "En Arlington trabajamos desde concreto residencial y entradas de grava hasta pisos de talleres, nivelación y drenaje en terrenos rurales grandes.",
    },
  },
  {
    slug: "monroe",
    name: "Monroe",
    county: "snohomish-county",
    nearby: ["snohomish", "woodinville", "bothell"],
    note: {
      en: "Monroe property owners count on us for concrete pads, patios, garage and shop floor coatings, excavation and exterior cleaning.",
      es: "Los propietarios de Monroe confían en nosotros para bases de concreto, patios, recubrimientos de pisos de garajes y talleres, excavación y limpieza exterior.",
    },
  },
  {
    slug: "mount-vernon",
    name: "Mount Vernon",
    county: "skagit",
    nearby: ["burlington", "sedro-woolley", "anacortes"],
    note: {
      en: "Mount Vernon is the Skagit County seat; we help its homeowners and businesses with concrete driveways and patios, garage epoxy, polished floors and site work.",
      es: "Mount Vernon es la sede del condado de Skagit; ayudamos a sus propietarios y negocios con entradas y patios de concreto, epoxy para garajes, pisos pulidos y trabajos de terreno.",
    },
  },
  {
    slug: "burlington",
    name: "Burlington",
    county: "skagit",
    nearby: ["mount-vernon", "sedro-woolley", "anacortes"],
    note: {
      en: "Right next to Mount Vernon along I-5, Burlington mixes homes, retail and commercial properties that need concrete, floor coatings, asphalt and exterior maintenance.",
      es: "Junto a Mount Vernon por la I-5, Burlington combina casas, comercios y propiedades comerciales que necesitan concreto, recubrimientos de pisos, asfalto y mantenimiento exterior.",
    },
  },
  {
    slug: "anacortes",
    name: "Anacortes",
    county: "skagit",
    nearby: ["burlington", "mount-vernon"],
    note: {
      en: "On Fidalgo Island, home of the ferry terminal to the San Juan Islands, Anacortes properties call for durable concrete, protective coatings and regular exterior cleaning.",
      es: "En la isla Fidalgo, donde está la terminal de ferris a las islas San Juan, las propiedades de Anacortes necesitan concreto resistente, recubrimientos protectores y limpieza exterior regular.",
    },
  },
  {
    slug: "sedro-woolley",
    name: "Sedro-Woolley",
    county: "skagit",
    nearby: ["burlington", "mount-vernon"],
    note: {
      en: "Known as the gateway to the North Cascades, Sedro-Woolley has many rural properties where we handle gravel driveways, grading, concrete pads and shop floors.",
      es: "Conocida como la puerta de entrada a las North Cascades, Sedro-Woolley tiene muchas propiedades rurales donde hacemos entradas de grava, nivelación, bases de concreto y pisos de talleres.",
    },
  },
  {
    slug: "bothell",
    name: "Bothell",
    county: "north-king-county",
    nearby: ["woodinville", "kirkland", "monroe"],
    note: {
      en: "Bothell sits on the line between King and Snohomish counties; we serve both sides with concrete, polished floors, epoxy coatings and maintenance services.",
      es: "Bothell está en el límite entre los condados de King y Snohomish; atendemos ambos lados con concreto, pisos pulidos, recubrimientos epóxicos y mantenimiento.",
    },
  },
  {
    slug: "woodinville",
    name: "Woodinville",
    county: "north-king-county",
    nearby: ["bothell", "kirkland", "monroe"],
    note: {
      en: "From homes to wineries and commercial spaces, Woodinville clients hire us for decorative concrete, polished and coated floors, and exterior improvements.",
      es: "Desde casas hasta bodegas de vino y espacios comerciales, los clientes de Woodinville nos contratan para concreto decorativo, pisos pulidos y recubiertos, y mejoras exteriores.",
    },
  },
  {
    slug: "kirkland",
    name: "Kirkland",
    county: "north-king-county",
    nearby: ["bothell", "woodinville"],
    note: {
      en: "We help Kirkland homeowners and businesses with stamped concrete patios, driveways, garage epoxy, polished concrete and pressure washing.",
      es: "Ayudamos a propietarios y negocios de Kirkland con patios de concreto estampado, entradas de autos, epoxy para garajes, concreto pulido y lavado a presión.",
    },
  },
];

