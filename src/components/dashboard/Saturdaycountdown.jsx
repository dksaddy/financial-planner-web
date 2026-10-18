"use client";

import { useEffect, useId, useRef, useState } from "react";

import { saturdaysUntil } from "@/lib/Saturdays";

const UP_MS = 3000; // 1 -> N
const HOLD_MS = 2000; // pause on N
const DOWN_MS = 3000; // N -> 1, then straight into the next cycle

const SIZE = 140;
const STROKE = 12;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// Low -> amber, full -> emerald, both read from the active theme so the ring
// follows paper / dark / soft / brutal instead of carrying its own palette.
const mix = (p) =>
    `color-mix(in srgb, var(--emerald-dot) ${Math.round(p * 100)}%, var(--amber-dot))`;

/*
 * Kept deliberately light, because the dashboard cards sit in a phone's
 * paint budget alongside animated target pictures:
 *   - only the ring moves; no blur, filter, mask or background animation;
 *   - the ring is driven by refs, not React state, so no re-render per frame;
 *   - all motion stops while the donut is off-screen or the tab is hidden.
 */
export default function SaturdayCountdown({
    endYear = 2027,
    endMonth = 6, // July (0-based)
    endLabel = "Jul 2027",
}) {
    const gid = `sat-ring-${useId().replace(/:/g, "")}`;

    // Null on the server and first paint: "today" only exists in the browser,
    // so computing it during render would mismatch the server HTML.
    const [total, setTotal] = useState(null);
    const [active, setActive] = useState(false); // on-screen and tab visible

    const rootRef = useRef(null);
    const arcRef = useRef(null);
    const glowRef = useRef(null);
    const tailRef = useRef(null);
    const headRef = useRef(null);
    const knobRef = useRef(null);
    const numRef = useRef(null);

    useEffect(() => {
        setTotal(saturdaysUntil(new Date(), endYear, endMonth));
    }, [endYear, endMonth]);

    // Track whether the donut is actually in view.
    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;

        let onScreen = false;
        const sync = () => setActive(onScreen && !document.hidden);

        const io = new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            sync();
        });
        io.observe(el);
        document.addEventListener("visibilitychange", sync);

        return () => {
            io.disconnect();
            document.removeEventListener("visibilitychange", sync);
        };
    }, []);

    // Writes one frame straight to the DOM.
    const paint = (v, n) => {
        const p = Math.min(Math.max(v / n, 0), 1);

        const offset = C * (1 - p);
        arcRef.current?.setAttribute("stroke-dashoffset", offset);
        glowRef.current?.setAttribute("stroke-dashoffset", offset);

        if (tailRef.current) tailRef.current.style.stopColor = mix(Math.max(p - 0.35, 0));
        if (headRef.current) headRef.current.style.stopColor = mix(p);

        if (knobRef.current) {
            const a = p * 2 * Math.PI - Math.PI / 2;
            knobRef.current.setAttribute("cx", SIZE / 2 + R * Math.cos(a));
            knobRef.current.setAttribute("cy", SIZE / 2 + R * Math.sin(a));
            knobRef.current.style.display = p > 0.02 ? "" : "none";
        }

        if (numRef.current) numRef.current.textContent = Math.round(v);
    };

    useEffect(() => {
        if (total === null) return;

        const reduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // Static: reduced motion, or nothing to count.
        if (reduced || total <= 1) {
            paint(total, total);
            return;
        }

        // Off-screen: park on the full ring and spend nothing.
        if (!active) {
            paint(total, total);
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
                paint(from + (to - from) * ease(p), total);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total, active]);

    return (
        <div
            ref={rootRef}
            className="flex w-full items-center justify-center"
        >
            <div
                role="img"
                aria-label={total === null ? undefined : `${total} Saturdays left till ${endLabel}`}
                className="relative h-32 w-32 shrink-0 sm:h-36 sm:w-36"
            >
                <svg
                    viewBox={`0 0 ${SIZE} ${SIZE}`}
                    className="h-full w-full overflow-visible"
                    aria-hidden
                >
                    <defs>
                        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={SIZE} y2={SIZE}>
                            <stop ref={tailRef} offset="0%" style={{ stopColor: mix(0) }} />
                            <stop ref={headRef} offset="100%" style={{ stopColor: mix(0) }} />
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

                    {/* Glow: a wider, faint copy of the arc. A filter here would be
                        re-rasterised every frame; a second stroke is free. */}
                    <circle
                        ref={glowRef}
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={R}
                        fill="none"
                        stroke={`url(#${gid})`}
                        strokeWidth={STROKE + 9}
                        strokeLinecap="round"
                        strokeDasharray={C}
                        strokeDashoffset={C}
                        opacity="0.2"
                        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                    />

                    <circle
                        ref={arcRef}
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={R}
                        fill="none"
                        stroke={`url(#${gid})`}
                        strokeWidth={STROKE}
                        strokeLinecap="round"
                        strokeDasharray={C}
                        strokeDashoffset={C}
                        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                    />

                    <circle
                        ref={knobRef}
                        cx={SIZE / 2}
                        cy={SIZE / 2 - R}
                        r="2.6"
                        fill="#fff"
                        opacity="0.92"
                        style={{ display: "none" }}
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <span
                        ref={numRef}
                        className="num text-[38px] font-bold leading-none text-ink"
                    >
                        –
                    </span>
                </div>
            </div>
        </div>
    );
}