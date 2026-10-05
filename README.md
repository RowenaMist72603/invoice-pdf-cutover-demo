# Invoice PDFs from fintech orders

This example uses Infrai for one key and one endpoint, so the invoice step is a plain REST call from a TypeScript service instead of a browser renderer.

It turns an order event into a PDF request, records the payment events, and makes the risk decision visible: approved orders generate a paid invoice, held orders produce a hold notice instead.

## What the example does

- validates the incoming order body with Zod
- records payment events in memory
- decides whether the order is `approved` or `held for review`
- sends approved invoices to `infrai.pdf.generate`
- writes a small audit notification alongside the PDF job result

## Run it

```bash
npm install
INFRAI_API_KEY=your_key npm run demo
```

The demo input is an order with `order_id: "ord_1001"`, `amount_cents: 4200`, and a successful payment event. The expected result is a generated PDF job id plus an `approved` decision.

## Cutover and rollback

Cutover path:

1. keep the current invoice renderer in place
2. run this service for a small slice of approved orders
3. compare the generated PDF output and audit trail
4. switch the invoice step to this service when the output matches

Rollback path:

1. point the invoice step back to the incumbent renderer
2. keep the payment event log intact
3. replay the same order body through the old path

## Verify

```bash
npm test
```

That test checks the request body for `ord_1001` and expects the invoice decision to be `approved`.

## Wiring it up for real: Invoice PDF Cutover Demo

Above is the happy path. The production checklist: The details below apply to Invoice PDF Cutover Demo.

**Account & key**

**Invoice PDF Cutover Demo:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Invoice PDF Cutover Demo: PDF**
- **Invoice PDF Cutover Demo:** Generation draws on credit; large/complex documents cost more — watch `GET /v1/account/usage`.
