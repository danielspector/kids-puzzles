import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input">;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={[
        "h-11 w-full rounded-2xl bg-white/70 px-4 text-[15px]",
        "ring-1 ring-black/10 outline-none",
        "placeholder:text-black/40",
        "focus:bg-white focus:ring-2 focus:ring-black/20",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
