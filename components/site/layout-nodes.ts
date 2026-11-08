// Places nodes outward from the centre on an elliptical spiral, first free spot wins.
// Deterministic, so the server and every visitor get the same map.

export type Size = { slug: string; w: number; h: number };
export type Placed = Size & { x: number; y: number; floatX: number; floatY: number; floatT: number; floatD: number };

const GAP = 170;
const ASPECT = 1.6;

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function layoutNodes(sizes: Size[]): Placed[] {
  const placed: Placed[] = [];
  let radius = 0;
  for (const size of sizes) {
    const seed = hash(size.slug);
    let angle = ((seed % 628) / 100) * 1;
    let r = Math.max(0, radius - 320);
    let x = 0;
    let y = 0;
    for (let guard = 0; guard < 6000; guard++) {
      x = Math.cos(angle) * r * ASPECT - size.w / 2;
      y = Math.sin(angle) * r - size.h / 2;
      const free = placed.every(
        (p) => x + size.w + GAP <= p.x || p.x + p.w + GAP <= x || y + size.h + GAP <= p.y || p.y + p.h + GAP <= y,
      );
      if (free) break;
      angle += 40 / Math.max(r, 80);
      r += 2;
    }
    radius = Math.max(radius, r);
    placed.push({
      ...size,
      x: Math.round(x),
      y: Math.round(y),
      // Slow, small and different for every node, so nothing moves in step.
      floatX: 5 + (seed % 7),
      floatY: 6 + ((seed >> 4) % 8),
      floatT: 11 + ((seed >> 8) % 9),
      floatD: -((seed >> 12) % 19),
    });
  }
  return placed;
}

export function bounds(nodes: Placed[]) {
  return {
    minX: Math.min(...nodes.map((n) => n.x)),
    minY: Math.min(...nodes.map((n) => n.y)),
    maxX: Math.max(...nodes.map((n) => n.x + n.w)),
    maxY: Math.max(...nodes.map((n) => n.y + n.h)),
  };
}
