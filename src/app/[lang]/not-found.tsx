import Link from "next/link";
import { getDictionary } from "@/content/dictionary";

// not-found no recibe params; se muestra en inglés con enlace también al español.
export default function NotFound() {
  const en = getDictionary("en");
  const es = getDictionary("es");
  return (
    <section className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="text-4xl font-bold">{en.pages.notFoundTitle}</h1>
      <p className="mt-3 text-neutral-300">{en.pages.notFoundText}</p>
      <p lang="es" className="mt-1 text-neutral-400">
        {es.pages.notFoundText}
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/en" className="btn btn-primary">
          {en.pages.backHome}
        </Link>
        <Link href="/es" className="btn btn-outline">
          {es.pages.backHome}
        </Link>
      </div>
    </section>
  );
}
