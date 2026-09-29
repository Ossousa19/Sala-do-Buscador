import Image from "next/image";

export function ArrowButton({ dir, label, onClick }: { dir: "prev" | "next"; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full transition-transform duration-150 ease-cinema [@media(hover:hover)_and_(pointer:fine)]:hover:scale-105 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <Image src={`/images/icons/arrow-${dir}.svg`} alt="" width={44} height={44} />
    </button>
  );
}
