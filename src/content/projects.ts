import type { StaticImageData } from "next/image";
import type { L } from "@/lib/i18n";

import polishedCommercial from "./images/polished-concrete-floor-commercial.jpg";
import stairsPour from "./images/concrete-stairs-pour.jpg";
import stepsPatio from "./images/concrete-steps-and-patio.jpg";
import stampedPorch from "./images/stamped-concrete-entry-porch.jpg";
import slabPour from "./images/concrete-slab-pour.jpg";
import walkwayForming from "./images/concrete-walkway-forming.jpg";
import drivewayInstall from "./images/concrete-driveway-installation.jpg";
import broomPatio from "./images/broom-finish-concrete-patio.jpg";
import polishedHallway from "./images/polished-concrete-hallway.jpg";
import polishedLobby from "./images/polished-concrete-commercial-lobby.jpg";
import stampedPatio from "./images/stamped-concrete-patio.jpg";
import flakeGarage from "./images/flake-epoxy-garage-floor.jpg";
import stepsBroom from "./images/concrete-steps-broom-finish.jpg";
import stampedCurved from "./images/stamped-concrete-patio-curved-border.jpg";
import drivewayGarage from "./images/new-concrete-driveway-garage.jpg";
import polishedShowroom from "./images/polished-concrete-showroom-floor.jpg";
import grindingProgress from "./images/concrete-grinding-polishing-in-progress.jpg";
import woodStamped from "./images/wood-plank-stamped-concrete.jpg";
import balconyCoating from "./images/balcony-protective-floor-coating.jpg";
import drivewayBroom from "./images/concrete-driveway-broom-finish.jpg";
import stairsSteps from "./images/concrete-stairs-steps.jpg";
import flakeGarage2 from "./images/decorative-flake-epoxy-garage-floor.jpg";

/** Categorías de trabajo según las fotos del cliente. */
export type ProjectCategory = "pour" | "polish" | "epoxy";

export type Project = {
  id: string;
  category: ProjectCategory;
  image: StaticImageData;
  alt: L;
};

const p = (id: string, category: ProjectCategory, image: StaticImageData, en: string, es: string): Project => ({
  id,
  category,
  image,
  alt: { en, es },
});

export const projects: Project[] = [
  // Epoxy work
  p("flake-garage-2", "epoxy", flakeGarage2, "Decorative flake epoxy garage floor in gray, black and white", "Piso de garaje con epoxy decorativo tipo flake en gris, negro y blanco"),
  // Pour concrete
  p("stamped-curved", "pour", stampedCurved, "Stamped concrete patio with curved decorative border", "Patio de concreto estampado con borde decorativo curvo"),
  // Polishing concrete
  p("polished-lobby", "polish", polishedLobby, "Polished concrete floor in a commercial lobby", "Piso de concreto pulido en el vestíbulo de un edificio comercial"),
  p("driveway-garage", "pour", drivewayGarage, "New concrete driveway poured in front of a garage", "Entrada de autos de concreto nueva frente a un garaje"),
  p("flake-garage", "epoxy", flakeGarage, "Flake epoxy coating on a residential garage floor", "Recubrimiento epóxico tipo flake en el piso de un garaje residencial"),
  p("polished-hallway", "polish", polishedHallway, "Polished concrete hallway with high-gloss finish", "Pasillo de concreto pulido con acabado de alto brillo"),
  p("stamped-patio", "pour", stampedPatio, "Stamped concrete patio with stone pattern", "Patio de concreto estampado con patrón de piedra"),
  p("polished-showroom", "polish", polishedShowroom, "Polished concrete floor in a bright showroom", "Piso de concreto pulido en una sala de exhibición"),
  p("stamped-porch", "pour", stampedPorch, "Stamped concrete entry porch and front steps", "Porche de entrada y escalones de concreto estampado"),
  p("balcony-coating", "epoxy", balconyCoating, "Protective floor coating on a residential balcony", "Recubrimiento protector en el piso de un balcón residencial"),
  p("driveway-install", "pour", drivewayInstall, "Residential concrete driveway installation", "Instalación de entrada de autos de concreto residencial"),
  p("polished-commercial", "polish", polishedCommercial, "Crew polishing a concrete floor in a commercial space", "Equipo puliendo un piso de concreto en un espacio comercial"),
  p("stairs-pour", "pour", stairsPour, "Poured concrete stairs with broom-finished treads", "Escaleras de concreto vaciado con huellas escobilladas"),
  p("grinding-progress", "polish", grindingProgress, "Concrete grinding and polishing in progress", "Desbaste y pulido de concreto en proceso"),
  p("wood-stamped", "pour", woodStamped, "Wood-plank stamped concrete patio", "Patio de concreto estampado con textura de madera"),
  p("broom-patio", "pour", broomPatio, "Broom-finish concrete patio under a covered porch", "Patio de concreto escobillado bajo un porche techado"),
  p("steps-patio", "pour", stepsPatio, "Concrete steps and patio for a residential backyard", "Escalones y patio de concreto en un jardín residencial"),
  p("driveway-broom", "pour", drivewayBroom, "Broom-finish concrete driveway along a hillside", "Entrada de concreto escobillado junto a una ladera"),
  p("walkway-forming", "pour", walkwayForming, "Concrete walkway being formed and poured", "Andador de concreto en proceso de cimbrado y vaciado"),
  p("slab-pour", "pour", slabPour, "Freshly poured concrete slab", "Losa de concreto recién vaciada"),
  p("steps-broom", "pour", stepsBroom, "Concrete steps with broom finish", "Escalones de concreto con acabado escobillado"),
  p("stairs-steps", "pour", stairsSteps, "Interior concrete stairs poured on site", "Escaleras interiores de concreto vaciadas en obra"),
];

export const projectsByCategory = (category: ProjectCategory) =>
  projects.filter((project) => project.category === category);
