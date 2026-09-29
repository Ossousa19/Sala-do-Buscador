import { site } from "@/content/site";
import { Nav } from "@/components/scenes/Nav";
import { HeroDoor } from "@/components/scenes/HeroDoor";
import { Salas } from "@/components/scenes/Salas";

export default function Home() {
  return (
    <>
      <Nav nav={site.nav} />
      <main>
        <HeroDoor content={site.hero} />
        <Salas content={site.salas} />
      </main>
    </>
  );
}
