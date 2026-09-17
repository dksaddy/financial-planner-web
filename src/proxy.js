import { NextResponse } from "next/server";

// Server-side route guard. A request for a dashboard page with no session
// cookie is redirected to /login before any of the page is rendered, instead of
// the protected shell painting and a client effect sending it away.
//
// Presence only: the web has no JWT secret to verify the token with, and must
// not have one. An expired or revoked token passes here and is caught by the
// API's first 401, which `lib/axios.js` turns into a logout — the pages keep
// their own `isAuthenticated()` checks for that path. The cookie name matches
// `TOKEN_KEY` in `lib/auth.js`.
export function proxy(request) {
  if (request.cookies.get("token")?.value) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
