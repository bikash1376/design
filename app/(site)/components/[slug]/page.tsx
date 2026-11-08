import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalog, getComponentDoc } from "@/lib/docs";
import { DocPanel } from "@/components/site/doc-panel";
import { HumanDoc } from "@/components/site/human-doc";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return catalog.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getComponentDoc(slug);
  return doc ? { title: doc.title, description: doc.description } : {};
}

export default async function ComponentPage({ params }: Props) {
  const { slug } = await params;
  const doc = getComponentDoc(slug);
  if (!doc) notFound();
  return <DocPanel id={slug} human={<HumanDoc doc={doc} />} raw={doc.raw} file={`${slug}.md`} href={`/components/${slug}.md`} />;
}
