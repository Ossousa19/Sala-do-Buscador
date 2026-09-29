import { site } from "@/content/site";
import { Nav } from "@/components/scenes/Nav";
import { HeroDoor } from "@/components/scenes/HeroDoor";
import { Salas } from "@/components/scenes/Salas";
import { Curadoria } from "@/components/scenes/Curadoria";
import { Perguntas } from "@/components/scenes/Perguntas";

export default function Home() {
  return (
    <>
      <Nav nav={site.nav} />
      <main>
        <HeroDoor content={site.hero} />
        <Salas content={site.salas} />
        <Curadoria content={site.curadoria} />
        <Perguntas content={site.perguntas} />
      </main>
    </>
  );
}
