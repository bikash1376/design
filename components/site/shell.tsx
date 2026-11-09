"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { XLogoIcon } from "@phosphor-icons/react";
import { PixelTitle } from "@/components/iota-app/pixel-title";
import { Canvas, NOTCH } from "./canvas";
import { CommandMenu, type NavIndex } from "./command-menu";

type View = "me" | "agent";
const ViewContext = createContext<{ view: View; setView: (v: View) => void }>({ view: "me", setView: () => {} });
export const useDocView = () => useContext(ViewContext);

const STORE = "iota:doc-view";

// The persistent frame: left column swaps with the route, the canvas on the right never remounts.
export function Shell({ children, index }: { children: ReactNode; index: NavIndex }) {
  const pathname = usePathname();
  const router = useRouter();
  const [view, setViewState] = useState<View>("me");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read after mount so the server and client agree
      if (saved === "agent" || saved === "me") setViewState(saved);
    } catch {}
  }, []);

  const setView = useCallback((v: View) => {
    setViewState(v);
    try {
      localStorage.setItem(STORE, v);
    } catch {}
  }, []);

  const selected = useMemo(() => pathname.match(/^\/components\/([^/]+)$/)?.[1] ?? null, [pathname]);
  const inDoc = pathname !== "/";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !inDoc) return;
      const t = e.target as HTMLElement;
      if (t.closest("[role=dialog],[role=menu],[role=listbox]")) return;
      if (document.querySelector("[data-slot=dialog-content],[data-slot=command-dialog]")) return;
      router.push("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inDoc, router]);

  const ctx = useMemo(() => ({ view, setView }), [view, setView]);

  return (
    <ViewContext.Provider value={ctx}>
      <div className="flex h-dvh min-h-0 flex-col-reverse gap-2 overflow-hidden bg-page p-2 md:flex-row">
        <aside className="relative flex min-h-0 w-full flex-1 flex-col md:w-[340px] md:flex-none lg:w-[372px]">
          <header className="flex h-11 shrink-0 items-center justify-between px-4">
            <Link href="/" aria-label="iOTA home" className="font-pixel text-[17px] tracking-tight text-brand">
              <PixelTitle text="iOTA" interval={1400} speed={140} />
            </Link>
            <CommandMenu index={index} />
          </header>
          <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
        </aside>
        <main className="relative min-h-0 flex-1 max-md:basis-[46%] max-md:flex-none">
          <Canvas selected={selected} dimAll={inDoc && !selected} />
          <div className="absolute top-0 right-0 grid place-items-center" style={{ width: NOTCH, height: NOTCH }}>
            <a
              href="https://x.com/bikash1376"
              target="_blank"
              rel="noreferrer"
              aria-label="Bikash on X"
              className="grid size-10 place-items-center rounded-xl text-text-2 transition-[background-color,color,scale] duration-150 hover:bg-panel hover:text-foreground active:scale-[0.97]"
            >
              <XLogoIcon size={18} />
            </a>
          </div>
        </main>
      </div>
    </ViewContext.Provider>
  );
}
