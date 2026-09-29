export function clamp(v: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, v));
}

export function progressToFrame(progress: number, frameCount: number): number {
  if (frameCount <= 0) return 0;
  return Math.round(clamp(progress) * (frameCount - 1));
}

export function frameLoadOrder(frameCount: number, stride = 8): number[] {
  const order: number[] = [];
  const seen = new Set<number>();
  const add = (i: number) => {
    if (i >= 0 && i < frameCount && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  let s = Math.max(1, stride);
  let first = true;
  while (true) {
    for (let i = 0; i < frameCount; i += s) add(i);
    if (first) {
      add(frameCount - 1);
      first = false;
    }
    if (s === 1) break;
    s = Math.max(1, Math.floor(s / 2));
  }
  return order;
}

export function nearestLoaded(target: number, loaded: readonly boolean[]): number {
  for (let d = 0; d < loaded.length; d++) {
    if (loaded[target - d]) return target - d;
    if (loaded[target + d]) return target + d;
  }
  return -1;
}

export function coverRect(iw: number, ih: number, cw: number, ch: number, focalY = 0.5) {
  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  return { dx: (cw - dw) / 2, dy: ((ch - dh) * focalY) || 0, dw, dh };
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
