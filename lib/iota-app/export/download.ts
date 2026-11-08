// Saving exports.
//
// Where the browser supports it (Chromium: Chrome, Edge, Arc, Opera…) the
// export asks *where* to save with the native Save dialog. That dialog may only
// open during a click, and a video render outlasts the click's activation
// window, so the order is: click → choose a location → render → write the file
// straight to the chosen place. Elsewhere (Firefox, Safari) it falls back to a
// normal download.
//
// `chooseSaveLocation` is called by the export menu on click; the export's own
// `downloadBlob` call later picks up the chosen file instead of downloading.

type SaveHandle = {
  name: string;
  createWritable: () => Promise<{
    write: (data: Blob) => Promise<void>;
    close: () => Promise<void>;
  }>;
};

type SavePicker = (opts: {
  suggestedName?: string;
  types?: { description?: string; accept: Record<string, string[]> }[];
}) => Promise<SaveHandle>;

const picker = (): SavePicker | undefined =>
  typeof window !== "undefined"
    ? (window as unknown as { showSaveFilePicker?: SavePicker })
        .showSaveFilePicker
    : undefined;

export const canChooseSaveLocation = () => !!picker();

const MIME: Record<string, string> = {
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  webm: "video/webm",
  glb: "model/gltf-binary",
  stl: "model/stl",
};

let pending: SaveHandle | null = null;

/**
 * Open the Save dialog for `suggestedName` (must run inside a click handler).
 * Resolves to `false` if the user cancelled — the caller should then skip the
 * export entirely — and `true` otherwise (including when the dialog isn't
 * supported, in which case the export downloads as before).
 */
export async function chooseSaveLocation(suggestedName: string): Promise<boolean> {
  pending = null;
  const show = picker();
  if (!show) return true;
  const ext = suggestedName.split(".").pop()?.toLowerCase() ?? "";
  const mime = MIME[ext];
  try {
    pending = await show({
      suggestedName,
      types: mime
        ? [{ description: `${ext.toUpperCase()} file`, accept: { [mime]: [`.${ext}`] } }]
        : undefined,
    });
    return true;
  } catch (e) {
    // AbortError = the user closed the dialog: cancel the export.
    if ((e as Error).name === "AbortError") return false;
    // Anything else (blocked in an iframe, permissions): just download.
    return true;
  }
}

/** Drop a chosen location without writing (e.g. the export failed). */
export function clearSaveLocation() {
  pending = null;
}

export function downloadBlob(data: BlobPart, filename: string, type: string) {
  const blob = new Blob([data], { type });
  const handle = pending;
  pending = null;
  // Write to the chosen file, unless the export changed format on the way
  // (an MP4 that fell back to WebM shouldn't land in a file named .mp4).
  const ext = (s: string) => s.split(".").pop()?.toLowerCase();
  if (handle && ext(handle.name) === ext(filename)) {
    void (async () => {
      try {
        const w = await handle.createWritable();
        await w.write(blob);
        await w.close();
      } catch (e) {
        console.error(e);
        anchorDownload(blob, filename);
      }
    })();
    return;
  }
  anchorDownload(blob, filename);
}

function anchorDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
