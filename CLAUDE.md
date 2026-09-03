# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # next dev
npm run build
npm start
npm run lint     # eslint (flat config, core-web-vitals)
```

No test runner is configured.

## Backend dependency

This is the frontend half of a pair. The Express/PostgreSQL API lives in the sibling
`financial-planner-api/` directory and must be running for anything past the login page to work.
`NEXT_PUBLIC_API_URL` in `.env.local` points at it and is the only environment variable.

## Architecture

Next.js 16 App Router, JavaScript (no TypeScript), Tailwind v4. Import alias `@/*` maps to `src/*`.

Data flow is deliberately flat — no server components fetching, no data-fetching library:

```
page ("use client") → src/services/*.service.js → src/lib/axios.js → API
```

- **Pages** are client components. `dashboard/page.js` guards on `isAuthenticated()`, fetches once in
  `useEffect`, holds the whole dashboard payload in one `useState`, and passes slices down as props.
- **Services** are thin one-function-per-endpoint wrappers returning `response.data` (the API's
  `{ success, statusCode, message, data }` envelope). Callers read `response.data` for the payload and
  `response.message` for toasts.
- **No global state.** Refresh after a mutation is done by passing `fetchDashboard` down as an
  `onSuccess` / `onAdded` / `onDeposit` callback, which refetches the entire dashboard. Keep that
  pattern for new mutating components rather than introducing local optimistic state.
- **Errors** surface through `react-hot-toast`, always as
  `error.response?.data?.message || "<fallback>"`.

## Auth

Token and user JSON live in cookies via `js-cookie` (`src/lib/auth.js`), 7 days, `sameSite: strict`.
They are readable by JS by design — there is no middleware and no server-side route protection; every
protected page checks `isAuthenticated()` itself and `router.replace("/login")`.

`src/lib/axios.js` attaches the bearer token per request and auto-logs-out on any 401 **except** from
`/auth/login` and `/auth/register`, where a 401 means bad credentials and must reach the page's own
catch block. Add any new endpoint with expected-401 semantics to that `AUTH_ENDPOINTS` list.

## Validation contract

`src/validations/*.validation.js` mirrors the API's Zod schemas field-for-field, including the
camelCase field names the saving-plan endpoints use (`depositAmount`, `withdrawalAmount`) while other
endpoints use snake_case (`expense_type_id`, `target_amount`). The one deliberate difference: the web
schemas use `z.coerce.number()` because form inputs yield strings, while the API uses strict
`z.number()`. Changing a field on either side requires changing both schemas.

Forms use `react-hook-form` + `zodResolver`. Modals reset their form and refetch their dropdown data on
every open, so stale options never persist between openings.

## Theming

Theme is an attribute on `<html data-theme>`, not React state. `THEME_BOOT_SCRIPT` from
`src/theme/mode.js` runs blocking in `<head>` before first paint to avoid a flash; that is why the root
layout sets `suppressHydrationWarning`. `src/theme/mode.js` is a small external store
(`subscribe`/`getTheme`/`getServerTheme`, for `useSyncExternalStore`) that also syncs across tabs via the
`storage` event and follows the OS preference when the user has never chosen manually.

Every colour comes from CSS custom properties in `src/theme/theme.css`, exposed as Tailwind utilities
through its `@theme inline` block — components use `bg-surface`, `text-ink-muted`, `border-line` and
never a raw palette value, so light and dark need no conditional classes. `src/theme/accents.js` gives
each card a named hue (`accent("emerald")`) with roles `grad`/`glow`/`text`/`dot`/`soft`/`line`; only
`grad` and `glow` are theme-independent (they sit under white text on a filled chip).

The visual language is a thermal receipt: Courier Prime mono throughout, 15px root font, paper-toned
background with a fixed aurora backdrop.

## Note on the README

`README.md` is still the untouched `create-next-app` boilerplate and describes Geist fonts and
`app/page.js` — ignore it.
