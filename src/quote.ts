export type Quote = { quantity: number; unit_price_cents: number; total_cents: number; currency: 'USD' };
export type QuoteResult = Quote | { error: string };

export function calculateQuote(input: unknown): QuoteResult {
  const fields = ['quantity', 'unit_price_cents'] as const;
  const values: number[] = [];
  for (const field of fields) {
    let value: unknown;
    if (input instanceof URLSearchParams || input instanceof FormData) {
      const entries = input.getAll(field);
      if (entries.length !== 1) return { error: `Provide exactly one ${field}.` };
      value = entries[0];
    } else if (input && typeof input === 'object' && !Array.isArray(input)) {
      value = (input as Record<string, unknown>)[field];
    }
    if ((typeof value !== 'string' && typeof value !== 'number') || !/^\d+$/.test(String(value))) return { error: `${field} must be an integer.` };
    const number = Number(value);
    const maximum = field === 'quantity' ? 100 : 1_000_000;
    if (!Number.isSafeInteger(number) || number < 1 || number > maximum) return { error: `${field} must be between 1 and ${maximum}.` };
    values.push(number);
  }
  const [quantity, unit_price_cents] = values;
  return { quantity, unit_price_cents, total_cents: quantity * unit_price_cents, currency: 'USD' };
}
