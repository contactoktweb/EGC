import type { Project, ProjectCategory } from "@/lib/content/types";


/**
 * Proyecto tal como se escribe en el código.
 * - image: nombre del archivo en src/content/images (foto o portada del video).
 * - video (opcional): nombre del archivo en public/videos, p. ej. "epoxy-garage.mp4".
 */
export type ProjectSource = Omit<Project, "image" | "video"> & { image: string; video?: string };

const p = (id: string, category: ProjectCategory, image: string, en: string, es: string): ProjectSource => ({
  id,
  category,
  image,
  alt: { en, es },
});

export const projectData: ProjectSource[] = [
  // Epoxy work
  p("flake-garage-2", "epoxy", "decorative-flake-epoxy-garage-floor.jpg", "Decorative flake epoxy garage floor in gray, black and white", "Piso de garaje con epoxy decorativo tipo flake en gris, negro y blanco"),
  // Pour concrete
  p("stamped-curved", "pour", "stamped-concrete-patio-curved-border.jpg", "Stamped concrete patio with curved decorative border", "Patio de concreto estampado con borde decorativo curvo"),
  // Polishing concrete
  p("polished-lobby", "polish", "polished-concrete-commercial-lobby.jpg", "Polished concrete floor in a commercial lobby", "Piso de concreto pulido en el vestíbulo de un edificio comercial"),
  p("driveway-garage", "pour", "new-concrete-driveway-garage.jpg", "New concrete driveway poured in front of a garage", "Entrada de autos de concreto nueva frente a un garaje"),
  p("flake-garage", "epoxy", "flake-epoxy-garage-floor.jpg", "Flake epoxy coating on a residential garage floor", "Recubrimiento epóxico tipo flake en el piso de un garaje residencial"),
  p("polished-hallway", "polish", "polished-concrete-hallway.jpg", "Polished concrete hallway with high-gloss finish", "Pasillo de concreto pulido con acabado de alto brillo"),
  p("stamped-patio", "pour", "stamped-concrete-patio.jpg", "Stamped concrete patio with stone pattern", "Patio de concreto estampado con patrón de piedra"),
  p("polished-showroom", "polish", "polished-concrete-showroom-floor.jpg", "Polished concrete floor in a bright showroom", "Piso de concreto pulido en una sala de exhibición"),
  p("stamped-porch", "pour", "stamped-concrete-entry-porch.jpg", "Stamped concrete entry porch and front steps", "Porche de entrada y escalones de concreto estampado"),
  p("balcony-coating", "epoxy", "balcony-protective-floor-coating.jpg", "Protective floor coating on a residential balcony", "Recubrimiento protector en el piso de un balcón residencial"),
  p("driveway-install", "pour", "concrete-driveway-installation.jpg", "Residential concrete driveway installation", "Instalación de entrada de autos de concreto residencial"),
  p("polished-commercial", "polish", "polished-concrete-floor-commercial.jpg", "Crew polishing a concrete floor in a commercial space", "Equipo puliendo un piso de concreto en un espacio comercial"),
  p("stairs-pour", "pour", "concrete-stairs-pour.jpg", "Poured concrete stairs with broom-finished treads", "Escaleras de concreto vaciado con huellas escobilladas"),
  p("grinding-progress", "polish", "concrete-grinding-polishing-in-progress.jpg", "Concrete grinding and polishing in progress", "Desbaste y pulido de concreto en proceso"),
  p("wood-stamped", "pour", "wood-plank-stamped-concrete.jpg", "Wood-plank stamped concrete patio", "Patio de concreto estampado con textura de madera"),
  p("broom-patio", "pour", "broom-finish-concrete-patio.jpg", "Broom-finish concrete patio under a covered porch", "Patio de concreto escobillado bajo un porche techado"),
  p("steps-patio", "pour", "concrete-steps-and-patio.jpg", "Concrete steps and patio for a residential backyard", "Escalones y patio de concreto en un jardín residencial"),
  p("driveway-broom", "pour", "concrete-driveway-broom-finish.jpg", "Broom-finish concrete driveway along a hillside", "Entrada de concreto escobillado junto a una ladera"),
  p("walkway-forming", "pour", "concrete-walkway-forming.jpg", "Concrete walkway being formed and poured", "Andador de concreto en proceso de cimbrado y vaciado"),
  p("slab-pour", "pour", "concrete-slab-pour.jpg", "Freshly poured concrete slab", "Losa de concreto recién vaciada"),
  p("steps-broom", "pour", "concrete-steps-broom-finish.jpg", "Concrete steps with broom finish", "Escalones de concreto con acabado escobillado"),
  p("stairs-steps", "pour", "concrete-stairs-steps.jpg", "Interior concrete stairs poured on site", "Escaleras interiores de concreto vaciadas en obra"),
];

