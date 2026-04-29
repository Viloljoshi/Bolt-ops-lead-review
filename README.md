# Alfred AI Operations Command Center

A functional prototype demonstrating how a top-tier AI Operations Lead monitors, diagnoses, prioritizes, and improves an AI support agent at global scale.

Built as a demonstration artefact for the **AI Operations Lead** role at Bolt.

---

## What This Is

Alfred is Bolt's AI support agent. This prototype simulates the operational command center an AI Ops team would use every Monday morning to answer eight core questions:

1. Is Alfred healthy?
2. Where is performance dropping?
3. Why is it dropping?
4. Is the issue a knowledge gap, classification error, logic fault, tool failure, compliance blocker, or poor UX?
5. What should the AI Ops team do next?
6. Which issues escalate to Product, Engineering, Support Ops, Legal/Compliance, or Knowledge Management?
7. How do customer feedback, agent overrides, and system telemetry become improvement actions?
8. How do we track whether fixes actually improved customer experience?

This is not a generic dashboard. It is a **decision system**.

---

## Core Philosophy

> AI support operations is not about maximizing automation blindly. It is about maximizing **trusted resolution at scale**.

High automation is good only when CSAT, reopen rate, and compliance risk are healthy. Escalation is not failure if the case is sensitive or risky. Every AI failure should have an owner, root cause, and measurable fix.

This philosophy is embedded in the product — most visibly through the **Trusted Automation Score**, a composite metric that replaces raw automation rate as the primary signal.

---

## App Structure

| Page | Purpose |
|------|---------|
| **Landing** | Intro screen with 4 operational pillars |
| **Executive Health Dashboard** | 10 metric cards + weekly trend + market health |
| **Failure Diagnosis Center** | Failure taxonomy, conversation log, pattern table |
| **Feedback Loop System** | Pipeline visualization, inbox, clusters, before/after |
| **Weekly Ops Review** | Action items, decision log, leadership brief generator |
| **Automation Portfolio** | Use case table with Scale / Monitor / Restrict logic |
| **Escalation & Compliance Desk** | Active incidents, compliance guardrails |
| **Improvement Backlog** | Kanban board from signal to measured impact |
| **Market / Vertical Drilldown** | Per-market health, active issues, recommended actions |

---

## Key Product Decisions

### Trusted Automation Score (TAS)
Raw automation rate is a misleading metric — it can be gamed by resolving cases incorrectly at scale. The Trusted Automation Score combines automation rate, CSAT, reopen rate, override rate, and compliance block rate into a single quality-weighted signal. A use case with 90% automation but 28% reopen rate gets a low TAS.

### Seven Failure Types
Rather than a binary "worked / didn't work", every failure is classified into one of seven root cause categories:

- **Knowledge Gap** — Alfred didn't have the right information
- **Classification Error** — Alfred misunderstood the intent
- **Logic Fault** — Alfred understood but followed the wrong decision path
- **Tool/API Failure** — An external system failed or timed out
- **Compliance/Policy Blocker** — The case shouldn't be automated
- **UX/Tone Failure** — Technically correct but emotionally wrong
- **Over-Automation Risk** — Resolving cases that should require human review

Each failure type routes to a different owner team and requires a different fix.

### Owner Mapping
Every failure, cluster, and backlog item maps to a clear owner team:

- **ML / AI Product** — Classification errors, intent taxonomy
- **CS Product** — Logic faults, decision tree updates, workflow fixes
- **Engineering / Platform** — Tool failures, API stability
- **Trust & Safety / Compliance** — Compliance blockers, safety routing
- **Local Ops / KM** — Knowledge gaps, market-specific policy
- **Conversation Design** — UX/tone failures, empathy templates, localization

### Feedback Loop Closure
Fixing Alfred is not enough. Every fix must have a before/after impact measurement tied to the metric it was supposed to improve. The Closed Loops tab in the Feedback system demonstrates this pattern explicitly.

### Escalation Is Not Failure
The Automation Portfolio includes a "Restrict" recommendation for use cases where high automation is actually the risk. Safety incidents, identity verification, fraud allegations, and repeated refund abuse cases are deliberately kept at low automation with required human review.

---

## Markets & Verticals in Mock Data

**Markets:** Estonia, Poland, Kenya, Nigeria, India, South Africa, Germany, Mexico

**Verticals:** Ride-hailing, Food Delivery, Scooter/e-bike, Driver Support, Payments/Refunds, Safety Incidents

**Issue Categories:** Refund Request, Driver Cancellation, Wrong Charge, Delayed Food Order, Account Verification, Safety Complaint, Lost Item, Promo Code Issue, Payout Delay, Vehicle Unlock Issue

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + inline CSS variables |
| Charts | Recharts |
| Icons | Lucide React |
| Font | Inter + JetBrains Mono |
| Design System | Bolt brand guidelines (Jungle Green #34BB78, Charade #2C2D33) |
| Data | Mock JSON files (`/data/*.json`) |
| Backend | None — structured for Supabase/API drop-in |

---

## How to Run Locally

```bash
cd alfred-ops
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## File Structure

```
alfred-ops/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── dashboard/page.tsx        # Executive Health Dashboard
│   ├── diagnosis/page.tsx        # Failure Diagnosis Center
│   ├── feedback/page.tsx         # Feedback Loop System
│   ├── weekly-review/page.tsx    # Weekly Ops Review
│   ├── automation/page.tsx       # Automation Portfolio
│   ├── escalation/page.tsx       # Escalation & Compliance Desk
│   ├── backlog/page.tsx          # Improvement Backlog (Kanban)
│   └── drilldown/page.tsx        # Market / Vertical Drilldown
├── components/
│   ├── Sidebar.tsx               # Navigation sidebar
│   └── AppShell.tsx              # Page shell with top bar
└── data/
    ├── metrics.json              # Global + market + vertical metrics
    ├── conversations.json        # Sample support conversations with failure data
    ├── backlog.json              # Improvement backlog items
    ├── automationPortfolio.json  # Automation use case portfolio
    └── incidents.json            # Active compliance/escalation incidents
```

---

## How to Deploy on Vercel

```bash
npm i -g vercel
vercel
```

Or connect the GitHub repository in the Vercel dashboard. No environment variables required for the mock data version.

---

## How This Evolves Into a Production System

| Prototype | Production |
|-----------|-----------|
| Mock JSON data | Supabase database with real conversation logs |
| Static filter pills | Live filter state tied to Supabase queries |
| Generated weekly brief | Scheduled Claude API call every Monday |
| Manual failure classification | ML classifier pipeline via Anthropic API |
| Static backlog cards | Jira / Linear integration |
| Single-user prototype | Role-based access (Ops Lead / PM / Compliance / Eng) |
| Hardcoded decision engine rules | Configurable rule engine with alert thresholds |

---

## What This Demonstrates

This prototype was built to show how an AI Operations Lead thinks — not just about dashboards, but about the full operational system:

- How customer signals become structured improvement work
- How to distinguish between a knowledge problem, a logic problem, a tooling problem, and a tone problem
- How to balance automation coverage with quality, compliance, and trust
- How to give Product, Engineering, CS Ops, and Compliance a shared operational language
- How to measure whether fixes actually worked

The goal is not to look good on a Monday morning review. The goal is to make Alfred measurably better by the following Monday.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
