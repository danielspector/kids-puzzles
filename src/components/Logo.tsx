export function Logo() {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-2xl bg-white/70 ring-1 ring-black/10">
        <div className="size-5 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#0ea5e9_0deg,#f97316_120deg,#22c55e_240deg,#0ea5e9_360deg)]" />
      </div>
      <div className="leading-tight">
        <div className="font-heading text-lg tracking-tight text-[var(--ink)]">
          Puzzle Path
        </div>
        <div className="text-xs font-semibold tracking-wide text-black/55">
          easy to tricky
        </div>
      </div>
    </div>
  );
}
