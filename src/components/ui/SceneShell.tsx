"use client";

import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

interface SceneShellProps {
  heading: string;
  eyebrow?: string;
  tone?: "light" | "night";
  headingClassName?: string;
  onBack?: () => void;
  children: ReactNode;
}

export function SceneShell({ heading, eyebrow, tone = "light", headingClassName = "", onBack, children }: SceneShellProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Al entrar a una escena, el foco pasa a su título para teclado y lectores de pantalla.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section
      className={`mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 pt-[calc(4.5rem+env(safe-area-inset-top))] pb-[calc(2.5rem+env(safe-area-inset-bottom))] ${
        tone === "night" ? "tone-night text-cream" : "text-plum"
      }`}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-3 inline-flex min-h-11 items-center gap-1 self-start rounded-full pr-3 text-sm underline-offset-4 hover:underline"
        >
          <ArrowLeft size={16} aria-hidden /> Volver
        </button>
      )}
      {eyebrow && <p className="font-hand text-xl text-rose-deep">{eyebrow}</p>}
      <h1
        ref={headingRef}
        tabIndex={-1}
        className={`font-serif text-3xl leading-tight text-balance outline-none sm:text-4xl ${headingClassName}`}
      >
        {heading}
      </h1>
      {children}
    </section>
  );
}
