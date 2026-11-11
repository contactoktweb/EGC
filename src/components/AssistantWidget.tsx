"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/lib/i18n";

type Msg = { role: "user" | "assistant"; content: string; notice?: boolean };

const STORAGE_KEY = "ecg-assistant-v1";

function load(lang: Locale): Msg[] {
  try {
    const raw = sessionStorage.getItem(`${STORAGE_KEY}-${lang}`);
    return raw ? (JSON.parse(raw) as Msg[]) : [];
  } catch {
    return [];
  }
}

function save(lang: Locale, msgs: Msg[]) {
  try {
    sessionStorage.setItem(`${STORAGE_KEY}-${lang}`, JSON.stringify(msgs.slice(-30)));
  } catch {
    /* almacenamiento no disponible: la conversación vive solo en esta página */
  }
}

/** Asistente de IA de la web: burbuja flotante con chat (Claude, vía /api/assistant). */
export function AssistantWidget({ lang, labels }: { lang: Locale; labels: Dictionary["assistant"] }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const loaded = useRef(false);

  function toggle() {
    if (!loaded.current) {
      loaded.current = true;
      setMessages(load(lang));
    }
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    save(lang, next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          messages: next.filter((m) => !m.notice).map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = (await res.json()) as { ok: boolean; reply?: string; quoteCreated?: boolean };
      const reply: Msg[] = data.ok && data.reply ? [{ role: "assistant", content: data.reply }] : [{ role: "assistant", content: labels.error, notice: true }];
      if (data.ok && data.quoteCreated) reply.push({ role: "assistant", content: `✓ ${labels.quoteSaved}`, notice: true });
      const done = [...next, ...reply];
      setMessages(done);
      save(lang, done);
    } catch {
      setMessages([...next, { role: "assistant", content: labels.error, notice: true }]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  function reset() {
    setMessages([]);
    save(lang, []);
    inputRef.current?.focus();
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label={labels.title}
          className="fixed inset-x-3 bottom-24 z-[60] flex max-h-[min(640px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-lg border border-line bg-ink-2 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9)] sm:inset-x-auto sm:right-5 sm:w-[380px]"
        >
          <div className="flex items-center gap-3 border-b border-line bg-ink px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-deep">
              <ChatIcon className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-bold">{labels.title}</span>
              <span className="block text-xs text-neutral-400">{labels.subtitle}</span>
            </span>
            {messages.length > 0 && (
              <button type="button" onClick={reset} className="rounded px-2 py-1 text-xs text-neutral-400 hover:text-white">
                {labels.reset}
              </button>
            )}
            <button type="button" onClick={() => setOpen(false)} className="rounded p-1.5 text-neutral-300 hover:text-white" aria-label={labels.close}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm" aria-live="polite">
            <Bubble role="assistant">{labels.greeting}</Bubble>
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {labels.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-line px-3 py-1.5 text-xs text-neutral-200 transition hover:border-brand hover:text-brand-light"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} notice={m.notice}>
                {m.content}
              </Bubble>
            ))}
            {loading && (
              <p className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="flex gap-1" aria-hidden="true">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-light" style={{ animationDelay: `${d * 120}ms` }} />
                  ))}
                </span>
                {labels.typing}
              </p>
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t border-line bg-ink p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                rows={1}
                maxLength={2000}
                placeholder={labels.placeholder}
                aria-label={labels.placeholder}
                className="max-h-28 min-h-[42px] flex-1 resize-none rounded border border-line bg-ink-2 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-brand-light focus:outline-none"
              />
              <button type="submit" disabled={loading || !input.trim()} className="btn btn-primary !px-3.5 !py-2.5 disabled:opacity-50" aria-label={labels.send}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-[0.68rem] leading-snug text-neutral-500">{labels.disclaimer}</p>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="hero-lift fixed right-4 bottom-4 z-[60] flex items-center gap-2 rounded-full bg-brand-deep p-3.5 font-bold sm:right-5 sm:bottom-5 sm:py-3.5 sm:pr-5 sm:pl-4 text-white shadow-[0_12px_30px_-8px_rgb(0_0_0/0.8)] hover:bg-brand-deeper"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        ) : (
          <ChatIcon className="h-6 w-6" />
        )}
        <span className="sr-only text-sm sm:not-sr-only">{open ? labels.close : labels.open}</span>
      </button>
    </>
  );
}

function Bubble({ role, notice, children }: { role: "user" | "assistant"; notice?: boolean; children: React.ReactNode }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <p
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-line ${
          mine
            ? "rounded-br-sm bg-brand-deep text-white"
            : notice
              ? "rounded-bl-sm border border-brand/40 bg-brand/10 text-brand-light"
              : "rounded-bl-sm bg-ink-3 text-neutral-100"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

function ChatIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5h16v11H9l-5 4V5Z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </svg>
  );
}
