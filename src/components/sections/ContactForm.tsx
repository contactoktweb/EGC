"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Dictionary } from "@/content/dictionary";

type Status = "idle" | "sending" | "success" | "error";

const MAX_PHOTOS = 5;

/**
 * Reduce una foto en el navegador (máx. 1600 px, JPEG) antes de enviarla: llega más rápido
 * y el envío completo queda por debajo del límite del servidor. Si el navegador no puede
 * leer el formato (p. ej. HEIC), se envía el archivo original.
 */
async function shrinkPhoto(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
    return blob ?? file;
  } catch {
    return file;
  }
}

/**
 * Formulario de estimado (con fotos). Envía a /api/contact, que guarda la solicitud
 * en Sanity → "Solicitudes de cotización".
 */
export function ContactForm({
  labels,
  services,
  cities,
  lang,
  privacy,
}: {
  labels: Dictionary["form"];
  /** Enlace a la política de privacidad (requerido por Google Ads en páginas con formulario). */
  privacy: { href: string; label: string };
  services: { value: string; label: string }[];
  cities: string[];
  lang: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [photoError, setPhotoError] = useState("");

  function onPhotos(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
    e.target.value = "";
    const next = [...photos, ...picked.map((file) => ({ file, url: URL.createObjectURL(file) }))];
    setPhotoError(next.length > MAX_PHOTOS ? labels.photosTooMany : "");
    next.slice(MAX_PHOTOS).forEach((p) => URL.revokeObjectURL(p.url));
    setPhotos(next.slice(0, MAX_PHOTOS));
  }

  function removePhoto(i: number) {
    URL.revokeObjectURL(photos[i].url);
    setPhotos(photos.filter((_, j) => j !== i));
    setPhotoError("");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const body = new FormData(form);
      body.delete("photos-picker");
      body.set("lang", lang);
      for (const [i, p] of photos.entries()) {
        body.append("photos", await shrinkPhoto(p.file), `foto-${i + 1}.jpg`);
      }
      const res = await fetch("/api/contact", { method: "POST", body });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      photos.forEach((p) => URL.revokeObjectURL(p.url));
      setPhotos([]);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full rounded border border-line bg-ink px-3.5 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-brand-light focus:outline-none";
  const label = "mb-1.5 block text-xs font-bold tracking-wide text-neutral-300 uppercase";

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-md border border-line bg-ink-2 p-6 sm:grid-cols-2 md:p-8">
      <h2 className="text-xl font-bold sm:col-span-2">{labels.title}</h2>

      <div>
        <label htmlFor="cf-name" className={label}>
          {labels.name} *
        </label>
        <input id="cf-name" name="name" required autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="cf-phone" className={label}>
          {labels.phone} *
        </label>
        <input id="cf-phone" name="phone" type="tel" required autoComplete="tel" className={field} />
      </div>
      <div>
        <label htmlFor="cf-email" className={label}>
          {labels.email} *
        </label>
        <input id="cf-email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="cf-city" className={label}>
          {labels.city}
        </label>
        <select id="cf-city" name="city" defaultValue="" className={field}>
          <option value="" disabled>
            {labels.cityPlaceholder}
          </option>
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
          <option>{labels.other}</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="cf-service" className={label}>
          {labels.service}
        </label>
        <select id="cf-service" name="service" defaultValue="" className={field}>
          <option value="" disabled>
            {labels.servicePlaceholder}
          </option>
          {services.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
          <option>{labels.other}</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="cf-message" className={label}>
          {labels.message} *
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          placeholder={labels.messagePlaceholder}
          className={field}
        />
      </div>

      <div className="sm:col-span-2">
        <span className={label}>{labels.photos}</span>
        <p className="mb-2 text-xs text-neutral-400">{labels.photosHelp}</p>
        <div className="flex flex-wrap items-center gap-3">
          {photos.map((p, i) => (
            <div key={p.url} className="relative h-20 w-20 overflow-hidden rounded border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:) */}
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/90 text-sm text-white"
                aria-label={`${labels.photos} ${i + 1}: ✕`}
              >
                ✕
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded border border-dashed border-line text-2xl text-neutral-400 transition hover:border-brand-light hover:text-brand-light">
              +
              <input
                type="file"
                name="photos-picker"
                accept="image/*"
                multiple
                onChange={onPhotos}
                className="sr-only"
                aria-label={labels.photos}
              />
            </label>
          )}
        </div>
        {photoError && <p className="mt-2 text-xs text-amber-300">{photoError}</p>}
      </div>

      {/* Honeypot anti-spam: invisible para personas. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="cf-company">Company</label>
        <input id="cf-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full disabled:opacity-60">
          {status === "sending" ? labels.sending : labels.submit}
        </button>
        <p className="mt-3 text-xs text-neutral-400">
          {labels.privacy}{" "}
          <a href={privacy.href} className="underline underline-offset-2 hover:text-white">
            {privacy.label}
          </a>
        </p>
        <p aria-live="polite" className="mt-2 text-sm">
          {status === "success" && <span className="text-brand-light">{labels.success}</span>}
          {status === "error" && <span className="text-amber-300">{labels.error}</span>}
        </p>
      </div>
    </form>
  );
}
