import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-2xl font-semibold tracking-tight transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-[var(--ink)] text-[var(--paper)] shadow-[0_10px_20px_rgba(17,24,39,0.18)] hover:shadow-[0_14px_26px_rgba(17,24,39,0.22)]",
    ghost:
      "bg-white/50 text-[var(--ink)] ring-1 ring-black/10 hover:bg-white/70",
  };
  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    md: "h-11 px-4 text-[15px]",
    lg: "h-12 px-5 text-[16px]",
  };

  return (
    <button
      className={[base, variants[variant], sizes[size], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
};

export function LinkButton({
  className,
  variant = "primary",
  size = "md",
  ...props
}: LinkButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-2xl font-semibold tracking-tight transition active:translate-y-px";
  const variants: Record<NonNullable<LinkButtonProps["variant"]>, string> = {
    primary:
      "bg-[var(--ink)] text-[var(--paper)] shadow-[0_10px_20px_rgba(17,24,39,0.18)] hover:shadow-[0_14px_26px_rgba(17,24,39,0.22)]",
    ghost:
      "bg-white/50 text-[var(--ink)] ring-1 ring-black/10 hover:bg-white/70",
  };
  const sizes: Record<NonNullable<LinkButtonProps["size"]>, string> = {
    md: "h-11 px-4 text-[15px]",
    lg: "h-12 px-5 text-[16px]",
  };

  return (
    <Link
      className={[base, variants[variant], sizes[size], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
