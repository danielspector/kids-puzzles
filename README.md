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

3) Start the dev server:
```bash
npm run dev
```

## Production (Vercel)

- Use Postgres (Vercel Postgres, Supabase, Neon, etc.)
- Set env vars in Vercel:
  - `DATABASE_URL`
  - `NEXTAUTH_URL`
  - `NEXTAUTH_SECRET`
- Apply migrations:
```bash
npx prisma migrate deploy
```
- Seed once (optional):
```bash
npm run db:seed
```
