// Builds the static site for Cloudflare.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

execSync("node scripts/build-endpoints.mjs", { stdio: "inherit" });
execSync("npx next build", { stdio: "inherit" });

// Next's static export writes route segments as __next.x/a/b/__PAGE__.txt, while its client
// asks for __next.x.a.b.__PAGE__.txt. Without flat copies every prefetch 404s and in-site
// navigation falls back to a slower path.
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? [path.join(d, e.name), ...walk(path.join(d, e.name))] : []));
let copied = 0;
for (const dir of ["out", ...walk("out")].filter((d) => path.basename(d).startsWith("__next.") && !path.dirname(d).includes("__next."))) {
  const files = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(path.join(d, e.name)) : [path.join(d, e.name)]));
  for (const f of files(dir)) {
    const flat = path.join(path.dirname(dir), [path.basename(dir), ...path.relative(dir, f).split(path.sep)].join("."));
    fs.copyFileSync(f, flat);
    copied++;
  }
}
console.log(`flattened ${copied} route segment files`);

