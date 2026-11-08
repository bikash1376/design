'use client';

import type * as React from 'react';
import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  ArrowDownIcon,
  ArrowElbowDownLeftIcon,
  ArrowRightIcon,
  ArrowSquareOutIcon,
  ArrowUpIcon,
  ArrowsClockwiseIcon,
  ArrowsInIcon,
  ArrowsOutCardinalIcon,
  ArrowsOutIcon,
  BellIcon,
  BookOpenIcon,
  BrainIcon,
  BroomIcon,
  BuildingsIcon,
  CalendarBlankIcon,
  CaretUpDownIcon,
  ChartLineIcon,
  CheckIcon,
  CheckSquareIcon,
  CircleHalfIcon,
  CircleNotchIcon,
  ClockIcon,
  CodeIcon,
  CopyIcon,
  CornersOutIcon,
  CubeIcon,
  CursorIcon,
  DatabaseIcon,
  DotsSixVerticalIcon,
  DownloadSimpleIcon,
  EyeIcon,
  EyeSlashIcon,
  FileAudioIcon,
  FileCsvIcon,
  FileDocIcon,
  FileIcon,
  FileMdIcon,
  FilePdfIcon,
  FileTextIcon,
  FileVideoIcon,
  FlagIcon,
  FlaskIcon,
  FlowArrowIcon,
  FolderIcon,
  FolderOpenIcon,
  FunctionIcon,
  FunnelIcon,
  GearIcon,
  GitBranchIcon,
  GitForkIcon,
  GlobeIcon,
  HashIcon,
  HourglassMediumIcon,
  HouseIcon,
  ImageIcon,
  InfoIcon,
  KeyIcon,
  LightningIcon,
  LinkIcon,
  ListBulletsIcon,
  ListChecksIcon,
  ListIcon,
  LockIcon,
  MagicWandIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
  MicrophoneSlashIcon,
  MinusIcon,
  MoonIcon,
  PaperPlaneTiltIcon,
  PaperclipIcon,
  PauseIcon,
  PencilSimpleIcon,
  PlayIcon,
  PlusIcon,
  PulseIcon,
  PushPinIcon,
  RepeatIcon,
  RobotIcon,
  RocketIcon,
  RssIcon,
  SidebarSimpleIcon,
  SignOutIcon,
  StarIcon,
  StopIcon,
  SunIcon,
  TableIcon,
  TerminalIcon,
  TextAlignLeftIcon,
  TextTIcon,
  TimerIcon,
  TrashIcon,
  TrendDownIcon,
  TrendUpIcon,
  UploadSimpleIcon,
  UserCircleIcon,
  UserMinusIcon,
  WarningCircleIcon,
  WarningDiamondIcon,
  WarningIcon,
  WrenchIcon,
  XCircleIcon,
  XIcon,
} from '@phosphor-icons/react';
import {ArrowDown01Icon, ArrowLeft01Icon, ArrowRight01Icon, ArrowUp01Icon, MoreHorizontalIcon} from 'hugeicons-react';
import {cn} from './lib/utils';

// One import point for icons: Phosphor for glyphs, Hugeicons for the thin chevrons and the
// overflow mark iOTA already uses. Swap a glyph here and every component follows.
type GlyphProps = {size?: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false'; 'aria-label'?: string; role?: string; style?: React.CSSProperties};
export type IotaIcon = React.ComponentType<GlyphProps & Record<string, unknown>>;

const hugeStroke = (Glyph: React.ComponentType<Record<string, unknown>>): IotaIcon => {
  const Stroked = (props: GlyphProps) => <Glyph strokeWidth={2.2} {...props}/>;
  Stroked.displayName = 'Huge';
  return Stroked as IotaIcon;
};

export const Activity: IotaIcon = PulseIcon as unknown as IotaIcon;
export const Add: IotaIcon = PlusIcon as unknown as IotaIcon;
export const Archive: IotaIcon = ArchiveIcon as unknown as IotaIcon;
export const ArrowDown: IotaIcon = ArrowDownIcon as unknown as IotaIcon;
export const ArrowDownRight: IotaIcon = TrendDownIcon as unknown as IotaIcon;
export const ArrowLeft: IotaIcon = hugeStroke(ArrowLeft01Icon as unknown as React.ComponentType<Record<string, unknown>>);
export const ArrowRight: IotaIcon = ArrowRightIcon as unknown as IotaIcon;
export const ArrowUp: IotaIcon = ArrowUpIcon as unknown as IotaIcon;
export const ArrowUpRight: IotaIcon = TrendUpIcon as unknown as IotaIcon;
export const Asleep: IotaIcon = MoonIcon as unknown as IotaIcon;
export const Attachment: IotaIcon = PaperclipIcon as unknown as IotaIcon;
export const Book: IotaIcon = BookOpenIcon as unknown as IotaIcon;
export const Bot: IotaIcon = RobotIcon as unknown as IotaIcon;
export const Branch: IotaIcon = GitBranchIcon as unknown as IotaIcon;
export const Building: IotaIcon = BuildingsIcon as unknown as IotaIcon;
export const Calendar: IotaIcon = CalendarBlankIcon as unknown as IotaIcon;
export const ChartLine: IotaIcon = ChartLineIcon as unknown as IotaIcon;
export const CheckboxChecked: IotaIcon = CheckSquareIcon as unknown as IotaIcon;
export const Checkmark: IotaIcon = CheckIcon as unknown as IotaIcon;
export const Chemistry: IotaIcon = FlaskIcon as unknown as IotaIcon;
export const ChevronDown: IotaIcon = hugeStroke(ArrowDown01Icon as unknown as React.ComponentType<Record<string, unknown>>);
export const ChevronLeft: IotaIcon = hugeStroke(ArrowLeft01Icon as unknown as React.ComponentType<Record<string, unknown>>);
export const ChevronRight: IotaIcon = hugeStroke(ArrowRight01Icon as unknown as React.ComponentType<Record<string, unknown>>);
export const ChevronSort: IotaIcon = CaretUpDownIcon as unknown as IotaIcon;
export const ChevronUp: IotaIcon = hugeStroke(ArrowUp01Icon as unknown as React.ComponentType<Record<string, unknown>>);
export const CircleDash: IotaIcon = CircleNotchIcon as unknown as IotaIcon;
export const Clean: IotaIcon = BroomIcon as unknown as IotaIcon;
export const Close: IotaIcon = XIcon as unknown as IotaIcon;
export const CloseOutline: IotaIcon = XCircleIcon as unknown as IotaIcon;
export const Code: IotaIcon = CodeIcon as unknown as IotaIcon;
export const CollapseAll: IotaIcon = ArrowsInIcon as unknown as IotaIcon;
export const Contrast: IotaIcon = CircleHalfIcon as unknown as IotaIcon;
export const Copy: IotaIcon = CopyIcon as unknown as IotaIcon;
export const Csv: IotaIcon = FileCsvIcon as unknown as IotaIcon;
export const Cube: IotaIcon = CubeIcon as unknown as IotaIcon;
export const Cursor_1: IotaIcon = CursorIcon as unknown as IotaIcon;
export const DataBase: IotaIcon = DatabaseIcon as unknown as IotaIcon;
export const DataTable: IotaIcon = TableIcon as unknown as IotaIcon;
export const Document: IotaIcon = FileTextIcon as unknown as IotaIcon;
export const DocumentAudio: IotaIcon = FileAudioIcon as unknown as IotaIcon;
export const DocumentBlank: IotaIcon = FileIcon as unknown as IotaIcon;
export const DocumentPdf: IotaIcon = FilePdfIcon as unknown as IotaIcon;
export const DocumentVideo: IotaIcon = FileVideoIcon as unknown as IotaIcon;
export const DocumentView: IotaIcon = FileTextIcon as unknown as IotaIcon;
export const DocumentWordProcessor: IotaIcon = FileDocIcon as unknown as IotaIcon;
export const Download: IotaIcon = DownloadSimpleIcon as unknown as IotaIcon;
export const Draggable: IotaIcon = DotsSixVerticalIcon as unknown as IotaIcon;
export const Edit: IotaIcon = PencilSimpleIcon as unknown as IotaIcon;
export const ErrorOutline: IotaIcon = WarningCircleIcon as unknown as IotaIcon;
export const ExpandAll: IotaIcon = ArrowsOutIcon as unknown as IotaIcon;
export const Filter: IotaIcon = FunnelIcon as unknown as IotaIcon;
export const FitToScreen: IotaIcon = CornersOutIcon as unknown as IotaIcon;
export const Flag: IotaIcon = FlagIcon as unknown as IotaIcon;
export const Flash: IotaIcon = LightningIcon as unknown as IotaIcon;
export const Flow: IotaIcon = FlowArrowIcon as unknown as IotaIcon;
export const Folder: IotaIcon = FolderIcon as unknown as IotaIcon;
export const FolderOpen: IotaIcon = FolderOpenIcon as unknown as IotaIcon;
export const Fork: IotaIcon = GitForkIcon as unknown as IotaIcon;
export const Function: IotaIcon = FunctionIcon as unknown as IotaIcon;
export const Globe: IotaIcon = GlobeIcon as unknown as IotaIcon;
export const Hashtag: IotaIcon = HashIcon as unknown as IotaIcon;
export const Home: IotaIcon = HouseIcon as unknown as IotaIcon;
export const Hourglass: IotaIcon = HourglassMediumIcon as unknown as IotaIcon;
export const Image: IotaIcon = ImageIcon as unknown as IotaIcon;
export const Information: IotaIcon = InfoIcon as unknown as IotaIcon;
export const Password: IotaIcon = KeyIcon as unknown as IotaIcon;
export const Launch: IotaIcon = ArrowSquareOutIcon as unknown as IotaIcon;
export const Light: IotaIcon = SunIcon as unknown as IotaIcon;
export const Link: IotaIcon = LinkIcon as unknown as IotaIcon;
export const List: IotaIcon = ListIcon as unknown as IotaIcon;
export const ListBulleted: IotaIcon = ListBulletsIcon as unknown as IotaIcon;
export const ListChecked: IotaIcon = ListChecksIcon as unknown as IotaIcon;
export const Locked: IotaIcon = LockIcon as unknown as IotaIcon;
export const Logout: IotaIcon = SignOutIcon as unknown as IotaIcon;
export const MachineLearningModel: IotaIcon = BrainIcon as unknown as IotaIcon;
export const MagicWand: IotaIcon = MagicWandIcon as unknown as IotaIcon;
export const Markdown: IotaIcon = FileMdIcon as unknown as IotaIcon;
export const Microphone: IotaIcon = MicrophoneIcon as unknown as IotaIcon;
export const MicrophoneOff: IotaIcon = MicrophoneSlashIcon as unknown as IotaIcon;
export const Move: IotaIcon = ArrowsOutCardinalIcon as unknown as IotaIcon;
export const Notification: IotaIcon = BellIcon as unknown as IotaIcon;
export const OverflowMenuHorizontal: IotaIcon = hugeStroke(MoreHorizontalIcon as unknown as React.ComponentType<Record<string, unknown>>);
export const Pause: IotaIcon = PauseIcon as unknown as IotaIcon;
export const Pin: IotaIcon = PushPinIcon as unknown as IotaIcon;
export const Play: IotaIcon = PlayIcon as unknown as IotaIcon;
export const Renew: IotaIcon = ArrowsClockwiseIcon as unknown as IotaIcon;
export const Repeat: IotaIcon = RepeatIcon as unknown as IotaIcon;
export const Return: IotaIcon = ArrowElbowDownLeftIcon as unknown as IotaIcon;
export const Rocket: IotaIcon = RocketIcon as unknown as IotaIcon;
export const Rss: IotaIcon = RssIcon as unknown as IotaIcon;
export const Search: IotaIcon = MagnifyingGlassIcon as unknown as IotaIcon;
export const Send: IotaIcon = PaperPlaneTiltIcon as unknown as IotaIcon;
export const Settings: IotaIcon = GearIcon as unknown as IotaIcon;
export const SidePanelOpen: IotaIcon = SidebarSimpleIcon as unknown as IotaIcon;
export const Sql: IotaIcon = DatabaseIcon as unknown as IotaIcon;
export const Star: IotaIcon = StarIcon as unknown as IotaIcon;
export const StopOutline: IotaIcon = StopIcon as unknown as IotaIcon;
export const Subtract: IotaIcon = MinusIcon as unknown as IotaIcon;
export const Terminal: IotaIcon = TerminalIcon as unknown as IotaIcon;
export const TextAlignLeft: IotaIcon = TextAlignLeftIcon as unknown as IotaIcon;
export const TextFont: IotaIcon = TextTIcon as unknown as IotaIcon;
export const Time: IotaIcon = ClockIcon as unknown as IotaIcon;
export const Timer: IotaIcon = TimerIcon as unknown as IotaIcon;
export const Tools: IotaIcon = WrenchIcon as unknown as IotaIcon;
export const TrashCan: IotaIcon = TrashIcon as unknown as IotaIcon;
export const Undo: IotaIcon = ArrowCounterClockwiseIcon as unknown as IotaIcon;
export const Upload: IotaIcon = UploadSimpleIcon as unknown as IotaIcon;
export const UserAvatar: IotaIcon = UserCircleIcon as unknown as IotaIcon;
export const UserMinus: IotaIcon = UserMinusIcon as unknown as IotaIcon;
export const View: IotaIcon = EyeIcon as unknown as IotaIcon;
export const ViewOff: IotaIcon = EyeSlashIcon as unknown as IotaIcon;
export const Warning: IotaIcon = WarningIcon as unknown as IotaIcon;
export const WarningAlt: IotaIcon = WarningIcon as unknown as IotaIcon;
export const WarningDiamond: IotaIcon = WarningDiamondIcon as unknown as IotaIcon;

type IconProps = Omit<React.ComponentProps<'svg'>, 'children' | 'ref'> & {
  icon: IotaIcon;
  size?: number;
  label?: string;
};

export function Icon({icon: Glyph, size = 16, label, className, ...props}: IconProps) {
  return <Glyph
    size={size}
    aria-hidden={label ? undefined : true}
    aria-label={label}
    role={label ? 'img' : undefined}
    className={cn('shrink-0', className)}
    {...props}
  />;
}
