import { ArrowSquareOutIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { SITE, tokenValues, type Doc } from "@/lib/docs";
import { Md } from "./md";
import { CopyLine, Fold, InstallPrompt, PanelScroll } from "./doc-parts";

function Heading({ title, description }: { title: string; description: string }) {
  return (
    <header className="flex flex-col gap-1.5">
      <h1 className="type-heading text-foreground">{title}</h1>
      <p className="text-[13px] leading-[19px] text-text-2">{description}</p>
    </header>
  );
}

// The me view of a component is deliberately short: what it is. The rules, API and
// edge cases all live in the agent view.
export function HumanDoc({ doc }: { doc: Doc }) {
  const more = doc.meta.more;
  const section = (h: string) => doc.sections.find((x) => x.heading === h)?.body;
  const related = [...(section("Related") ?? "").matchAll(/^- \[([^\]]+)\]\(([^)]+)\)/gm)];
  const tokens = (section("Tokens") ?? "").split(/,\s*/).map((t) => t.trim()).filter(Boolean);
  const values = tokenValues();
  const slug = doc.meta.human?.split("/").pop() ?? "";
  const variants = doc.sections.find((x) => x.heading === "Variants")?.body.replace(/```[\s\S]*?```/g, "").trim();
  return (
    <div className="flex flex-col gap-4">
      <Heading title={doc.title} description={doc.description} />
      {doc.meta.install && <InstallPrompt title={doc.title} install={doc.meta.install} docs={`${SITE}/components/${slug}.md`} />}
      {variants && (
        <section className="flex flex-col gap-2">
          <h2 className="text-[13px] font-medium text-foreground">Variants</h2>
          <Md source={variants} />
        </section>
      )}
      {more && (
        <a href={more} target="_blank" rel="noreferrer" className="flex w-fit items-center gap-1 text-[13px] text-brand transition-opacity duration-150 hover:opacity-70">
          {doc.meta["more-label"] ?? more}
          <ArrowSquareOutIcon size={12} />
        </a>
      )}
      {related.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-[13px] font-medium text-foreground">Related</h2>
          <div className="flex flex-wrap gap-1.5">
            {related.map((m) => (
              <Link key={m[2]} href={m[2].replace(/\.md$/, "")} className="rounded-lg bg-panel px-2 py-1 text-[12px] text-foreground/80 transition-colors duration-150 hover:bg-fill hover:text-foreground">
                {m[1]}
              </Link>
            ))}
          </div>
        </section>
      )}
      {tokens.length > 0 && (
        <Fold title="Tokens" count={`${tokens.length} ${tokens.length === 1 ? "token" : "tokens"}`}>
          <PanelScroll className="flex flex-col rounded-xl bg-panel px-3 py-1">
            {tokens.map((t) => (
              <div key={t} className="flex flex-col gap-0.5 border-b border-fill py-1.5 last:border-0">
                <code className="font-mono text-[11px] text-foreground">{t}</code>
                {values[t] && <code className="font-mono text-[11px] [overflow-wrap:anywhere] text-text-2">{values[t]}</code>}
              </div>
            ))}
          </PanelScroll>
        </Fold>
      )}
    </div>
  );
}

// A skill reads the same way, plus the one thing a person does with it: install it.
export function SkillDoc({ doc, install }: { doc: Doc; install: string }) {
  return (
    <div className="flex flex-col gap-4">
      <Heading title={doc.title} description={doc.meta.description ?? doc.description} />
      <CopyLine value={install} />
    </div>
  );
}

// A foundation has no component to look at on the canvas, so its prose is the content.
export function ProseDoc({ doc }: { doc: Doc }) {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-1.5">
        <h1 className="type-heading text-foreground">{doc.title}</h1>
        {doc.description && <Md source={doc.description} />}
      </header>
      {doc.sections.map((s) => (
        <section key={s.heading} className="flex flex-col gap-2">
          <h2 className="text-[13px] font-medium text-foreground">{s.heading}</h2>
          <Md source={s.body} />
        </section>
      ))}
    </div>
  );
}
