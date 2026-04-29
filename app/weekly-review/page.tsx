'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, Copy, CheckCheck } from 'lucide-react';

interface ActionBriefItem {
  text: string;
  ticket?: string;
  due: string;
  impact: string;
}

interface TeamActionBrief {
  emoji: string;
  team: string;
  context: string;
  borderColor: string;
  items: ActionBriefItem[];
}

const teamActionBriefs: TeamActionBrief[] = [
  {
    emoji: '🔧',
    team: 'Engineering',
    context: 'Two P1 incidents need your immediate attention this week. Both have business and compliance risk.',
    borderColor: '#7C3AED',
    items: [
      { text: 'Ship BLG-004 (DE telemetry API root cause fix)', ticket: 'BLG-004', due: 'May 2', impact: 'Unblocks 89 conversations/week; German CSAT will recover ~0.8 points' },
      { text: 'Instrument Alfred escalation context package', ticket: 'BLG-014', due: 'May 9', impact: 'Required for handoff quality tracking' },
      { text: 'Add confidence × reopen tracking per intent/market cohort', ticket: 'BLG-013', due: 'May 16', impact: 'Enables calibration audit' },
      { text: 'KYC API in India: monitor error rate weekly, alert threshold at 3%', due: 'Ongoing', impact: 'Compliance and driver onboarding risk mitigation' },
    ],
  },
  {
    emoji: '📋',
    team: 'CS Product',
    context: 'Three decision tree updates are in sprint. Two decisions needed from you this week to unblock Engineering.',
    borderColor: '#34D399',
    items: [
      { text: 'Approve Poland refund decision tree spec', ticket: 'BLG-001', due: 'Apr 30', impact: 'Unblocks 420 PL customers/week' },
      { text: 'Write spec for ghost trip detection rule', ticket: 'BLG-006', due: 'May 5', impact: 'Engineering cannot build without CS Product rule definition' },
      { text: 'Decide escalation SLA for driver account suspensions (24h vs 48h?)', due: 'Apr 30', impact: 'Compliance and driver NPS impact' },
      { text: 'Review safety complaint P0/P1/P2 severity thresholds', due: 'May 2', impact: 'Required before Conversation Design builds MX template' },
    ],
  },
  {
    emoji: '🧠',
    team: 'ML / AI Product',
    context: 'Two classification fixes need your training data. One calibration audit to schedule.',
    borderColor: '#F59E0B',
    items: [
      { text: 'Provide 40+ training examples for wrong charge vs. promo code disambiguation', ticket: 'BLG-002', due: 'May 5', impact: 'Fixes 28 customers/week sent to wrong resolution flow' },
      { text: 'Scope confidence calibration audit by market/intent cohort', ticket: 'BLG-013', due: 'May 9', impact: 'Outputs will feed threshold tuning' },
      { text: 'Spec safety severity classifier: what signals distinguish P0 assault-adjacent from P2 behavioural complaint?', due: 'May 2', impact: 'Blocks empathy-first template rollout in Mexico' },
    ],
  },
  {
    emoji: '⚖️',
    team: 'Compliance / Legal',
    context: 'Two active regulatory risks require your review this week. Both have potential for regulatory action.',
    borderColor: '#EF4444',
    items: [
      { text: 'Assess GDPR Art. 22 exposure on Poland automated refund denials (UODO enforcement risk)', due: 'Apr 30', impact: 'Potential €20M fine exposure' },
      { text: 'Review CBN compliance: Alfred\'s automated payment dispute handling in Nigeria', due: 'May 7', impact: 'CBN can suspend fintech licenses' },
      { text: 'Confirm Kenya DPA threshold: at what dispute value does Alfred need to stop automating? (current estimate: KSh 5,000)', due: 'May 5', impact: 'Regulatory compliance clarity for KE market' },
      { text: 'Sign off on GDPR Art. 22 decision logging plan (currently 32% unlogged)', due: 'May 9', impact: 'Required for audit trail compliance' },
    ],
  },
  {
    emoji: '🗺️',
    team: 'Local Ops / KM',
    context: 'Knowledge staleness is causing measurable customer harm in two markets. Both fixes are small but urgent.',
    borderColor: '#3B82F6',
    items: [
      { text: 'Ship Nigeria payout delay knowledge article', ticket: 'BLG-003', due: 'Apr 30', impact: '47 drivers/week getting wrong timelines; CSAT impact 0.5 points' },
      { text: 'Review Kenya food delivery SLA article (62 days stale)', due: 'May 2', impact: 'Critical staleness threshold exceeded' },
      { text: 'Create knowledge update trigger process for Mexico safety escalations', due: 'May 9', impact: 'Prevents future knowledge gap windows for safety cases' },
      { text: 'Add Bolt Kenya food delivery insurance policy to Alfred knowledge', due: 'May 2', impact: '100% override rate on these queries' },
    ],
  },
];

const actionItems = [
  {
    id: 'A1',
    priority: 'P1',
    problem: 'Poland refund automation dropped 12 points due to local policy mismatch',
    evidence: '38 escalations/week ↑62% WoW. CSAT 3.1 (↓0.6). Automation 52% (↓12pp).',
    rootCause: 'Global refund logic applied — misses PL 30-min non-delivery exception',
    owner: 'CS Product',
    dueDate: 'May 5',
    status: 'In Sprint',
  },
  {
    id: 'A2',
    priority: 'P1',
    problem: 'Germany vehicle telemetry API instability causing 12.4% error rate',
    evidence: '89 affected conversations. Avg resolution 28 min vs 4.4 min normal. CSAT 2.1.',
    rootCause: 'Telemetry API degraded Monday. No timeout fallback deployed initially.',
    owner: 'Engineering',
    dueDate: 'May 2',
    status: 'In Sprint',
  },
  {
    id: 'A3',
    priority: 'P1',
    problem: 'Nigeria driver payout knowledge gap — 47 driver escalations/week',
    evidence: 'Escalation rate 42.6%, repeat contact 62%. Alfred giving wrong 1-3 day timeline.',
    rootCause: 'NG partner bank adds 2-4 days not reflected in knowledge base',
    owner: 'Local Ops / KM',
    dueDate: 'Apr 30',
    status: 'In Sprint',
  },
  {
    id: 'A4',
    priority: 'P0',
    problem: 'Safety complaints in Mexico receiving cold, bureaucratic responses',
    evidence: 'INC-2841 — P0 safety incident handled without empathy SLA or human handoff.',
    rootCause: 'No P0 severity classifier for safety intent. Single safety_report bucket.',
    owner: 'Trust & Safety / CS Product',
    dueDate: 'Apr 28',
    status: 'In Progress',
  },
  {
    id: 'A5',
    priority: 'P1',
    problem: 'Ghost trip fraud pattern not detected in Nigeria',
    evidence: '12 confirmed ghost trips. 100% escalation. ~₦28,800 wrongly denied refunds.',
    rootCause: 'Alfred trusts driver GPS arrival without checking rider proximity (<500m)',
    owner: 'Risk / Engineering',
    dueDate: 'May 19',
    status: 'Validated Issue',
  },
];

const decisionLog = [
  {
    decision: 'Safety complaints in Mexico now route to empathy-first template',
    rationale: 'INC-2841 showed P0 safety event handled with cold SLA message. Conversation Design briefed. Pending full template deploy in Sprint 25.',
    owner: 'Trust & Safety',
    date: 'Apr 27',
  },
  {
    decision: 'Poland refund automation restricted pending BLG-001 fix',
    rationale: 'CS Product flagged PL automation rate drop. Decision to not expand automation in PL until logic mismatch resolved.',
    owner: 'CS Product',
    date: 'Apr 25',
  },
  {
    decision: 'Germany vehicle unlock automation paused at current coverage (54%)',
    rationale: 'API error rate 12.4% makes expansion unsafe. Engineering working root cause. Interim timeout fallback shipped.',
    owner: 'Engineering',
    date: 'Apr 24',
  },
  {
    decision: 'Estonia promo code automation approved for Sprint 26 expansion',
    rationale: 'CSAT 4.2, reopen 6.1%, agent override 3.1%. All signals green for adding 3 new promo types.',
    owner: 'CS Product',
    date: 'Apr 22',
  },
  {
    decision: 'Weekly AI Ops review format changed — market drilldowns moved to async doc',
    rationale: 'Meeting time spent on Poland/Germany root causes. Market summaries now pre-read document.',
    owner: 'AI Ops Lead',
    date: 'Apr 22',
  },
];

const crossFuncDeps = [
  { team: 'Engineering', count: 4, items: ['BLG-004 (DE vehicle API)', 'BLG-006 (ghost trip signal)', 'BLG-007 (API timeout fallback)', 'KYC API SLA monitoring'] },
  { team: 'CS Ops', count: 2, items: ['Poland interim manual override briefing', 'Lost item escalation path documentation'] },
  { team: 'Compliance', count: 1, items: ['EU consumer protection review for PL refund denials'] },
  { team: 'Local Ops', count: 3, items: ['Nigeria payout knowledge article (BLG-003)', 'Mexico empathy template localization', 'Nigeria English register update (BLG-011)'] },
  { team: 'Product', count: 3, items: ['Classification fix for wrong charge/promo (BLG-002)', 'Kenya delay refund trigger (BLG-008)', 'Safety P0 severity routing'] },
];

const metricChanges = [
  { label: 'Trusted Auto Score', val: 67.3, change: -1.8, good: false },
  { label: 'Escalation Rate', val: 18.3, change: 1.8, suffix: '%', good: false, invert: true },
  { label: 'CSAT', val: 3.8, change: -0.2, good: false },
  { label: 'Automation Rate', val: 71.4, change: -2.1, suffix: '%', good: false },
  { label: 'Reopen Rate', val: 11.4, change: 1.2, suffix: '%', good: false, invert: true },
  { label: 'Override Rate', val: 9.1, change: 0.7, suffix: '%', good: false, invert: true },
];

const severityStyles: Record<string, { bg: string; color: string }> = {
  P0: { bg: '#2C2D33', color: '#fff' },
  P1: { bg: 'var(--red-50)', color: 'var(--red)' },
  P2: { bg: 'var(--amber-50)', color: '#b96c00' },
  P3: { bg: 'var(--blue-50)', color: 'var(--blue)' },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  'In Sprint': { bg: 'var(--bolt-green-50)', color: 'var(--bolt-green-700)' },
  'In Progress': { bg: 'var(--blue-50)', color: 'var(--blue)' },
  'Validated Issue': { bg: 'var(--amber-50)', color: '#b96c00' },
  'Open': { bg: 'var(--red-50)', color: 'var(--red)' },
};

const briefText = `Alfred Health: 67.3/100 (↓1.8 WoW)

TOP RISK: Refund automation dropped 12 points in Poland due to local policy mismatch. Escalation rate rose to 27.8% (+11.4pp). CSAT fell to 3.1 (↓0.6). BLG-001 is in sprint and expected to restore performance by May 5.

WINS: Estonia remains the highest-performing market at 84/100 health. Driver cancellation automation expanded in India (+8pp coverage).

TOP 3 PRIORITIES:
1. P1 — Poland refund logic fix (CS Product, due May 5)
2. P1 — Germany vehicle API stability (Engineering, due May 2)
3. P1 — Nigeria payout knowledge update (Local Ops, due Apr 30)

DECISION MADE: Safety complaints in Mexico now route to empathy-first template pending Conversation Design update.

WATCH NEXT WEEK: PL escalation rate, DE tool error rate, NG driver payout CSAT.`;

export default function WeeklyReviewPage() {
  const [expandedDep, setExpandedDep] = useState<string | null>(null);
  const [showBrief, setShowBrief] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedBrief, setExpandedBrief] = useState<string>('Engineering');

  function handleCopy() {
    navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const healthScore = 67.3;
  const healthColor = healthScore >= 75 ? 'var(--bolt-green)' : healthScore >= 60 ? 'var(--amber)' : 'var(--red)';

  return (
    <AppShell>
      <div style={{ maxWidth: 1100 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Weekly Ops Review
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Week of Apr 22–28, 2026 · Structured review for cross-functional leadership
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, marginBottom: 24 }}>
          {/* Health score card */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
            }}
          >
            <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
              Alfred Health Score
            </div>
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: healthColor,
                letterSpacing: '-0.05em',
                lineHeight: 1,
              }}
            >
              {healthScore}
            </div>
            <div style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 500, marginTop: 4 }}>/100</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 14,
                padding: '4px 10px',
                borderRadius: 20,
                background: 'var(--red-50)',
                color: 'var(--red)',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <ArrowDownRight size={13} /> 1.8 WoW
            </div>
            <div
              style={{
                marginTop: 16,
                padding: '6px 12px',
                borderRadius: 8,
                background: 'var(--amber-50)',
                color: '#b96c00',
                fontSize: 12,
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              ⚠ Needs Attention
            </div>
          </div>

          {/* Metric changes */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              padding: '20px',
              boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em', marginBottom: 14 }}>
              This Week's Movement
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {metricChanges.map(({ label, val, change, suffix = '', invert }) => {
                const isGood = invert ? change < 0 : change > 0;
                const isUp = change > 0;
                return (
                  <div
                    key={label}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      background: 'var(--athens-gray)',
                      border: '1px solid var(--line)',
                    }}
                  >
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--charade)', letterSpacing: '-0.03em' }}>
                      {val}{suffix}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        marginTop: 4,
                        fontSize: 12,
                        fontWeight: 700,
                        color: isGood ? 'var(--bolt-green-700)' : 'var(--red)',
                      }}
                    >
                      {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {change > 0 ? '+' : ''}{change} WoW
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action items */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: '20px',
            marginBottom: 16,
            boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Top 5 Action Items
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {actionItems.map((item, idx) => {
              const sev = severityStyles[item.priority] ?? severityStyles.P3;
              const st = statusColors[item.status] ?? statusColors.Open;
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 10,
                    border: '1px solid var(--line)',
                    background: 'var(--surface-2)',
                    display: 'flex',
                    gap: 14,
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'var(--charade)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.015em', marginBottom: 4 }}>
                      {item.problem}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>
                      <strong>Evidence:</strong> {item.evidence}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      <strong>Root cause:</strong> {item.rootCause}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', flexShrink: 0 }}>
                    <span style={{ padding: '2px 7px', borderRadius: 5, background: sev.bg, color: sev.color, fontSize: 11, fontWeight: 700 }}>
                      {item.priority}
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: 20, background: st.bg, color: st.color, fontSize: 11, fontWeight: 600 }}>
                      {item.status}
                    </span>
                    <div style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {item.owner} · Due {item.dueDate}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Decision log */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              padding: '20px',
              boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em', marginBottom: 16 }}>
              Decision Log
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {decisionLog.map((d, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'var(--athens-gray)',
                    border: '1px solid var(--line)',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.01em', marginBottom: 4 }}>
                    {d.decision}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{d.rationale}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 6 }}>
                    {d.owner} · {d.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-functional deps */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              padding: '20px',
              boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em', marginBottom: 16 }}>
              Cross-functional Dependencies
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {crossFuncDeps.map((dep) => {
                const isExpanded = expandedDep === dep.team;
                return (
                  <div key={dep.team} style={{ border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
                    <button
                      onClick={() => setExpandedDep(isExpanded ? null : dep.team)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: isExpanded ? 'var(--bolt-green-50)' : 'var(--athens-gray)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--charade)', letterSpacing: '-0.01em' }}>
                          {dep.team}
                        </span>
                        <span
                          style={{
                            padding: '1px 7px',
                            borderRadius: 20,
                            background: 'var(--charade)',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {dep.count} items
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp size={14} color="var(--muted)" /> : <ChevronDown size={14} color="var(--muted)" />}
                    </button>
                    {isExpanded && (
                      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--line)', background: 'var(--surface)' }}>
                        {dep.items.map((item) => (
                          <div key={item} style={{ fontSize: 12, color: 'var(--muted)', padding: '4px 0', display: 'flex', gap: 6 }}>
                            <span style={{ color: 'var(--bolt-green)' }}>·</span> {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Team Action Briefs */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Team Action Briefs — Week of Apr 28
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
            Specific actions needed from each team this week. Expand to see details.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {teamActionBriefs.map((brief) => {
              const isOpen = expandedBrief === brief.team;
              return (
                <div
                  key={brief.team}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderLeft: `4px solid ${brief.borderColor}`,
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
                  }}
                >
                  <button
                    onClick={() => setExpandedBrief(isOpen ? '' : brief.team)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      background: isOpen ? 'var(--athens-gray)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, textAlign: 'left' }}>
                      <span style={{ fontSize: 16 }}>{brief.emoji}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.01em' }}>
                          {brief.team}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
                          {brief.context}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span
                        style={{
                          padding: '1px 8px',
                          borderRadius: 20,
                          background: 'var(--charade)',
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {brief.items.length} actions
                      </span>
                      {isOpen ? <ChevronUp size={14} color="var(--muted)" /> : <ChevronDown size={14} color="var(--muted)" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '12px 18px 16px', borderTop: '1px solid var(--line)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {brief.items.map((item, i) => (
                          <div
                            key={i}
                            style={{
                              display: 'flex',
                              gap: 12,
                              alignItems: 'flex-start',
                              padding: '10px 12px',
                              borderRadius: 8,
                              background: 'var(--athens-gray)',
                              border: '1px solid var(--line)',
                            }}
                          >
                            <span style={{ fontSize: 14, color: 'var(--muted)', flexShrink: 0, marginTop: 1 }}>☐</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--charade)', letterSpacing: '-0.01em', marginBottom: 4 }}>
                                {item.text}
                                {item.ticket && (
                                  <span
                                    style={{
                                      marginLeft: 6,
                                      padding: '1px 6px',
                                      borderRadius: 4,
                                      background: 'var(--line)',
                                      color: 'var(--muted)',
                                      fontSize: 10,
                                      fontWeight: 600,
                                      fontFamily: 'JetBrains Mono, monospace',
                                    }}
                                  >
                                    {item.ticket}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
                                {item.impact}
                              </div>
                            </div>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: 20,
                                background: item.due === 'Ongoing' ? 'var(--blue-50)' : 'var(--amber-50)',
                                color: item.due === 'Ongoing' ? 'var(--blue)' : '#92400E',
                                fontSize: 10,
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                              }}
                            >
                              {item.due === 'Ongoing' ? item.due : `Due ${item.due}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Generate weekly brief */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: '20px',
            boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showBrief ? 16 : 0 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em' }}>
                Weekly Brief
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                Formatted summary ready to paste into Slack or email
              </div>
            </div>
            <button
              onClick={() => setShowBrief(!showBrief)}
              style={{
                padding: '8px 20px',
                borderRadius: 10,
                border: 'none',
                background: 'var(--bolt-green)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
              }}
            >
              {showBrief ? 'Hide Brief' : 'Generate Weekly Brief'}
            </button>
          </div>
          {showBrief && (
            <div
              style={{
                background: 'var(--charade)',
                borderRadius: 12,
                padding: '20px 22px',
                position: 'relative',
              }}
            >
              <button
                onClick={handleCopy}
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  padding: '5px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <pre
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                }}
              >
                {briefText}
              </pre>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
