import {
  Courier_Prime,
  IBM_Plex_Mono,
  Plus_Jakarta_Sans,
  Space_Mono,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import { THEME_BOOT_SCRIPT } from "@/theme/mode";

// Courier Prime is the closest web face to the mono, slightly inked look of a
// point-of-sale receipt printer. Nothing is set in it any more, so this is only
// the fallback behind the two faces below and is not worth preloading.
const receipt = Courier_Prime({
  variable: "--font-receipt",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  preload: false,
});

// IBM Plex Mono, the default face. Normal is the receipt theme — paper ground,
// printed ledger — so it stays mono, but Space Mono was built to shout and a
// dense table of amounts is not the place for it. Plex is the same idea with
// the weight taken out: lighter strokes, narrower slots, humanist details that
// sit warm on the paper tones.
//
// The face a first-time visitor sees, since the boot script falls back to the
// OS light/dark preference and both of those are Normal, so this is the one
// that gets preloaded.
const paper = IBM_Plex_Mono({
  variable: "--font-paper",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// Space Mono — a heavy, geometric mono that keeps the tabular figures. Now the
// Brutal theme's face only, which is where the shouting belongs, and the
// fallback Phormism shows while its sans loads.
const brutal = Space_Mono({
  variable: "--font-brutal",
  weight: ["400", "700"],
  subsets: ["latin"],
  preload: false,
});

// Plus Jakarta Sans, for Phormism only. A mono's hard slab terminals need crisp
// edges to read against, and neumorphism has no edges — only a soft pair of
// shadows — so Space Mono went muddy there. This is a geometric sans with low
// stroke contrast and rounded bowls, which is the shape the lighting suits.
//
// Not preloaded: only one of the three surface styles asks for it, and the
// variable font would otherwise be downloaded for every visitor. Phormism
// renders in Space Mono for the swap.
const soft = Plus_Jakarta_Sans({
  variable: "--font-soft",
  subsets: ["latin"],
  preload: false,
});

export const metadata = {
  title: "Financial Planner",
  description: "Track savings, spending and targets in one dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      // The boot script writes data-theme before hydration, so the server
      // markup and the client markup differ on <html> by design.
      suppressHydrationWarning
      className={`${receipt.variable} ${paper.variable} ${brutal.variable} ${soft.variable} h-full antialiased`}
    >
      <head>
        {/* Must run before the stylesheet paints anything, so it sits in the
            head rather than the body: otherwise the browser shows one frame of
            the light theme before the attribute lands. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>

      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {children}

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--panel)",
              color: "var(--ink)",
              border: "var(--toast-border-width) solid var(--line)",
              borderRadius: "var(--toast-radius)",
              fontSize: "13px",
              fontFamily: "var(--font-app), ui-monospace, monospace",
              boxShadow: "var(--shadow-card)",
            },
          }}
        />
      </body>
    </html>
  );
}
