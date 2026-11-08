import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { foundationSlugs, getFoundationDoc } from "@/lib/docs";
import { DocPanel } from "@/components/site/doc-panel";
import { ProseDoc } from "@/components/site/human-doc";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return foundationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getFoundationDoc(slug);
  return doc ? { title: doc.title, description: doc.description.split("\n")[0] } : {};
}

export default async function FoundationPage({ params }: Props) {
  const { slug } = await params;
  const doc = getFoundationDoc(slug);
  if (!doc) notFound();
  return <DocPanel id={`f-${slug}`} human={<ProseDoc doc={doc} />} raw={doc.raw} file={`${slug}.md`} href={`/foundations/${slug}.md`} />;
}
