import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-coral-500 text-white hover:bg-coral-600 focus-visible:outline-coral-600 shadow-beach",
  secondary:
    "bg-sea-600 text-white hover:bg-sea-700 focus-visible:outline-sea-700 shadow-beach",
  danger: "bg-red-500 text-white hover:bg-red-600 focus-visible:outline-red-600",
  ghost:
    "bg-white text-sea-800 border border-sea-200 hover:bg-sea-50 focus-visible:outline-sea-400",
};

export function Button({ variant = "primary", className, disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className ?? ""}`}
      disabled={disabled}
      {...rest}
    />
  );
}
