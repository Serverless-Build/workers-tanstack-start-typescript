import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';
import { calculateQuote, type QuoteResult } from '../quote';

const getRequestData = createServerFn({ method: 'GET' }).handler(() => {
  setResponseHeader('Cache-Control', 'no-store');
  return { renderedAt: new Date().toISOString(), runtime: 'Cloudflare Workers' };
});

const quote = createServerFn({ method: 'POST' })
  .validator((input: { quantity: string; unit_price_cents: string }) => calculateQuote(input))
  .handler(({ data }) => { setResponseHeader('Cache-Control', 'no-store'); return data; });

export const Route = createFileRoute('/')({ loader: () => getRequestData(), component: Home });

function Home() {
  const data = Route.useLoaderData();
  const [count, setCount] = useState(0);
  const [result, setResult] = useState<QuoteResult>();
  const [pending, setPending] = useState(false);
  return <main>
    <header><span className="badge">TanStack Start · Cloudflare Workers</span><h1>Typed routes.<br /><em>Real server functions.</em></h1><p className="intro">End-to-end typed routing and server functions, rendered on a Worker and hydrated in your browser.</p></header>
    <div className="grid">
      <section><span className="step">01 / Route loader + server function</span><h2>Fresh data, from the server.</h2><p>The typed route loader calls a server function for each page request. Refresh to see it run again.</p><time dateTime={data.renderedAt}>{data.renderedAt}</time><p className="muted">{data.runtime} · no-store</p></section>
      <section><span className="step">02 / React in the browser</span><h2>Local interaction.</h2><p>A hydrated counter belongs to this browser and resets on refresh.</p><button type="button" onClick={() => setCount(count + 1)}>Count: {count}</button></section>
      <section className="wide"><span className="step">03 / Typed POST server function</span><h2>Call the server from React.</h2><p>The server function validates its input and returns a typed quote. No client-side price calculation.</p>
        <form onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          setPending(true);
          try { setResult(await quote({ data: { quantity: String(form.get('quantity')), unit_price_cents: String(form.get('unit_price_cents')) } })); }
          catch { setResult({ error: 'The server could not calculate the quote. Please try again.' }); }
          finally { setPending(false); }
        }}><label>Quantity<input name="quantity" type="number" min="1" max="100" step="1" defaultValue="3" required /></label><label>Unit price (cents)<input name="unit_price_cents" type="number" min="1" max="1000000" step="1" defaultValue="250" required /></label><button disabled={pending}>{pending ? 'Calculating…' : 'Calculate a quote'}</button></form>
        <output id="result" aria-live="polite">{result ? 'error' in result ? result.error : `${result.total_cents} cents · ${result.currency}` : 'Your server-calculated quote will appear here.'}</output>
      </section>
    </div><footer>TanStack Router + Start · Workers Static Assets · <a href="/api/health">Health</a> · <a href="/api/quote?quantity=3&unit_price_cents=250">JSON API</a></footer>
  </main>;
}
