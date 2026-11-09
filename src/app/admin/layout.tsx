import type { ReactNode } from "react";

/** Layout raíz propio del Studio (separado del sitio bilingüe). */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
