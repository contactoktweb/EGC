import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";

/** Estilos del contenido escrito con el editor WYSIWYG de Sanity (políticas y textos largos). */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 leading-relaxed text-neutral-300">{children}</p>,
    h2: ({ children }) => <h2 className="mt-10 mb-3 text-xl font-bold text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-6 mb-2 text-lg font-bold text-white">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 grid list-disc gap-2 pl-5 text-neutral-300 marker:text-brand-light">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 grid list-decimal gap-2 pl-5 text-neutral-300 marker:text-brand-light">{children}</ol>
    ),
  },
  listItem: ({ children }) => <li className="leading-relaxed">{children}</li>,
  marks: {
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const blank = Boolean(value?.blank);
      return (
        <a
          href={href}
          className="text-brand-light underline underline-offset-2 hover:text-white"
          {...(blank ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export function RichText({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
