import type { Metadata } from "next";
import { anfitrioes } from "@/content/anfitrioes";
import { Etapas, HeroAnfitrioes, Politica, PorQue, SecaoEditor, SuaSala } from "@/components/scenes/AnfitrioesSections";
import { Chamado } from "@/components/scenes/Chamado";
import { Faq } from "@/components/scenes/Faq";
import { FooterCurtain } from "@/components/scenes/FooterCurtain";
import { Nav } from "@/components/scenes/Nav";

export const metadata: Metadata = anfitrioes.meta;

export default function Anfitrioes() {
  return (
    <>
      <Nav nav={anfitrioes.nav} />
      <main className="relative z-10">
        <HeroAnfitrioes content={anfitrioes.hero} />
        <PorQue content={anfitrioes.porQue} />
        <SuaSala content={anfitrioes.sala} />
        <SecaoEditor content={anfitrioes.editor} />
        <Etapas content={anfitrioes.etapas} />
        <Politica content={anfitrioes.politica} />
        <Faq content={anfitrioes.faq} />
        <Chamado content={anfitrioes.chamado} />
      </main>
      <FooterCurtain content={anfitrioes.footer} />
    </>
  );
}
