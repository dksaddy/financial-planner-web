"use client";

import { useEffect, useState } from "react";

import { saturdaysUntil } from "@/lib/Saturdays";

const UP_MS = 3000; // 1 -> N sweep
const HOLD_MS = 4500; // rest on N
const DOWN_MS = 500; // quick rewind to 1 (hold + rewind = the 5s pause)

const SIZE = 140;
const STROKE = 12;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

// Bubbles rising on the two sides of the donut: left %, size px, seconds,
// delay s, start height % — fixed values so server and client render alike.
const BUBBLES = [
    [7, 6, 7, 0, 8], [13, 4, 9, -3, 30], [19, 8, 8, -5, 14], [25, 5, 10, -1, 40],
    [75, 5, 9, -4, 36], [81, 8, 8, -2, 10], [87, 4, 10, -6, 28], [93, 6, 7, -1, 6],
];

const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// Low -> amber, full -> emerald, both read from the active theme so the ring
// follows paper / dark / soft / brutal instead of carrying its own palette.
const mix = (p) =>
    `color-mix(in srgb, var(--emerald-dot) ${Math.round(p * 100)}%, var(--amber-dot))`;

export default function SaturdayCountdown({
    endYear = 2027,
    endMonth = 6, // July (0-based)
    endLabel = "Jul 2027",
}) {
    // Null on the server and first paint: "today" only exists in the browser,
    // so computing it during render would mismatch the server HTML.
    const [total, setTotal] = useState(null);
    const [value, setValue] = useState(null);

    useEffect(() => {
        setTotal(saturdaysUntil(new Date(), endYear, endMonth));
    }, [endYear, endMonth]);

    useEffect(() => {
        if (total === null) return;

        const reduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduced || total <= 1) {
            setValue(total);
            return;
        }

        let frame;
        let timer;
        let cancelled = false;

        const tween = (from, to, ms, ease, done) => {
            const t0 = performance.now();

            const tick = (now) => {
                if (cancelled) return;
                const p = Math.min((now - t0) / ms, 1);
                setValue(from + (to - from) * ease(p));
                if (p < 1) frame = requestAnimationFrame(tick);
                else done();
            };

            frame = requestAnimationFrame(tick);
        };

        const cycle = () =>
            tween(1, total, UP_MS, easeOut, () => {
                timer = setTimeout(() => {
                    if (cancelled) return;
                    tween(total, 1, DOWN_MS, easeInOut, cycle);
                }, HOLD_MS);
            });

        cycle();

        return () => {
            cancelled = true;
            cancelAnimationFrame(frame);
            clearTimeout(timer);
        };
    }, [total]);

    const ready = total !== null && value !== null;
    const progress = ready ? Math.min(Math.max(value / total, 0), 1) : 0;

    const head = mix(progress);
    const tail = mix(Math.max(progress - 0.35, 0));

    // Knob at the arc's leading edge. The arc starts at 12 o'clock, hence -90deg.
    const angle = progress * 2 * Math.PI - Math.PI / 2;
    const knobX = SIZE / 2 + R * Math.cos(angle);
    const knobY = SIZE / 2 + R * Math.sin(angle);

    return (
        <div className="relative flex w-full flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <style>{`
                @keyframes sat-spin { to { transform: rotate(360deg); } }
                @keyframes sat-ripple {
                    0% { transform: scale(0.85); opacity: 0.6; }
                    100% { transform: scale(1.45); opacity: 0; }
                }
                @keyframes sat-rise {
                    0% { transform: translateY(0) scale(0.6); opacity: 0; }
                    20% { opacity: 0.9; }
                    100% { transform: translateY(-110px) scale(1); opacity: 0; }
                }
                @keyframes sat-wave { to { transform: translateX(-50%); } }
                @keyframes sat-grid { to { background-position: 18px 18px; } }
                .sat-rise { animation: sat-rise 8s ease-in infinite; }
                .sat-wave { animation: sat-wave 12s linear infinite; }
                .sat-grid { animation: sat-grid 6s linear infinite; }
                .sat-spin { animation: sat-spin 14s linear infinite; }
                .sat-ripple { animation: sat-ripple 4s ease-out infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .sat-spin, .sat-ripple, .sat-rise, .sat-wave, .sat-grid { animation: none; }
                }
            `}</style>

            {/* Full-width backdrop: bleeds to the card's edges (the card clips it)
                so the two sides of the donut are not left bare. A drifting dot
                grid, two slow waves along the bottom and bubbles rising on
                each side, all from theme tokens. */}
            <div aria-hidden className="pointer-events-none absolute -inset-x-5 -bottom-5 top-0 overflow-hidden">
                <span
                    className="sat-grid absolute inset-0"
                    style={{
                        backgroundImage:
                            "radial-gradient(color-mix(in srgb, var(--ink) 22%, transparent) 1px, transparent 1.5px)",
                        backgroundSize: "18px 18px",
                        WebkitMaskImage: "radial-gradient(ellipse at center, #000 20%, transparent 75%)",
                        maskImage: "radial-gradient(ellipse at center, #000 20%, transparent 75%)",
                        opacity: 0.5,
                    }}
                />

                <svg
                    className="sat-wave absolute bottom-0 left-0 h-16 w-[200%]"
                    viewBox="0 0 800 80"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 40 Q100 0 200 40 T400 40 T600 40 T800 40 V80 H0 Z"
                        style={{ fill: "color-mix(in srgb, var(--emerald-dot) 16%, transparent)" }}
                    />
                </svg>
                <svg
                    className="sat-wave absolute bottom-0 left-0 h-12 w-[200%]"
                    viewBox="0 0 800 80"
                    preserveAspectRatio="none"
                    style={{ animationDuration: "18s", animationDirection: "reverse" }}
                >
                    <path
                        d="M0 40 Q100 0 200 40 T400 40 T600 40 T800 40 V80 H0 Z"
                        style={{ fill: "color-mix(in srgb, var(--amber-dot) 14%, transparent)" }}
                    />
                </svg>

                {BUBBLES.map(([left, size, dur, delay, from], i) => (
                    <span
                        key={i}
                        className="sat-rise absolute rounded-full"
                        style={{
                            left: `${left}%`,
                            bottom: `${from}%`,
                            width: size,
                            height: size,
                            animationDuration: `${dur}s`,
                            animationDelay: `${delay}s`,
                            background:
                                i % 3 === 0
                                    ? "color-mix(in srgb, var(--amber-dot) 70%, transparent)"
                                    : "color-mix(in srgb, var(--emerald-dot) 70%, transparent)",
                        }}
                    />
                ))}
            </div>

            <div
                role="img"
                aria-label={ready ? `${total} Saturdays left till ${endLabel}` : undefined}
                className="relative h-32 w-32 shrink-0 sm:h-36 sm:w-36"
            >
                {/* Animated backdrop, all tinted from the theme's emerald/amber so it
                    follows paper / dark / soft / brutal. Decorative only:
                    a spinning conic aurora, two ripples radiating out of the
                    ring, and three dots in orbit. */}
                <div aria-hidden className="pointer-events-none absolute -inset-10">
                    <span
                        className="sat-spin absolute inset-0 rounded-full blur-xl"
                        style={{
                            background:
                                "conic-gradient(from 0deg, color-mix(in srgb, var(--emerald-dot) 70%, transparent), transparent 30%, color-mix(in srgb, var(--amber-dot) 60%, transparent) 55%, transparent 80%, color-mix(in srgb, var(--emerald-dot) 70%, transparent))",
                            opacity: 0.55,
                            WebkitMaskImage: "radial-gradient(circle, transparent 38%, #000 52%, transparent 72%)",
                            maskImage: "radial-gradient(circle, transparent 38%, #000 52%, transparent 72%)",
                        }}
                    />

                    <span
                        className="sat-ripple absolute inset-10 rounded-full"
                        style={{ border: "1.5px solid color-mix(in srgb, var(--emerald-dot) 70%, transparent)" }}
                    />
                    <span
                        className="sat-ripple absolute inset-10 rounded-full"
                        style={{
                            border: "1.5px solid color-mix(in srgb, var(--emerald-dot) 70%, transparent)",
                            animationDelay: "-2s",
                        }}
                    />

                    <span className="sat-spin absolute inset-4" style={{ animationDuration: "9s" }}>
                        <span
                            className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full"
                            style={{ background: "var(--emerald-dot)", boxShadow: "0 0 10px var(--emerald-dot)" }}
                        />
                    </span>
                    <span className="sat-spin absolute inset-6" style={{ animationDuration: "13s", animationDirection: "reverse" }}>
                        <span
                            className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
                            style={{ background: "var(--amber-dot)", boxShadow: "0 0 8px var(--amber-dot)" }}
                        />
                    </span>
                    <span className="sat-spin absolute inset-5" style={{ animationDuration: "17s" }}>
                        <span
                            className="absolute right-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full"
                            style={{ background: "var(--ink)", opacity: 0.6 }}
                        />
                    </span>
                </div>

                <svg
                    viewBox={`0 0 ${SIZE} ${SIZE}`}
                    className="h-full w-full overflow-visible"
                    aria-hidden
                >
                    <defs>
                        <linearGradient id="sat-ring" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={SIZE} y2={SIZE}>
                            <stop offset="0%" style={{ stopColor: tail }} />
                            <stop offset="100%" style={{ stopColor: head }} />
                        </linearGradient>
                    </defs>

                    {/* Track — ink at low alpha, because some themes zero --line. */}
                    <circle
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={R}
                        fill="none"
                        strokeWidth={STROKE}
                        style={{ stroke: "color-mix(in srgb, var(--ink) 9%, transparent)" }}
                    />

                    {/* Hairline ring just inside the track, for depth. */}
                    <circle
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={R - STROKE / 2 - 7}
                        fill="none"
                        strokeWidth="1"
                        strokeDasharray="2 5"
                        strokeLinecap="round"
                        style={{ stroke: "color-mix(in srgb, var(--ink) 22%, transparent)" }}
                    />

                    <circle
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={R}
                        fill="none"
                        stroke="url(#sat-ring)"
                        strokeWidth={STROKE}
                        strokeLinecap="round"
                        strokeDasharray={C}
                        strokeDashoffset={C * (1 - progress)}
                        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                        style={{
                            filter: `drop-shadow(0 2px 5px color-mix(in srgb, ${head} 45%, transparent))`,
                        }}
                    />

                    {progress > 0.02 && (
                        <circle cx={knobX} cy={knobY} r="2.6" fill="#fff" opacity="0.92" />
                    )}
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="num text-[38px] font-bold leading-none text-ink">
                        {ready ? Math.round(value) : "–"}
                    </span>
                </div>
            </div>
        </div>
    );
}