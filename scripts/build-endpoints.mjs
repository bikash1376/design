// Generates everything an agent or the shadcn CLI fetches, as static files in public/:
//   /components/<slug>.md  /foundations/<slug>.md  /skills/<name>/SKILL.md
//   /r/<slug>.json  /r/theme.json  /r/registry.json  /llms.txt
//   /.well-known/agent-skills/index.json + <name>.tar.gz
//   /.well-known/skills/index.json + files
// Run automatically before dev and build.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import zlib from "node:zlib";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const SITE = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://design.useiota.space").replace(/\/$/, "");
const PUB = path.join(ROOT, "public");
const CONTENT = path.join(ROOT, "content");
const site = (s) => s.replace(/\{\{SITE\}\}/g, SITE);
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const put = (rel, data) => {
  const f = path.join(PUB, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, data);
};
for (const d of ["components", "foundations", "skills", "r", ".well-known"]) fs.rmSync(path.join(PUB, d), { recursive: true, force: true });

const catalog = JSON.parse(fs.readFileSync(path.join(CONTENT, "catalog.json"), "utf8"));

// What people see and what agents read must agree, so a mismatch stops the build.
{
  const slugs = new Set(catalog.map((c) => c.slug));
  const problems = [];
  const docs = new Set(fs.readdirSync(path.join(CONTENT, "components")).map((f) => f.replace(/\.md$/, "")));
  for (const s of slugs) if (!docs.has(s)) problems.push(`catalog entry has no doc: ${s}`);
  for (const d of docs) if (!slugs.has(d)) problems.push(`doc is not in the catalog: ${d}`);
  for (const f of walk(CONTENT).filter((x) => x.endsWith(".md"))) {
    for (const m of fs.readFileSync(f, "utf8").matchAll(/\/components\/([a-z-]+)\.md/g)) if (!slugs.has(m[1])) problems.push(`dead link to ${m[1]} in ${path.relative(CONTENT, f)}`);
  }
  const skill = fs.readFileSync(path.join(CONTENT, "skills/iota/SKILL.md"), "utf8");
  for (const s of slugs) if (!skill.includes(`/components/${s}.md`)) problems.push(`missing from the iota skill: ${s}`);
  // Nothing published may name the old source or a local address.
  for (const f of [...walk(CONTENT), ...walk(path.join(ROOT, "components/iota")), ...walk(path.join(ROOT, "components/iota-app"))].filter((x) => /\.(md|mjs|tsx?|css|json)$/.test(x))) {
    if (/qu[a]rtz|design[.]how|localhost:[3]000/i.test(fs.readFileSync(f, "utf8"))) problems.push(`banned mention in ${path.relative(ROOT, f)}`);
  }
  if (problems.length) throw new Error("Content check failed:\n" + problems.join("\n"));
}

// Markdown docs
for (const dir of ["components", "foundations"])
  for (const f of walk(path.join(CONTENT, dir))) put(`${dir}/${path.basename(f)}`, site(fs.readFileSync(f, "utf8")));

// Skills
const skillDirs = fs.readdirSync(path.join(CONTENT, "skills"));
const describe = (md) => (md.match(/^description: (.+)$/m) || [])[1] || "";
const tar = (entries) => {
  const blocks = [];
  for (const [name, data] of entries) {
    const h = Buffer.alloc(512);
    h.write(name, 0, 100);
    h.write("0000644\0", 100);
    h.write("0000000\0", 108);
    h.write("0000000\0", 116);
    h.write(data.length.toString(8).padStart(11, "0") + "\0", 124);
    h.write("00000000000\0", 136);
    h.write("        ", 148);
    h.write("0", 156);
    h.write("ustar\0" + "00", 257);
    let sum = 0;
    for (const b of h) sum += b;
    h.write(sum.toString(8).padStart(6, "0") + "\0 ", 148);
    blocks.push(h, data, Buffer.alloc((512 - (data.length % 512)) % 512));
  }
  blocks.push(Buffer.alloc(1024));
  return zlib.gzipSync(Buffer.concat(blocks), { mtime: 0 });
};
fs.rmSync(path.join(ROOT, "skills"), { recursive: true, force: true });
const agentIndex = [];
const legacyIndex = [];
for (const name of skillDirs) {
  const dir = path.join(CONTENT, "skills", name);
  const entries = walk(dir).map((f) => {
    const rel = path.relative(dir, f).replace(/\\/g, "/");
    const data = /\.(md|mjs|json|txt)$/.test(f) ? Buffer.from(site(fs.readFileSync(f, "utf8"))) : fs.readFileSync(f);
    return [rel, data];
  });
  for (const [rel, data] of entries) {
    put(`skills/${name}/${rel}`, data);
    const repoCopy = path.join(ROOT, "skills", name, rel);
    fs.mkdirSync(path.dirname(repoCopy), { recursive: true });
    fs.writeFileSync(repoCopy, data);
    put(`.well-known/skills/${name}/${rel}`, data);
  }
  const md = entries.find(([r]) => r === "SKILL.md")[1].toString();
  const archive = tar(entries.map(([r, d]) => [r, d]));
  put(`.well-known/agent-skills/${name}.tar.gz`, archive);
  agentIndex.push({ name, type: "archive", description: describe(md), url: `${name}.tar.gz`, digest: `sha256:${crypto.createHash("sha256").update(archive).digest("hex")}` });
  legacyIndex.push({ name, description: describe(md), files: entries.map(([r]) => r) });
}
put(".well-known/agent-skills/index.json", JSON.stringify({ $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json", skills: agentIndex }, null, 2));
put(".well-known/skills/index.json", JSON.stringify({ skills: legacyIndex }, null, 2));

// Shadcn registry: every item carries the transitive closure of its local files.
const SHADCN = new Set(fs.readdirSync(path.join(ROOT, "components/ui")).map((f) => f.replace(/\.tsx?$/, "")));
const NODE = new Set(["react", "react-dom", "next"]);
const resolveFile = (p) => {
  for (const c of [p, `${p}.ts`, `${p}.tsx`, `${p}/index.ts`, `${p}/index.tsx`]) if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  return null;
};
const pkgJson = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const ver = (name) => pkgJson.dependencies[name] ? `${name}@${pkgJson.dependencies[name]}` : name;
function closure(entry) {
  const files = new Set();
  const deps = new Set();
  const reg = new Set();
  const visit = (file) => {
    if (files.has(file)) return;
    files.add(file);
    if (!/\.tsx?$/.test(file)) return;
    const src = fs.readFileSync(file, "utf8");
    for (const m of src.matchAll(/(?:from\s+|import\s*\(\s*|^import\s+)['"]([^'"]+)['"]/gm)) {
      const spec = m[1];
      if (spec.startsWith(".")) {
        const r = resolveFile(path.resolve(path.dirname(file), spec));
        if (r) visit(r);
      } else if (spec.startsWith("@/components/ui/")) {
        const n = spec.split("/").pop();
        if (SHADCN.has(n)) reg.add(n);
      } else if (spec === "@/lib/utils") {
        reg.add("utils");
      } else if (spec.startsWith("@/")) {
        const r = resolveFile(path.join(ROOT, spec.slice(2)));
        if (r) visit(r);
      } else {
        const name = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
        if (!NODE.has(name)) deps.add(name);
      }
    }
  };
  visit(entry);
  return { files: [...files], deps: [...deps], reg: [...reg] };
}
const importPath = (slug) => {
  const md = fs.readFileSync(path.join(CONTENT, "components", `${slug}.md`), "utf8");
  return (md.match(/from '(@\/components\/[^']+)'/) || [])[1];
};
const EXTRA_ENTRIES = {
  button: ["components/iota/ui/button-group.tsx", "components/iota/ui/bulk-action-bar.tsx"],
  "dropdown-menu": ["components/iota-app/ui/export-menu.tsx"],
  "text-effects": ["components/iota-app/typewriter.tsx", "components/iota-app/work/motion.tsx"],
  message: ["components/iota/ai/response.tsx", "components/iota/ai/tool-call.tsx"],
};
const items = [];
const rel = (f) => path.relative(ROOT, f).replace(/\\/g, "/");
const fileEntry = (f) => ({ path: rel(f), type: /\/ui\//.test(rel(f)) ? "registry:ui" : "registry:file", target: rel(f), content: fs.readFileSync(f, "utf8") });
for (const c of catalog) {
  const ip = importPath(c.slug);
  if (!ip) {
    console.warn("no import path", c.slug);
    continue;
  }
  const entry = resolveFile(path.join(ROOT, ip.slice(2)));
  if (!entry) {
    console.warn("no file", c.slug, ip);
    continue;
  }
  const { files, deps, reg } = closure(entry);
  for (const extra of EXTRA_ENTRIES[c.slug] ?? []) {
    const more = closure(path.join(ROOT, extra));
    for (const f of more.files) if (!files.includes(f)) files.push(f);
    for (const d of more.deps) if (!deps.includes(d)) deps.push(d);
    for (const r of more.reg) if (!reg.includes(r)) reg.push(r);
  }
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: c.slug,
    type: c.group === "Blocks" ? "registry:block" : "registry:ui",
    title: c.title,
    description: c.description,
    author: "iOTA",
    categories: [c.group.toLowerCase()],
    dependencies: deps.map(ver),
    registryDependencies: [...reg, `${SITE}/r/theme.json`],
    files: files.map(fileEntry),
    meta: { docs: `${SITE}/components/${c.slug}.md`, page: `${SITE}/components/${c.slug}` },
  };
  put(`r/${c.slug}.json`, JSON.stringify(item));
  const importLine = fs.readFileSync(path.join(CONTENT, "components", `${c.slug}.md`), "utf8").match(/^import: (.*)$/m)?.[1] ?? "";
  for (const m of importLine.matchAll(/from '@\/(components\/[^']+)'/g)) {
    const want = resolveFile(path.join(ROOT, m[1]));
    if (!want || !files.includes(want)) throw new Error(`Registry item ${c.slug} is missing ${m[1]}`);
  }
  const { files: _f, ...summary } = item;
  items.push(summary);
}
const themeFiles = ["tokens.css", "base.css", "styles.css", "lib/utils.ts", "lib/portal.ts", "THIRD_PARTY_NOTICES.md"].map((f) => path.join(ROOT, "components/iota", f));
const skillMd = site(fs.readFileSync(path.join(CONTENT, "skills/iota/SKILL.md"), "utf8"));
put("r/theme.json", JSON.stringify({
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "theme",
  type: "registry:theme",
  title: "iOTA theme",
  description: "Tokens, styles and the iOTA skill.",
  author: "iOTA",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge", "@phosphor-icons/react", "hugeicons-react", "motion", "lenis", "torph", "@base-ui/react"],
  files: [
    ...themeFiles.map((f) => ({ path: rel(f), type: "registry:file", target: rel(f), content: fs.readFileSync(f, "utf8") })),
    { path: "skills/iota/SKILL.md", type: "registry:file", target: ".claude/skills/iota/SKILL.md", content: skillMd },
  ],
  docs: `In app/globals.css, after Tailwind, add @import "../components/iota/styles.css"; Then put className="iota" on <body> with IotaPortalProvider from @/components/iota/lib/portal inside it, and load Geist and Geist Mono as --font-geist-sans and --font-geist-mono.`,
}));
put("r/lint.json", JSON.stringify({
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "lint",
  type: "registry:lib",
  title: "iOTA lint",
  description: "ESLint rules that enforce the iOTA tokens and components.",
  author: "iOTA",
  dependencies: ["@typescript-eslint/parser"],
  files: fs.readdirSync(path.join(ROOT, "components/iota/lint")).map((f) => ({
    path: `components/iota/lint/${f}`,
    type: "registry:file",
    target: f === "eslint.config.mjs" ? "iota.eslint.config.mjs" : `lib/iota/lint/${f}`,
    content: fs.readFileSync(path.join(ROOT, "components/iota/lint", f), "utf8"),
  })),
}));
put("r/registry.json", JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry.json", name: "iota", homepage: SITE, items }, null, 2));

// llms.txt
const line = (c) => `- [${c.title}](${SITE}/components/${c.slug}.md): ${c.description}`;
const groups = [...new Set(catalog.map((c) => c.group))];
put("llms.txt", `# iOTA

> iOTA is a design system for coding agents: components, tokens and written rules an agent installs and follows while it builds UI. Every page has a Markdown version at its address plus .md.

## Install

- Skills: \`npx skills@latest add ${SITE}\`
- Theme and system skill: \`npx shadcn@latest add ${SITE}/r/theme.json\`
- One component: \`npx shadcn@latest add ${SITE}/r/<name>.json\`

## Skills

${skillDirs.map((n) => `- [${n}](${SITE}/skills/${n}/SKILL.md)`).join("\n")}

## Foundations

${fs.readdirSync(path.join(CONTENT, "foundations")).map((f) => `- [${f.replace(".md", "")}](${SITE}/foundations/${f})`).join("\n")}

${groups.map((g) => `## ${g}\n\n${catalog.filter((c) => c.group === g).map(line).join("\n")}`).join("\n\n")}
`);
console.log(`endpoints: ${catalog.length} components, ${skillDirs.length} skills, site ${SITE}`);
