import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ciudades que ya no forman parte del área de servicio: redirección permanente a la lista de áreas.
  redirects() {
    return [
      // El Studio de Sanity ahora vive en /admin.
      { source: "/studio/:path*", destination: "/admin/:path*", permanent: true },
      {
        source: "/:lang(en|es)/service-areas/:city(seattle|bellevue|redmond)",
        destination: "/:lang/service-areas",
        permanent: true,
      },
    ];
  },
  // Imágenes subidas a Sanity (se sirven desde su CDN).
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" }],
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
