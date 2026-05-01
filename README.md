# stripe-churn-calculator

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

1. Go to **Stripe Dashboard → Payments**
2. Click **Export** in the top right
3. Select your date range and download the CSV
4. Drop it into the calculator

Or skip the export and enter your numbers manually.

---

## Features

- **Failed payment analysis** — see exactly how much MRR is lost to failed charges each month
- **Voluntary churn breakdown** — cancellations vs payment failures, side by side
- **Churn rate & LTV** — calculated from your real data
- **Recovery opportunity** — estimates how much you could recover with smart retry logic
- **MRR trend chart** — visualizes 6 months of revenue and churn
- **Shareable report** — one-click copy to share your results
- **Zero backend** — everything processes in your browser, nothing is uploaded

---

## How it works

1. You drop a Stripe charges CSV (or enter numbers manually)
2. The tool parses it client-side using [Papa Parse](https://www.papaparse.com/)
3. Calculates MRR, churn, LTV, and recovery opportunity
4. Renders a full report — no server, no storage, no account

---

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mehadave/stripe-churn-calculator)

No environment variables needed. Zero config.

---

## Contributing

Issues and PRs welcome. Good first issues are labeled [`good first issue`](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

Things that would be useful:
- Support for Stripe subscriptions CSV (voluntary churn from cancellation data)
- Cohort retention chart
- PDF export of the report

---

## License

MIT

---

Want to **automatically recover** the failed payments this tool finds?  
→ [Reflow](https://getreflow.co) — AI-powered billing recovery for Stripe. No code required.
