export function clamp(v: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, v));
}

export type TunnelLayout = { zs: number[]; total: number };

export function tunnelLayout(
  count: number,
  { spacing = 1400, start = 1200, exit = 1200 }: { spacing?: number; start?: number; exit?: number } = {},
): TunnelLayout {
  const zs = Array.from({ length: count }, (_, i) => start + i * spacing);
  return { zs, total: count ? zs[count - 1] + exit : 0 };
}

export function progressForItem(index: number, layout: TunnelLayout): number {
  return layout.total ? layout.zs[index] / layout.total : 0;
}

export function tunnelVisual(
  distance: number,
  { far = 4200, fadeOut = -600, maxBlur = 6 }: { far?: number; fadeOut?: number; maxBlur?: number } = {},
): { opacity: number; blur: number } {
  if (distance >= far) return { opacity: 0, blur: maxBlur };
  if (distance >= 0) {
    const t = 1 - distance / far;
    return { opacity: t, blur: maxBlur * (1 - t) };
  }
  if (distance > fadeOut) return { opacity: 1 - distance / fadeOut, blur: 0 };
  return { opacity: 0, blur: 0 };
}

export function indexAtProgress(p: number, starts: readonly number[]): number {
  let idx = 0;
  starts.forEach((s, i) => {
    if (p >= s) idx = i;
  });
  return idx;
}

export function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/**
 * Final zoom of the Hero arch layer (2752×1536, box = max(viewport height, 80vw tall-equivalent),
 * origin 50% 62%) so the door opening (22.2% of the arch width, top at 21.4% of its height)
 * swallows the whole viewport, with margin for the curved top corners.
 */
export function archZoom(vw: number, vh: number): number {
  const h = Math.max(vh, (0.8 * vw * 1536) / 2752);
  const w = (h * 2752) / 1536;
  return Math.max(0.62 / (0.62 - 0.214), vw / (0.222 * w)) * 1.35;
}

/** Pads a scroll-linked range to 0..1 holding edge values (avoids implicit WAAPI keyframes). */
export function holdRange<T>(input: readonly number[], output: readonly T[]): [number[], T[]] {
  if (input.length !== output.length) throw new Error("holdRange: input and output lengths differ");
  const i = [...input];
  const o = [...output];
  if (i.length && i[0] > 0) {
    i.unshift(0);
    o.unshift(output[0]);
  }
  if (i.length && i[i.length - 1] < 1) {
    i.push(1);
    o.push(output[output.length - 1]);
  }
  return [i, o];
}
