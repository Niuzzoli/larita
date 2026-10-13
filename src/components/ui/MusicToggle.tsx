"use client";

import { Music, Pause } from "lucide-react";
import { useRef, useState } from "react";
import type { MusicConfig } from "@/types/birthday";

export function MusicToggle({ music, tone = "light" }: { music?: MusicConfig; tone?: "light" | "night" }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!music) return null;

  const fail = () => {
    setPlaying(false);
    setFailed(true);
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
      setFailed(false);
    } catch {
      fail();
    }
  };

  const colors = tone === "night" ? "bg-cream/15 text-cream" : "bg-white text-plum shadow-sm";

  return (
    <div className="flex items-center gap-2">
      {failed && (
        <p role="status" className={`text-xs ${tone === "night" ? "text-cream/80" : "text-plum/80"}`}>
          No se pudo reproducir la música
        </p>
      )}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pausar música" : "Reproducir música"}
        title={music.title}
        className={`inline-flex size-11 items-center justify-center rounded-full ${colors}`}
      >
        {playing ? <Pause size={18} aria-hidden /> : <Music size={18} aria-hidden />}
      </button>
      <audio ref={audioRef} src={music.src} loop preload="none" onError={fail} />
    </div>
  );
}
