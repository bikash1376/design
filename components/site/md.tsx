import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// A small Markdown renderer for the me view. The docs use a narrow, known subset,
// so this stays dependency-free and renders on the server.

const hrefOf = (url: string) => url.replace(/^https?:\/\/[^/]+(?=\/(components|foundations|skills)\/)/, "").replace(/\.md$/, "");

export function Inline({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined)
      out.push(
        <code key={k++} className="rounded-sm bg-panel px-1 py-px font-mono text-[11px] [overflow-wrap:anywhere] text-foreground">
          {m[1]}
        </code>,
      );
    else if (m[2] !== undefined) {
      const href = hrefOf(m[3]);
      const inner = <span className="underline decoration-hair underline-offset-3 transition-colors hover:text-brand hover:decoration-brand">{m[2]}</span>;
      out.push(
        href.startsWith("/") ? (
          <Link key={k++} href={href}>
            {inner}
          </Link>
        ) : (
          <a key={k++} href={href} target="_blank" rel="noreferrer">
            {inner}
          </a>
        ),
      );
    } else if (m[4] !== undefined)
      out.push(
        <strong key={k++} className="font-medium text-foreground">
          {m[4]}
        </strong>,
      );
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

export function CodeBox({ code, className }: { code: string; className?: string }) {
  return (
    <pre
      data-lenis-prevent
      className={cn("overflow-x-auto rounded-lg bg-panel p-3 font-mono text-[11px] leading-[17px] text-foreground/85", className)}
    >
      <code>{code}</code>
    </pre>
  );
}

const cells = (row: string) =>
  row
    .replace(/^\||\|$/g, "")
    .split(/(?<!\\)\|/)
    .map((c) => c.trim().replace(/\\\|/g, "|"));

export function Md({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const fence = line.match(/^\s*```/);
    if (fence) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      blocks.push(<CodeBox key={k++} code={buf.join("\n")} />);
      continue;
    }
    const h = line.match(/^(#{1,4}) (.+)/);
    if (h) {
      blocks.push(
        <h3 key={k++} className="pt-2 text-[13px] font-medium text-foreground">
          <Inline text={h[2]} />
        </h3>,
      );
      i++;
      continue;
    }
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        if (!/^\|[\s:|-]+\|$/.test(lines[i])) rows.push(cells(lines[i]));
        i++;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div key={k++} className="flex flex-col">
          {body.map((r, ri) => (
            <div key={ri} className="flex flex-col gap-0.5 border-b border-border py-2 last:border-0">
              <span className="text-[12px] text-foreground">
                <Inline text={r[0]} />
              </span>
              {r.slice(1).map(
                (c, ci) =>
                  c && (
                    <span key={ci} className="text-[12px] text-text-2">
                      {head[ci + 1] && r.length > 2 && ci < r.length - 2 && <span className="text-text-faint">{head[ci + 1]} </span>}
                      <Inline text={c} />
                    </span>
                  ),
              )}
            </div>
          ))}
        </div>,
      );
      continue;
    }
    if (/^\s*(- |\d+\. )/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && (/^\s*(- |\d+\. )/.test(lines[i]) || /^\s{2,}\S/.test(lines[i]))) {
        if (/^(- |\d+\. )/.test(lines[i])) items.push(lines[i].replace(/^(- \[ \] |- |\d+\. )/, ""));
        else if (items.length) items[items.length - 1] += " " + lines[i].trim().replace(/^- /, "");
        i++;
      }
      blocks.push(
        <ul key={k++} className="flex flex-col gap-1.5">
          {items.map((t, ti) => (
            <li key={ti} className="relative pl-3 text-[13px] leading-[19px] text-text-2 before:absolute before:top-[8px] before:left-0 before:size-[3px] before:rounded-full before:bg-text-faint">
              <Inline text={t} />
            </li>
          ))}
        </ul>,
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#|\||\s*```|\s*- |\d+\. )/.test(lines[i])) para.push(lines[i++]);
    if (!para.length) {
      i++;
      continue;
    }
    blocks.push(
      <p key={k++} className="text-[13px] leading-[19px] text-text-2">
        <Inline text={para.join(" ")} />
      </p>,
    );
  }
  return <div className="flex flex-col gap-3">{blocks}</div>;
}
