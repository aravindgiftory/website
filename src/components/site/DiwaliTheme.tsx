import { useEffect, useRef } from "react";

/** A diya with a flickering flame. Pure SVG and CSS, so it costs almost nothing. */
export function Diya({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id="diya-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd36b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff9a2e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="diya-clay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d99a3c" />
          <stop offset="100%" stopColor="#9c5a1c" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="22" r="16" fill="url(#diya-glow)" className="diya-glow" />
      <path
        className="diya-flame"
        d="M32 6c5 7 7 11 7 16a7 7 0 0 1-14 0c0-5 2-9 7-16z"
        fill="#ffb02e"
      />
      <path d="M32 14c2.5 4 3.5 6.5 3.5 9a3.5 3.5 0 0 1-7 0c0-2.5 1-5 3.5-9z" fill="#fff1b8" />
      <path d="M6 34h52c0 11-10 20-26 20S6 45 6 34z" fill="url(#diya-clay)" />
      <path d="M6 34h52" stroke="#f0c36a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const BULB_COLOURS = ["#ffcf5a", "#ff8a3d", "#ff5d8f", "#ffe9a8", "#ffa53a"];

/** A string of fairy lights that hangs across the top of the page and twinkles. */
export function FairyLights() {
  const count = 24;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-20 z-20 h-16 overflow-hidden"
    >
      <svg
        viewBox="0 0 100 64"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M0 6 Q 50 86 100 6"
          fill="none"
          stroke="#5a1a1a"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {Array.from({ length: count }, (_, index) => {
        const t = (index + 0.5) / count;
        // Same curve as the wire above: a quadratic that sags 40px at the middle.
        const y = 6 + 160 * t * (1 - t);
        const colour = BULB_COLOURS[index % BULB_COLOURS.length];
        return (
          <span
            key={index}
            className="twinkle absolute block"
            style={{
              left: `${t * 100}%`,
              top: `${y}px`,
              animationDelay: `${(index % 7) * 0.35}s`,
            }}
          >
            <span
              className="block h-3.5 w-2.5 -translate-x-1/2 rounded-b-full rounded-t-[40%]"
              style={{ background: colour, boxShadow: `0 0 10px 3px ${colour}99` }}
            />
          </span>
        );
      })}
    </div>
  );
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  hue: number;
  kind: "burst" | "ember";
}

const palette = [44, 36, 28, 340, 20];

/**
 * Firecracker bursts and rising embers over the hero. It draws only while it is on screen and the
 * tab is visible, caps its particle count, and never runs for visitors who prefer reduced motion.
 */
export function Fireworks() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = element.getContext("2d");
    if (!ctx) return;

    const sparks: Spark[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let visible = true;
    let nextBurst = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const box = element.getBoundingClientRect();
      width = box.width;
      height = box.height;
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const burst = (x: number, y: number) => {
      const hue = palette[Math.floor(Math.random() * palette.length)] ?? 40;
      const total = width < 640 ? 26 : 40;
      for (let i = 0; i < total; i++) {
        const angle = (Math.PI * 2 * i) / total + Math.random() * 0.2;
        const speed = 1.2 + Math.random() * 2.4;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          max: 55 + Math.random() * 25,
          size: 1.4 + Math.random() * 1.4,
          hue,
          kind: "burst",
        });
      }
    };

    const ember = () => {
      sparks.push({
        x: Math.random() * width,
        y: height + 6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.35 + Math.random() * 0.6),
        life: 0,
        max: 220 + Math.random() * 120,
        size: 1 + Math.random() * 1.6,
        hue: 38 + Math.random() * 10,
        kind: "ember",
      });
    };

    const tick = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      if (time > nextBurst) {
        burst(width * (0.08 + Math.random() * 0.84), height * (0.12 + Math.random() * 0.4));
        nextBurst = time + 2200 + Math.random() * 2200;
      }
      if (sparks.length < 90 && Math.random() < 0.18) ember();

      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        if (!spark) continue;
        spark.life++;
        spark.x += spark.vx;
        spark.y += spark.vy;
        if (spark.kind === "burst") {
          spark.vy += 0.035;
          spark.vx *= 0.985;
        } else {
          spark.x += Math.sin(spark.life / 18) * 0.3;
        }
        const fade = 1 - spark.life / spark.max;
        if (fade <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = spark.kind === "ember" ? fade * 0.7 : fade;
        ctx.fillStyle = `hsl(${spark.hue} 95% ${spark.kind === "ember" ? 62 : 66}%)`;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    resize();
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) start();
      else stop();
    });
    observer.observe(element);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);
    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[34rem] w-full sm:h-[42rem]"
    />
  );
}
