# Alfred AI Operations Command Center

**A functional prototype built for the AI Operations Lead role at Bolt.**

This is not a slide deck or a design mockup. It is a working Next.js application that shows how I would actually run AI support operations — what I would monitor, how I would diagnose failures, how I would drive cross-functional action, and how I would measure whether anything got better.

[Live demo →](http://localhost:3000) · [Run locally](#run-locally)

---

## Why I built this

The job description asked for someone who can operate AI agents at scale, drive improvement across product and engineering teams, and maintain quality across global markets.

I could have written about that. Instead I built it.

This prototype simulates the Monday morning command center my team would use to answer the questions that actually matter in AI ops:

- Is Alfred healthy right now, or are we flying blind?
- Where exactly is performance degrading, and why?
- Which team needs to act, and by when?
- Are we compliant in Kenya, Nigeria, India, Germany, and Poland — each with different laws?
- Is our 71% automation rate something to be proud of, or is it hiding a quality problem?

The goal was to build something a Bolt hiring team could open, click through, and immediately understand how I think.

---

## What I'm trying to demonstrate

### 1. I distinguish between monitoring and operating

Most AI dashboards show you what happened. This one tells you what to do about it.

Every metric card has a tooltip explaining why it matters, what threshold should trigger action, and which team owns the response. Every failure pattern has a business risk quantification and a recommended fix with an owner. The weekly review generates team-specific action briefs — not a generic summary, but five separate briefs for Engineering, CS Product, ML, Compliance, and Local Ops, each with specific tasks and due dates.

The insight I'm trying to show: **dashboards are not operations. Operations is the system that turns signals into decisions and decisions into measurable improvements.**

### 2. I don't trust raw automation rate as a success metric

Raw automation rate is easy to game — you can push it to 95% by resolving cases incorrectly at scale. No one notices until CSAT collapses or a regulator asks questions.

I built a **Trusted Automation Score (TAS)** that weights automation rate against CSAT, reopen rate, agent override rate, and compliance block rate. A use case with 90% automation but 28% reopen rate gets a low TAS. That's the right call.

This is the kind of metric design decision that separates an ops lead from an ops analyst.

### 3. I understand failure modes that don't show up in standard dashboards

The industry standard failure taxonomy has 7 categories. I built 15, because the 8 additional ones are the ones that silently degrade quality for weeks before anyone notices:

- **Confidence Calibration Drift** — Alfred answers confidently even when it shouldn't
- **Cross-market Policy Bleed** — a rule configured for Estonia incorrectly applies in Nigeria
- **Temporal Knowledge Staleness** — Alfred's knowledge base is accurate but 47 days out of date
- **Adversarial Pattern Exploitation** — customers have learned which phrases trigger refund approvals
- **Silent Degradation** — Alfred resolves cases as "closed" that customers consider unresolved
- **Emotional State Blindness** — technically correct responses to customers who are frightened or distressed
- **Handoff Quality Degradation** — Alfred escalates but loses context, so human agents restart from zero
- **Driver vs. Rider Persona Confusion** — different policy rules for the same transaction type depending on who initiated

These don't appear in standard automation or CSAT metrics. They only surface through override analysis, reopen patterns, and repeat contact rates. I built detection logic and owner routing for each one.

### 4. I understand compliance as an operational constraint, not a legal footnote

GDPR is not the whole picture. Bolt operates in markets where:

- **Nigeria** — CBN requires payment dispute oversight; NDPR has specific data residency rules
- **Kenya** — Data Protection Act 2019 requires human review within 5 business days for disputes over KSh 5,000
- **India** — DPDP Act 2023 requires consent and grievance redressal; RBI Master Directions mandate human escalation for disputes above ₹10,000
- **Poland** — UODO has been actively enforcing GDPR Art. 22; refund denials without explanation face fines up to €20M
- **Germany** — BDSG adds data minimisation and BaFin oversight for payment-adjacent automated decisions

I built a per-market regulatory exposure matrix with specific legal citations, identified where Alfred's current behaviour creates compliance gaps, and mapped each gap to a remediation action. Compliance is not a review step — it is a constraint that belongs in the core decision logic.

### 5. I know how to make cross-functional operations actually work

AI ops fails when insight stays inside the ops team. I built explicit hand-offs:

- Every failure type routes to a named owner team (not just "escalate to product")
- Every backlog item links to a sprint, a due date, and a measurable expected outcome
- The weekly review generates a leadership brief that can be pasted directly into Slack or email
- The backlog board shows a live integration note for Jira, Slack, and Microsoft Teams — because tools that don't connect to where teams already work get ignored

### 6. I think about the full improvement loop, not just diagnosis

Identifying a problem is the easy part. I built the entire loop:

`Customer signal → Failure classification → Root cause cluster → Backlog item → Sprint → Shipped fix → Before/after measurement`

The Feedback Loop system and Improvement Backlog together demonstrate that every fix has a hypothesis (which metric should improve), an owner, a due date, and a success criterion. Fixes without measurement are guesses.

---

## Pages and what each one reveals

| Page | What it demonstrates |
|------|----------------------|
| **Executive Health Dashboard** | Metric design, TAS, tooltip-driven context, signal intelligence layer |
| **Failure Diagnosis Center** | 15-mode taxonomy, silent killer detection, quantified business impact |
| **Feedback Loop System** | Full signal-to-fix pipeline, multilingual inbox, closed loop tracking |
| **Weekly Ops Review** | Cross-functional action briefs, decision log, leadership communication |
| **Automation Portfolio** | Scale / Monitor / Restrict / Pause logic, TAS-weighted decisions |
| **Escalation & Compliance Desk** | Per-market regulatory matrix, Art. 22 monitoring, guardrail definitions |
| **Improvement Backlog** | Kanban from signal to impact, sprint integration, outcome tracking |
| **Market / Vertical Drilldown** | Market-specific health, issue patterns, recommended actions |

---

## What I would do with this in production

| This prototype | Production version |
|---------------|-------------------|
| Mock JSON data | Supabase with live conversation logs and outcome data |
| Static filter pills | Live filters tied to real-time queries |
| Weekly brief button | Scheduled Claude API call every Monday at 08:00 local time |
| Manual failure classification | Fine-tuned classifier pipeline with confidence scoring |
| Static backlog cards | Bi-directional Jira/Linear sync |
| Single view | Role-based access: Ops Lead / PM / Compliance / Engineering |
| Hardcoded thresholds | Configurable alert engine per market and use case |

The architecture is deliberately structured so that each mock data file maps directly to a Supabase table. Swapping the data layer requires changing one import per page, not rebuilding the system.

---

## Markets and verticals in the mock data

**Markets:** Estonia, Poland, Kenya, Nigeria, India, South Africa, Germany, Mexico

**Verticals:** Ride-hailing, Food Delivery, Scooter/e-bike, Driver Support, Payments/Refunds, Safety Incidents

**Issue categories:** Refund Request, Driver Cancellation, Wrong Charge, Delayed Food Order, Account Verification, Safety Complaint, Lost Item, Promo Code Issue, Payout Delay, Vehicle Unlock Issue

---

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Charts | Recharts |
| Icons | Lucide React |
| Design | Bolt brand system — Jungle Green `#34BB78`, Charade `#2C2D33` |
| Data | Mock JSON (structured for Supabase drop-in) |

---

## One thing I want to leave you with

The thing I care most about in this role is not the automation rate. It is whether customers who come to Bolt with a problem — a wrong charge, a safety concern, a driver payout that never arrived — leave the interaction feeling like the company actually handled it.

Alfred can do a lot of that at scale. But only if the ops team running Alfred is honest about where it fails, specific about why, and rigorous about measuring whether fixes actually worked.

That is what this prototype is designed to show I can do.
