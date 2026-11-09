import type { ServiceIcon } from "@/lib/content/types";

type P = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const PhoneIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" />
  </svg>
);
export const MailIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
export const ClockIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const PinIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);
export const UserIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);
export const ArrowRight = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const UpArrow = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={2.4}>
    <path d="M12 20V4M5 11l7-7 7 7" />
  </svg>
);
export const ChevronDown = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const MenuIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const CloseIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const ShieldIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export function ServiceGlyph({ icon, className = "h-7 w-7" }: { icon: ServiceIcon; className?: string }) {
  switch (icon) {
    case "concrete":
      return (
        <svg viewBox="0 0 24 24" className={className} {...base}>
          <path d="M3 20h18M5 20V10l7-5 7 5v10" />
          <path d="M9 20v-5h6v5" />
        </svg>
      );
    case "polish":
      return (
        <svg viewBox="0 0 24 24" className={className} {...base}>
          <circle cx="12" cy="13" r="6" />
          <circle cx="12" cy="13" r="2" />
          <path d="M12 7V3M9 3h6M4 21h16" />
        </svg>
      );
    case "epoxy":
      return (
        <svg viewBox="0 0 24 24" className={className} {...base}>
          <path d="M4 17 12 21l8-4M4 12l8 4 8-4M12 3 4 7l8 4 8-4-8-4Z" />
        </svg>
      );
    case "asphalt":
      return (
        <svg viewBox="0 0 24 24" className={className} {...base}>
          <path d="M8 3 4 21M16 3l4 18M12 4v3M12 10v3M12 16v3" />
        </svg>
      );
    case "excavation":
      return (
        <svg viewBox="0 0 24 24" className={className} {...base}>
          <path d="M2 18h12v-4H6l-2 4M14 15l4-7 4 2-2 4" />
          <circle cx="5" cy="20" r="1.5" />
          <circle cx="11" cy="20" r="1.5" />
        </svg>
      );
    case "washing":
      return (
        <svg viewBox="0 0 24 24" className={className} {...base}>
          <path d="M3 8h8l2 2h3M16 10l5-3M16 10l5 0M16 10l5 3" />
          <path d="M5 8V5h4v3M7 12v8" />
        </svg>
      );
    case "maintenance":
      return (
        <svg viewBox="0 0 24 24" className={className} {...base}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5Z" />
        </svg>
      );
  }
}
