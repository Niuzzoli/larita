/** 40 estrellas en posiciones fijas; solo 6 titilan. */
const STARS = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 92,
  size: 1 + (i % 3),
  twinkle: i % 7 === 0,
  delay: (i % 5) * 0.6,
}));

export function Stars({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 transition-opacity duration-[1500ms] ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {STARS.map((star, i) => (
        <span
          key={i}
          className={`absolute rounded-full bg-cream ${star.twinkle ? "twinkle" : ""}`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            opacity: star.twinkle ? 1 : 0.7,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
