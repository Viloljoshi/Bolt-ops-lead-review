'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import conversations from '@/data/conversations.json';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';

const latentRiskStyles: Record<string, { bg: string; color: string }> = {
  Low: { bg: 'var(--bolt-green-50)', color: 'var(--bolt-green-700)' },
  Medium: { bg: 'var(--amber-50)', color: '#b96c00' },
  High: { bg: 'var(--red-50)', color: 'var(--red)' },
  Critical: { bg: '#2C2D33', color: '#fff' },
};

const failureModeLibrary = [
  {
    name: 'Knowledge Gap',
    dangerous: 'Alfred answers confidently from stale or missing knowledge. Classic support failure — easy to detect from override rate.',
    signal: 'High override rate in a specific category. Agents routinely rewriting the same section of Alfred responses.',
    owner: 'KM / Local Ops',
    risk: 'High',
    borderColor: 'var(--blue)',
  },
  {
    name: 'Classification Error',
    dangerous: 'Wrong intent detected, wrong resolution applied. Everything downstream is wrong even if individually correct.',
    signal: 'High escalation rate despite low API/logic errors. Customers saying "that\'s not what I asked".',
    owner: 'ML / AI Product',
    risk: 'High',
    borderColor: 'var(--amber)',
  },
  {
    name: 'Logic Fault',
    dangerous: 'Decision tree applies wrong policy branch. Confidence is high. Customer gets wrong answer confidently delivered.',
    signal: 'Policy override rate. Agent changing decision (not just tone). Reopen rate spike in a specific category.',
    owner: 'CS Product',
    risk: 'High',
    borderColor: 'var(--red)',
  },
  {
    name: 'Tool API Failure',
    dangerous: 'External API times out or errors. Alfred has no fallback — customer gets a dead wait or generic error.',
    signal: 'Tool error rate in logs. Dead wait time spikes. CSAT collapse in a specific market/vertical.',
    owner: 'Engineering',
    risk: 'Medium',
    borderColor: 'var(--violet)',
  },
  {
    name: 'UX Tone',
    dangerous: 'Factually correct answer delivered with wrong emotional register. Customer feels dismissed even when helped.',
    signal: 'Low CSAT on technically resolved cases. High "rewrite wording only" override rate from agents.',
    owner: 'Conversation Design',
    risk: 'Medium',
    borderColor: '#22c55e',
  },
  {
    name: 'Compliance Blocker',
    dangerous: 'Alfred automates something it should not. Legal, financial, or safety case resolved without required human review.',
    signal: 'Compliance audit flags. Legal team escalations. High-value payment disputes auto-resolved.',
    owner: 'Legal / CS Product',
    risk: 'Critical',
    borderColor: '#7a0000',
  },
  {
    name: 'Over-automation',
    dangerous: 'Alfred resolves cases it should not touch — sensitive situations, cultural nuance, edge cases requiring judgment.',
    signal: 'High CSAT variance in automated cohort. P0 cases without human review. Safety/fraud cases auto-closed.',
    owner: 'AI Ops Lead',
    risk: 'Critical',
    borderColor: '#5B21B6',
  },
  {
    name: 'Confidence Calibration Drift',
    dangerous: 'Alfred reports high confidence but is wrong at elevated rates in specific cohorts. CSAT looks normal in aggregate — only visible when you cross-tab confidence against reopen rate by market/intent.',
    signal: 'Confidence >0.8 but reopen rate >20% in same cohort. MX Safety P0: 0.77 confidence on cases requiring immediate human escalation.',
    owner: 'ML / AI Product',
    risk: 'Critical',
    borderColor: '#dc2626',
  },
  {
    name: 'Cross-market Policy Bleed',
    dangerous: 'Policy logic learned from dominant markets (typically Estonia/EU) bleeds into markets where local rules are fundamentally different. Alfred is confidently wrong — high automation rate, high confidence, systematically wrong for local market.',
    signal: 'Market-specific escalation spike despite global metrics being stable. Agent override clusters by market. NG/PL patterns diverging from EE baseline.',
    owner: 'Local Ops + CS Product',
    risk: 'High',
    borderColor: '#ea580c',
  },
  {
    name: 'Handoff Quality Degradation',
    dangerous: 'Alfred escalates cases but the handoff is broken — human agent receives incomplete context, wrong intent classification, or misleading summary. Alfred marks itself "escalated successfully." Invisible in standard dashboards.',
    signal: 'Long handle time on escalated cases. CSAT on escalated cases lower than Alfred-resolved cases. Agent reopens escalated ticket. Customer repeating themselves.',
    owner: 'CS Product / Engineering / CS Ops',
    risk: 'High',
    borderColor: '#7c3aed',
  },
  {
    name: 'Temporal Knowledge Staleness',
    dangerous: 'Every time Bolt changes pricing, adds a feature, or updates a policy, Alfred has a window of hours to weeks where it gives confidently wrong answers. No SLA between "product ships change" and "Alfred knows about change."',
    signal: 'Spike in a specific category after a product launch. Override rate spikes immediately after product/policy change. New intent categories appearing in unclassified bucket.',
    owner: 'KM + Product Ops',
    risk: 'High',
    borderColor: '#0284c7',
  },
  {
    name: 'Emotional State Blindness',
    dangerous: 'Alfred gives the same information-dense, policy-accurate response to a scared customer and a curious one. Factual content is correct; emotional register is wrong. Does not show up in resolution rate at all.',
    signal: 'CSAT <3 on cases where resolution is technically correct and confidence >0.8. High "override just to change tone" rate. Driver suspension cases with CSAT 1-2.',
    owner: 'Conversation Design',
    risk: 'Medium',
    borderColor: '#0891b2',
  },
  {
    name: 'Adversarial Pattern Exploitation',
    dangerous: 'Heavy users, repeat refund claimers, or driver fraud rings have learned Alfred\'s patterns. They phrase requests to reliably trigger automatic refund or bypass fraud checks. Alfred has no cross-session memory.',
    signal: 'Refund rate per user >3x average. Same claim phrasing across multiple incidents from one user. High automation rate + rising fraud loss rate.',
    owner: 'Risk / Trust & Safety',
    risk: 'Critical',
    borderColor: '#be123c',
  },
  {
    name: 'Silent Degradation (Hollow Resolution)',
    dangerous: 'Automation rate looks healthy, but quality of "resolved" cases is hollowing out. Customers who would have pushed back just give up. Lower reopen rate does not equal better outcomes — some customers just stop using the product.',
    signal: 'Automation rate stable or rising + CSAT flat + NPS declining + repeat usage declining among support-contacted users. Churn spike traceable to poor Alfred interactions 6-8 weeks prior.',
    owner: 'AI Ops Lead + Growth / Analytics',
    risk: 'Critical',
    borderColor: '#475569',
  },
  {
    name: 'Driver vs. Rider Persona Confusion',
    dangerous: 'Alfred serves both sides of Bolt\'s marketplace through the same interface. When persona detection fails, wrong policy set is applied. Intent classification is technically correct but resolution logic is wrong. Confidence is high. The error is in a layer nobody is monitoring.',
    signal: 'Cross-persona override rate. Cases where agent changes entire resolution direction (not just tone). Customer explicitly correcting Alfred\'s persona assumption in conversation.',
    owner: 'CS Product / ML',
    risk: 'High',
    borderColor: '#b45309',
  },
];

const failureTypeColors: Record<string, { bg: string; color: string; border: string }> = {
  'Logic Fault': { bg: 'var(--red-50)', color: 'var(--red)', border: '#f5b8ba' },
  'Classification Error': { bg: 'var(--amber-50)', color: '#b96c00', border: '#f8d8a0' },
  'Knowledge Gap': { bg: 'var(--blue-50)', color: 'var(--blue)', border: '#b3cef7' },
  'Tool API Failure': { bg: 'var(--violet-50)', color: 'var(--violet)', border: '#c8b8fc' },
  'UX Tone': { bg: 'var(--bolt-green-50)', color: 'var(--bolt-green-700)', border: 'var(--bolt-mint)' },
  'Compliance Blocker': { bg: '#FFF0F0', color: '#8B0000', border: '#fbb' },
  'Over-automation': { bg: '#F5F0FF', color: '#5B21B6', border: '#d8c9ff' },
};

const severityStyles: Record<string, { bg: string; color: string }> = {
  P0: { bg: '#2C2D33', color: '#fff' },
  P1: { bg: 'var(--red-50)', color: 'var(--red)' },
  P2: { bg: 'var(--amber-50)', color: '#b96c00' },
  P3: { bg: 'var(--blue-50)', color: 'var(--blue)' },
};

const topPatterns = [
  {
    pattern: 'Vehicle unlock API timeout — Germany',
    volume: 89,
    markets: ['🇩🇪 DE'],
    severity: 'P1',
    type: 'Tool API Failure',
    action: 'Add 8s timeout + fallback; fix telemetry API root cause',
    owner: 'Engineering',
    weeklyImpact: '89 customers stranded mid-journey. Avg 28 min resolution vs 4.4 min normal. CSAT 2.1.',
    businessRisk: 'Operational: 89 × lost trip revenue. Reputational: social media spike risk.',
  },
  {
    pattern: 'Driver payout knowledge gap — Nigeria',
    volume: 47,
    markets: ['🇳🇬 NG'],
    severity: 'P1',
    type: 'Knowledge Gap',
    action: 'Create NG-specific payout timeline knowledge article',
    owner: 'Local Ops / KM',
    weeklyImpact: '47 drivers/week with false payment expectations. 2.4 avg re-contacts per driver.',
    businessRisk: 'Driver NPS risk. Regulatory: CBN may interpret repeated payout friction as systemic failure.',
  },
  {
    pattern: 'Refund logic mismatch — Poland',
    volume: 38,
    markets: ['🇵🇱 PL'],
    severity: 'P1',
    type: 'Logic Fault',
    action: 'Update refund decision tree with PL local exception',
    owner: 'CS Product',
    weeklyImpact: '420 refund conversations/week. 38% wrongly denied. EU consumer protection exposure.',
    businessRisk: 'Legal: UODO enforcement risk (GDPR). Financial: ~€18K/week in contested refunds.',
  },
  {
    pattern: 'Wrong charge intent confusion — India',
    volume: 28,
    markets: ['🇮🇳 IN'],
    severity: 'P1',
    type: 'Classification Error',
    action: 'Add disambiguation for duplicate charge vs promo code',
    owner: 'ML / AI Product',
    weeklyImpact: '28 customers/week sent to wrong resolution flow. 38% immediately escalate.',
    businessRisk: 'Financial: delayed resolution increases churn risk among payment-sensitive rider segment.',
  },
  {
    pattern: 'Safety complaint tone failure — Mexico',
    volume: 28,
    markets: ['🇲🇽 MX'],
    severity: 'P2',
    type: 'UX Tone',
    action: 'Build empathy-first safety response template',
    owner: 'Conversation Design',
    weeklyImpact: '28 customers who felt unsafe receive robotic response. 61% require agent rewrite.',
    businessRisk: 'Brand/Legal: cold safety responses create reputational and liability risk if incidents escalate to media.',
  },
  {
    pattern: 'Ghost trip fraud not detected — Nigeria',
    volume: 12,
    markets: ['🇳🇬 NG'],
    severity: 'P1',
    type: 'Logic Fault',
    action: 'Add rider-driver proximity check at pickup event',
    owner: 'Risk / Engineering',
    weeklyImpact: '12 confirmed ghost trips. 100% escalation. ~₦28,800 wrongly denied refunds.',
    businessRisk: 'Financial: fraud loss. Driver fraud ring exploitation risk if pattern not closed.',
  },
  {
    pattern: 'Lost item escalation path missing — South Africa',
    volume: 38,
    markets: ['🇿🇦 ZA'],
    severity: 'P3',
    type: 'Knowledge Gap',
    action: 'Add 2hr escalation gate when courier unresponsive',
    owner: 'CS Ops / KM',
    weeklyImpact: '38 customers/week with no resolution path for lost items after courier non-response.',
    businessRisk: 'Customer churn in ZA food delivery vertical. CSAT decline risk.',
  },
];

const failureDistribution = [
  { type: 'Tool API Failure', count: 89, pct: 32 },
  { type: 'Knowledge Gap', count: 85, pct: 31 },
  { type: 'Logic Fault', count: 50, pct: 18 },
  { type: 'Classification Error', count: 28, pct: 10 },
  { type: 'UX Tone', count: 28, pct: 10 },
  { type: 'Compliance Blocker', count: 5, pct: 2 },
];

const failureTypes = ['All', 'Logic Fault', 'Classification Error', 'Knowledge Gap', 'Tool API Failure', 'UX Tone'];
const markets = ['All', 'Poland', 'India', 'Nigeria', 'Germany', 'Mexico', 'Kenya', 'Estonia', 'South Africa'];
const severities = ['All', 'P0', 'P1', 'P2', 'P3'];

export default function DiagnosisPage() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('All');
  const [filterMarket, setFilterMarket] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [escalatedOnly, setEscalatedOnly] = useState(false);
  const [expandedMode, setExpandedMode] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(true);

  const filtered = conversations.filter((c) => {
    if (filterType !== 'All' && c.failure_type !== filterType) return false;
    if (filterMarket !== 'All' && c.market !== filterMarket) return false;
    if (filterSeverity !== 'All' && c.severity !== filterSeverity) return false;
    if (escalatedOnly && !c.escalated) return false;
    return true;
  });

  return (
    <AppShell>
      <div style={{ maxWidth: 1200 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Failure Diagnosis Center
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Classify and triage every AI failure type. Surface root causes and drive fixes.
          </p>
        </div>

        {/* Failure type distribution */}
        <div className="r-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              padding: '20px 20px 12px',
              boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em', marginBottom: 16 }}>
              Failure Type Distribution
            </div>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={failureDistribution} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="type" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip formatter={(v) => [`${v} cases`, 'Volume']} />
                  <Bar dataKey="count" fill="var(--bolt-green)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary chips */}
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
              This Week at a Glance
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {failureDistribution.map(({ type, count, pct }) => {
                const s = failureTypeColors[type] ?? { bg: 'var(--bolt-green-50)', color: 'var(--bolt-green)', border: 'var(--bolt-mint)' };
                return (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        padding: '2px 10px',
                        borderRadius: 20,
                        background: s.bg,
                        color: s.color,
                        fontSize: 12,
                        fontWeight: 600,
                        minWidth: 140,
                      }}
                    >
                      {type}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 6,
                        background: 'var(--line)',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: s.color,
                          borderRadius: 3,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--charade)', minWidth: 48, textAlign: 'right' }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top patterns table */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: '20px',
            marginBottom: 24,
            boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Top Failure Patterns
          </div>
          <div className="r-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Pattern', 'Volume', 'Markets', 'Severity', 'Type', 'Recommended Action', 'Owner', 'Weekly Impact', 'Business Risk'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--muted)',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      padding: '6px 10px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topPatterns.map((p) => {
                const sev = severityStyles[p.severity] ?? severityStyles.P3;
                const ft = failureTypeColors[p.type] ?? { bg: 'var(--bolt-green-50)', color: 'var(--bolt-green)', border: '' };
                return (
                  <tr key={p.pattern} style={{ borderBottom: '1px solid var(--line-soft)' }}>
                    <td style={{ padding: '10px 10px', fontSize: 13, fontWeight: 600, color: 'var(--charade)' }}>
                      {p.pattern}
                    </td>
                    <td style={{ padding: '10px', fontSize: 13, fontWeight: 700, color: 'var(--charade)' }}>
                      {p.volume}
                    </td>
                    <td style={{ padding: '10px', fontSize: 13, color: 'var(--charade)' }}>
                      {p.markets.join(', ')}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span
                        style={{
                          padding: '2px 7px',
                          borderRadius: 5,
                          background: sev.bg,
                          color: sev.color,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {p.severity}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 20,
                          background: ft.bg,
                          color: ft.color,
                          fontSize: 11,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {p.type}
                      </span>
                    </td>
                    <td style={{ padding: '10px', fontSize: 12, color: 'var(--muted)', maxWidth: 200 }}>
                      {p.action}
                    </td>
                    <td style={{ padding: '10px', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {p.owner}
                    </td>
                    <td style={{ padding: '10px', fontSize: 11, color: 'var(--charade)', maxWidth: 200 }}>
                      <div style={{ padding: '5px 8px', background: 'var(--amber-50)', borderRadius: 6, lineHeight: 1.5 }}>
                        {p.weeklyImpact}
                      </div>
                    </td>
                    <td style={{ padding: '10px', fontSize: 11, color: 'var(--charade)', maxWidth: 200 }}>
                      <div style={{ padding: '5px 8px', background: 'var(--red-50)', borderRadius: 6, lineHeight: 1.5 }}>
                        {p.businessRisk}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>

        {/* Failure Mode Quick Reference */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: '20px',
            marginBottom: 24,
            boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em' }}>
              Failure Mode Quick Reference
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
              Which failure modes are silent killers vs. noisy but obvious. Silent killers require proactive monitoring — they won&apos;t surface in dashboards until damage is done.
            </div>
          </div>
          <div className="r-table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr>
                  {['Failure Mode', 'Detects Early?', 'Visible in Std Metrics?', 'Primary Owner', 'Sprint Urgency'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        fontSize: 10,
                        fontWeight: 700,
                        color: 'var(--muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        padding: '5px 10px',
                        borderBottom: '1px solid var(--line)',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Knowledge Gap', detects: 'Yes', visible: 'Yes', owner: 'KM / Local Ops', urgency: 'P2', silent: false },
                  { name: 'Classification Error', detects: 'Yes', visible: 'Partially', owner: 'ML / AI Product', urgency: 'P1', silent: false },
                  { name: 'Logic Fault', detects: 'Sometimes', visible: 'Sometimes', owner: 'CS Product', urgency: 'P1', silent: false },
                  { name: 'Tool API Failure', detects: 'Yes', visible: 'Yes', owner: 'Engineering', urgency: 'P1', silent: false },
                  { name: 'UX Tone', detects: 'Late', visible: 'No', owner: 'Conversation Design', urgency: 'P2', silent: false },
                  { name: 'Compliance Blocker', detects: 'Yes', visible: 'Partially', owner: 'Compliance', urgency: 'P0', silent: false },
                  { name: 'Over-automation', detects: 'Late', visible: 'No', owner: 'CS Product / Risk', urgency: 'P1', silent: false },
                  { name: 'Confidence Calibration Drift', detects: 'Never', visible: 'No', owner: 'ML / AI Product', urgency: 'P1', silent: true },
                  { name: 'Cross-market Policy Bleed', detects: 'Late', visible: 'No', owner: 'Local Ops / CS Product', urgency: 'P1', silent: true },
                  { name: 'Handoff Quality Degradation', detects: 'Late', visible: 'No', owner: 'CS Ops', urgency: 'P2', silent: true },
                  { name: 'Temporal Knowledge Staleness', detects: 'Never', visible: 'No', owner: 'KM / Product Ops', urgency: 'P1', silent: true },
                  { name: 'Emotional State Blindness', detects: 'Never', visible: 'No', owner: 'Conversation Design', urgency: 'P2', silent: true },
                  { name: 'Adversarial Pattern Exploitation', detects: 'Never', visible: 'No', owner: 'Risk / Trust & Safety', urgency: 'P1', silent: true },
                  { name: 'Silent Degradation (Hollow Resolution)', detects: 'Never', visible: 'No', owner: 'AI Ops Lead', urgency: 'P1', silent: true },
                  { name: 'Driver vs Rider Persona Confusion', detects: 'Late', visible: 'No', owner: 'CS Product', urgency: 'P2', silent: true },
                ].map((row) => {
                  const urgencyStyle = severityStyles[row.urgency] ?? severityStyles.P3;
                  const detectsColor = row.detects === 'Yes' ? 'var(--bolt-green-700)' : row.detects === 'Never' ? 'var(--red)' : '#b96c00';
                  const visibleColor = row.visible === 'Yes' ? 'var(--bolt-green-700)' : row.visible === 'No' ? 'var(--red)' : '#b96c00';
                  return (
                    <tr
                      key={row.name}
                      style={{
                        borderBottom: '1px solid var(--line-soft)',
                        background: row.silent ? 'rgba(239,68,68,0.03)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {row.silent && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '1px 6px',
                                borderRadius: 4,
                                background: '#FEE2E2',
                                color: '#991B1B',
                                fontSize: 9,
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                              }}
                            >
                              🔴 SILENT KILLER
                            </span>
                          )}
                          <span style={{ fontSize: 12, fontWeight: row.silent ? 700 : 500, color: 'var(--charade)' }}>
                            {row.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '8px 10px', fontSize: 11, fontWeight: 600, color: detectsColor }}>{row.detects}</td>
                      <td style={{ padding: '8px 10px', fontSize: 11, fontWeight: 600, color: visibleColor }}>{row.visible}</td>
                      <td style={{ padding: '8px 10px', fontSize: 11, color: 'var(--muted)' }}>{row.owner}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <span style={{ padding: '2px 7px', borderRadius: 5, background: urgencyStyle.bg, color: urgencyStyle.color, fontSize: 11, fontWeight: 700 }}>
                          {row.urgency}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Failure Mode Intelligence Library */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            marginBottom: 24,
            boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setLibraryOpen(!libraryOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 20px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderBottom: libraryOpen ? '1px solid var(--line)' : 'none',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em' }}>
                Failure Mode Intelligence Library — 15 recognized failure patterns
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                Beyond the obvious. These are the failure modes that don&apos;t show up in standard dashboards until they&apos;re already causing damage.
              </div>
            </div>
            {libraryOpen ? <ChevronUp size={16} color="var(--muted)" /> : <ChevronDown size={16} color="var(--muted)" />}
          </button>

          {libraryOpen && (
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {failureModeLibrary.map((mode) => {
                const isExpanded = expandedMode === mode.name;
                const riskStyle = latentRiskStyles[mode.risk] ?? latentRiskStyles.Medium;
                return (
                  <div
                    key={mode.name}
                    style={{
                      border: '1px solid var(--line)',
                      borderLeft: `3px solid ${mode.borderColor}`,
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() => setExpandedMode(isExpanded ? null : mode.name)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: isExpanded ? 'var(--athens-gray)' : 'var(--surface)',
                        border: 'none',
                        cursor: 'pointer',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.01em', textAlign: 'left' }}>
                          {mode.name}
                        </span>
                        <span
                          style={{
                            padding: '1px 7px',
                            borderRadius: 20,
                            background: riskStyle.bg,
                            color: riskStyle.color,
                            fontSize: 10,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {mode.risk} Risk
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'left', flex: 1 }}>
                          {mode.dangerous.substring(0, 80)}…
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: 'var(--muted-2)', background: 'var(--athens-gray)', padding: '2px 8px', borderRadius: 20, border: '1px solid var(--line)' }}>
                          {mode.owner}
                        </span>
                        {isExpanded ? <ChevronUp size={14} color="var(--muted)" /> : <ChevronDown size={14} color="var(--muted)" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div style={{ padding: '12px 16px', background: 'var(--athens-gray)', borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Why it&apos;s dangerous</div>
                          <div style={{ fontSize: 12, color: 'var(--charade)', lineHeight: 1.6 }}>{mode.dangerous}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Bolt-specific signal to watch</div>
                          <div style={{ fontSize: 12, color: 'var(--charade)', lineHeight: 1.6, padding: '8px 10px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--line)' }}>{mode.signal}</div>
                          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>Typical owner: <strong style={{ color: 'var(--charade)' }}>{mode.owner}</strong></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Conversation table with filters */}
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
            Conversation Log
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { label: 'Type', options: failureTypes, value: filterType, setter: setFilterType },
              { label: 'Market', options: markets, value: filterMarket, setter: setFilterMarket },
              { label: 'Severity', options: severities, value: filterSeverity, setter: setFilterSeverity },
            ].map(({ label, options, value, setter }) => (
              <select
                key={label}
                value={value}
                onChange={(e) => setter(e.target.value)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                  fontSize: 12,
                  color: 'var(--charade)',
                  background: 'var(--surface)',
                  cursor: 'pointer',
                }}
              >
                {options.map((o) => <option key={o} value={o}>{label}: {o}</option>)}
              </select>
            ))}
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={escalatedOnly}
                onChange={(e) => setEscalatedOnly(e.target.checked)}
                style={{ accentColor: 'var(--bolt-green)' }}
              />
              Escalated only
            </label>
            <span style={{ fontSize: 12, color: 'var(--muted-2)', marginLeft: 'auto' }}>
              {filtered.length} conversations
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['ID', 'Market', 'Category', 'Conf.', 'Failure Type', 'Sev.', 'Escalated', 'CSAT', 'Override'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--muted)',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      padding: '6px 8px',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const isExpanded = expandedRow === c.id;
                const ft = c.failure_type ? failureTypeColors[c.failure_type] : null;
                const sev = c.severity ? severityStyles[c.severity] : null;
                return (
                  <>
                    <tr
                      key={c.id}
                      onClick={() => setExpandedRow(isExpanded ? null : c.id)}
                      style={{
                        cursor: 'pointer',
                        borderBottom: isExpanded ? 'none' : '1px solid var(--line-soft)',
                        background: isExpanded ? 'var(--athens-gray)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '10px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          {isExpanded ? <ChevronUp size={12} color="var(--muted)" /> : <ChevronDown size={12} color="var(--muted)" />}
                          <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--muted)' }}>{c.id}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 8px', fontSize: 12, color: 'var(--charade)', whiteSpace: 'nowrap' }}>
                        {c.market}
                      </td>
                      <td style={{ padding: '10px 8px', fontSize: 12, color: 'var(--muted)', maxWidth: 140 }}>
                        {c.issue_category}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: c.confidence >= 0.7 ? 'var(--bolt-green-700)' : c.confidence >= 0.5 ? '#b96c00' : 'var(--red)',
                          }}
                        >
                          {(c.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        {ft ? (
                          <span
                            style={{
                              padding: '2px 7px',
                              borderRadius: 20,
                              background: ft.bg,
                              color: ft.color,
                              fontSize: 11,
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {c.failure_type}
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, color: 'var(--muted-2)' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        {sev ? (
                          <span style={{ padding: '2px 6px', borderRadius: 5, background: sev.bg, color: sev.color, fontSize: 11, fontWeight: 700 }}>
                            {c.severity}
                          </span>
                        ) : <span style={{ fontSize: 11, color: 'var(--muted-2)' }}>—</span>}
                      </td>
                      <td style={{ padding: '10px 8px', fontSize: 12, color: c.escalated ? 'var(--red)' : 'var(--muted-2)' }}>
                        {c.escalated ? 'Yes' : 'No'}
                      </td>
                      <td style={{ padding: '10px 8px', fontSize: 12, fontWeight: 700, color: c.csat && c.csat >= 4 ? 'var(--bolt-green-700)' : c.csat && c.csat <= 2 ? 'var(--red)' : 'var(--charade)' }}>
                        {c.csat ? '★'.repeat(c.csat) : '—'}
                      </td>
                      <td style={{ padding: '10px 8px', fontSize: 12, color: c.agent_override ? '#b96c00' : 'var(--muted-2)' }}>
                        {c.agent_override ? 'Yes' : 'No'}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${c.id}-expand`}>
                        <td colSpan={9} style={{ padding: '0 8px 14px', background: 'var(--athens-gray)', borderBottom: '1px solid var(--line)' }}>
                          <div
                            style={{
                              background: 'var(--surface)',
                              border: '1px solid var(--line)',
                              borderRadius: 10,
                              padding: '14px 16px',
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: 16,
                            }}
                          >
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Customer Message</div>
                              <div style={{ fontSize: 13, color: 'var(--charade)', lineHeight: 1.5, fontStyle: 'italic' }}>
                                "{c.customer_message}"
                              </div>
                              <div style={{ marginTop: 10, fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Alfred Response</div>
                              <div style={{ fontSize: 13, color: 'var(--charade)', lineHeight: 1.5 }}>
                                {c.alfred_response}
                              </div>
                            </div>
                            <div>
                              {c.failure_detail && (
                                <>
                                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Failure Detail</div>
                                  <div style={{ fontSize: 13, color: 'var(--charade)', lineHeight: 1.5, marginBottom: 10 }}>
                                    {c.failure_detail}
                                  </div>
                                </>
                              )}
                              {c.recommended_fix && (
                                <>
                                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--bolt-green-700)', textTransform: 'uppercase', marginBottom: 6 }}>Recommended Fix</div>
                                  <div style={{ fontSize: 13, color: 'var(--charade)', lineHeight: 1.5, padding: '8px 12px', background: 'var(--bolt-green-50)', borderRadius: 8 }}>
                                    {c.recommended_fix}
                                  </div>
                                  {c.owner_team && (
                                    <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>
                                      Owner: <strong>{c.owner_team}</strong>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
