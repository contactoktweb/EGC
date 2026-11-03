"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "../Icons";
import type { Project, ProjectCategory } from "@/content/projects";
import type { Locale } from "@/lib/i18n";

type Labels = { all: string; pour: string; polish: string; epoxy: string; close: string; open: string };

/** Galería filtrable (Pour concrete / Polished / Epoxy) con visor ampliado. */
export function ProjectGallery({
  projects,
  lang,
  labels,
  limit,
  showFilters = true,
}: {
  projects: Project[];
  lang: Locale;
  labels: Labels;
  limit?: number;
  showFilters?: boolean;
}) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const [active, setActive] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const filtered = projects.filter((p) => filter === "all" || p.category === filter);
  const visible = limit ? filtered.slice(0, limit) : filtered;

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (active && !d.open) d.showModal();
    if (!active && d.open) d.close();
  }, [active]);

  const tabs: { key: ProjectCategory | "all"; label: string }[] = [
    { key: "all", label: labels.all },
    { key: "pour", label: labels.pour },
    { key: "polish", label: labels.polish },
    { key: "epoxy", label: labels.epoxy },
  ];
  const catLabel = (c: ProjectCategory) => labels[c];

  return (
    <div>
      {showFilters && (
        <div role="group" aria-label="Filter" className="mb-8 flex flex-wrap justify-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={filter === t.key}
              onClick={() => setFilter(t.key)}
              className={`rounded-full border-[1.5px] border-ink px-4 py-2 text-sm font-bold transition ${
                filter === t.key ? "bg-ink text-white" : "hover:bg-ink/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setActive(p)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded bg-neutral-300"
            >
              <Image
                src={p.image}
                alt={p.alt[lang]}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-2 left-2 rounded-sm bg-ink/85 px-2 py-1 text-[0.65rem] font-bold tracking-wide text-white uppercase">
                {catLabel(p.category)}
              </span>
              <span className="sr-only">{labels.open}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setActive(null);
        }}
        className="m-auto max-h-[92vh] w-[min(1100px,94vw)] bg-transparent p-0 backdrop:bg-black/85"
      >
        {active && (
          <figure className="relative">
            <Image
              src={active.image}
              alt={active.alt[lang]}
              placeholder="blur"
              sizes="94vw"
              className="max-h-[82vh] w-full rounded object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-neutral-200">{active.alt[lang]}</figcaption>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute top-2 right-2 rounded-full bg-ink/90 p-2 text-white"
              autoFocus
            >
              <CloseIcon className="h-5 w-5" />
              <span className="sr-only">{labels.close}</span>
            </button>
          </figure>
        )}
      </dialog>
    </div>
  );
}
