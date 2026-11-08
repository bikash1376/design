"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useDemoActive } from "./active";
import { Activity } from "@/components/iota/ai/activity";
import { AgentTurn, Message, MessageBubble, MessageBubbleContent, MessageContent, MessageFooter, MessageModel, MessageWorked } from "@/components/iota/ai/message";
import { Conversation, ConversationContent, ConversationProvider, ConversationViewport } from "@/components/iota/ai/conversation";
import { Reasoning } from "@/components/iota/ai/reasoning";
import { Response } from "@/components/iota/ai/response";
import { ToolCallList, type ToolCallData } from "@/components/iota/ai/tool-call";
import { Icon, Close, Renew } from "@/components/iota/icon";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentDrop,
  AttachmentDropDescription,
  AttachmentDropIcon,
  AttachmentDropTitle,
  AttachmentDropTrigger,
  AttachmentGlyph,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentProgress,
  AttachmentTile,
  AttachmentTitle,
} from "@/components/iota/ui/attachment";
import { LogViewer, type LogLine } from "@/components/iota/ui/log-viewer";
import { Timeline } from "@/components/iota/ui/timeline";

// Every AI demo replays a real sequence: state on a clock, handed to the real component.
// A loop restarts from a fresh key. With reduced motion, the demo holds its finished state.
function useClock(length: number, step = 80) {
  const reduce = useReducedMotion();
  const active = useDemoActive();
  const still = reduce || !active;
  const [state, setState] = useState({ t: 0, run: 0 });
  const start = useRef(0);
  useEffect(() => {
    if (still) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- rewind so the next selection plays from the top
      setState({ t: 0, run: 0 });
      return;
    }
    start.current = performance.now();
    const id = setInterval(() => {
      const e = performance.now() - start.current;
      if (e >= length) {
        start.current = performance.now();
        setState((s) => ({ t: 0, run: s.run + 1 }));
      } else setState((s) => ({ ...s, t: e }));
    }, step);
    return () => clearInterval(id);
  }, [length, step, still]);
  return still ? { t: length - 1, run: 0 } : state;
}

const ENTER = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] as const } };
const Enter = ({ children }: { children: ReactNode }) => <motion.div {...ENTER}>{children}</motion.div>;

const User = ({ children }: { children: string }) => (
  <Enter>
    <Message from="user">
      <MessageContent>
        <MessageBubble align="end">
          <MessageBubbleContent>{children}</MessageBubbleContent>
        </MessageBubble>
      </MessageContent>
    </Message>
  </Enter>
);

const typed = (text: string, elapsed: number, duration: number) => text.slice(0, Math.max(0, Math.round((elapsed / duration) * text.length)));

const THOUGHT = "Checking the source file. It has 14 strokes, so 2.4 seconds at 60 frames keeps the draw readable. 4K will fit the H.264 limit.";
const ANSWER = "Done. **logo.mp4** is ready at 4K: 14 strokes over 2.4 seconds, in H.264.";
const ANSWER_2 = "Slowing it to 3.2 seconds and exporting again.";

// One agent turn: thinks, works through tools, answers, then signs off.
function calls(t: number, base: number): ToolCallData[] {
  const out: ToolCallData[] = [];
  const step = (id: string, seq: number, tool: string, input: Record<string, unknown>, from: number, to: number) => {
    if (t < from) return;
    out.push({ id, seq, tool, input, status: t >= to ? "completed" : "running", startedAt: base + from, endedAt: t >= to ? base + to : undefined });
  };
  step("read", 1, "read_svg", { file: "logo.svg" }, 3000, 3700);
  step("trace", 2, "trace_paths", { strokes: 14 }, 3700, 4800);
  step("mp4", 3, "export_mp4", { size: "4K" }, 4800, 6000);
  return out;
}

function Thread() {
  const { t, run } = useClock(17000);
  const [base] = useState(() => Date.now());
  const thinking = t >= 600 && t < 3000;
  const answering = t >= 6100 && t < 8100;
  const second = t >= 10200 && t < 12000;
  return (
    <div key={run} className="flex flex-col gap-3">
      <User>Export this as a 4K MP4.</User>
      <AgentTurn name="iota-agent" time="14:02">
        {t >= 600 && (
          <Enter>
            <Reasoning streaming={thinking} duration={thinking ? undefined : 2}>
              {thinking ? typed(THOUGHT, t - 600, 2400) : THOUGHT}
            </Reasoning>
          </Enter>
        )}
        {t >= 3000 && (
          <Enter>
            <ToolCallList calls={calls(t, base)} orphanTtl={0} />
          </Enter>
        )}
        {t >= 6100 && <Response streaming={answering}>{answering ? typed(ANSWER, t - 6100, 2000) : ANSWER}</Response>}
        {t >= 8200 && (
          <Enter>
            <MessageFooter>
              <MessageWorked duration="8s" time="14:02" />
              <MessageModel model="model-s" />
            </MessageFooter>
          </Enter>
        )}
      </AgentTurn>
      {t >= 9200 && <User>Make the strokes slower.</User>}
      {t >= 9900 && (
        <AgentTurn name="iota-agent" time="14:03">
          {t < 10200 ? <Activity waiting announce={false} /> : <Response streaming={second}>{second ? typed(ANSWER_2, t - 10200, 1800) : ANSWER_2}</Response>}
        </AgentTurn>
      )}
    </div>
  );
}

export const MessageDemo = () => (
  <div className="no-scrollbar size-full overflow-y-auto p-4" data-lenis-prevent>
    <Thread />
  </div>
);

export const ConversationDemo = () => (
  <ConversationProvider status="streaming">
    <Conversation className="size-full">
      <ConversationViewport>
        <ConversationContent className="p-4">
          <Thread />
        </ConversationContent>
      </ConversationViewport>
    </Conversation>
  </ConversationProvider>
);

export function ResponseDemo() {
  const { t, run } = useClock(7000);
  const text = "Exported **logo.mp4** at 4K.\n\n- 14 strokes\n- 2.4 seconds\n- H.264";
  const streaming = t < 3600;
  return (
    <div key={run} className="flex size-full flex-col gap-3 p-4">
      <Response streaming={streaming}>{streaming ? typed(text, t, 3600) : text}</Response>
    </div>
  );
}

export function ReasoningDemo() {
  const { t, run } = useClock(8000);
  const streaming = t < 3600;
  return (
    <div key={run} className="flex size-full flex-col gap-3 p-4">
      <Reasoning streaming={streaming} duration={streaming ? undefined : 4}>
        {streaming ? typed(THOUGHT, t, 3600) : THOUGHT}
      </Reasoning>
    </div>
  );
}

export function ToolCallDemo() {
  const { t, run } = useClock(9000);
  const [base] = useState(() => Date.now());
  return (
    <div key={run} className="flex size-full flex-col gap-3 p-4">
      <ToolCallList calls={calls(t + 3000, base)} orphanTtl={0} />
    </div>
  );
}

export function ActivityDemo() {
  const { t, run } = useClock(6500);
  return (
    <div key={run} className="flex size-full flex-col gap-3 p-4">
      <Activity active={t < 3800} label={t < 1900 ? "Reading logo.svg" : "Tracing paths"} doneLabel="Traced 14 paths" />
    </div>
  );
}

const File = ({ name, type, note, state, children }: { name: string; type: string; note: string; state: "idle" | "uploading" | "processing" | "done" | "error"; children?: ReactNode }) => (
  <Attachment state={state}>
    <AttachmentMedia>
      <AttachmentGlyph type={type} name={name} />
    </AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>{name}</AttachmentTitle>
      <AttachmentDescription>{note}</AttachmentDescription>
    </AttachmentContent>
    {children}
  </Attachment>
);
const Remove = ({ name }: { name: string }) => (
  <AttachmentActions>
    <AttachmentAction aria-label={`Remove ${name}`}>
      <Icon icon={Close} size={14} />
    </AttachmentAction>
  </AttachmentActions>
);

// A file through its five states; the upload actually climbs.
export function AttachmentDemo() {
  const { t, run } = useClock(6000);
  const pct = Math.min(96, Math.round((t / 5000) * 96));
  const mb = ((pct / 100) * 4.8).toFixed(1);
  return (
    <div key={run} className="flex size-full flex-col gap-2 p-4">
      <File name="logo.svg" type="image/svg+xml" note="Picked, not sent" state="idle">
        <Remove name="logo.svg" />
      </File>
      <File name="frames.csv" type="text/csv" note={`${mb} of 4.8 MB`} state="uploading">
        <AttachmentProgress value={pct} label="Uploading frames.csv" />
      </File>
      <File name="brief.pdf" type="application/pdf" note="Reading the file" state="processing" />
      <File name="trace.json" type="application/json" note="12 KB" state="done">
        <Remove name="trace.json" />
      </File>
      <File name="render.mp4" type="video/mp4" note="Over the 25 MB limit" state="error">
        <AttachmentActions>
          <AttachmentAction aria-label="Retry render.mp4">
            <Icon icon={Renew} size={14} />
          </AttachmentAction>
        </AttachmentActions>
      </File>
    </div>
  );
}

export const AttachmentMessageDemo = () => (
  <div className="flex size-full flex-col justify-center p-4">
    <Message from="user">
      <MessageContent>
        <AttachmentGroup aria-label="Attached files">
          <File name="brief.pdf" type="application/pdf" note="240 KB" state="done" />
          <File name="trace.json" type="application/json" note="12 KB" state="done" />
        </AttachmentGroup>
        <MessageBubble align="end">
          <MessageBubbleContent>Use these for the next export.</MessageBubbleContent>
        </MessageBubble>
      </MessageContent>
    </Message>
  </div>
);

export const AttachmentDropDemo = () => (
  <div className="size-full p-4">
    <AttachmentDrop variant="zone" accept="image/*,application/pdf,text/csv" maxSize={25 * 1024 * 1024} className="size-full">
      <AttachmentDropIcon />
      <AttachmentDropTitle>Drop exports here</AttachmentDropTitle>
      <AttachmentDropDescription>Images, PDF or CSV, up to 25 MB each.</AttachmentDropDescription>
      <AttachmentDropTrigger>Choose files</AttachmentDropTrigger>
    </AttachmentDrop>
  </div>
);

export const AttachmentTileDemo = () => <AttachmentTile variant="tile" aria-label="Replace project icon" src="/iota-icon.png" fit="cover" onFile={() => {}} />;

const LOG: Omit<LogLine, "id">[] = [
  { level: "info", message: "render.start" },
  { level: "info", message: "parsed 14 strokes" },
  { level: "info", message: "frames 144" },
  { level: "warn", message: "encoder fell back to WebM" },
  { level: "info", message: "encoded 72 of 144" },
  { level: "fail", message: "disk quota low" },
  { level: "info", message: "render.done" },
];
export function LogViewerDemo() {
  const { t, run } = useClock(9000);
  const n = Math.min(LOG.length, 1 + Math.floor(t / 900));
  return <LogViewer key={run} label="Log for run_01" className="size-full" streaming={n < LOG.length} lines={LOG.slice(0, n).map((l, i) => ({ ...l, id: i }))} />;
}

export function TimelineDemo() {
  const { t, run } = useClock(7000);
  const now = Math.min(t, 5200);
  const span = (id: string, label: string, start: number, end: number) => ({ id, label, start, end: now >= end ? end : undefined, status: now >= end ? ("ok" as const) : ("running" as const) });
  const spans = [span("1", "read_svg", 0, 700), span("2", "trace_paths", 700, 2600), span("3", "encode_h264", 2600, 5200)].filter((s) => now >= s.start);
  return <Timeline key={run} label="Run run_8f2a91" kind="run" now={now} spans={spans} className="size-full" />;
}
