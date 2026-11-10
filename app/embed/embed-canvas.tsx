"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@/components/site/canvas";

// Selection stays inside the frame: picking a component wakes it in place instead of routing.
export function EmbedCanvas() {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <Canvas selected={selected} dimAll={false} onSelect={setSelected} embed />;
}
