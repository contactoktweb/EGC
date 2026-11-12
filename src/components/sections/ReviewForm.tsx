"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/content/dictionary";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Formulario para que el cliente deje su reseña. Envía a /api/reviews, que la guarda en
 * Sanity → Reseñas como "Pendiente": solo aparece en la web cuando el equipo la aprueba.
 */
export function ReviewForm({
  labels,
  services,
  lang,
  startOpen = false,
}: {
  labels: Dictionary["reviews"];
  services: { value: string; label: string }[];
  lang: string;
  startOpen?: boolean;
}) {
  const [open, setOpen] = useState(startOpen);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const data = Object.fromEntries(new FormData(form));
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, rating, lang }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setRating(5);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-primary hero-lift"
      >
        {labels.write}
      </button>
    );
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="mx-auto max-w-xl rounded-md border border-brand/50 bg-brand/10 p-5 text-center text-sm text-white"
      >
        {labels.formSuccess}
      </p>
    );
  }

  const field =
    "w-full rounded border border-line bg-ink px-3.5 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-brand-light focus:outline-none";
  const label =
    "mb-1.5 block text-xs font-bold tracking-wide text-neutral-300 uppercase";
  const shown = hover || rating;

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto grid max-w-2xl gap-4 rounded-md border border-line bg-ink p-6 text-left sm:grid-cols-2 md:p-8"
    >
      <div className="sm:col-span-2">
        <h3 className="text-xl font-bold">{labels.formTitle}</h3>
        <p className="mt-1 text-sm text-neutral-400">{labels.formLead}</p>
      </div>

      <fieldset className="sm:col-span-2">
        <legend className={label}>{labels.formRating} *</legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className="cursor-pointer"
              onMouseEnter={() => setHover(n)}
            >
              <input
                type="radio"
                name="stars"
                value={n}
                checked={rating === n}
                onChange={() => setRating(n)}
                className="peer sr-only"
              />
              <span className="sr-only">
                {n} {labels.outOf}
              </span>
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className={`h-8 w-8 transition peer-focus-visible:outline-2 peer-focus-visible:outline-brand-light ${n <= shown ? "text-amber-400" : "text-neutral-600"}`}
                fill="currentColor"
              >
                <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
              </svg>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="rv-name" className={label}>
          {labels.formName} *
        </label>
        <input
          id="rv-name"
          name="name"
          required
          maxLength={80}
          autoComplete="name"
          className={field}
        />
      </div>
      <div>
        <label htmlFor="rv-city" className={label}>
          {labels.formCity}
        </label>
        <input
          id="rv-city"
          name="city"
          maxLength={80}
          autoComplete="address-level2"
          className={field}
        />
      </div>
      <div>
        <label htmlFor="rv-email" className={label}>
          {labels.formEmail}
        </label>
        <input
          id="rv-email"
          name="email"
          type="email"
          maxLength={200}
          autoComplete="email"
          className={field}
        />
      </div>
      <div>
        <label htmlFor="rv-service" className={label}>
          {labels.formService}
        </label>
        <select
          id="rv-service"
          name="service"
          defaultValue=""
          className={field}
        >
          <option value="">—</option>
          {services.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="rv-text" className={label}>
          {labels.formText} *
        </label>
        <textarea
          id="rv-text"
          name="text"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder={labels.formTextPlaceholder}
          className={field}
        />
      </div>

      {/* Honeypot anti-spam: invisible para personas. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="rv-company">Company</label>
        <input
          id="rv-company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-primary disabled:opacity-60"
        >
          {status === "sending" ? labels.formSending : labels.formSubmit}
        </button>
        {status === "error" && (
          <p role="alert" className="text-sm text-amber-300">
            {labels.formError}
          </p>
        )}
      </div>
    </form>
  );
}
