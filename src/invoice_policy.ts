import { z } from 'zod';
import { infrai } from './infrai_client.js';

export const orderBodySchema = z.object({
  order_id: z.string().min(1),
  customer_name: z.string().min(1),
  amount_cents: z.number().int().positive(),
  currency: z.string().length(3),
  payment_events: z.array(
    z.object({
      type: z.enum(['authorized', 'captured', 'failed']),
      occurred_at: z.string().min(1)
    })
  )
});

export type OrderBody = z.infer<typeof orderBodySchema>;

export function decideInvoiceState(order: OrderBody) {
  const hasCapture = order.payment_events.some((event) => event.type === 'captured');
  return hasCapture && order.amount_cents > 0 ? 'approved' : 'held for review';
}

export async function buildInvoiceDocument(order: OrderBody) {
  const decision = decideInvoiceState(order);
  const auditLine = `invoice ${order.order_id} ${decision}`;

  if (decision === 'held for review') {
    return { decision, auditLine };
  }

  const html = `
    <html>
      <body>
        <h1>Invoice ${order.order_id}</h1>
        <p>Customer: ${order.customer_name}</p>
        <p>Total: ${order.currency} ${(order.amount_cents / 100).toFixed(2)}</p>
        <p>Status: paid</p>
      </body>
    </html>
  `;

  const pdfResult = await infrai.pdf.generate({ html, store: true });
  return { decision, auditLine, pdfResult };
}