import { site } from "@/content/site";
import { Nav } from "@/components/scenes/Nav";
import { CosmosBackdrop } from "@/components/motion/CosmosBackdrop";
import { HeroDoor } from "@/components/scenes/HeroDoor";
import { Salas } from "@/components/scenes/Salas";
import { Curadoria } from "@/components/scenes/Curadoria";
import { Perguntas } from "@/components/scenes/Perguntas";
import { Trilhas } from "@/components/scenes/Trilhas";
import { Artigos } from "@/components/scenes/Artigos";
import { Leitura } from "@/components/scenes/Leitura";
import { Conquistas } from "@/components/scenes/Conquistas";
import { Anfitriao } from "@/components/scenes/Anfitriao";
import { Faq } from "@/components/scenes/Faq";
import { Chamado } from "@/components/scenes/Chamado";
import { FooterCurtain } from "@/components/scenes/FooterCurtain";

export default function Home() {
  return (
    <>
      <Nav nav={site.nav} />
      <main className="relative z-10">
        <CosmosBackdrop>
          <HeroDoor content={site.hero} />
          <Salas content={site.salas} />
        </CosmosBackdrop>
        <Curadoria content={site.curadoria} />
        <Perguntas content={site.perguntas} />
        <Trilhas content={site.trilhas} />
        <Artigos content={site.artigos} />
        <Leitura content={site.leitura} />
        <Conquistas content={site.conquistas} />
        <Anfitriao content={site.anfitriao} />
        <Faq content={site.faq} />
        <Chamado content={site.chamado} />
      </main>
      <FooterCurtain content={site.footer} />
    </>
  );
}
