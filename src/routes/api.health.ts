import { createFileRoute } from '@tanstack/react-router';

const methodNotAllowed = () => Response.json({ error: 'Method not allowed.' }, { status: 405, headers: { Allow: 'GET, HEAD', 'Cache-Control': 'no-store' } });

export const Route = createFileRoute('/api/health')({ server: { handlers: {
  GET: () => Response.json({ ok: true, framework: 'TanStack Start', marker: 'SERVERLESS_BUILD_TANSTACK_START_TYPESCRIPT_V1' }, { headers: { 'Cache-Control': 'no-store' } }),
  POST: methodNotAllowed, PUT: methodNotAllowed, PATCH: methodNotAllowed, DELETE: methodNotAllowed, OPTIONS: methodNotAllowed,
} } });
