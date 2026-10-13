import type { CSSProperties } from "react";

const COLORS = ["#EBA8C0", "#C9B8E8", "#F8DCE6", "#FFF5F2"];

const PIECES = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 29 + 5) % 100,
  drift: ((i * 17) % 60) - 30,
  spin: ((i * 47) % 360) + 360,
  delay: (i % 10) * 0.07,
  duration: 2.4 + (i % 5) * 0.3,
  color: COLORS[i % COLORS.length],
  round: i % 3 === 0,
}));

/** Confeti que cae una sola vez. Montarlo dispara la animación (CSS; con movimiento reducido no se muestra). */
export function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {PIECES.map((piece, i) => (
        <span
          key={i}
          className={`confetti-piece absolute top-0 block h-3 w-2 ${piece.round ? "rounded-full" : "rounded-[1px]"}`}
          style={
            {
              left: `${piece.left}%`,
              background: piece.color,
              animationDuration: `${piece.duration}s`,
              animationDelay: `${piece.delay}s`,
              "--drift": `${piece.drift}px`,
              "--spin": `${piece.spin}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
