Puzzle Path is a kid-friendly sequence of puzzles with login and score tracking.

## Local development

1) Create `.env` (copy from `.env.example`) and set:
- `DATABASE_URL` (Postgres)
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

2) Run migrations + seed:
```bash
npx prisma migrate dev
npm run db:seed
```

Optional: reset puzzle progress (clears `UserPuzzle` rows):
```bash
# all users
npm run db:reset-progress

# one user
npm run db:reset-progress -- --email you@example.com
```

3) Start the dev server:
```bash
npm run dev
```

## Production (Vercel)

- Use Postgres (Vercel Postgres, Supabase, Neon, etc.)

### Vercel Postgres

1) In the Vercel dashboard: Project -> Storage -> Create Database -> Postgres

2) Attach the database to your project environments (Production, Preview, etc.)

3) Set env vars in Vercel:
- `DATABASE_URL` (recommended: set it equal to Vercel's `POSTGRES_PRISMA_URL`)
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

4) Deploy. This repo's `vercel-build` runs `prisma migrate deploy` automatically.

Optional: seed once (run it with `DATABASE_URL` pointing at your Vercel Postgres):
```bash
npm run db:seed
```
