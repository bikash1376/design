'use client';

import {Menu as MenuPrimitive} from '@base-ui/react/menu';
import {mergeProps} from '@base-ui/react/merge-props';
import {useRender} from '@base-ui/react/use-render';
import {cva, type VariantProps} from 'class-variance-authority';
import {createContext, useContext, useEffect, useMemo, useRef, useState, type ComponentProps, type ReactNode, type RefObject} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {TextMorph} from 'torph/react';
import {Icon, Checkmark, ChevronDown, Download} from '../icon';
import {useIotaPortal} from '../lib/portal';
import {cn, mergeClass, mergeRefs} from '../lib/utils';
import {Button, type ButtonProps} from './button';
import {overlayMotion, overlaySurface} from '../lib/overlay';

const buttonGroupVariants = cva(
  [
    'flex w-fit items-stretch gap-0',
    '[&>:not([data-variant=primary])]:shadow-none! *:active:scale-none!',
    '*:focus-visible:focus-ring-inset *:data-[variant=primary]:focus-visible:focus-ring-ink *:data-pressed:focus-visible:focus-ring-ink',
    'has-[>[data-variant=primary]]:gap-px *:data-[variant=primary]:rounded-none!',
    'has-[>[data-slot=button-group]]:gap-2',
  ],
  {
    variants: {
      orientation: {
        horizontal: '[&>:not([data-variant=primary],[data-slot=button-group-separator])]:frame-shared *:data-[variant=primary]:first:rounded-s-soft! *:data-[variant=primary]:last:rounded-e-soft! *:data-[slot=button-group-menu-trigger]:data-[variant=primary]:rounded-e-soft!',
        vertical: 'flex-col [&>:not([data-variant=primary],[data-slot=button-group-separator])]:frame-shared-y *:data-[variant=primary]:first:rounded-t-soft! *:data-[variant=primary]:last:rounded-b-soft! *:data-[slot=button-group-menu-trigger]:data-[variant=primary]:rounded-b-soft!',
      },
    },
    defaultVariants: {orientation: 'horizontal'},
  },
);

const GroupAnchor = createContext<RefObject<HTMLDivElement | null> | null>(null);

type ButtonGroupProps = ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>;

function ButtonGroup({className, orientation = 'horizontal', ref, ...props}: ButtonGroupProps) {
  const anchor = useRef<HTMLDivElement | null>(null);
  const setRef = useMemo(() => mergeRefs(anchor, ref), [ref]);
  return <GroupAnchor.Provider value={anchor}>
    <div
      ref={setRef}
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({orientation}), className)}
      {...props}
    />
  </GroupAnchor.Provider>;
}

function ButtonGroupText({className, render, ...props}: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        ...({'data-slot': 'button-group-text'} as ComponentProps<'div'>),
        className: cn('flex items-center gap-2 bg-page px-3 type-label text-text-2 forced-colors:border forced-colors:border-solid [&_svg]:pointer-events-none', className),
      },
      props,
    ),
  });
}

function ButtonGroupSeparator({className, orientation = 'vertical', ...props}: ComponentProps<'div'> & {orientation?: 'horizontal' | 'vertical'}) {
  return <div
    role="separator"
    aria-orientation={orientation}
    data-slot="button-group-separator"
    data-orientation={orientation}
    className={cn('relative shrink-0 self-stretch rounded-none! bg-line-row! forced-colors:bg-[CanvasText]', orientation === 'vertical' ? 'my-2 w-px' : 'mx-2 h-px', className)}
    {...props}
  />;
}

type ButtonGroupMenuProps = {
  label: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  pending?: boolean;
  disabled?: boolean;
  align?: 'start' | 'end';
};

function ButtonGroupMenu({label, children, variant = 'primary', size = 'default', pending, disabled, align = 'end'}: ButtonGroupMenuProps) {
  const container = useIotaPortal();
  const anchor = useContext(GroupAnchor);
  const iconSize: ButtonProps['size'] = size === 'sm' ? 'icon-sm' : size === 'lg' ? 'icon-lg' : 'icon';
  return <MenuPrimitive.Root>
    <MenuPrimitive.Trigger
      render={<Button variant={variant} size={iconSize}/>}
      disabled={disabled || pending}
      aria-label={label}
      data-slot="button-group-menu-trigger"
    >
      <Icon icon={ChevronDown} size={16} className="transition-none in-data-popup-open:rotate-180"/>
    </MenuPrimitive.Trigger>
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Positioner anchor={anchor ?? undefined} sideOffset={4} align={align} collisionPadding={8} className="isolate z-(--z-overlay) outline-none">
        <MenuPrimitive.Popup data-slot="button-group-menu" className={cn('menu-popup w-max max-w-[min(var(--popover),var(--available-width))]', overlaySurface, overlayMotion)}>
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  </MenuPrimitive.Root>;
}

type ButtonGroupMenuItemProps = MenuPrimitive.Item.Props & {
  description?: ReactNode;
  variant?: 'default' | 'destructive';
};

function ButtonGroupMenuItem({className, description, variant = 'default', children, ...props}: ButtonGroupMenuItemProps) {
  return <MenuPrimitive.Item
    data-slot="button-group-menu-item"
    data-variant={variant}
    data-status={variant === 'destructive' ? 'fail' : undefined}
    className={mergeClass(['menu-item', description && 'items-start'], className)}
    {...props}
  >
    {description
      ? <span className="flex min-w-0 flex-col gap-0.5">
          <span className="flex items-center gap-2">{children}</span>
          <span className="type-body-sm text-text-3">{description}</span>
        </span>
      : children}
  </MenuPrimitive.Item>;
}

function ButtonGroupMenuGroup({children, label}: {children: ReactNode; label?: string}) {
  return <MenuPrimitive.Group data-slot="button-group-menu-group">
    {label && <MenuPrimitive.GroupLabel className="menu-label">{label}</MenuPrimitive.GroupLabel>}
    {children}
  </MenuPrimitive.Group>;
}

function ButtonGroupMenuSeparator({className, ...props}: MenuPrimitive.Separator.Props) {
  return <MenuPrimitive.Separator data-slot="button-group-menu-separator" className={mergeClass('menu-separator', className)} {...props}/>;
}

type ExportFormat = {id: string; label: string};

type ExportGroupProps = {
  formats: readonly ExportFormat[];
  defaultFormat?: string;
  /** Runs the export. Resolve when it is done; resolve false or reject if it did not finish. */
  onExport?: (format: string) => unknown | Promise<unknown>;
  menuLabel?: string;
  className?: string;
};

// A split export button. Picking a format runs it straight away and remembers it; the main half
// repeats it. The download icon bobs through Exporting, then springs to a check on Exported.
function ExportGroup({formats, defaultFormat, onExport, menuLabel = 'Export format', className}: ExportGroupProps) {
  const reduce = useReducedMotion();
  const [format, setFormat] = useState(defaultFormat ?? formats[0]?.id);
  const [phase, setPhase] = useState<'idle' | 'busy' | 'done'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const current = formats.find(f => f.id === format) ?? formats[0];

  const run = async (id: string) => {
    if (phase === 'busy') return;
    clearTimeout(timer.current);
    setFormat(id);
    setPhase('busy');
    let ok = true;
    try {
      ok = (await onExport?.(id)) !== false;
    } catch {
      ok = false;
    }
    if (!ok) { setPhase('idle'); return; }
    setPhase('done');
    timer.current = setTimeout(() => setPhase('idle'), 1600);
  };

  const label = phase === 'done' ? 'Exported' : phase === 'busy' ? 'Exporting' : `Export ${current?.label ?? ''}`.trim();
  return <ButtonGroup data-slot="export-group" className={className}>
    <Button data-phase={phase} aria-busy={phase === 'busy' || undefined} onClick={() => current && run(current.id)} className="overflow-hidden">
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 start-0 bg-white/20"
        initial={false}
        animate={{width: phase === 'done' ? '100%' : '0%', opacity: phase === 'done' ? [0.9, 0] : 1}}
        transition={phase === 'done' ? {duration: 0.9, ease: 'easeOut'} : {duration: 0}}
      />
      <span aria-hidden className="relative grid size-4 place-items-center">
        <AnimatePresence initial={false} mode="popLayout">
          {phase === 'done'
            ? <motion.span
                key="check"
                className="col-start-1 row-start-1 flex"
                initial={{opacity: 0, scale: 0.6, rotate: -20}}
                animate={{opacity: 1, scale: 1, rotate: 0}}
                exit={{opacity: 0, scale: 0.6}}
                transition={reduce ? {duration: 0} : {type: 'spring', stiffness: 520, damping: 30}}
              ><Icon icon={Checkmark} size={16}/></motion.span>
            : <motion.span
                key="download"
                className="col-start-1 row-start-1 flex"
                initial={{opacity: 0, y: -6}}
                animate={phase === 'busy' && !reduce ? {opacity: 1, y: [0, 2.5, 0]} : {opacity: 1, y: 0}}
                exit={{opacity: 0, scale: 0.6, rotate: 14}}
                transition={phase === 'busy' && !reduce ? {y: {duration: 0.9, repeat: Infinity, ease: 'easeInOut'}} : {duration: 0.2}}
              ><Icon icon={Download} size={16}/></motion.span>}
        </AnimatePresence>
      </span>
      <TextMorph duration={340} ease="cubic-bezier(0.19, 1, 0.22, 1)" className="relative whitespace-nowrap">{label}</TextMorph>
    </Button>
    <ButtonGroupMenu label={menuLabel}>
      <MenuPrimitive.RadioGroup value={format}>
        {formats.map(f => <MenuPrimitive.RadioItem
          key={f.id}
          value={f.id}
          closeOnClick
          data-slot="export-group-item"
          onClick={() => run(f.id)}
          className="menu-item justify-between gap-6"
        >
          {f.label}
          <MenuPrimitive.RadioItemIndicator className="flex"><Icon icon={Checkmark} size={14}/></MenuPrimitive.RadioItemIndicator>
        </MenuPrimitive.RadioItem>)}
      </MenuPrimitive.RadioGroup>
    </ButtonGroupMenu>
  </ButtonGroup>;
}

export {
  ExportGroup,
  type ExportGroupProps,
  type ExportFormat,
  ButtonGroup, ButtonGroupMenu, ButtonGroupMenuGroup, ButtonGroupMenuItem, ButtonGroupMenuSeparator, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants,
  type ButtonGroupProps, type ButtonGroupMenuProps, type ButtonGroupMenuItemProps,
};
