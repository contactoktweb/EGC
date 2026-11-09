import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export { metadata, viewport } from "next-sanity/studio";

/** Studio de Sanity integrado: https://tu-dominio.com/studio */
export default function StudioPage() {
  return <NextStudio config={config} />;
}
