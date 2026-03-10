# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Dev Event Next.js App Router project. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes the PostHog client-side singleton using the Next.js 15.3+ `instrumentation-client` approach. Configured with a reverse proxy (`/ingest`), error tracking (`capture_exceptions: true`), and debug mode in development.
- **`next.config.ts`** (updated): Added PostHog reverse proxy rewrites for `/ingest/static/:path*` and `/ingest/:path*`, plus `skipTrailingSlashRedirect: true` to support PostHog trailing-slash API requests.
- **`components/ExploreBtn.tsx`** (updated): Added `'use client'` directive (already present) and a `handleClick` handler that fires `explore_events_clicked` when the Explore Events button is clicked.
- **`components/EventCard.tsx`** (updated): Added `'use client'` directive and a `handleClick` handler on the Link that fires `event_card_clicked` with properties: `event_title`, `event_slug`, `event_location`, `event_date`.
- **`components/Navbar.tsx`** (updated): Added `'use client'` directive and a `handleCreateEventClick` handler that fires `create_event_clicked` when the Create Event nav link is clicked.
- **`.env.local`** (created): Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables (covered by `.gitignore`).

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the 'Explore Events' button on the homepage hero section | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card to view event details | `components/EventCard.tsx` |
| `create_event_clicked` | User clicked on the 'Create Event' link in the navbar | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/337585/dashboard/1347146)
- **Insight**: [User Engagement Overview](https://us.posthog.com/project/337585/insights/mfZirVei) — Daily trend of all three events
- **Insight**: [Homepage to Event Detail Funnel](https://us.posthog.com/project/337585/insights/KFSNCO6j) — Conversion funnel from Explore Events → Event Card click
- **Insight**: [Create Event Intent Rate](https://us.posthog.com/project/337585/insights/FhithlzG) — Daily unique users clicking Create Event
- **Insight**: [Most Clicked Events (by title)](https://us.posthog.com/project/337585/insights/YnVOfrQg) — Which event cards get the most interest, broken down by title
- **Insight**: [Unique Active Users per Day](https://us.posthog.com/project/337585/insights/Shn8uxPM) — Weekly unique users per action type

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
