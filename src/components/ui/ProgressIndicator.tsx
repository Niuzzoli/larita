import { SCENES, type SceneId } from "@/state/experience";

// Distancia entre puntos, en px: 6 de punto + 10 de separación.
const PITCH = 16;

export function ProgressIndicator({ current, tone = "light" }: { current: SceneId; tone?: "light" | "night" }) {
  const index = SCENES.indexOf(current);
  const on = tone === "night" ? "bg-cream" : "bg-plum";
  const off = tone === "night" ? "bg-cream/30" : "bg-plum/20";
  return (
    <div role="img" aria-label={`Parte ${index + 1} de ${SCENES.length}`} className="relative flex items-center gap-2.5">
      {SCENES.map((scene, i) => (
        <span key={scene} className={`size-1.5 rounded-full transition-colors duration-500 ${i < index ? on : off}`} />
      ))}
      {/* La pastilla se desliza de punto en punto: solo cambia transform. */}
      <span
        className={`absolute top-0 -left-[5px] h-1.5 w-4 rounded-full transition-[translate,background-color] duration-[600ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${on}`}
        style={{ translate: `${index * PITCH}px 0` }}
      />
    </div>
  );
}
