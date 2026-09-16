import { Courier_Prime, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import { THEME_BOOT_SCRIPT } from "@/theme/mode";

// Courier Prime is the closest web face to the mono, slightly inked look of a
// point-of-sale receipt printer. Every theme is set in Space Mono now, so this
// is only the fallback behind it and is not worth preloading.
const receipt = Courier_Prime({
  variable: "--font-receipt",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  preload: false,
});

// Space Mono — a heavy, geometric mono that keeps the tabular figures. Started
// as the Brutal theme's face and is now the face of every theme, so it is the
// one that gets preloaded.
const brutal = Space_Mono({
  variable: "--font-brutal",
  weight: ["400", "700"],
  subsets: ["latin"],
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
      className={`${receipt.variable} ${brutal.variable} h-full antialiased`}
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
