import fs from "node:fs";
import path from "node:path";
import catalogJson from "@/content/catalog.json";

export type CatalogItem = { slug: string; title: string; group: string; description: string };
export const catalog = catalogJson as CatalogItem[];

export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://design.useiota.space").replace(/\/$/, "");
const CONTENT = path.join(process.cwd(), "content");

export type Doc = {
  raw: string;
  meta: Record<string, string>;
  title: string;
  description: string;
  sections: { heading: string; body: string }[];
};

export function parseDoc(rawIn: string): Doc {
  const raw = rawIn.replace(/\{\{SITE\}\}/g, SITE);
  const meta: Record<string, string> = {};
  let body = raw;
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) {
    body = raw.slice(fm[0].length);
    for (const line of fm[1].split("\n")) {
      const m = line.match(/^([\w-]+):\s*(.*)$/);
      if (m) meta[m[1]] = m[2].replace(/^"|"$/g, "");
    }
  }
  const title = (body.match(/^# (.+)$/m) || [])[1] || meta.name || "";
  const afterTitle = body.replace(/^[\s\S]*?^# .+$\n?/m, "");
  const parts = afterTitle.split(/^## /m);
  const description = parts[0].trim();
  const sections = parts.slice(1).map((p) => {
    const nl = p.indexOf("\n");
    return { heading: (nl < 0 ? p : p.slice(0, nl)).trim(), body: nl < 0 ? "" : p.slice(nl + 1).trim() };
  });
  return { raw, meta, title, description, sections };
}

const read = (rel: string) => {
  const f = path.join(CONTENT, rel);
  return fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null;
};

export const getComponentDoc = (slug: string) => {
  const r = read(`components/${slug}.md`);
  return r ? parseDoc(r) : null;
};
export const getFoundationDoc = (slug: string) => {
  const r = read(`foundations/${slug}.md`);
  return r ? parseDoc(r) : null;
};
export const getSkillDoc = (name: string) => {
  const r = read(`skills/${name}/SKILL.md`);
  return r ? parseDoc(r) : null;
};

export const foundationSlugs = () => fs.readdirSync(path.join(CONTENT, "foundations")).map((f) => f.replace(/\.md$/, ""));
export const skillNames = () => fs.readdirSync(path.join(CONTENT, "skills"));

export function foundationIndex() {
  return foundationSlugs().map((slug) => {
    const d = getFoundationDoc(slug)!;
    return { slug, title: d.title, description: d.description.split("\n")[0] };
  });
}
export function skillIndex() {
  return skillNames().map((name) => {
    const d = getSkillDoc(name)!;
    return { name, title: d.title, description: d.meta.description || "" };
  });
}

let tokenCache: Record<string, string> | null = null;
export function tokenValues() {
  if (tokenCache) return tokenCache;
  const css = fs.readFileSync(path.join(process.cwd(), "components/iota/tokens.css"), "utf8");
  const out: Record<string, string> = {};
  for (const m of css.matchAll(/(--[\w-]+):\s*([^;]+);/g)) if (!(m[1] in out)) out[m[1]] = m[2].trim();
  tokenCache = out;
  return out;
}
