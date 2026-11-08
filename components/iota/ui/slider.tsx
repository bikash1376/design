'use client';

import {DirectionProvider} from '@base-ui/react/direction-provider';
import {Slider as SliderPrimitive} from '@base-ui/react/slider';
import {useMemo, useRef, type ReactNode} from 'react';
import {useDomDirection} from '../lib/direction';
import {cn, mergeClass, mergeRefs} from '../lib/utils';

type SliderProps = SliderPrimitive.Root.Props & {
  label?: ReactNode;
  thumbLabels?: string[];
  showValue?: boolean;
};

// iOTA's row slider: the whole row is the track, a thin tick marks the value, the label
// sits left and the value right. Press anywhere on the row to set it.
function Slider({className, defaultValue, value, min = 0, max = 100, step = 1, label, thumbLabels, showValue, format, locale = 'en-US', ref, ...props}: SliderProps) {
  const values = useMemo(() => {
    const v = value ?? defaultValue;
    return Array.isArray(v) ? v : [v ?? min];
  }, [value, defaultValue, min]);
  const box = useRef<HTMLDivElement | null>(null);
  const boxRefs = useMemo(() => mergeRefs(box, ref), [ref]);
  const dir = useDomDirection(box);

  return <DirectionProvider direction={dir}>
    <SliderPrimitive.Root
      ref={boxRefs}
      data-slot="slider"
      className={mergeClass(
        [
          'group/slider relative flex items-center justify-between gap-3 overflow-hidden rounded-lg bg-panel px-3 type-label select-none',
          'data-[orientation=horizontal]:h-9 data-[orientation=horizontal]:w-full',
          'data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-9 data-[orientation=vertical]:flex-col data-[orientation=vertical]:px-0 data-[orientation=vertical]:py-2',
          'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-(--border-focus)',
          'data-disabled:cursor-not-allowed data-disabled:opacity-(--dim-opacity)',
        ],
        className,
      )}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      step={step}
      format={format}
      thumbAlignment="edge"
      locale={locale}
      {...props}
    >
      <SliderPrimitive.Control
        data-slot="slider-control"
        className="absolute inset-0 cursor-pointer touch-none data-disabled:cursor-not-allowed"
      >
        <SliderPrimitive.Track data-slot="slider-track" className="relative size-full forced-colors:border forced-colors:border-solid forced-colors:border-[CanvasText]">
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-fill data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full forced-colors:[forced-color-adjust:none] forced-colors:bg-[Highlight]"
          />
          {values.map((_, index) => <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            getAriaLabel={thumbLabels ? i => thumbLabels[i] ?? '' : undefined}
            className={cn(
              'relative block shrink-0 bg-text-faint outline-none transition-[background-color] duration-(--dur-fast) ease-(--ease-step) [-webkit-tap-highlight-color:transparent]',
              'data-[orientation=horizontal]:h-4 data-[orientation=horizontal]:w-px data-[orientation=vertical]:h-px data-[orientation=vertical]:w-4',
              "after:absolute after:-inset-x-2 after:-inset-y-3 after:content-['']",
              'group-hover/slider:not-data-disabled:bg-text-2 data-dragging:bg-text-1',
              'forced-colors:[forced-color-adjust:none] forced-colors:bg-[CanvasText]',
            )}
          />)}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
      {label && <span data-slot="slider-label" className="pointer-events-none relative min-w-0 truncate text-foreground/80">{label}</span>}
      {showValue && <SliderPrimitive.Value data-slot="slider-value" className="pointer-events-none relative ms-auto shrink-0 font-mono text-text-2 tabular-nums data-disabled:text-text-disabled">
        {formatted => formatted.join(' – ')}
      </SliderPrimitive.Value>}
    </SliderPrimitive.Root>
  </DirectionProvider>;
}

export {Slider, type SliderProps};
