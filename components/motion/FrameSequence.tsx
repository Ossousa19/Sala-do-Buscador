"use client";
import { useCallback, useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import { coverRect, frameLoadOrder, nearestLoaded, progressToFrame } from "@/lib/motion/math";

type Props = { frames: string[]; progress: MotionValue<number>; focalY?: number; className?: string };

const CONCURRENCY = 6;

export function FrameSequence({ frames, progress, focalY = 0.5, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const loaded = useRef<boolean[]>([]);
  const drawn = useRef(-1);

  const draw = useCallback(
    (force = false) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const target = progressToFrame(progress.get(), frames.length);
      const idx = nearestLoaded(target, loaded.current);
      if (idx < 0 || (idx === drawn.current && !force)) return;
      const img = images.current[idx];
      const { dx, dy, dw, dh } = coverRect(img.naturalWidth, img.naturalHeight, canvas.width, canvas.height, focalY);
      ctx.drawImage(img, dx, dy, dw, dh);
      drawn.current = idx;
    },
    [frames, progress, focalY],
  );

  useEffect(() => {
    images.current = [];
    loaded.current = new Array(frames.length).fill(false);
    drawn.current = -1;
    let cancelled = false;
    const order = frameLoadOrder(frames.length);
    let cursor = 0;
    const next = () => {
      if (cancelled || cursor >= order.length) return;
      const i = order[cursor++];
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        loaded.current[i] = true;
        draw();
        next();
      };
      img.onerror = () => next();
      img.src = frames[i];
      images.current[i] = img;
    };
    for (let k = 0; k < CONCURRENCY; k++) next();
    return () => {
      cancelled = true;
    };
  }, [frames, draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw(true);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  useMotionValueEvent(progress, "change", () => draw());

  return <canvas ref={canvasRef} aria-hidden="true" data-testid="frame-sequence" className={className} />;
}
