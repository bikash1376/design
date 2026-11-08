import { catalog, foundationSlugs, skillNames } from "@/lib/docs";
import { HomePanel } from "@/components/site/home-panel";

export default function Home() {
  const foundations = foundationSlugs();
  const skills = skillNames();
  return (
    <HomePanel
      counts={{ components: catalog.length, foundations: foundations.length, skills: skills.length }}
      foundation={foundations.includes("color") ? "color" : foundations[0]}
      skill="iota"
    />
  );
}
