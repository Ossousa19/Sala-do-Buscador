import Image from "next/image";

export function ArrowButton({ dir, label, onClick }: { dir: "prev" | "next"; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="btn btn-icon grid size-11 place-items-center"
    >
      <Image src={`/images/icons/arrow-${dir}.svg`} alt="" width={44} height={44} />
    </button>
  );
}
