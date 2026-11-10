import type { Metadata } from "next";
import { EmbedCanvas } from "./embed-canvas";

export const metadata: Metadata = {
  title: "Canvas",
  robots: { index: false },
};

// The component canvas on its own, made to be framed by another site.
export default function EmbedPage() {
  return (
    <div className="h-dvh bg-page p-0">
      <div className="relative size-full">
        <EmbedCanvas />
      </div>
    </div>
  );
}
