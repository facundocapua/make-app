# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Make-App is a Next.js 16 app (App Router, React 19) for managing makeup appointments. It has **no application database**: Google Calendar stores appointments, a Google Sheet is the income ledger, and Cloudflare R2 (through the AWS SDK v3 S3 client, server-side only) stores each appointment's reference photo.

The UI is in Spanish (es-AR), so keep new user-facing copy in Spanish.

## Commands

Use **pnpm**. `pnpm-lock.yaml` is the maintained lockfile, even though the README says `npm install`. `package-lock.json` also exists and is only updated by Dependabot, so don't rely on it.

```bash
pnpm dev             # next dev
pnpm build           # next build
pnpm start           # next start
pnpm exec tsc --noEmit   # typecheck (currently passes); the most reliable static check
```

There are no tests.

**Linting is currently broken.** `pnpm lint` runs `next lint`, which Next 16 removed, and plain `eslint` fails because ESLint 9 expects a flat config while the repo only has `.eslintrc.json`. This runs it against the legacy config:

```bash
ESLINT_USE_FLAT_CONFIG=false pnpm exec eslint src --ext .ts,.tsx
```

Most of its output is `Definition for rule '@typescript-eslint/indent' was not found`, because typescript-eslint v8 removed that rule. Ignore that noise. 2-space indent is a convention here, not something the linter enforces.

## Environment variables (`.env.local`)

- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `NEXTAUTH_SECRET`: read implicitly by NextAuth
- `ALLOWED_EMAILS`: comma-separated Google accounts allowed to sign in; when empty or missing, everyone is denied
- `GOOGLE_SPREADSHEET_ID`, `GOOGLE_SHEET_NAME`: income ledger target
- `CLOUDFLARE_R2_ACCOUNT_ID`, `CLOUDFLARE_R2_ACCESS_KEY`, `CLOUDFLARE_R2_SECRET_KEY`, `CLOUDFLARE_R2_BUCKET_NAME`, `CLOUDFLARE_R2_PUBLIC_URL`: event pictures bucket

## Architecture

### Auth and Google APIs

- NextAuth with the Google provider, configured in [src/utils/auth-options.ts](src/utils/auth-options.ts); scopes are in [src/services/google/auth.ts](src/services/google/auth.ts). Every Google call runs on behalf of the signed-in user with `session.accessToken`; there is no service account.
- There is no middleware. Each page or route checks the session itself and redirects to `/api/auth/signin` or returns 401, so new pages and routes must do the same. The `signIn` callback only lets accounts in `ALLOWED_EMAILS` sign in; it doesn't end existing sessions, so removing an account also requires rotating `NEXTAUTH_SECRET`.
- On token expiry the `jwt` callback calls `refreshAccessToken`. On `RefreshAccessTokenError`, [UserContextProvider](src/context/user.tsx) calls `signOut()`. Sign-in requests offline access with `prompt: 'consent'` so Google issues a refresh token; sessions without one are signed out when the access token expires.
- Google REST calls go through `makeApiCall` in [src/services/google.ts](src/services/google.ts), which picks the `calendar` or `sheets` base URL from its `service` param and throws `GoogleApiError` on any non-2xx response. Extend it rather than hand-rolling fetches. Server pages pass errors to `handlePageError` ([src/utils/page-errors.ts](src/utils/page-errors.ts)), which redirects on 401, shows the 404 page on 404/410, and otherwise lets [error.tsx](src/app/error.tsx) handle them.

### Calendar as the data store

The appointment record is JSON-serialized into the **`description`** field of a Calendar event: written by `generateEventObject` ([src/utils/google.ts](src/utils/google.ts)), read back by `parseGoogleEvent` ([src/services/google/parse-event.ts](src/services/google/parse-event.ts)). Events without a valid JSON description, such as ones added by hand in Google Calendar, are built from their Calendar fields instead.

When changing event code:
- A new [`EventType`](src/types/event.d.ts) field needs no schema change, but older events won't have it, so reads must tolerate its absence.
- `createEventAction` builds its record field by field from `FormData` and doesn't set `includesTest` or `testDate`, so a new field must be added there explicitly. Update paths spread the existing event instead.
- `listEvents` follows `nextPageToken` and limits the response with `fields`, so a new Calendar field must also be added to that list.
- `getCalendar` finds or creates the calendar named by `CALENDAR_NAME` (`'MakeApp Calendar'`) and is called from nearly every server entrypoint to resolve the `calendarId`.

### Income ledger (Google Sheets)

`POST /api/payments` ([route](src/app/api/payments/route.ts)) appends `Object.values(parsedData)` as a row to `${GOOGLE_SHEET_NAME}!A2:E`. **Sheet column order comes from the key order of the request body**, which is set by `defaultState` in [PaymentForm/hook.ts](src/components/Payment/PaymentForm/hook.ts), not by the `PaymentType` declaration (the two differ). Reordering `defaultState` silently corrupts the ledger. It currently sends date, paymentMethod, description, service, amount, plus an empty `clientId` as a sixth value.

### Picture uploads (Cloudflare R2)

[UploadEventPhoto](src/components/Events/event-modal/upload-event-photo.tsx) uploads directly from the browser with a presigned URL: `getUploadUrlAction` validates type and size and signs a `PUT` valid for 5 minutes, then `updateEventPictureAction` saves the public URL into the event description. `deletePictureAction` deletes the R2 object and clears `picture`. Both picture actions take the event ID and re-read the event on the server, and the bucket key must never come from the client. R2 credentials stay on the server.

Things that are easy to break in the signing call: the SDK leaves `content-type` out of the signature unless it is in `signableHeaders`, and it adds a checksum to the URL unless `requestChecksumCalculation` is `WHEN_REQUIRED`. Also, `redirect()` in a server action rejects the promise on the client, so call these actions inside `startTransition`, not `try/catch`.

### Routing and data flow

App Router under [src/app/](src/app/). `page.tsx` is usually a server component that resolves the session and calendar and fetches data, with a sibling `client.tsx` for interactive parts.

Mutations use **server actions** ([event-modal/actions.ts](src/components/Events/event-modal/actions.ts), [CreateEventForm/actions.ts](src/components/Form/CreateEventForm/actions.ts)), which `redirect()` after saving, except `deleteItem`, which returns `{ ok }` so the list can stay on the current page. Flash messages cross the redirect through a short-lived `notification` cookie set by `setNotification` ([toaster.tsx](src/components/toaster/toaster.tsx)) and rendered with `sonner`. The payment form is the exception: it uses `fetch` to `/api/payments` and the alerts context.

### Code with no callers in `src`

Check before extending these; the live path is usually the server action above:
- `useGroupedEvents` → `useEventCollection` → `services/api/{updateEvent,deleteEvent}`, plus `services/api/saveEvent` and `hooks/useCalendar`
- Routes `POST /api/events`, `PUT|DELETE /api/events/[id]`, `GET /api/events/export` (could still be called from outside the app)
- The `zustand` dependency is not imported

## Conventions

- **Path alias**: `@/*` → `src/*`.
- **Type imports**: `consistent-type-imports` is configured; always use `import type { ... }` for type-only imports.
- **Styling**: Tailwind v4 (`@tailwindcss/postcss`); merge classes with `clsx` + `tailwind-merge`.
- **Form state**: `useReducer` hooks (see [CreateEventForm/hook.ts](src/components/Form/CreateEventForm/hook.ts)).
