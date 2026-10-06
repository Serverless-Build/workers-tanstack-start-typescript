# TanStack Start on Workers

Typed routes, request-time SSR, React hydration, and real server functions with the official Cloudflare Vite plugin.

## Run and deploy

Use Node.js 22.22 or later; `.node-version` pins the tested Node 24.21.0 toolchain.

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run bundle
npm run start
```

`check` generates Workers types, builds the routes and app, checks TypeScript, and performs a Wrangler dry run. `bundle` writes a self-contained upload to `dist/worker-bundle`. `start` previews the production build in Workers. Log in with Wrangler, select your account, and run `npm run deploy`.

The source is portable. Its only binding is Workers Static Assets (`ASSETS`); generated route trees, types, dependencies, and build outputs stay out of the published repository.

## Try it

- Open `/`, increment the hydrated counter, and refresh for new request-time server data.
- Submit the quote form. It calls a typed POST server function with server-side input validation.
- `GET /api/health` checks liveness.
- `GET /api/quote?quantity=3&unit_price_cents=250` returns 750 cents in USD. Quantity must be one integer 1–100, unit price one integer 1–1000000. Missing, duplicate, decimal, and out-of-range API inputs return 400.
- `/robots.txt` and generated JS/CSS are served by Static Assets.

This stateless example permits HTTPS embedding and local development, uses `no-store` for request-time data, and keeps browser counters separate from server requests. It does not require file-system persistence or additional Cloudflare products.

See the [official TanStack Start Workers guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/).

## Pattern and live demo

- [Pattern page](https://serverless.build/patterns/tanstack-start-workers)
- [Live deployment](https://workers-tanstack-start-typescript.dwarven.workers.dev)
