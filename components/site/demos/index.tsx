"use client";

import type { ComponentType } from "react";
import * as Q from "./system";
import * as I from "./iota";
import * as L from "./live";

// `doc` lets several nodes share one page: each button variant floats alone but opens Button.
export type DemoSpec = { w: number; h: number; render: ComponentType; bare?: boolean; zoom?: number; doc?: string; title?: string };

const s = (w: number, h: number, render: ComponentType, zoom?: number): DemoSpec => ({ w, h, render, zoom });
const b = (w: number, h: number, render: ComponentType): DemoSpec => ({ w, h, render, bare: true });

export const DEMOS: Record<string, DemoSpec> = {
  button: { ...b(150, 36, Q.ButtonDemo), title: "Primary button" },
  "button-secondary": { ...b(90, 36, Q.ButtonSecondaryDemo), doc: "button", title: "Secondary button" },
  "button-ghost": { ...b(70, 36, Q.ButtonGhostDemo), doc: "button", title: "Ghost button" },
  "button-icon-left": { ...b(120, 36, Q.ButtonIconLeftDemo), doc: "button", title: "Button with icon" },
  "button-icon": { ...b(40, 36, Q.ButtonIconDemo), doc: "button", title: "Icon button" },
  "button-group": { ...b(170, 36, Q.ButtonGroupDemo), doc: "button", title: "Button group" },
  "button-bulk": { ...b(300, 44, Q.BulkActionBarDemo), doc: "button", title: "Bulk actions" },
  "copy-button": b(170, 32, Q.CopyButtonDemo),
  input: s(280, 96, Q.InputDemo),
  textarea: s(300, 150, Q.TextareaDemo),
  field: s(280, 122, Q.FieldDemo),
  "date-picker": s(260, 72, Q.DatePickerDemo),
  combobox: s(260, 72, Q.ComboboxDemo),
  checkbox: s(240, 88, Q.CheckboxDemo),
  "radio-group": s(260, 128, Q.RadioGroupDemo),
  switch: b(150, 28, Q.SwitchDemo),
  slider: s(300, 116, Q.SliderDemo),
  select: s(220, 72, Q.SelectDemo),
  "segmented-control": b(260, 36, Q.SegmentedControlDemo),
  badge: b(290, 28, Q.BadgeDemo),
  chip: b(240, 32, Q.ChipDemo),
  status: s(140, 132, Q.StatusDemo),
  stat: s(200, 124, Q.StatDemo),
  avatar: b(110, 36, Q.AvatarDemo),
  kbd: b(190, 28, Q.KbdDemo),
  "relative-time": b(150, 24, Q.RelativeTimeDemo),
  truncate: b(190, 24, Q.TruncateDemo),
  item: s(320, 192, Q.ItemDemo),
  card: s(260, 120, Q.CardDemo),
  panel: s(300, 150, Q.PanelDemo),
  "data-list": s(260, 190, Q.DataListDemo),
  alert: s(320, 84, Q.AlertDemo),
  toast: b(110, 32, Q.ToastDemo),
  "empty-state": s(300, 180, Q.EmptyDemo),
  skeleton: s(260, 188, Q.SkeletonDemo),
  progress: s(280, 120, Q.ProgressDemo),
  dialog: b(130, 32, Q.DialogDemo),
  sheet: b(100, 32, Q.SheetDemo),
  popover: b(100, 32, Q.PopoverDemo),
  tooltip: b(40, 32, Q.TooltipDemo),
  "dropdown-menu": b(90, 32, Q.DropdownDemo),
  "dropdown-export": { ...b(120, 36, I.ExportMenuDemo), doc: "dropdown-menu", title: "Export menu" },
  command: b(320, 236, Q.CommandDemo),
  tabs: s(300, 120, Q.TabsDemo),
  breadcrumb: b(370, 24, Q.BreadcrumbDemo),
  pagination: b(320, 32, Q.PaginationDemo),
  collapsible: s(260, 96, Q.CollapsibleDemo),
  table: s(460, 260, Q.TableDemo),
  "filter-bar": s(520, 72, Q.FilterBarDemo),
  timeline: s(460, 204, L.TimelineDemo),
  "data-grid": s(240, 150, Q.DataGridDemo),
  "code-block": s(540, 190, Q.CodeBlockDemo),
  "json-view": s(280, 170, Q.JsonViewDemo),
  "log-viewer": s(380, 220, L.LogViewerDemo),
  attachment: { ...s(240, 280, L.AttachmentDemo), title: "Attachment states" },
  "attachment-message": { ...s(360, 200, L.AttachmentMessageDemo), doc: "attachment", title: "Files on a message" },
  "attachment-drop": { ...s(340, 210, L.AttachmentDropDemo), doc: "attachment", title: "Drop zone" },
  "attachment-tile": { ...b(96, 96, L.AttachmentTileDemo), doc: "attachment", title: "Image tile" },
  chart: s(460, 330, Q.ChartDemo),
  message: s(460, 500, L.MessageDemo),
  conversation: s(460, 460, L.ConversationDemo),
  response: s(320, 170, L.ResponseDemo),
  reasoning: s(340, 170, L.ReasoningDemo),
  "tool-call": s(380, 200, L.ToolCallDemo),
  activity: s(260, 60, L.ActivityDemo),
  "prompt-input": s(420, 110, Q.PromptInputDemo),
  "page-header": s(420, 120, Q.PageHeaderDemo),
  "color-picker": b(170, 28, I.ColorPickerDemo),
  "control-row": s(260, 112, I.ControlRowDemo),
  "origin-wave": b(84, 84, I.OriginWaveDemo),
  "pixel-title": b(180, 72, I.PixelTitleDemo),
  scales: s(260, 120, I.ScalesDemo),
  reveal: b(220, 24, I.RevealDemo),
  "text-effects": { ...b(210, 32, I.RotatingWordDemo), title: "Rotating word" },
  "text-effects-typewriter": { ...b(180, 32, I.TypewriterDemo), doc: "text-effects", title: "Typewriter" },
  "text-effects-word-reveal": { ...b(240, 70, I.WordRevealDemo), doc: "text-effects", title: "Word reveal" },
  faq: s(420, 260, I.FaqDemo),
};

// Centre first: a varied, recognisable mix, then everything else outward.
const LEAD = ["button", "button-secondary", "button-icon-left", "button-ghost", "button-icon", "button-group", "chart", "switch", "message", "slider", "status", "card", "segmented-control", "pixel-title", "alert", "item", "tool-call", "origin-wave", "badge"];
export const DEMO_ORDER = [...LEAD, ...Object.keys(DEMOS).filter((k) => !LEAD.includes(k))];
