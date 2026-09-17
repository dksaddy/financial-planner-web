"use client"; // Error boundaries must be Client Components

// The last resort, for an error in the root layout itself. It replaces that
// layout, so it brings its own <html> and <body> and cannot rely on the theme
// tokens or fonts — hence the plain inline styles.
export default function GlobalError({ error, unstable_retry }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "ui-monospace, monospace",
          textAlign: "center",
          padding: 24,
        }}
      >
        <title>Something went wrong</title>

        <div>
          <h1 style={{ fontSize: 18 }}>Something went wrong</h1>

          {error?.digest && (
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              Reference: {error.digest}
            </p>
          )}

          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{ marginTop: 12, padding: "8px 16px", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
