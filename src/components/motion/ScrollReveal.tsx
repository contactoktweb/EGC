"use client";

import { useEffect } from "react";

/**
 * Animaciones al hacer scroll para toda la web.
 *
 * - `data-reveal` (up | left | right | zoom) en un elemento: aparece al entrar en pantalla.
 * - `data-reveal-stagger="80"` en un contenedor: sus hijos aparecen uno tras otro (80 ms).
 *
 * El ocultamiento inicial vive en CSS y solo se activa si hay JS (atributo `data-js` en <html>),
 * así el contenido siempre es visible para buscadores y si JS falla.
 * Un MutationObserver detecta elementos nuevos (navegación, filtros de la galería).
 */
const SELECTOR = "[data-reveal], [data-reveal-stagger] > *";

export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const show = (el: Element) => el.classList.add("is-visible");

    if (reduce || !("IntersectionObserver" in window)) {
      document.querySelectorAll(SELECTOR).forEach(show);
      root.dataset.revealDone = "";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        // Los elementos que aparecen en el mismo momento se escalonan entre sí.
        const visible = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
        visible.forEach((el, i) => {
          const parent = el.parentElement?.closest("[data-reveal-stagger]") as HTMLElement | null;
          const step = Number(parent?.dataset.revealStagger || el.dataset.revealStep || 90);
          el.style.setProperty("--rd", `${Math.min(i, 8) * step}ms`);
          show(el);
          io.unobserve(el);
          // Tras la entrada, quita el retraso para que los hovers respondan al instante.
          window.setTimeout(() => el.style.setProperty("--rd", "0ms"), 1200 + Math.min(i, 8) * step);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const observe = (scope: ParentNode) =>
      scope.querySelectorAll(SELECTOR).forEach((el) => {
        if (!el.classList.contains("is-visible")) io.observe(el);
      });

    observe(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations)
        m.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          if (n.matches(SELECTOR) && !n.classList.contains("is-visible")) io.observe(n);
          observe(n);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
