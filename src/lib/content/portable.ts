import type { PortableTextBlock } from "next-sanity";
import type { PrivacySource } from "./types";

/** Textos que se convierten en enlaces dentro de la política. */
const AUTOLINKS: { pattern: string; href: string; blank: boolean }[] = [
  { pattern: "{email}", href: "mailto:{email}", blank: false },
  { pattern: "adssettings.google.com", href: "https://adssettings.google.com", blank: true },
];

/**
 * Convierte la política de respaldo (intro + secciones) a texto con formato (Portable Text),
 * el mismo formato que produce el editor WYSIWYG de Sanity.
 */
export function privacyToBlocks(p: PrivacySource, lang: string): PortableTextBlock[] {
  let n = 0;
  const key = () => `${lang}${(n++).toString(36)}`;

  const block = (text: string, extra: Partial<PortableTextBlock> = {}): PortableTextBlock => {
    const markDefs: { _type: "link"; _key: string; href: string; blank: boolean }[] = [];
    const children: { _type: "span"; _key: string; text: string; marks: string[] }[] = [];
    const regex = new RegExp(`(${AUTOLINKS.map((l) => l.pattern.replace(/[.{}]/g, "\\$&")).join("|")})`);
    for (const part of text.split(regex).filter(Boolean)) {
      const link = AUTOLINKS.find((l) => l.pattern === part);
      if (link) {
        const k = key();
        markDefs.push({ _type: "link", _key: k, href: link.href, blank: link.blank });
        children.push({ _type: "span", _key: key(), text: part, marks: [k] });
      } else {
        children.push({ _type: "span", _key: key(), text: part, marks: [] });
      }
    }
    return { _type: "block", _key: key(), style: "normal", markDefs, children, ...extra } as PortableTextBlock;
  };

  const blocks: PortableTextBlock[] = [block(p.intro)];
  for (const s of p.sections) {
    blocks.push(block(s.title, { style: "h2" }));
    for (const para of s.paragraphs ?? []) blocks.push(block(para));
    for (const item of s.bullets ?? []) blocks.push(block(item, { listItem: "bullet", level: 1 }));
  }
  return blocks;
}
