import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "light" | "night" };

export function PrimaryButton({ tone = "light", className = "", type = "button", ...props }: Props) {
  const colors = tone === "night" ? "bg-cream text-plum" : "bg-plum text-cream";
  return (
    <button
      type={type}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 text-center text-base font-semibold shadow-[0_5px_0_rgba(87,57,77,0.2)] transition-transform duration-100 active:translate-y-0.5 active:shadow-none ${colors} ${className}`}
      {...props}
    />
  );
}
