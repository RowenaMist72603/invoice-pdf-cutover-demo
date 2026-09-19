import { orderBodySchema, buildInvoiceDocument } from './invoice_policy.js';

const sample = orderBodySchema.parse({
  order_id: 'ord_1001',
  customer_name: 'Avery Chen',
  amount_cents: 4200,
  currency: 'USD',
  payment_events: [{ type: 'captured', occurred_at: '2025-01-12T10:00:00Z' }]
});

const result = await buildInvoiceDocument(sample);
console.log(JSON.stringify(result, null, 2));