import type { ComponentProps } from "react";

type CardProps = ComponentProps<"div">;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-3xl bg-white/70 p-6 ring-1 ring-black/10 backdrop-blur",
        "shadow-[0_20px_50px_rgba(17,24,39,0.12)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
