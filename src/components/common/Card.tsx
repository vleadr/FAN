import type { HTMLAttributes } from "react";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-3xl border border-white/60 bg-white/80 p-6 shadow-beach backdrop-blur ${className ?? ""}`}
      {...rest}
    />
  );
}
