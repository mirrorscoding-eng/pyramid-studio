# استوديو هرم — Pyramid Studio

The Pyramid Studio site built with **Next.js 16** and **Supabase**, plus a dashboard (`/dashboard`) that controls all of the site's content.

## Running locally

Requirements: Node.js 20+, and Docker running (Colima on this Mac).

```bash
npm install
npm run db:start          # starts local Supabase (database + storage + login)
npm run create-admin      # creates the dashboard account from ADMIN_EMAIL / ADMIN_PASSWORD in .env.local
npm run dev               # http://localhost:3000
```

- Dashboard: http://localhost:3000/dashboard
- Supabase Studio (to browse the database): http://127.0.0.1:54323
- Stop the database: `npm run db:stop`

If `.env.local` is missing, copy `.env.example` and fill in the values from `npx supabase status`.

## How content works

- The whole site content (page texts, services, works, clients, team, settings…) is stored as one JSON document in the `site_content` table (row `main`).
- If a field is missing from the database, the site falls back to the defaults in `lib/content/defaults.json` (the content from the old site).
- Contact form messages go to the `messages` table. Visitors can send but not read; only the admin can read them.
- Images and videos are uploaded to the `media` bucket in Supabase Storage.
- Only users listed in the `admins` table can edit. Public sign-up is disabled.

## Project structure

| Path | Contents |
| --- | --- |
| `app/(site)/` | The site pages: home, about, services, work, contact |
| `app/(admin)/dashboard/` | Dashboard, login and save actions |
| `components/site/` | Site sections (header, orbit, work modal, form…) |
| `components/dashboard/` | Dashboard views |
| `lib/content/` | Content model, defaults, and text labels for the dashboard |
| `lib/art.ts` | Pyramid drawings and engraved covers (SVG) |
| `supabase/migrations/` | Tables and access rules |
| `legacy/` | The old site (HTML) for reference only; not used |

## Moving to the cloud later (Vercel + Supabase)

1. Create a Supabase project, then link it: `npx supabase link` and push the tables: `npx supabase db push`.
2. In Supabase → Authentication, make sure sign-up is turned off.
3. On Vercel, add the variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the cloud project.
4. Create the admin account against the cloud project: `node --env-file=.env.production.local scripts/create-admin.mjs <email> <password>`.
5. From the dashboard → Settings → Backup: export a copy locally and import it into the cloud version.
