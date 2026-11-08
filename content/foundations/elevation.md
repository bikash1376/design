---
name: Elevation
system: iota
kind: foundation
version: 1
last-updated: 2026-11-08
human: {{SITE}}/foundations/elevation
---

# Elevation

Everything is flat except overlays, and the things floating on the canvas.

## Rules
1. elevation-overlay-only MUST Put a shadow only on overlays, using `shadow-overlay`. Because a shadow on a flat card competes with what the card says.
2. elevation-canvas-exception SHOULD Give canvas nodes the soft float shadow. Because they are literally floating, and the shadow is what separates white from #f2f2f2.
3. elevation-no-glass NEVER Blur an overlay or bar. Because the page shows through and pulls the text under its contrast floor.
