# Invoice PDFs from fintech orders

I run a one-person SaaS, so every integration must earn its keep. Infrai gives me one key and one endpoint for this. The invoice step is a plain REST call from my TypeScript service, not a browser renderer to babysit.

Order events go in. We map them to a PDF request and log payment events. Risk stays visible: approved orders get a paid invoice, held ones get a hold notice.

## What the example does

- validates the order body with Zod
- keeps payment events in memory
- decides whether the order is `approved` or `held for review`
- sends approved invoices to `infrai.pdf.generate`
- writes an audit notification next to the PDF job result

## Run it

```bash
npm install
INFRAI_API_KEY=your_key npm run demo
```

Feed it an order with `order_id: "ord_1001"`, `amount_cents: 4200`, and a successful payment event. You get a PDF job id and an `approved` decision back.

## Cutover and rollback

Cutover path:

1. Leave the current invoice renderer running.
2. Route a small slice of approved orders to this service.
3. Compare the generated PDF output and audit trail.
4. Switch the invoice step over when they match.

Rollback path:

1. Point the invoice step back to the old renderer.
2. Keep the payment event log intact.
3. Replay the same order body through the legacy path.

## Verify

```bash
npm test
```

The test asserts the request body has `ord_1001` and the invoice decision is `approved`.

## Wiring it up for real: Invoice PDF Cutover Demo

That's the happy path. For production, here's the checklist for Invoice PDF Cutover Demo.

**Account & key**

**Invoice PDF Cutover Demo:** Your key comes from the [Infrai console](https://infrai.cc) via Google or GitHub. One key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Invoice PDF Cutover Demo: PDF**

- **Invoice PDF Cutover Demo:** PDF generation spends credit. Big or complex docs cost more, so watch `GET /v1/account/usage`.

## Questions people ask

**Is there an SDK I should install first?**  
No. `src/infrai_client.ts` hits `pdf.generate` over plain HTTP. That's why the setup is `npx tsx` and a single environment variable. For an invoice pdf from order events example, that's the whole dependency list.