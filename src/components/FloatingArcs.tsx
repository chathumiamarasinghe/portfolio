"use client";

import { useEffect, useRef } from "react";

interface Arc {
  side: "left" | "right";
  cx: number;
  cy: number;
  r: number;
  driftY: number;
  baseOpacity: number;
  lineWidth: number;
  breathePhase: number;
  breatheSpeed: number;
}

interface FloatingArcsProps {
  color?: string;
  count?: number;
  maxOpacity?: number;
  className?: string;
}

export default function FloatingArcs({
  color = "rgba(90, 165, 145, 1)",
  count = 4,
  maxOpacity = 0.22,
  className,
}: FloatingArcsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const arcsRef = useRef<Arc[]>([]);

  useEffect(() => {
    const node = canvasRef.current;
    const context = node?.getContext("2d");
    if (!node || !context) return;
    const canvas: HTMLCanvasElement = node;
    const ctx: CanvasRenderingContext2D = context;

    let width = 0;
    let height = 0;
    let lastTime = performance.now();

    function signedDriftPxPerSec() {
      const direction = Math.random() < 0.5 ? -1 : 1;
      return direction * (32 + Math.random() * 28);
    }

    function makeArc(side: "left" | "right", index: number): Arc {
      const radius = 900 + Math.random() * 600;
      const slotHeight = height / count;
      const cy =
        slotHeight * index +
        slotHeight * 0.5 +
        (Math.random() - 0.5) * slotHeight * 0.4;
      const cx =
        side === "left" ? -radius + width * 0.3 : width + radius - width * 0.3;

      return {
        side,
        cx,
        cy,
        r: radius,
        driftY: signedDriftPxPerSec(),
        baseOpacity: (0.12 + Math.random() * 0.14) * (maxOpacity / 0.22),
        lineWidth: 0.6 + Math.random() * 0.6,
        breathePhase: Math.random() * Math.PI * 2,
        breatheSpeed: 0.7 + Math.random() * 0.6,
      };
    }

    function init() {
      const next: Arc[] = [];
      for (let i = 0; i < count; i += 1) next.push(makeArc("left", i));
      for (let i = 0; i < count; i += 1) next.push(makeArc("right", i));
      arcsRef.current = next;
    }

    function resize() {
      const nextW = window.innerWidth;
      const nextH = window.innerHeight;
      if (nextW === width && nextH === height && canvas.width > 0) return;

      width = nextW;
      height = nextH;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    }

    function draw(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      for (const arc of arcsRef.current) {
        arc.cy += arc.driftY * dt;
        if (arc.cy < -height * 0.35) arc.cy = height * 1.35;
        if (arc.cy > height * 1.35) arc.cy = -height * 0.35;

        const breathe =
          0.7 +
          0.3 * Math.sin(now * 0.001 * arc.breatheSpeed + arc.breathePhase);

        const visibleChord = width * 0.3;
        const halfAngle =
          Math.acos(
            Math.min(1, Math.max(-1, (arc.r - visibleChord) / arc.r)),
          ) * 0.8;

        const startAngle =
          arc.side === "left" ? -halfAngle : Math.PI - halfAngle;
        const endAngle = arc.side === "left" ? halfAngle : Math.PI + halfAngle;

        ctx.save();
        ctx.globalAlpha = arc.baseOpacity * breathe;
        ctx.strokeStyle = color;
        ctx.lineWidth = arc.lineWidth;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(arc.cx, arc.cy, arc.r, startAngle, endAngle, false);
        ctx.stroke();
        ctx.restore();
      }

      rafRef.current = window.requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color, count, maxOpacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[2] ${className ?? ""}`}
    />
  );
}
