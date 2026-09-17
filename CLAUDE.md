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
`NEXT_PUBLIC_API_URL` in `.env.local` points at it.

`NEXT_PUBLIC_SUPABASE_URL` is the only other variable — it must match the API's `SUPABASE_URL`.
`next.config.mjs` turns its hostname into the `images.remotePatterns` entry that lets `next/image`
optimize avatars and target pictures. Without it the patterns list is empty and every remote image
404s through the optimizer, so it has to be set anywhere the app is built or deployed.

## Architecture

Next.js 16 App Router, JavaScript (no TypeScript), Tailwind v4. Import alias `@/*` maps to `src/*`.

Data flow is deliberately flat — no server components fetching, no data-fetching library:

```
page ("use client") → src/services/*.service.js → src/lib/axios.js → API
```

- **Pages** are client components. `dashboard/page.js` guards on `isAuthenticated()`, fetches once in
  `useEffect`, holds the whole dashboard payload in one `useState`, and passes slices down as props.
- **Fetching is split in two** on every page: a `loadX` that calls the service and toasts on failure
  but never touches state, and a `fetchX` that awaits it and commits. The mount effect calls `loadX`
  and commits inside `.then` behind an `active` flag it clears on cleanup, so a superseded response is
  dropped; `fetchX` is what gets passed to children. Keep this shape — calling a state-setting
  function straight from an effect trips `react-hooks/set-state-in-effect` and cannot be cancelled.
- **Services** are thin one-function-per-endpoint wrappers returning `response.data` (the API's
  `{ success, statusCode, message, data }` envelope). Callers read `response.data` for the payload and
  `response.message` for toasts.
- **Paginated lists** (`dashboard/expenses`) are server-driven: page and month live in `useState`, an
  effect refetches on either change, and `response.meta` supplies the pagination, the totals for the
  whole filtered set, and the month-tab list — none of which can be derived from a single page. A
  `useRef` request counter drops out-of-order responses. `components/common/Pagination.jsx` is shared.
- **No global state.** Refresh after a mutation is done by passing `fetchDashboard` down as an
  `onSuccess` / `onAdded` / `onDeposit` callback, which refetches the entire dashboard. Keep that
  pattern for new mutating components rather than introducing local optimistic state.
- **Errors** surface through `react-hot-toast`, always as
  `error.response?.data?.message || "<fallback>"`.

## Auth

Token and user JSON live in cookies via `js-cookie` (`src/lib/auth.js`), 7 days, `sameSite: strict`,
`secure` in production builds and on any HTTPS page. They are readable by JS by design. `src/proxy.js`
(Next 16's renamed middleware) redirects `/dashboard/**` to `/login` when the `token` cookie is missing —
presence only, the web cannot verify a JWT — and every protected page still checks `isAuthenticated()`
itself for the expired-token path. `getUser()` drops a cookie that does not parse instead of throwing.

`src/lib/axios.js` attaches the bearer token per request and auto-logs-out on any 401 **except** from
`/auth/login` and `/auth/register`, where a 401 means bad credentials and must reach the page's own
catch block. Add any new endpoint with expected-401 semantics to that `AUTH_ENDPOINTS` list.

## Validation contract

`src/validations/*.validation.js` mirrors the API's Zod schemas field-for-field, including the
camelCase field names the saving-plan endpoints use (`depositAmount`, `withdrawalAmount`) while other
endpoints use snake_case (`expense_type_id`, `target_amount`). The deliberate differences are two: the
web schemas use `z.coerce.number()` because form inputs yield strings, while the API uses strict
`z.number()`; and an expense record's date is refused from tomorrow on by the API but from today on
here, because a date is only ever sent from the user's own clock and the API cannot know what zone it
is in. Changing a field on either side requires changing both schemas.

The shared pieces mirror the API file for file: `src/constants/limits.js` (name and password lengths,
and what a picture may be — `TARGET_IMAGE_MAX_MB`, `AVATAR_MAX_MB` and `AVATAR_MAX`, each enforced by
its own route), `src/validations/fields.js` (`name`, `email`, `newPassword`, `existingPassword` — a
re-typed password is checked for presence only) and `src/constants/status.js` (every status value plus
`FILTER_ALL`). Compare statuses against those constants, never a typed string.

Forms use `react-hook-form` + `zodResolver`. Modals reset their form and refetch their dropdown data on
every open, so stale options never persist between openings.

Some API rules cannot be checked here, because they need data the page does not hold — how many photos
an album has, how many records a week already carries. Those stay the API's to enforce and are stated
rather than duplicated: `src/lib/image.js` prints the size and type rules under each picker,
`src/lib/expenseRecord.js` prints the weekly record limit under the date field, and `AvatarCard`
disables its picker once the album reports itself full. A rule stated here that the API does not
actually enforce is worse than no rule, so state only what it does.

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

The visual language is a thermal receipt: mono type, 15px root font, paper-toned background with a
fixed aurora backdrop.

There are six themes: a surface style (`normal`, `morphism` = `phormism*`, `brutal` = `brutal*`) crossed
with light/dark. `THEMES`, `STYLES` and `THEME_BY_AXES` in `mode.js` are the only place that mapping
lives; the style switch steps through `STYLES` in order. Phormism and Brutal each restyle the app
without touching components: tokens under `:root[data-theme^="…"]`, then unlayered rules in
`theme.css` that re-map existing utilities (`shadow-card`, `shadow-lg`, `rounded-xl`, `bg-gradient-*`,
`.edge-sheen`/`.corner-bloom`).

Type is the same mechanism: one face per style, each set through `--font-app` with Courier Prime as the
last fallback. Normal is IBM Plex Mono (the receipt idea without Space Mono's weight), Brutal is Space
Mono, Phormism is Plus Jakarta Sans — a mono has nothing to read against on a groundless, shadow-lit
surface. Only IBM Plex Mono is preloaded, since the boot script's fallback is a Normal theme; the other
three are loaded in `layout.js` with `preload: false`. Anything that sets a font or a toast border goes through
`--font-app` / `--toast-*` rather than naming a family or a radius directly. Two knock-on rules live
with the Phormism block for the same reason: `font-feature-settings: "tnum"`, since a proportional
sans does not have the mono's tabular figures, and a halved `.tracking-wider`, which was spaced for
a mono's wide slots. The `--text-*` scale in `@theme inline` (Tailwind's defaults × 1.14) is global and
unchanged — all three faces have close enough x-heights not to need their own.

## Note on the README

`README.md` is still the untouched `create-next-app` boilerplate and describes Geist fonts and
`app/page.js` — ignore it.
