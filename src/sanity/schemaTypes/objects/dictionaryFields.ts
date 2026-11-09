import { defineArrayMember, defineField } from "sanity";
import { dictionaries } from "@/content/dictionary";
import { EXCLUDED_KEYS, FIELD_TITLES, GROUP_TITLES, TOKENS_HELP, TUPLES, TUPLE_FIELD_TITLES, isLongText } from "../../dictionary-map";

type AnyRecord = Record<string, unknown>;

const short = (v: string, n = 110) => (v.length > n ? `${v.slice(0, n)}…` : v);
const example = (en: string, es: string) => `Ejemplo — EN: "${short(en)}" · ES: "${short(es)}"`;

/**
 * Genera los campos de Sanity para un grupo del diccionario (p. ej. "hero").
 * Cada texto queda como { en, es } y su descripción muestra el texto actual como ejemplo.
 */
export function dictionaryGroupField(group: string) {
  const en = (dictionaries.en as unknown as AnyRecord)[group] as AnyRecord;
  const es = (dictionaries.es as unknown as AnyRecord)[group] as AnyRecord;

  const fields = Object.keys(en)
    .filter((key) => !EXCLUDED_KEYS.has(`${group}.${key}`))
    .map((key) => {
      const path = `${group}.${key}`;
      const title = FIELD_TITLES[path] ?? key;
      const vEn = en[key];
      const vEs = es[key];

      if (typeof vEn === "string") {
        const hasToken = /\{(phone|email|license|years)\}/.test(vEn);
        return defineField({
          name: key,
          title,
          type: isLongText(vEn) ? "localeText" : "localeString",
          description: example(vEn, String(vEs)) + (hasToken ? ` · ${TOKENS_HELP}` : ""),
        });
      }

      if (Array.isArray(vEn) && TUPLES[path]) {
        const [a, b] = TUPLES[path];
        const first = (vEn as string[][])[0] ?? ["", ""];
        return defineField({
          name: key,
          title,
          type: "array",
          description: `Ejemplo: "${short(first[0], 40)}" — "${short(first[1], 60)}"`,
          of: [
            defineArrayMember({
              type: "object",
              name: `${group}${key.charAt(0).toUpperCase()}${key.slice(1)}Item`,
              fields: [
                defineField({ name: a, title: TUPLE_FIELD_TITLES[a], type: "localeString", validation: (r) => r.required() }),
                defineField({ name: b, title: TUPLE_FIELD_TITLES[b], type: "localeString", validation: (r) => r.required() }),
              ],
              preview: { select: { title: `${a}.en`, subtitle: `${b}.en` } },
            }),
          ],
        });
      }

      if (Array.isArray(vEn)) {
        return defineField({
          name: key,
          title,
          type: "localeStringList",
          description: `Ejemplo: ${(vEn as string[]).map((x) => `"${short(x, 40)}"`).join(", ")}`,
        });
      }

      throw new Error(`Tipo no soportado en el diccionario: ${path}`);
    });

  return defineField({
    name: group,
    title: GROUP_TITLES[group] ?? group,
    type: "object",
    options: { collapsible: true, collapsed: true },
    fields,
  });
}
