import test from 'node:test';
import assert from 'node:assert/strict';
import { orderBodySchema, decideInvoiceState } from '../src/invoice_policy.js';

test('approved order becomes an invoice-ready document', () => {
  const order = orderBodySchema.parse({
    order_id: 'ord_1001',
    customer_name: 'Avery Chen',
    amount_cents: 4200,
    currency: 'USD',
    payment_events: [{ type: 'captured', occurred_at: '2025-01-12T10:00:00Z' }]
  });

  assert.equal(decideInvoiceState(order), 'approved');
});