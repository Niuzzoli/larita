import { SCENES, type SceneId } from "@/state/experience";

export function ProgressIndicator({ current, tone = "light" }: { current: SceneId; tone?: "light" | "night" }) {
  const index = SCENES.indexOf(current);
  const on = tone === "night" ? "bg-cream" : "bg-plum";
  const off = tone === "night" ? "bg-cream/30" : "bg-plum/20";
  return (
    <div role="img" aria-label={`Parte ${index + 1} de ${SCENES.length}`} className="flex items-center gap-1.5">
      {SCENES.map((scene, i) => (
        <span
          key={scene}
          className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? `w-5 ${on}` : `w-1.5 ${i < index ? on : off}`}`}
        />
      ))}
    </div>
  );
}
