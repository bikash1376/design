import type { ReactNode } from "react";
import { catalog, foundationIndex, skillIndex } from "@/lib/docs";
import { Shell } from "@/components/site/shell";

export default function SiteLayout({ children }: { children: ReactNode }) {
  const index = {
    components: catalog.map(({ slug, title, group }) => ({ slug, title, group })),
    foundations: foundationIndex().map(({ slug, title }) => ({ slug, title })),
    skills: skillIndex().map(({ name, title }) => ({ name, title })),
  };
  return <Shell index={index}>{children}</Shell>;
}
