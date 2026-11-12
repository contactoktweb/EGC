import "server-only";
import { Resend } from "resend";
import { site } from "./site";
import { contractorRegText } from "./content/helpers";
import type { Settings } from "./content/types";

/**
 * Correos de la web (Resend).
 *  1. Aviso al equipo de cada nueva solicitud de estimado (formulario o asistente de IA).
 *  2. Confirmación automática al cliente, en su idioma.
 *  3. Aviso al equipo de cada reseña nueva dejada en la web (pendiente de aprobación).
 *
 * Remitente: info@ecgcowa.com (dominio verificado en Resend). Se puede cambiar con CONTACT_FROM_EMAIL.
 * Destinatario del aviso: "Configuración general → Notificaciones" en Sanity.
 */
const FROM = process.env.CONTACT_FROM_EMAIL || "ECG Construction <info@ecgcowa.com>";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
export const isEmailReady = () => resend !== null;

export type LeadEmailData = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  city?: string;
  service?: string;
  message: string;
  language?: string;
  source: "form" | "assistant";
  transcript?: string;
  submittedAt: Date;
  /** Fotos ya guardadas en Sanity (enlaces públicos). */
  photoUrls?: string[];
  /** Fotos sin guardar (si Sanity no está disponible): van como adjuntos. */
  photoFiles?: { data: Buffer; filename: string; contentType: string }[];
};

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const nl2br = (v: string) => esc(v).replace(/\r?\n/g, "<br>");
const abs = (src: string) => (src.startsWith("http") ? src : `${site.url}${src}`);
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

function pacificDate(d: Date, lang: "en" | "es") {
  return new Intl.DateTimeFormat(lang === "es" ? "es-US" : "en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Los_Angeles",
  }).format(d);
}

const C = { ink: "#1b1a1b", ink2: "#232223", line: "#3a393a", brand: "#44783a", brandLight: "#7cb96b", text: "#1b1a1b", mute: "#5b5b5b", paper: "#f4f4f2" };

/** Marco común del correo: cabecera con logo, contenido y pie con datos legales. */
function layout(s: Settings, preheader: string, body: string, footerNote: string) {
  const logo = s.logo
    ? `<img src="${esc(abs(s.logo.src))}" width="150" alt="${esc(s.legalName)}" style="display:block;border:0;height:auto;max-width:150px">`
    : `<span style="font:800 22px Arial,sans-serif;letter-spacing:6px;color:#fff">ECG</span><br><span style="font:700 10px Arial,sans-serif;letter-spacing:2px;color:#fff">CONSTRUCTION</span>`;
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(s.legalName)}</title></head>
<body style="margin:0;padding:0;background:${C.paper}">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:${C.text}">
<tr><td style="background:${C.ink};padding:22px 28px;border-bottom:4px solid ${C.brand}">${logo}</td></tr>
<tr><td style="padding:28px">${body}</td></tr>
<tr><td style="background:${C.ink};padding:18px 28px;font-size:12px;line-height:18px;color:#bdbdbd">
${esc(s.legalName)} · ${esc(contractorRegText(s))}<br>
<a href="${telHref(s.phoneE164)}" style="color:${C.brandLight};text-decoration:none">${esc(s.phoneDisplay)}</a> ·
<a href="mailto:${esc(s.email)}" style="color:${C.brandLight};text-decoration:none">${esc(s.email)}</a> ·
<a href="${esc(site.url)}" style="color:${C.brandLight};text-decoration:none">${esc(site.url.replace(/^https?:\/\//, ""))}</a><br>
<span style="color:#8a8a8a">${esc(footerNote)}</span>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function row(label: string, valueHtml: string) {
  return `<tr>
<td style="padding:10px 12px;border-bottom:1px solid #e6e6e3;width:150px;vertical-align:top;font-size:12px;font-weight:bold;letter-spacing:.5px;color:${C.mute};text-transform:uppercase">${esc(label)}</td>
<td style="padding:10px 12px;border-bottom:1px solid #e6e6e3;font-size:15px;line-height:22px">${valueHtml}</td>
</tr>`;
}

function button(href: string, label: string, bg = C.brand) {
  return `<a href="${esc(href)}" style="display:inline-block;background:${bg};color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 18px;border-radius:4px;margin:0 8px 8px 0">${esc(label)}</a>`;
}

/* ------------------------------------------------------------------ */
/* 1. Aviso al equipo                                                  */
/* ------------------------------------------------------------------ */

export function leadNotificationEmail(lead: LeadEmailData, s: Settings) {
  const sourceLabel = lead.source === "assistant" ? "Asistente de IA (chat)" : "Formulario de la web";
  const langLabel = lead.language === "es" ? "Español" : lead.language === "en" ? "Inglés" : "—";
  const when = pacificDate(lead.submittedAt, "es");
  const subject = `Nueva solicitud de estimado: ${lead.name}${lead.service ? ` · ${lead.service}` : ""}${lead.city ? ` · ${lead.city}` : ""}`;
  const adminUrl = lead.id ? `${site.url}/admin/structure/leads;${encodeURIComponent(lead.id)}` : `${site.url}/admin`;

  const photos = lead.photoUrls?.length
    ? `<p style="margin:24px 0 8px;font-size:12px;font-weight:bold;letter-spacing:.5px;color:${C.mute};text-transform:uppercase">Fotos del cliente (${lead.photoUrls.length})</p>
<p style="margin:0">${lead.photoUrls
        .map((u) => `<a href="${esc(u)}"><img src="${esc(`${u}?w=320&h=240&fit=crop&auto=format`)}" width="160" height="120" alt="Foto del proyecto" style="border:0;border-radius:4px;margin:0 6px 6px 0;object-fit:cover"></a>`)
        .join("")}</p>`
    : lead.photoFiles?.length
      ? `<p style="margin:24px 0 0;font-size:14px;color:${C.mute}">📎 ${lead.photoFiles.length} foto(s) adjunta(s) a este correo.</p>`
      : "";

  const transcript = lead.transcript
    ? `<p style="margin:24px 0 8px;font-size:12px;font-weight:bold;letter-spacing:.5px;color:${C.mute};text-transform:uppercase">Conversación con el asistente</p>
<div style="background:${C.paper};border-radius:6px;padding:14px 16px;font-size:13px;line-height:20px;color:#333">${nl2br(lead.transcript)}</div>`
    : "";

  const body = `
<p style="margin:0 0 6px;font-size:12px;font-weight:bold;letter-spacing:2px;color:${C.brand};text-transform:uppercase">Nueva solicitud de estimado</p>
<h1 style="margin:0 0 6px;font-size:24px;line-height:30px;color:${C.ink}">${esc(lead.name)}</h1>
<p style="margin:0 0 20px;font-size:14px;color:${C.mute}">${esc(when)} (hora del Pacífico) · ${esc(sourceLabel)}</p>
<p style="margin:0 0 20px">
${button(telHref(lead.phone), `Llamar ${lead.phone}`)}
${button(`mailto:${lead.email}?subject=${encodeURIComponent(`Tu estimado con ${s.name}`)}`, "Responder por correo", C.ink)}
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e6e6e3">
${row("Nombre", esc(lead.name))}
${row("Teléfono", `<a href="${telHref(lead.phone)}" style="color:${C.brand};font-weight:bold">${esc(lead.phone)}</a>`)}
${row("Correo", `<a href="mailto:${esc(lead.email)}" style="color:${C.brand}">${esc(lead.email)}</a>`)}
${row("Ciudad", esc(lead.city || "—"))}
${row("Servicio", esc(lead.service || "—"))}
${row("Idioma", esc(langLabel))}
${row("Origen", esc(sourceLabel))}
</table>
<p style="margin:24px 0 8px;font-size:12px;font-weight:bold;letter-spacing:.5px;color:${C.mute};text-transform:uppercase">Detalles del proyecto</p>
<div style="border-left:4px solid ${C.brand};background:${C.paper};padding:14px 16px;font-size:15px;line-height:23px">${nl2br(lead.message)}</div>
${photos}
${transcript}
<p style="margin:28px 0 0">${button(adminUrl, "Ver y dar seguimiento en el panel")}</p>
<p style="margin:8px 0 0;font-size:13px;color:${C.mute}">Responde a este correo para escribirle directamente al cliente.</p>`;

  const text = [
    "NUEVA SOLICITUD DE ESTIMADO",
    `${when} (hora del Pacífico) · ${sourceLabel}`,
    "",
    `Nombre:   ${lead.name}`,
    `Teléfono: ${lead.phone}`,
    `Correo:   ${lead.email}`,
    `Ciudad:   ${lead.city || "—"}`,
    `Servicio: ${lead.service || "—"}`,
    `Idioma:   ${langLabel}`,
    "",
    "Detalles del proyecto:",
    lead.message,
    lead.photoUrls?.length ? `\nFotos:\n${lead.photoUrls.join("\n")}` : "",
    lead.transcript ? `\nConversación con el asistente:\n${lead.transcript}` : "",
    "",
    `Ver en el panel: ${adminUrl}`,
  ].join("\n");

  return {
    subject,
    html: layout(s, `${lead.name} · ${lead.phone} · ${lead.service || ""}`, body, "Aviso automático de la web. Responde a este correo para contestar al cliente."),
    text,
  };
}

/* ------------------------------------------------------------------ */
/* 2. Confirmación al cliente                                          */
/* ------------------------------------------------------------------ */

const T = {
  en: {
    subject: (n: string) => `We received your request — ${n}`,
    eyebrow: "Request received",
    hello: (name: string) => `Hi ${name},`,
    intro: (company: string) =>
      `Thank you for contacting ${company}. We received your free estimate request and our team will contact you during business hours.`,
    summary: "Your request",
    service: "Service",
    city: "City",
    details: "Project details",
    hours: "Business hours",
    questions: "Questions? Call us or reply to this email.",
    call: "Call us",
    footer: "You are receiving this email because you requested an estimate on our website.",
  },
  es: {
    subject: (n: string) => `Recibimos tu solicitud — ${n}`,
    eyebrow: "Solicitud recibida",
    hello: (name: string) => `Hola ${name}:`,
    intro: (company: string) =>
      `Gracias por contactar a ${company}. Recibimos tu solicitud de estimado gratis y nuestro equipo te contactará en horario laboral.`,
    summary: "Tu solicitud",
    service: "Servicio",
    city: "Ciudad",
    details: "Detalles del proyecto",
    hours: "Horario de atención",
    questions: "¿Dudas? Llámanos o responde a este correo.",
    call: "Llamar",
    footer: "Recibes este correo porque pediste un estimado en nuestra web.",
  },
};

export function clientConfirmationEmail(lead: LeadEmailData, s: Settings) {
  const lang = lead.language === "es" ? "es" : "en";
  const t = T[lang];
  const first = lead.name.split(/\s+/)[0] || lead.name;
  const body = `
<p style="margin:0 0 6px;font-size:12px;font-weight:bold;letter-spacing:2px;color:${C.brand};text-transform:uppercase">${t.eyebrow}</p>
<h1 style="margin:0 0 14px;font-size:22px;line-height:28px;color:${C.ink}">${esc(t.hello(first))}</h1>
<p style="margin:0 0 20px;font-size:15px;line-height:23px">${esc(t.intro(s.legalName))}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e6e6e3">
${lead.service ? row(t.service, esc(lead.service)) : ""}
${lead.city ? row(t.city, esc(lead.city)) : ""}
${row(t.details, nl2br(lead.message))}
${row(t.hours, esc(s.hoursText[lang]))}
</table>
<p style="margin:24px 0 12px;font-size:15px">${esc(t.questions)}</p>
<p style="margin:0">${button(telHref(s.phoneE164), `${t.call} ${s.phoneDisplay}`)}</p>`;

  const text = [
    t.hello(first),
    "",
    t.intro(s.legalName),
    "",
    `${t.summary}:`,
    lead.service ? `${t.service}: ${lead.service}` : "",
    lead.city ? `${t.city}: ${lead.city}` : "",
    `${t.details}: ${lead.message}`,
    `${t.hours}: ${s.hoursText[lang]}`,
    "",
    `${t.questions} ${s.phoneDisplay} · ${s.email}`,
    "",
    `${s.legalName} · ${contractorRegText(s)}`,
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n");

  return { subject: t.subject(s.legalName), html: layout(s, t.intro(s.legalName), body, t.footer), text };
}

/* ------------------------------------------------------------------ */
/* Envío                                                               */
/* ------------------------------------------------------------------ */

/**
 * Envía el aviso al equipo y (si está activado) la confirmación al cliente.
 * Devuelve si el aviso al equipo salió bien. Nunca lanza errores: un correo fallido
 * no debe hacer perder la solicitud (ya quedó guardada en Sanity).
 */
export async function sendLeadEmails(lead: LeadEmailData, s: Settings): Promise<boolean> {
  if (!resend) return false;
  let notified = false;

  try {
    const n = leadNotificationEmail(lead, s);
    const { error } = await resend.emails.send({
      from: FROM,
      to: s.notificationEmail,
      replyTo: lead.email,
      subject: n.subject,
      html: n.html,
      text: n.text,
      tags: [{ name: "category", value: "lead_notification" }],
      attachments: lead.photoUrls?.length
        ? undefined
        : lead.photoFiles?.map((p) => ({ filename: p.filename, content: p.data, contentType: p.contentType })),
    });
    if (error) console.error("email: aviso al equipo falló", error);
    else notified = true;
  } catch (err) {
    console.error("email: aviso al equipo falló", err);
  }

  if (s.sendClientConfirmation) {
    try {
      const c = clientConfirmationEmail(lead, s);
      const { error } = await resend.emails.send({
        from: FROM,
        to: lead.email,
        replyTo: s.notificationEmail,
        subject: c.subject,
        html: c.html,
        text: c.text,
        tags: [{ name: "category", value: "lead_confirmation" }],
      });
      if (error) console.error("email: confirmación al cliente falló", error);
    } catch (err) {
      console.error("email: confirmación al cliente falló", err);
    }
  }

  return notified;
}

/* ------------------------------------------------------------------ */
/* 3. Aviso de nueva reseña pendiente de aprobación                    */
/* ------------------------------------------------------------------ */

export type ReviewEmailData = {
  id?: string;
  author: string;
  rating: number;
  text: string;
  email?: string;
  city?: string;
  service?: string;
  submittedAt: Date;
};

export function reviewNotificationEmail(r: ReviewEmailData, s: Settings) {
  const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
  const adminUrl = r.id ? `${site.url}/admin/structure/reviews;reviews-pending;${encodeURIComponent(r.id)}` : `${site.url}/admin`;
  const subject = `Nueva reseña por aprobar: ${stars} ${r.author}`;
  const body = `
<p style="margin:0 0 6px;font-size:12px;font-weight:bold;letter-spacing:2px;color:${C.brand};text-transform:uppercase">Reseña pendiente de aprobación</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:28px">${esc(r.author)} dejó una reseña en la web</h1>
<p style="margin:0 0 18px;font-size:22px;color:#e0a800;letter-spacing:2px">${stars}</p>
<blockquote style="margin:0 0 20px;padding:14px 16px;background:${C.paper};border-left:4px solid ${C.brand};font-size:15px;line-height:22px">${nl2br(r.text)}</blockquote>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-top:1px solid #e6e6e3">
${row("Nombre", esc(r.author))}
${r.city ? row("Ciudad", esc(r.city)) : ""}
${r.service ? row("Servicio", esc(r.service)) : ""}
${r.email ? row("Correo", `<a href="mailto:${esc(r.email)}" style="color:${C.brand}">${esc(r.email)}</a>`) : ""}
${row("Recibida", esc(pacificDate(r.submittedAt, "es")))}
</table>
<p style="margin:24px 0 0;font-size:14px;line-height:21px">No se publica hasta que la apruebes: en el panel, abre la reseña, cambia el <b>Estado</b> a <b>Aprobada</b> y presiona <b>Publish</b>.</p>
<p style="margin:16px 0 0">${button(adminUrl, "Revisar y aprobar en el panel")}</p>`;
  const text = [
    subject,
    "",
    r.text,
    "",
    `Nombre: ${r.author}`,
    r.city ? `Ciudad: ${r.city}` : "",
    r.service ? `Servicio: ${r.service}` : "",
    r.email ? `Correo: ${r.email}` : "",
    "",
    `Aprobar en el panel: ${adminUrl}`,
  ]
    .filter((l, i, a) => l || a[i - 1])
    .join("\n");
  return { subject, html: layout(s, `${stars} ${r.text.slice(0, 80)}`, body, "Aviso automático de la web: nueva reseña de cliente."), text };
}

/** Avisa al equipo de una reseña nueva. Nunca lanza errores. */
export async function sendReviewEmail(r: ReviewEmailData, s: Settings): Promise<boolean> {
  if (!resend) return false;
  try {
    const n = reviewNotificationEmail(r, s);
    const { error } = await resend.emails.send({
      from: FROM,
      to: s.notificationEmail,
      replyTo: r.email || undefined,
      subject: n.subject,
      html: n.html,
      text: n.text,
      tags: [{ name: "category", value: "review_notification" }],
    });
    if (error) {
      console.error("email: aviso de reseña falló", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("email: aviso de reseña falló", err);
    return false;
  }
}
