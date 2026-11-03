type Props = { className?: string; compact?: boolean };

/** Logo de ECG Construction: flecha verde hacia arriba + "ECG / CONSTRUCTION". */
export function Logo({ className = "", compact = false }: Props) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className="h-9 w-9 shrink-0" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[1.55rem] font-extrabold tracking-[0.3em]">ECG</span>
          <span className="mt-1 text-[0.62rem] font-bold tracking-[0.14em]">CONSTRUCTION</span>
        </span>
      )}
    </span>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill="none">
      <path d="M20 37V5M6 18 20 4.5 34 18" stroke="#5f9a4f" strokeWidth="3.4" strokeLinecap="square" />
    </svg>
  );
}

/** Línea curva verde de la tarjeta de presentación. */
export function BrandWave({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d="M0 50 C 420 62, 720 8, 1200 14" stroke="#5f9a4f" strokeWidth="4" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
