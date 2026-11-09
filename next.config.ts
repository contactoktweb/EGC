import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ciudades que ya no forman parte del área de servicio: redirección permanente a la lista de áreas.
  redirects() {
    return [
      {
        source: "/:lang(en|es)/service-areas/:city(seattle|bellevue|redmond)",
        destination: "/:lang/service-areas",
        permanent: true,
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
