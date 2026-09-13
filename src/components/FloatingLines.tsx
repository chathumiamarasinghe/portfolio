"use client";

import { useEffect, useRef } from "react";

type RGB = readonly [number, number, number];

interface FloatingLinesProps {
  className?: string;
  lineCount?: number;
  colorA?: RGB;
  colorB?: RGB;
  maxOpacity?: number;
}

type Side = "left" | "right";

interface ArcLine {
  side: Side;
  radiusIndex: number;
  sideCount: number;
  speed: number;
  phase: number;
  width: number;
  mix: number;
  opacity: number;
}

interface SideProgression {
  radiusStart: number;
  radiusStep: number;
  speedStart: number;
  speedStep: number;
}

const DEFAULT_COLOR_A: RGB = [232, 180, 150];
const DEFAULT_COLOR_B: RGB = [200, 120, 90];
const ABSOLUTE_MAX_OPACITY = 0.15;

const LEFT_PROGRESSION: SideProgression = {
  radiusStart: 0.76,
  radiusStep: 0.028,
  speedStart: 0.14,
  speedStep: 0.045,
};

const RIGHT_PROGRESSION: SideProgression = {
  radiusStart: 0.68,
  radiusStep: 0.05,
  speedStart: 0.18,
  speedStep: 0.055,
};

function clampOpacity(value: number): number {
  return Math.min(ABSOLUTE_MAX_OPACITY, Math.max(0.06, value));
}

function mixColor(a: RGB, b: RGB, amount: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * amount),
    Math.round(a[1] + (b[1] - a[1]) * amount),
    Math.round(a[2] + (b[2] - a[2]) * amount),
  ];
}

function rgba(color: RGB, alpha: number): string {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

function term(start: number, step: number, index: number): number {
  return start + index * step;
}

function createSideArcs(
  side: Side,
  count: number,
  maxOpacity: number,
): ArcLine[] {
  const progression = side === "left" ? LEFT_PROGRESSION : RIGHT_PROGRESSION;

  return Array.from({ length: count }, (_, index) => ({
    side,
    radiusIndex: index,
    sideCount: count,
    speed: term(progression.speedStart, progression.speedStep, index),
    phase: index * 0.35 + (side === "right" ? 1.1 : 0),
    width: 0.85 + index * 0.08,
    mix: count > 1 ? index / (count - 1) : 0,
    opacity: 0.06 + ((maxOpacity - 0.06) * (index + 1)) / count,
  }));
}

function mix(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

function packAmount(time: number, speed: number, phase: number): number {
  const primary = 0.5 + 0.5 * Math.sin(time * speed + phase);
  const secondary = 0.5 + 0.5 * Math.sin(time * speed * 0.41 + phase * 1.6);
  return primary * 0.74 + secondary * 0.26;
}

function createArcs(count: number, maxOpacity: number): ArcLine[] {
  const leftCount = Math.ceil(count / 2);
  const rightCount = Math.floor(count / 2);
  return [
    ...createSideArcs("left", leftCount, maxOpacity),
    ...createSideArcs("right", rightCount, maxOpacity),
  ];
}

export function FloatingLines({
  className,
  lineCount = 8,
  colorA = DEFAULT_COLOR_A,
  colorB = DEFAULT_COLOR_B,
  maxOpacity = 0.11,
}: FloatingLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const opacity = clampOpacity(maxOpacity);
  const colorKey = `${colorA.join(",")}|${colorB.join(",")}`;

  useEffect(() => {
    const node = canvasRef.current;
    const context = node?.getContext("2d", { alpha: true });
    if (!node || !context) return;
    const canvas: HTMLCanvasElement = node;
    const ctx: CanvasRenderingContext2D = context;

    const arcs = createArcs(lineCount, opacity);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = performance.now();
    let time = 0;
    let width = 0;
    let height = 0;
    let visible = true;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now: number) {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      const pace = motionQuery.matches ? 0.35 : 1;
      time += delta * pace;

      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const diagonal = Math.hypot(width, height);

      const leftPack = packAmount(time, 0.32, 0.2);
      const rightPack = packAmount(time, 0.24, 2.4);

      for (const arc of arcs) {
        const progression =
          arc.side === "left" ? LEFT_PROGRESSION : RIGHT_PROGRESSION;
        const pack = arc.side === "left" ? leftPack : rightPack;
        const spread =
          arc.side === "left"
            ? mix(0.08, 1, 1 - pack)
            : mix(0.28, 1.15, 1 - pack);
        const openRadius = term(
          progression.radiusStart,
          progression.radiusStep,
          arc.radiusIndex,
        );
        const meanRadius = term(
          progression.radiusStart,
          progression.radiusStep,
          (arc.sideCount - 1) / 2,
        );
        const radius = mix(meanRadius, openRadius, spread) * diagonal;

        const gather = 1 - spread;
        const cx =
          (arc.side === "left" ? width * -0.12 : width * 1.14) +
          Math.sin(time * 0.22 + (arc.side === "left" ? 0 : 1.3)) *
            width *
            0.03 *
            gather;
        const cy =
          (arc.side === "left" ? height * 0.82 : height * 0.12) +
          Math.cos(time * 0.18 + (arc.side === "left" ? 0.4 : 2)) *
            height *
            0.04 *
            gather;

        const start =
          (arc.side === "left" ? -0.62 : 2.28) +
          time * arc.speed +
          arc.phase * 0.2;

        ctx.beginPath();
        ctx.strokeStyle = rgba(mixColor(colorA, colorB, arc.mix), arc.opacity);
        ctx.lineWidth = arc.width;
        ctx.arc(cx, cy, radius, start, start + 1.05);
        ctx.stroke();
      }

      if (visible) {
        frame = window.requestAnimationFrame(draw);
      }
    }

    function play() {
      last = performance.now();
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(draw);
    }

    function onVisibility() {
      visible = !document.hidden;
      if (visible) play();
      else window.cancelAnimationFrame(frame);
    }

    resize();
    play();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [colorKey, lineCount, opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[2] ${className ?? ""}`}
    />
  );
}
