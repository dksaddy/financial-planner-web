"use client";

import { useIsAuthenticated } from "@/lib/useIsAuthenticated";

/**
 * Picks one of two ready-made trees based on whether the visitor is logged in.
 *
 * Both trees arrive as props from the server components that own them, so the
 * landing sections keep their own markup and styling and this file holds the
 * auth check exactly once. Only this leaf is a client component — the sections
 * around it stay on the server.
 */
export default function AuthSwitch({ loggedOut, loggedIn }) {
  return useIsAuthenticated() ? loggedIn : loggedOut;
}
