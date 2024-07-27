This is a [Next.js](https://nextjs.org/) Reddit RSS Reader project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Rename .env.local.example to .env.local

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project deployed on vercel [Link](https://rss-inhm.vercel.app/)

Feed updates via [https://www.easycron.com/](https://www.easycron.com/) every 20 minutes

Force update by hitting [https://rss-inhm.vercel.app/api/cron](https://rss-inhm.vercel.app/api/cron)

On dev it updates based on UPDATE_DB_INTERVAL via instrumentation.ts
