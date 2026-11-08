import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSkillDoc, SITE, skillNames } from "@/lib/docs";
import { DocPanel } from "@/components/site/doc-panel";
import { SkillDoc } from "@/components/site/human-doc";

type Props = { params: Promise<{ name: string }> };

export function generateStaticParams() {
  return skillNames().map((name) => ({ name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const doc = getSkillDoc(name);
  return doc ? { title: `${name} skill`, description: doc.meta.description } : {};
}

export default async function SkillPage({ params }: Props) {
  const { name } = await params;
  const doc = getSkillDoc(name);
  if (!doc) notFound();
  return (
    <DocPanel
      id={`s-${name}`}
      human={<SkillDoc doc={doc} install={`npx skills@latest add ${SITE} --skill ${name}`} />}
      raw={doc.raw}
      file="SKILL.md"
      href={`/skills/${name}/SKILL.md`}
    />
  );
}
