'use client';

import * as React from 'react';
import {TextMorph} from 'torph/react';
import {Icon, Checkmark, Copy, Warning} from '../icon';
import {cn} from '../lib/utils';
import {Button, type ButtonProps} from './button';

type CopyState = 'idle' | 'fetching' | 'copied' | 'failed';

async function writeFetched(result: Promise<string>): Promise<string> {
  let text = '';
  const blob = result.then(t => { text = t; return new Blob([t], {type: 'text/plain'}); });
  const canWrite = typeof ClipboardItem !== 'undefined' && typeof navigator.clipboard?.write === 'function';
  if (canWrite) {
    try {
      await navigator.clipboard.write([new ClipboardItem({'text/plain': blob})]);
      return text;
    } catch {
    }
  }
  text = await result;
  await navigator.clipboard.writeText(text);
  return text;
}

type CopyButtonProps = Omit<ButtonProps, 'onClick' | 'children' | 'pending' | 'pendingLabel' | 'value' | 'pressed' | 'defaultPressed' | 'onPressedChange'> & {
  value: string | (() => string | Promise<string>);
  label?: string;
  showLabel?: boolean;
  timeout?: number;
  onCopy?: (value: string) => void;
  forceState?: Exclude<CopyState, 'idle'>;
};

function CopyButton({value, label, showLabel = false, timeout = 1600, onCopy, forceState, variant = 'ghost', size, className, ...props}: CopyButtonProps) {
  const [live, setState] = React.useState<CopyState>('idle');
  const [announcement, setAnnouncement] = React.useState('');
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const frame = React.useRef(0);
  React.useEffect(() => () => { clearTimeout(timer.current); cancelAnimationFrame(frame.current); }, []);
  const state = forceState ?? live;

  const announce = (message: string) => {
    cancelAnimationFrame(frame.current);
    setAnnouncement('');
    frame.current = requestAnimationFrame(() => setAnnouncement(message));
  };

  const copy = async () => {
    clearTimeout(timer.current);
    try {
      let text: string;
      const result = typeof value === 'function' ? value() : value;
      if (typeof result === 'string') {
        text = result;
        await navigator.clipboard.writeText(text);
      } else {
        const writing = writeFetched(result);
        setState('fetching');
        text = await writing;
      }
      setState('copied');
      announce(label ? `${label} copied` : 'Copied');
      onCopy?.(text);
    } catch {
      setState('failed');
      announce('Could not copy. Select the text and copy it by hand.');
    }
    timer.current = setTimeout(() => { setState('idle'); setAnnouncement(''); }, timeout);
  };

  const swap = 'col-start-1 row-start-1 transition-[opacity,scale,rotate] duration-200 ease-(--ease-step) motion-reduce:transition-none';
  const off = 'scale-75 opacity-0';
  const name = label ? `Copy ${label}` : 'Copy';
  const iconOnly = !showLabel;

  return <>
    <Button
      data-slot="copy-button"
      data-state={state}
      variant={variant}
      size={size ?? (iconOnly ? 'icon-sm' : 'sm')}
      aria-label={name}
      pending={state === 'fetching'}
      pendingLabel={showLabel ? 'Copy' : undefined}
      onClick={copy}
      className={className}
      {...props}
    >
      <span aria-hidden className="grid size-4 place-items-center">
        <Icon icon={Copy} size={16} className={cn(swap, state === 'copied' || state === 'failed' ? `${off} -rotate-12` : 'opacity-100')}/>
        <Icon icon={Checkmark} size={16} className={cn(swap, state === 'copied' ? 'opacity-100' : off)}/>
        <Icon icon={Warning} size={16} className={cn(swap, state === 'failed' ? 'opacity-100' : off)}/>
      </span>
      {showLabel && <TextMorph aria-hidden duration={300} ease="cubic-bezier(0.23, 1, 0.32, 1)">{state === 'copied' ? 'Copied' : state === 'failed' ? 'Failed' : 'Copy'}</TextMorph>}
    </Button>
    <span role="status" data-slot="copy-button-status" className="sr-only fixed">{announcement}</span>
  </>;
}

export {CopyButton, type CopyButtonProps};
