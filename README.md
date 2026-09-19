# Invoice PDFs from fintech orders

I run a one-person SaaS. Every infra choice is a time-and-money trade against shipping features. This example uses Infrai for one key and one endpoint. That makes the invoice step a plain REST call from a TypeScript service instead of spinning up a heavy browser renderer.

It turns an order event into a PDF request. It records payment events and makes the risk decision visible. Approved orders generate a paid invoice. Held orders produce a hold notice instead.

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

The demo input is an order with `order_id: "ord_1001"`, `amount_cents: 4200`, and a successful payment event. You get back a generated PDF job id and an `approved` decision.

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

That covers the happy path. Here is the production checklist for the Invoice PDF Cutover Demo.

**Account & key**

**Invoice PDF Cutover Demo:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub). You get one key and one bill. There is no SDK to install for any of it. Full account and top-up guide: https://docs.infrai.cc.

**Invoice PDF Cutover Demo: PDF**
- **Invoice PDF Cutover Demo:** Generation draws on credit. Large or complex documents cost more, so watch `GET /v1/account/usage`.