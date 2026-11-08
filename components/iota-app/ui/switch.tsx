"use client";

import { Switch as IotaSwitch } from "@/components/iota/ui/switch";

// The one-prop-style switch used by control rows and the export menu: the system Switch
// with a required label, so there is only one switch look.
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Announced to screen readers: the visible heading is separate. */
  label: string;
}) {
  return <IotaSwitch checked={checked} onCheckedChange={(next) => onChange(next)} aria-label={label} title={label} size="sm" />;
}
