import type { ComunidadeContent, Member } from "@/content/types";
import { Marquee } from "@/components/motion/Marquee";
import { Avatar } from "@/components/ui/Avatar";
import { Pill } from "@/components/ui/Pill";
import { Texture } from "@/components/ui/Texture";

// rows are full-bleed; alternating directions, different speeds
const ROWS = [{ velocity: -2 }, { velocity: 2 }, { velocity: -1.5 }];

function Chip({ member, hidden }: { member: Member; hidden?: boolean }) {
  return (
    <span aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-2.5 rounded-full border border-white bg-white py-2 pr-2.5">
      <Avatar name={member.name} src={member.avatar} className="ml-2" />
      <span className="whitespace-nowrap text-base font-light text-wine">{member.name}</span>
    </span>
  );
}

export function Comunidade({ content }: { content: ComunidadeContent }) {
  const perRow = Math.ceil(content.members.length / ROWS.length);
  const [first, ...rest] = content.title.split(" ");
  return (
    <section id="comunidade" aria-labelledby="comunidade-title" className="relative overflow-hidden bg-cream pb-16 pt-[115px]">
      <Texture src="/images/textures/parchment.webp" opacity={0.26} />
      <div className="container-page relative mx-auto flex max-w-[426px] flex-col items-center text-center">
        <span className="rounded-[20px] border border-[#807f78] p-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#807f78]">{content.badge}</span>
        <h2 id="comunidade-title" className="mt-6 font-display text-[clamp(44px,4.3vw,62px)] font-medium leading-[0.87]">
          <span className="block text-wine">{first}</span>{" "}
          <span className="block text-[rgba(17,19,19,0.8)]">{rest.join(" ")}</span>
        </h2>
        <p className="mt-6 max-w-[348px] text-base leading-normal text-[#55554f]">{content.text}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {content.links.map((link) => (
            <Pill key={link.label} href={link.href} external={link.external} variant="outline">{link.label}</Pill>
          ))}
        </div>
      </div>
      <div className="relative mt-16 flex flex-col gap-3">
        {ROWS.map((row, r) => {
          const members = content.members.slice(r * perRow, (r + 1) * perRow);
          return (
            <Marquee key={r} baseVelocity={row.velocity}>
              {members.map((m) => <Chip key={m.name} member={m} />)}
              {/* repeat so one copy is wider than the viewport; hidden from assistive tech */}
              {members.map((m) => <Chip key={`r-${m.name}`} member={m} hidden />)}
            </Marquee>
          );
        })}
      </div>
    </section>
  );
}
