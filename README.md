# Stripe Churn Calculator

**See exactly how much MRR you're leaking — free, instant, no account required.**

> Drop your Stripe export and get a full breakdown: failed payment MRR, voluntary churn, churn rate, LTV, and your recovery opportunity. Runs entirely in your browser.

---

## Demo

_[Demo GIF — coming soon]_

---

## Quick Start

**Option 1 — Use the hosted version:**
👉 [stripe-churn-calculator.vercel.app](https://stripe-churn-calculator.vercel.app)

**Option 2 — Run locally:**

```bash
git clone https://github.com/mehadave/stripe-churn-calculator
cd stripe-churn-calculator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How to export from Stripe

The calculator supports two Stripe CSV formats. The Subscriptions export gives the most accurate results.

### Subscriptions CSV (recommended — high accuracy)

1. Go to **Stripe Dashboard → Billing → Subscriptions**
2. Click **Export** in the top right
3. Download and drop into the calculator

This gives you true MRR normalization (monthly/annual/quarterly plans all handled), real voluntary churn from cancellation data, and a historical MRR trend.

### Charges CSV (estimated)

1. Go to **Stripe Dashboard → Payments**
2. Click **Export** in the top right
3. Download and drop into the calculator

Or skip the export entirely and enter your numbers manually.

---

## Features

- **Subscriptions CSV support** — true MRR normalization across monthly, annual, and quarterly plans
- **Failed payment analysis** — see exactly how much MRR is lost to failed charges each month
- **Voluntary churn breakdown** — cancellations vs payment failures, side by side
- **Churn rate & LTV** — calculated at the customer level from your real data
- **Recovery opportunity** — estimates how much you could recover with smart retry logic (~70% of failed payments)
- **MRR trend chart** — historical revenue and churn visualized over time
- **Shareable report** — one-click copy to share your results
- **Zero backend** — everything processes in your browser, nothing is uploaded anywhere

---

## How it works

1. Drop a Stripe CSV (subscriptions or charges) or enter numbers manually
2. The tool parses it client-side using [Papa Parse](https://www.papaparse.com/) — data never leaves your browser
3. Auto-detects CSV type from column headers and routes to the correct calculation path
4. Calculates MRR, churn rate, LTV, and recovery opportunity
5. Renders a full report — no server, no storage, no account

---

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mehadave/stripe-churn-calculator)

No environment variables needed. Zero config.

---

## Contributing

Issues and PRs welcome. Good first issues are labeled [`good first issue`](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

Things that would be useful:
- Cohort retention chart
- PDF export of the report
- Multi-currency support

---

## License

MIT

---

Want to **automatically recover** the failed payments this tool finds?
→ [Reflow](https://stripe-churn-calculator.vercel.app/reflow) — AI-powered billing recovery for Stripe. Coming soon.
