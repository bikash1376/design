"use client";

import { useState } from "react";
import { useDemoActive } from "./active";
import { ExportMenu } from "@/components/iota-app/ui/export-menu";
import { ColorSwatch } from "@/components/iota-app/ui/color-picker";
import { Switch as IotaSwitch } from "@/components/iota-app/ui/switch";
import { ScalesContainer } from "@/components/iota-app/ui/scales";
import { ColorSwatch as Swatch, ControlRow } from "@/components/iota-app/playground/control-row";
import { OriginWave } from "@/components/iota-app/origin-wave";
import { PixelTitle } from "@/components/iota-app/pixel-title";
import { Typewriter } from "@/components/iota-app/typewriter";
import { Reveal, WordReveal } from "@/components/iota-app/work/motion";
import { RotatingWord } from "@/components/iota-app/work/rotating-word";
import { Faq } from "@/components/iota-app/work/faq";

const pad = "flex size-full flex-col gap-2 p-4";

export const ExportMenuDemo = () => (
  <ExportMenu
    items={[
      { id: "svg", label: "SVG", onSelect: () => false },
      { id: "png", label: "PNG", onSelect: () => false },
      { id: "mp4", label: "MP4", onSelect: () => false },
    ]}
  />
);
export function ColorPickerDemo() {
  const [c, setC] = useState("#0057fc");
  return (
    <div className="flex items-center gap-3 text-[13px]">
      Fill <ColorSwatch value={c} onChange={setC} />
      <code className="font-mono text-[11px] text-text-2">{c}</code>
    </div>
  );
}
export function ControlRowDemo() {
  const [c, setC] = useState("#18181b");
  const [l, setL] = useState(true);
  return (
    <div className={pad}>
      <ControlRow label="Color">
        <Swatch value={c} onChange={setC} />
      </ControlRow>
      <ControlRow label="Loop">
        <IotaSwitch checked={l} onChange={setL} label="Loop" />
      </ControlRow>
    </div>
  );
}
export const OriginWaveDemo = () => {
  const on = useDemoActive();
  return <OriginWave size={72} dotSize={8} speed={1} ringStagger={0.18} pattern="grid3" dotShape="circle" color="#0057fc" animated={on} />;
};
export const PixelTitleDemo = () => {
  const on = useDemoActive();
  return <PixelTitle text="iOTA" paused={!on} className="font-pixel text-[56px] tracking-tight text-brand" />;
};
export const TypewriterDemo = () => {
  const on = useDemoActive();
  return <Typewriter key={String(on)} text="draw it on" paused={!on} className="font-pixel text-[20px] text-foreground" speed={140} />;
};




export const ScalesDemo = () => (
  <ScalesContainer containerClassName="size-full rounded-xl" size={10}>
    <div className="flex h-[120px] items-center justify-center text-[12px] text-text-2">Reserved</div>
  </ScalesContainer>
);




export const RevealDemo = () => {
  const on = useDemoActive();
  const line = <p className="text-[13px] text-text-2">This block faded up once.</p>;
  return on ? <Reveal onMount>{line}</Reveal> : line;
};
export const WordRevealDemo = () => {
  const on = useDemoActive();
  return (
    <p className="text-[22px] leading-[1.2] font-medium tracking-tight">
      {on ? (
        <WordReveal onMount lines={[[{ text: "every word arrives" }], [{ text: "on its own", className: "text-brand" }]]} lineClassName="block" />
      ) : (
        <>
          <span className="block">every word arrives</span>
          <span className="block text-brand">on its own</span>
        </>
      )}
    </p>
  );
};

export const RotatingWordDemo = () => {
  const on = useDemoActive();
  return (
    <p className="text-[20px] leading-[1.2] font-medium tracking-tight">
      Animate <RotatingWord paused={!on} words={["logos", "icons", "type"]} className="text-brand" />
    </p>
  );
};
export const FaqDemo = () => (
  <div className="no-scrollbar size-full overflow-y-auto p-2" data-lenis-prevent>
    <Faq
      items={[
        { q: "Does it need a config file?", a: "No. Paste the prompt and your agent installs the theme and the skill." },
        { q: "Can I use one component?", a: "Yes. Each component installs on its own through the registry." },
        { q: "Which agents does it support?", a: "Any agent that reads skills or Markdown." },
      ]}
    />
  </div>
);





