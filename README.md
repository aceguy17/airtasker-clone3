# TaskHive: Airtasker-style marketplace (Phase 1 MVP)

A working Next.js demo of a two-sided task marketplace. Posters post tasks, Taskers make offers, hire, chat, get paid through escrow and leave reviews.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
# or for production
npm run build && npm start
```

Demo accounts (password `password123`):

| Email | Role |
|---|---|
| alex@example.com | Poster |
| sam@example.com | Tasker (Assembly, Cleaning) |
| priya@example.com | Tasker (Gardening, Pet Care) |
| tom@example.com | Tasker (Painting, Handyman) |

Sign up with any new email to try the full flow yourself.

## What works

- Sign up, log in, log out (salted scrypt password hashing, HTTP-only session cookie)
- Post a task: category, in-person or remote, fixed/hourly/open budget, optional date
- Browse tasks: keyword (all words must match), category, location type, price range, sort
- Make an offer (price, availability, message). Phone numbers and emails in messages are masked.
- Poster reviews offers privately and hires one. Other offers are declined automatically.
- Escrow flow: fund (demo), Tasker marks done, Poster confirms and releases payment
- Chat between the Poster and the hired Tasker
- Two-way reviews; Tasker profiles show average rating and completed jobs
- Find Taskers directory, dashboard with earnings after a 10% fee, messages inbox, profile settings

## What is mocked (Phase 1)

- **Payments:** no real money moves. "Fund" and "release" only change task state. Swap in Stripe Connect (test mode) for Phase 2.
- **Phone verification:** a demo button, no SMS is sent.
- **Storage:** a JSON file at `data/db.json` (created on first run, git-ignored). Replace `src/lib/db.ts` with Postgres/Prisma for Phase 2. The pages call only the exported functions in that file.
- **Email notifications, ID verification, disputes, admin panel, maps:** planned for later phases (see the project plan).

## Project layout

```
src/app/            pages and routes (App Router)
src/app/actions.ts  all server actions (writes): auth, tasks, offers, escrow, chat, reviews
src/lib/db.ts       storage layer (JSON file for now)
src/lib/auth.ts     sessions and current-user helpers
src/lib/format.ts   money, dates, fee logic, contact masking
src/components/     shared UI and task card
```

## Notes

- Branding is a placeholder ("TaskHive"). Airtasker is a real trademark, so keep the clone's name and visuals distinct if it is ever published.
- The app is rendered per request (`force-dynamic`) because the data file changes at runtime.
