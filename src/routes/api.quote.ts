import { createFileRoute } from '@tanstack/react-router';
import { calculateQuote } from '../quote';

const methodNotAllowed = () => Response.json({ error: 'Method not allowed.' }, { status: 405, headers: { Allow: 'GET, HEAD', 'Cache-Control': 'no-store' } });

export const Route = createFileRoute('/api/quote')({ server: { handlers: {
  GET: ({ request }) => {
    const result = calculateQuote(new URL(request.url).searchParams);
    return Response.json(result, { status: 'error' in result ? 400 : 200, headers: { 'Cache-Control': 'no-store' } });
  },
  POST: methodNotAllowed, PUT: methodNotAllowed, PATCH: methodNotAllowed, DELETE: methodNotAllowed, OPTIONS: methodNotAllowed,
} } });
