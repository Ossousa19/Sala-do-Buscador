import { site } from "@/content/site";
import { Nav } from "@/components/scenes/Nav";
import { HeroDoor } from "@/components/scenes/HeroDoor";
import { Salas } from "@/components/scenes/Salas";
import { Curadoria } from "@/components/scenes/Curadoria";
import { Perguntas } from "@/components/scenes/Perguntas";
import { Trilhas } from "@/components/scenes/Trilhas";
import { Artigos } from "@/components/scenes/Artigos";
import { Comunidade } from "@/components/scenes/Comunidade";
import { Faq } from "@/components/scenes/Faq";
import { FooterCurtain } from "@/components/scenes/FooterCurtain";

export default function Home() {
  return (
    <>
      <Nav nav={site.nav} />
      <main className="relative z-10">
        <HeroDoor content={site.hero} />
        <Salas content={site.salas} />
        <Curadoria content={site.curadoria} />
        <Perguntas content={site.perguntas} />
        <Trilhas content={site.trilhas} />
        <Artigos content={site.artigos} />
        <Comunidade content={site.comunidade} />
        <Faq content={site.faq} />
      </main>
      <FooterCurtain content={site.footer} />
    </>
  );
}
