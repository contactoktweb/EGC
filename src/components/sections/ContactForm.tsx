"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/content/dictionary";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Formulario de estimado. Envía a /api/contact.
 * El envío de correo con Resend se conectará en la etapa final (ver src/app/api/contact/route.ts).
 */
export function ContactForm({
  labels,
  services,
  cities,
  lang,
}: {
  labels: Dictionary["form"];
  services: { value: string; label: string }[];
  cities: string[];
  lang: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, lang }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
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
          {labels.email}
        </label>
        <input id="cf-email" name="email" type="email" autoComplete="email" className={field} />
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

      {/* Honeypot anti-spam: invisible para personas. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="cf-company">Company</label>
        <input id="cf-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full disabled:opacity-60">
          {status === "sending" ? labels.sending : labels.submit}
        </button>
        <p className="mt-3 text-xs text-neutral-400">{labels.privacy}</p>
        <p aria-live="polite" className="mt-2 text-sm">
          {status === "success" && <span className="text-brand-light">{labels.success}</span>}
          {status === "error" && <span className="text-amber-300">{labels.error}</span>}
        </p>
      </div>
    </form>
  );
}
