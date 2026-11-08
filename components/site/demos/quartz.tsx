"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { TextMorph } from "torph/react";
import { cn } from "@/lib/utils";
import { useDemoActive } from "./active";
import { Icon, Copy, Add, ArrowUp, Checkmark, CircleDash } from "@/components/iota/icon";
import { PromptInput } from "@/components/iota/ai/prompt-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/iota/ui/alert";
import { Avatar, AvatarGroup } from "@/components/iota/ui/avatar";
import { Badge } from "@/components/iota/ui/badge";
import { BreadcrumbTrail } from "@/components/iota/ui/breadcrumb";
import { BulkAction, BulkActionBar } from "@/components/iota/ui/bulk-action-bar";
import { Button } from "@/components/iota/ui/button";
import { ButtonGroup, ButtonGroupMenu, ButtonGroupMenuItem } from "@/components/iota/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/iota/ui/card";
import { Chart } from "@/components/iota/ui/chart";
import { Checkbox } from "@/components/iota/ui/checkbox";
import { Chip, ChipGroup } from "@/components/iota/ui/chip";
import { CodeBlock } from "@/components/iota/ui/code-block";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/iota/ui/collapsible";
import { ComboboxField } from "@/components/iota/ui/combobox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/iota/ui/command";
import { CopyButton } from "@/components/iota/ui/copy-button";
import { DataGrid, DataGridBody, DataGridCell, DataGridRow, DataGridTable } from "@/components/iota/ui/data-grid";
import { DataList, DataListItem, DataListLabel, DataListValue } from "@/components/iota/ui/data-list";
import { DatePicker } from "@/components/iota/ui/date-picker";
import { Dialog, DialogAction, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/iota/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/iota/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/iota/ui/empty-state";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/iota/ui/field";
import { FilterBar, FilterBarCount, FilterBarSearch, FilterBarSelect } from "@/components/iota/ui/filter-bar";
import { Input } from "@/components/iota/ui/input";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemStatus, ItemTitle } from "@/components/iota/ui/item";
import { JsonView } from "@/components/iota/ui/json-view";
import { Kbd } from "@/components/iota/ui/kbd";
import { PageHeader, PageHeaderActions, PageHeaderContent, PageHeaderDescription, PageHeaderRow, PageHeaderTitle } from "@/components/iota/ui/page-header";
import { PaginationNav } from "@/components/iota/ui/pagination";
import { Panel, PanelBody, PanelHeader, PanelMeta, PanelTitle } from "@/components/iota/ui/panel";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/iota/ui/popover";
import { Progress, ProgressLabel, ProgressValue } from "@/components/iota/ui/progress";
import { RadioGroup, RadioGroupOption } from "@/components/iota/ui/radio-group";
import { RelativeTime } from "@/components/iota/ui/relative-time";
import { SegmentedControl, SegmentedControlItem } from "@/components/iota/ui/segmented-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/iota/ui/select";
import { Sheet, SheetBody, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/iota/ui/sheet";
import { Skeleton, SkeletonText } from "@/components/iota/ui/skeleton";
import { Slider } from "@/components/iota/ui/slider";
import { Stat, StatCount, StatDelta, StatLabel, StatValue } from "@/components/iota/ui/stat";
import { Status } from "@/components/iota/ui/status";
import { Switch } from "@/components/iota/ui/switch";
import { DataTable } from "@/components/iota/ui/table";
import { Tabs, TabsContent, TabsCount, TabsList, TabsTrigger } from "@/components/iota/ui/tabs";
import { Textarea } from "@/components/iota/ui/textarea";
import { toast } from "@/components/iota/ui/toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/iota/ui/tooltip";
import { Truncate } from "@/components/iota/ui/truncate";

const pad = "flex size-full flex-col gap-3 p-4";
const RUNS = [
  { id: "run_01", name: "logo-export", status: "ok" as const, time: "1.2s" },
  { id: "run_02", name: "icon-render", status: "running" as const, time: "4.8s" },
  { id: "run_03", name: "hero-render", status: "fail" as const, time: "9.1s" },
  { id: "run_04", name: "tile-render", status: "warn" as const, time: "2.6s" },
];
const CHART = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({ day, runs: [42, 58, 51, 74, 69, 88, 96][i] }));

export function ButtonDemo() {
  const [phase, setPhase] = useState<"idle" | "busy" | "done">("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const run = () => {
    if (phase !== "idle") return;
    setPhase("busy");
    timers.current = [setTimeout(() => setPhase("done"), 1500), setTimeout(() => setPhase("idle"), 3300)];
  };
  const swap = "col-start-1 row-start-1 transition-[opacity,scale] duration-200 ease-(--ease-step)";
  return (
    <Button onClick={run} aria-busy={phase === "busy" || undefined} className="overflow-hidden">
      <motion.span
        aria-hidden
        className="grid place-items-center overflow-hidden"
        initial={false}
        animate={{ width: phase === "idle" ? 0 : 16, marginRight: phase === "idle" ? -8 : 0, opacity: phase === "idle" ? 0 : 1 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      >
        <Icon icon={CircleDash} size={16} className={cn(swap, "animate-spin motion-reduce:animate-none", phase === "busy" ? "opacity-100" : "scale-75 opacity-0")} />
        <Icon icon={Checkmark} size={16} className={cn(swap, phase === "done" ? "opacity-100" : "scale-75 opacity-0")} />
      </motion.span>
      <TextMorph duration={300} ease="cubic-bezier(0.23, 1, 0.32, 1)">{phase === "idle" ? "Export MP4" : phase === "busy" ? "Exporting" : "Exported"}</TextMorph>
    </Button>
  );
}
export const ButtonSecondaryDemo = () => <Button variant="secondary">Cancel</Button>;
export const ButtonGhostDemo = () => <Button variant="ghost">Skip</Button>;
export const ButtonIconLeftDemo = () => <CopyButton value="<svg />" label="code" showLabel variant="secondary" size="default" />;
export const ButtonIconDemo = () => (
  <Button size="icon" aria-label="Send">
    <Icon icon={ArrowUp} />
  </Button>
);
export const ButtonGroupDemo = () => (
  <ButtonGroup>
    <Button>Export</Button>
    <ButtonGroupMenu label="More export options">
      <ButtonGroupMenuItem>Export as GIF</ButtonGroupMenuItem>
      <ButtonGroupMenuItem>Export as SVG</ButtonGroupMenuItem>
    </ButtonGroupMenu>
  </ButtonGroup>
);
export const CopyButtonDemo = () => (
  <div className="flex items-center gap-3 text-[12px]">
    <code className="font-mono text-text-2">run_01J9ZKQX</code>
    <CopyButton value="run_01J9ZKQX" label="run ID" />
  </div>
);
export const InputDemo = () => (
  <div className={pad}>
    <Field>
      <FieldLabel>Project name</FieldLabel>
      <Input placeholder="logo-reveal" autoComplete="off" />
    </Field>
  </div>
);
export const TextareaDemo = () => (
  <div className={pad}>
    <Field>
      <FieldLabel>Prompt</FieldLabel>
      <Textarea limit={280} placeholder="Draw the wordmark on, stroke by stroke." />
    </Field>
  </div>
);
export const FieldDemo = () => (
  <div className={pad}>
    <Field name="slug">
      <FieldLabel>Slug</FieldLabel>
      <Input placeholder="dither-export" />
      <FieldDescription>Lowercase and dashes.</FieldDescription>
      <FieldError />
    </Field>
  </div>
);
export const DatePickerDemo = () => (
  <div className={pad}>
    <DatePicker aria-label="Publish on" />
  </div>
);
const APPS = ["Dashboard", "Projects", "Exports", "Settings", "Members", "Billing", "Support"];
export const ComboboxDemo = () => (
  <div className={pad}>
    <ComboboxField items={APPS} placeholder="Search pages" showClear emptyText="No pages match." aria-label="Page" />
  </div>
);
export const CheckboxDemo = () => (
  <div className={pad}>
    <label className="flex items-center gap-2 text-[13px]">
      <Checkbox name="loop" defaultChecked />
      Loop the animation
    </label>
    <label className="flex items-center gap-2 text-[13px]">
      <Checkbox name="bg" />
      Transparent background
    </label>
  </div>
);
export const RadioGroupDemo = () => (
  <div className={pad}>
    <RadioGroup defaultValue="4k" aria-label="Export size">
      <RadioGroupOption value="hd" label="1080p" description="Smaller file." />
      <RadioGroupOption value="4k" label="4K" description="Crisp at any size." />
    </RadioGroup>
  </div>
);
export function SwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <label className="flex items-center gap-3 text-[13px]">
      Auto-replay
      <Switch checked={on} onCheckedChange={setOn} />
    </label>
  );
}
export function SliderDemo() {
  const [a, setA] = useState(48);
  const [b, setB] = useState(2.4);
  return (
    <div className="flex size-full flex-col gap-2 p-4">
      <Slider label="Stroke width" min={1} max={100} value={a} onValueChange={(n) => setA(n as number)} showValue />
      <Slider label="Duration" min={0.5} max={6} step={0.1} value={b} onValueChange={(n) => setB(n as number)} showValue format={{ minimumFractionDigits: 1, style: "unit", unit: "second", unitDisplay: "narrow" }} />
    </div>
  );
}
export const SelectDemo = () => {
  const items = [
    { value: "svg", label: "Animated SVG" },
    { value: "mp4", label: "MP4" },
    { value: "gif", label: "GIF" },
  ];
  return (
    <div className={pad}>
      <Select items={items} defaultValue="mp4">
        <SelectTrigger aria-label="Format">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
export const SegmentedControlDemo = () => (
  <div className="w-[260px]">
    <SegmentedControl aria-label="Mode" defaultValue="draw" fill>
      <SegmentedControlItem value="draw">Draw</SegmentedControlItem>
      <SegmentedControlItem value="fill">Fill</SegmentedControlItem>
      <SegmentedControlItem value="both">Both</SegmentedControlItem>
    </SegmentedControl>
  </div>
);
export const BadgeDemo = () => (
  <div className="flex flex-wrap items-center gap-1.5">
    <Badge kind="agent" />
    <Badge kind="run" />
    <Badge kind="deploy" />
    <Badge kind="model" />
    <Badge>Beta</Badge>
  </div>
);
export function ChipDemo() {
  const [a, setA] = useState(true);
  return (
    <ChipGroup aria-label="Filters">
      <Chip pressed={a} onPressedChange={setA}>Animated</Chip>
      <Chip>Vector</Chip>
      <Chip>Raster</Chip>
    </ChipGroup>
  );
}
export const StatusDemo = () => (
  <div className="flex flex-col gap-2 p-4">
    <Status status="running" live />
    <Status status="ok" />
    <Status status="warn" />
    <Status status="fail" />
  </div>
);
const StatDemoCount = () => {
  const on = useDemoActive();
  return on ? <StatCount value={549} /> : <>549</>;
};
export const StatDemo = () => (
  <div className={pad}>
    <Stat>
      <StatLabel>Exports today</StatLabel>
      <StatValue><StatDemoCount /></StatValue>
      <StatDelta from={498} to={549} period="yesterday" />
    </Stat>
  </div>
);
export const AvatarDemo = () => (
  <AvatarGroup>
    <Avatar name="Bikash" />
    <Avatar name="Divyansh" />
    <Avatar name="Ana Marsh" />
  </AvatarGroup>
);
export const KbdDemo = () => (
  <div className="flex items-center gap-2 whitespace-nowrap [&_*]:flex-nowrap">
    <Kbd keys="mod+k" />
    <Kbd keys="shift+enter" />
  </div>
);
export function RelativeTimeDemo() {
  const [at] = useState(() => new Date(Date.now() - 180000));
  return (
    <span className="text-[13px] text-text-2">
      Exported <RelativeTime date={at} />
    </span>
  );
}
export const TruncateDemo = () => (
  <div className="w-[180px] font-mono text-[12px]">
    <Truncate position="middle">run_01J9ZKQX8M2V4E7Q0TBRNH3S5</Truncate>
  </div>
);
export const ItemDemo = () => (
  <ItemGroup className="w-full p-2">
    {RUNS.slice(0, 3).map((r) => (
      <Item key={r.id} kind="run">
        <ItemContent>
          <ItemTitle>{r.name}</ItemTitle>
          <ItemDescription>{r.time}</ItemDescription>
        </ItemContent>
        <ItemStatus status={r.status} />
      </Item>
    ))}
  </ItemGroup>
);
export const CardDemo = () => (
  <Card className="size-full">
    <CardHeader>
      <CardTitle>Exports</CardTitle>
    </CardHeader>
    <CardContent>112 finished, 9 queued.</CardContent>
  </Card>
);
export const PanelDemo = () => (
  <Panel className="size-full">
    <PanelHeader>
      <PanelTitle>Needs a look</PanelTitle>
      <PanelMeta>2</PanelMeta>
    </PanelHeader>
    <PanelBody>
      {RUNS.slice(2).map((r) => (
        <div key={r.id} className="flex items-center justify-between px-4 py-2 text-[13px] rule-row">
          {r.name}
          <Status status={r.status} />
        </div>
      ))}
    </PanelBody>
  </Panel>
);
export const DataListDemo = () => (
  <div className={pad}>
    <DataList>
      <DataListItem>
        <DataListLabel>Project</DataListLabel>
        <DataListValue>Logo reveal</DataListValue>
      </DataListItem>
      <DataListItem>
        <DataListLabel>Format</DataListLabel>
        <DataListValue>MP4, 4K</DataListValue>
      </DataListItem>
      <DataListItem>
        <DataListLabel>Duration</DataListLabel>
        <DataListValue>2.4s</DataListValue>
      </DataListItem>
    </DataList>
  </div>
);
export const AlertDemo = () => (
  <Alert status="warn" className="size-full">
    <AlertTitle>Export limit at 82%</AlertTitle>
    <AlertDescription>New exports queue at the limit.</AlertDescription>
  </Alert>
);
export const ToastDemo = () => (
  <Button variant="secondary" onClick={() => toast.success("Exported logo.mp4", { description: "Saved to Downloads." })}>
    Show toast
  </Button>
);
export const EmptyDemo = () => (
  <Empty className="size-full">
    <EmptyHeader>
      <EmptyTitle>No exports yet</EmptyTitle>
      <EmptyDescription>Finished exports show up here.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button size="sm">New export</Button>
    </EmptyContent>
  </Empty>
);
export const SkeletonDemo = () => (
  <div className={pad}>
    <Skeleton className="h-24 w-full" />
    <SkeletonText lines={2} />
  </div>
);
export function ProgressDemo() {
  const on = useDemoActive();
  const [v, setV] = useState(62);
  useEffect(() => {
    if (!on) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the demo when it goes to rest
      setV(62);
      return;
    }
    setV(8);
    const id = setInterval(() => setV((n) => (n >= 100 ? 8 : Math.min(100, n + 7 + Math.round(Math.random() * 12)))), 700);
    return () => clearInterval(id);
  }, [on]);
  return (
    <div className={pad}>
      <Progress value={v} aria-label="Rendering">
        <ProgressLabel>Rendering frames</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={null} aria-label="Preparing">
        <ProgressLabel>Preparing</ProgressLabel>
      </Progress>
    </div>
  );
}
export const DialogDemo = () => (
  <Dialog>
    <DialogTrigger render={<Button variant="secondary" />}>Rename project</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Rename project</DialogTitle>
        <DialogDescription>The name shows on exports.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose>Cancel</DialogClose>
        <DialogAction onAction={() => {}}>Save</DialogAction>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
export const SheetDemo = () => (
  <Sheet>
    <SheetTrigger render={<Button variant="secondary" />}>Edit preset</SheetTrigger>
    <SheetContent side="end">
      <SheetHeader>
        <SheetTitle>Edit preset</SheetTitle>
      </SheetHeader>
      <SheetBody>Stroke, duration and easing for this preset.</SheetBody>
      <SheetFooter>
        <SheetClose>Cancel</SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);
export const PopoverDemo = () => (
  <Popover>
    <PopoverTrigger render={<Button variant="secondary" />}>Filter runs</PopoverTrigger>
    <PopoverContent align="start">
      <PopoverHeader>
        <PopoverTitle>Status</PopoverTitle>
      </PopoverHeader>
    </PopoverContent>
  </Popover>
);
export const TooltipDemo = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Copy" />}>
        <Icon icon={Copy} />
      </TooltipTrigger>
      <TooltipContent shortcut={["⌘", "C"]}>Copy run ID</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
export const DropdownDemo = () => (
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="secondary" />}>Actions</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Duplicate</DropdownMenuItem>
      <DropdownMenuItem>Export</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
export const CommandDemo = () => (
  <Command className="h-[236px] w-[320px] rounded-xl bg-page shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_28px_-18px_rgb(0_0_0/0.16)]">
    <CommandInput placeholder="Search pages" />
    <CommandList>
      <CommandEmpty />
      <CommandGroup heading="Pages">
        {APPS.slice(0, 4).map((a) => (
          <CommandItem key={a}>{a}</CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  </Command>
);
export const TabsDemo = () => (
  <div className={pad}>
    <Tabs defaultValue="thread">
      <TabsList aria-label="Project">
        <TabsTrigger value="thread">Preview</TabsTrigger>
        <TabsTrigger value="activity">
          Exports<TabsCount>24</TabsCount>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="thread" className="pt-3 text-[13px] text-text-2">The last render.</TabsContent>
      <TabsContent value="activity" className="pt-3 text-[13px] text-text-2">24 files.</TabsContent>
    </Tabs>
  </div>
);
export const BreadcrumbDemo = () => (
  <BreadcrumbTrail items={[{ label: "Projects", href: "#" }, { label: "Logo reveal", href: "#" }, { label: "Exports" }]} />
);
export const PaginationDemo = () => <PaginationNav page={4} pages={24} hrefPattern="#{page}" />;
export const CollapsibleDemo = () => (
  <div className={pad}>
    <Collapsible>
      <CollapsibleTrigger summary="2 lines">Raw input</CollapsibleTrigger>
      <CollapsibleContent>render.start</CollapsibleContent>
    </Collapsible>
  </div>
);
export const TableDemo = () => (
  <DataTable
    aria-label="Runs"
    title="Runs"
    kind="run"
    data={RUNS}
    getRowId={(r: (typeof RUNS)[number]) => r.id}
    columns={[
      { accessorKey: "name", header: "Name", size: 190 },
      { accessorKey: "status", header: "Status", size: 130, cell: ({ row }: { row: { original: (typeof RUNS)[number] } }) => <Status status={row.original.status} /> },
      { accessorKey: "time", header: "Time", size: 100 },
    ]}
    className="size-full"
  />
);
export function FilterBarDemo() {
  const [q, setQ] = useState("");
  const [s, setS] = useState<string[]>([]);
  return (
    <div className={pad}>
      <FilterBar aria-label="Filter runs">
        <FilterBarSearch value={q} onValueChange={setQ} placeholder="Search runs" />
        <FilterBarSelect label="Status" multiple options={[{ value: "ok", label: "Ok" }, { value: "fail", label: "Failed" }]} value={s} onValueChange={setS} />
        <FilterBarCount shown={4} total={24} noun="runs" />
      </FilterBar>
    </div>
  );
}
export function DataGridDemo() {
  const rows = [
    { id: "trace", score: 92 },
    { id: "dither", score: 84 },
    { id: "glass", score: 71 },
  ];
  return (
    <DataGrid rowCount={rows.length} colCount={1} className="size-full">
      <DataGridTable aria-label="Scores">
        <DataGridBody>
          {rows.map((c, row) => (
            <DataGridRow key={c.id} index={row}>
              <DataGridCell row={row} col={0} label={`Score for ${c.id}`} value={c.score} editor="number" onCommit={() => {}} />
            </DataGridRow>
          ))}
        </DataGridBody>
      </DataGridTable>
    </DataGrid>
  );
}
const APP_TSX = `import { Button } from "@/components/iota/ui/button";

// One button, any skin.
export function App() {
  return <Button variant="dark" size="sm">Export 4K</Button>;
}`;
export const CodeBlockDemo = () => <CodeBlock language="tsx" filename="app.tsx" code={APP_TSX} highlight="5" className="size-full" />;
export const JsonViewDemo = () => <JsonView label="export result" data={{ file: "logo.mp4", size: "4K", frames: 144, ok: true }} className="size-full" />;
export function ChartDemo() {
  const on = useDemoActive();
  const [data, setData] = useState(CHART);
  useEffect(() => {
    if (!on) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- rest on the real figures
      setData(CHART);
      return;
    }
    // Once it has drawn, the numbers keep arriving.
    const id = setInterval(() => setData((rows) => rows.map((r) => ({ ...r, runs: Math.max(24, Math.min(98, r.runs + Math.round((Math.random() - 0.5) * 22))) }))), 2400);
    return () => clearInterval(id);
  }, [on]);
  return <Chart type="line" label="Exports, last 7 days" data={data} xKey="day" config={{ runs: { label: "Exports", kind: "run" } }} unit="count" className="size-full" />;
}
export const PromptInputDemo = () => (
  <div className="flex size-full items-end p-3">
    <PromptInput status="ready" onSubmit={() => {}} placeholder="Ask the agent to animate something" className="w-full" />
  </div>
);
export const PageHeaderDemo = () => (
  <div className={pad}>
    <PageHeader>
      <PageHeaderRow>
        <PageHeaderContent>
          <PageHeaderTitle>Exports</PageHeaderTitle>
          <PageHeaderDescription>Everything rendered this week.</PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Button size="sm">
            <Icon icon={Add} size={14} />
            New
          </Button>
        </PageHeaderActions>
      </PageHeaderRow>
    </PageHeader>
  </div>
);
export const BulkActionBarDemo = () => (
  <BulkActionBar count={3} onClear={() => {}} className="static">
    <BulkAction>Export</BulkAction>
    <BulkAction>Delete</BulkAction>
  </BulkActionBar>
);
