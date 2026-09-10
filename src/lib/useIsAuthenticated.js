"use client";

import { useSyncExternalStore } from "react";

import { isAuthenticated } from "./auth";

// Nothing inside a tab can flip this without a navigation — logging in and out
// both route — so there is no event worth listening to. The store exists for
// its server snapshot, not its subscription.
const subscribe = () => () => {};

const getSnapshot = () => isAuthenticated();

// The landing page is prerendered and cookies do not exist on the server, so
// the server pass and the hydrating client pass must agree on "logged out" or
// React discards the markup as a hydration mismatch. The real value arrives on
// the render immediately after hydration, which is why a logged-in visitor can
// see the logged-out buttons for a frame.
const getServerSnapshot = () => false;

export const useIsAuthenticated = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
