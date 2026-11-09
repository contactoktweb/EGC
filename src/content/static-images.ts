import type { StaticImageData } from "next/image";
import imgBalconyProtectiveFloorCoating from "./images/balcony-protective-floor-coating.jpg";
import imgBroomFinishConcretePatio from "./images/broom-finish-concrete-patio.jpg";
import imgConcreteDrivewayBroomFinish from "./images/concrete-driveway-broom-finish.jpg";
import imgConcreteDrivewayInstallation from "./images/concrete-driveway-installation.jpg";
import imgConcreteGrindingPolishingInProgress from "./images/concrete-grinding-polishing-in-progress.jpg";
import imgConcreteSlabPour from "./images/concrete-slab-pour.jpg";
import imgConcreteStairsPour from "./images/concrete-stairs-pour.jpg";
import imgConcreteStairsSteps from "./images/concrete-stairs-steps.jpg";
import imgConcreteStepsAndPatio from "./images/concrete-steps-and-patio.jpg";
import imgConcreteStepsBroomFinish from "./images/concrete-steps-broom-finish.jpg";
import imgConcreteWalkwayForming from "./images/concrete-walkway-forming.jpg";
import imgDecorativeFlakeEpoxyGarageFloor from "./images/decorative-flake-epoxy-garage-floor.jpg";
import imgFlakeEpoxyGarageFloor from "./images/flake-epoxy-garage-floor.jpg";
import imgNewConcreteDrivewayGarage from "./images/new-concrete-driveway-garage.jpg";
import imgPolishedConcreteCommercialLobby from "./images/polished-concrete-commercial-lobby.jpg";
import imgPolishedConcreteFloorCommercial from "./images/polished-concrete-floor-commercial.jpg";
import imgPolishedConcreteHallway from "./images/polished-concrete-hallway.jpg";
import imgPolishedConcreteShowroomFloor from "./images/polished-concrete-showroom-floor.jpg";
import imgStampedConcreteEntryPorch from "./images/stamped-concrete-entry-porch.jpg";
import imgStampedConcretePatioCurvedBorder from "./images/stamped-concrete-patio-curved-border.jpg";
import imgStampedConcretePatio from "./images/stamped-concrete-patio.jpg";
import imgWoodPlankStampedConcrete from "./images/wood-plank-stamped-concrete.jpg";
import imgBrandLogoHorizontal from "./images/brand/logo-horizontal.png";
import imgBrandLogoSquare from "./images/brand/logo-square.png";
import imgBrandOgImage from "./images/brand/og-image.jpg";

/**
 * Imágenes locales indexadas por nombre de archivo (respaldo cuando Sanity no está configurado).
 * Al agregar una foto nueva a src/content/images, agrégala también aquí.
 */
export const staticImages: Record<string, StaticImageData> = {
  "balcony-protective-floor-coating.jpg": imgBalconyProtectiveFloorCoating,
  "broom-finish-concrete-patio.jpg": imgBroomFinishConcretePatio,
  "concrete-driveway-broom-finish.jpg": imgConcreteDrivewayBroomFinish,
  "concrete-driveway-installation.jpg": imgConcreteDrivewayInstallation,
  "concrete-grinding-polishing-in-progress.jpg": imgConcreteGrindingPolishingInProgress,
  "concrete-slab-pour.jpg": imgConcreteSlabPour,
  "concrete-stairs-pour.jpg": imgConcreteStairsPour,
  "concrete-stairs-steps.jpg": imgConcreteStairsSteps,
  "concrete-steps-and-patio.jpg": imgConcreteStepsAndPatio,
  "concrete-steps-broom-finish.jpg": imgConcreteStepsBroomFinish,
  "concrete-walkway-forming.jpg": imgConcreteWalkwayForming,
  "decorative-flake-epoxy-garage-floor.jpg": imgDecorativeFlakeEpoxyGarageFloor,
  "flake-epoxy-garage-floor.jpg": imgFlakeEpoxyGarageFloor,
  "new-concrete-driveway-garage.jpg": imgNewConcreteDrivewayGarage,
  "polished-concrete-commercial-lobby.jpg": imgPolishedConcreteCommercialLobby,
  "polished-concrete-floor-commercial.jpg": imgPolishedConcreteFloorCommercial,
  "polished-concrete-hallway.jpg": imgPolishedConcreteHallway,
  "polished-concrete-showroom-floor.jpg": imgPolishedConcreteShowroomFloor,
  "stamped-concrete-entry-porch.jpg": imgStampedConcreteEntryPorch,
  "stamped-concrete-patio-curved-border.jpg": imgStampedConcretePatioCurvedBorder,
  "stamped-concrete-patio.jpg": imgStampedConcretePatio,
  "wood-plank-stamped-concrete.jpg": imgWoodPlankStampedConcrete,
  "brand/logo-horizontal.png": imgBrandLogoHorizontal,
  "brand/logo-square.png": imgBrandLogoSquare,
  "brand/og-image.jpg": imgBrandOgImage,
};
