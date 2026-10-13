const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function DoodleStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path d="M24 5l5 13 14 1-11 9 4 14-12-8-12 8 4-14L5 19l14-1z" {...stroke} />
    </svg>
  );
}

export function DoodleHeart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path d="M24 41C10 31 5 23 8 15c3-7 12-7 16 0 4-7 13-7 16 0 3 8-2 16-16 26z" {...stroke} />
    </svg>
  );
}

export function DoodleSquiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 24" aria-hidden className={className}>
      <path d="M4 14c8-12 14 10 22 0s14 10 22 0 14 10 22 0 14 10 22 0" {...stroke} />
    </svg>
  );
}
