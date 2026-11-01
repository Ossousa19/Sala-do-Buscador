import { cn } from "@/lib/cn";

/** One choice among a few, for the switches that change what a section shows (Leitura, Artigos). */
export function Segmented<T extends string>({ label, options, value, onChange }: {
  label: string; options: { id: T; label: string }[]; value: T; onChange: (id: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex w-fit max-w-full gap-0.5 rounded-full bg-ivory p-1 text-sm shadow-[0_2px_4px_rgb(0_0_0/0.06),0_24px_40px_-14px_rgb(57_0_7/0.32)]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-full px-4 py-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink pointer-coarse:min-h-11 sm:px-5",
            value === o.id ? "bg-graphite font-semibold text-white" : "font-medium text-text-2 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-cream",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
