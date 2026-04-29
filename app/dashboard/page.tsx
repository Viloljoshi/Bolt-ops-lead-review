'use client';

import AppShell from '@/components/AppShell';
import MetricTooltip from '@/components/MetricTooltip';
import metrics from '@/data/metrics.json';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle, Wrench } from 'lucide-react';
import Link from 'next/link';

function Chip({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 20,
        background: bg,
        color,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </span>
  );
}

interface TooltipData {
  definition: string;
  whyItMatters: string;
  decisionTrigger: string;
  owner: string;
  direction: 'positive' | 'negative';
}

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  target?: string;
  positiveIsUp?: boolean;
  href?: string;
  tooltip?: TooltipData;
}

function MetricCard({ title, value, change, target, positiveIsUp = false, href, tooltip }: MetricCardProps) {
  const isGood = positiveIsUp ? change > 0 : change < 0;
  const isUp = change > 0;
  const changeColor = isGood ? 'var(--bolt-green-700)' : 'var(--red)';
  const changeBg = isGood ? 'var(--bolt-green-50)' : 'var(--red-50)';

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        padding: '18px 20px',
        boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.01em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
        {title}
        {tooltip && (
          <MetricTooltip
            definition={tooltip.definition}
            whyItMatters={tooltip.whyItMatters}
            decisionTrigger={tooltip.decisionTrigger}
            owner={tooltip.owner}
            direction={tooltip.direction}
          />
        )}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: 'var(--charade)',
          letterSpacing: '-0.035em',
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            padding: '2px 7px',
            borderRadius: 20,
            background: changeBg,
            color: changeColor,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {isUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {Math.abs(change)}
        </span>
        {target && (
          <span style={{ fontSize: 11, color: 'var(--muted-2)' }}>target {target}</span>
        )}
      </div>
      {href && (
        <Link href={href} style={{ fontSize: 11, color: 'var(--bolt-green)', fontWeight: 600, textDecoration: 'none', marginTop: 4 }}>
          View Details →
        </Link>
      )}
    </div>
  );
}

const topIssues = [
  {
    title: 'Germany vehicle API 12.4% error rate',
    market: '🇩🇪 Germany',
    severity: 'P1',
    action: 'Engineering: Fix telemetry API timeout',
    href: '/escalation',
  },
  {
    title: 'Poland refund logic mismatch — 38 cases',
    market: '🇵🇱 Poland',
    severity: 'P1',
    action: 'CS Product: Update PL refund decision tree',
    href: '/diagnosis',
  },
  {
    title: 'Safety complaint tone failure — Mexico',
    market: '🇲🇽 Mexico',
    severity: 'P0',
    action: 'Conversation Design: Deploy empathy-first template',
    href: '/escalation',
  },
];

const severityStyles: Record<string, { bg: string; color: string }> = {
  P0: { bg: '#2C2D33', color: '#fff' },
  P1: { bg: 'var(--red-50)', color: 'var(--red)' },
  P2: { bg: 'var(--amber-50)', color: 'var(--amber)' },
  P3: { bg: 'var(--blue-50)', color: 'var(--blue)' },
};

export default function DashboardPage() {
  const g = metrics.global;
  const trend = metrics.weekly_trend;
  const byMarket = metrics.by_market;

  const metricCards: MetricCardProps[] = [
    {
      title: 'Automation Resolution Rate',
      value: `${g.automation_resolution_rate}%`,
      change: g.automation_resolution_change,
      target: `${g.automation_resolution_target}%`,
      positiveIsUp: true,
      href: '/automation',
      tooltip: {
        definition: '% of support conversations fully resolved by Alfred without human escalation. A conversation is "resolved" only if the customer did not reopen or escalate.',
        whyItMatters: 'Shows how much support load Alfred absorbs. But NEVER optimise this metric alone — high automation with wrong resolutions destroys customer trust faster than slow human support.',
        decisionTrigger: 'If ARR drops below 68% in any market — pause automation expansion in that market and run diagnosis. If ARR rises above 80% while CSAT drops — Alfred is force-closing tickets.',
        owner: 'CS Product / ML Product',
        direction: 'positive',
      },
    },
    {
      title: 'Trusted Automation Score',
      value: `${g.trusted_automation_score}`,
      change: g.trusted_automation_change,
      target: `${g.trusted_automation_target}`,
      positiveIsUp: true,
      href: '/automation',
      tooltip: {
        definition: 'Composite metric: ARR × quality multiplier. Penalises automation that generates reopens, agent overrides, or CSAT < 3. A use case with 90% automation but 28% reopen rate scores ~52/100.',
        whyItMatters: 'Raw automation rate can be gamed. TAS forces quality and throughput to improve together. It\'s the single metric leadership should track, not ARR in isolation.',
        decisionTrigger: 'TAS < 60 in any market = do not expand automation there. TAS < 50 = actively restrict automation and run root cause sprint.',
        owner: 'AI Ops Lead',
        direction: 'positive',
      },
    },
    {
      title: 'Escalation Rate',
      value: `${g.escalation_rate}%`,
      change: g.escalation_rate_change,
      target: `${g.escalation_rate_target}%`,
      positiveIsUp: false,
      href: '/escalation',
      tooltip: {
        definition: '% of conversations transferred to human agents. Important: not all escalation is bad. Safety, fraud, compliance, and identity cases SHOULD escalate.',
        whyItMatters: 'The key question is: what % of escalations were avoidable? Current estimate: 12% avoidable (knowledge/logic/tool failures), 6.3% healthy (safety/compliance). Track both separately.',
        decisionTrigger: 'Avoidable escalation > 15% = sprint-priority fix. Total escalation rising while healthy escalation is stable = Alfred quality problem.',
        owner: 'CS Product + ML Product (avoidable) / Trust & Safety (healthy)',
        direction: 'negative',
      },
    },
    {
      title: 'First Contact Resolution',
      value: `${g.fcr}%`,
      change: g.fcr_change,
      target: `${g.fcr_target}%`,
      positiveIsUp: true,
      href: '/dashboard',
      tooltip: {
        definition: '% of customers whose issue is fully resolved in the first interaction, without reopening, re-contacting, or escalating later.',
        whyItMatters: 'FCR is a stronger quality signal than automation rate. Alfred can "resolve" a case and create a false FCR by closing the ticket before the customer has time to reopen it. Watch FCR over 72h, not just at close.',
        decisionTrigger: 'FCR < 60% in any category = Alfred is answering but not solving. Fix answer completeness, not just routing.',
        owner: 'CS Product / KM',
        direction: 'positive',
      },
    },
    {
      title: 'CSAT',
      value: `${g.csat}/5`,
      change: g.csat_change,
      target: `${g.csat_target}`,
      positiveIsUp: true,
      href: '/dashboard',
      tooltip: {
        definition: 'Average customer rating (1–5) after AI-assisted support. Only 31% of customers respond — unhappy customers are 3× more likely to rate. Raw CSAT of 3.8 is biased downward; bias-adjusted estimate is ~4.1.',
        whyItMatters: 'CSAT below 3.0 in any category means Alfred is actively making the experience worse than no AI at all. That\'s a signal to restrict automation, not improve prompts.',
        decisionTrigger: 'Category CSAT < 3.0 = restrict automation immediately. Market CSAT declining >0.3 WoW = investigate root cause before expanding.',
        owner: 'CS Product + Conversation Design',
        direction: 'positive',
      },
    },
    {
      title: 'Human Override Rate',
      value: `${g.override_rate}%`,
      change: g.override_rate_change,
      target: `${g.override_rate_target}%`,
      positiveIsUp: false,
      href: '/diagnosis',
      tooltip: {
        definition: '% of cases where a support agent changed or corrected Alfred\'s suggested resolution. Broken into: tone-only overrides (34%), policy overrides (41%), escalation overrides (18%), unknown (7%).',
        whyItMatters: 'Override rate is your best leading indicator of AI quality problems. Every override is a data point. The type of override tells you WHO needs to fix it: tone = Conversation Design, policy = CS Product, escalation = Logic/Compliance.',
        decisionTrigger: 'Policy overrides > 5% in any category = CS Product review needed. Unknown overrides > 5% = data quality fix needed first.',
        owner: 'CS Ops (categorisation) / CS Product (policy overrides) / Conversation Design (tone overrides)',
        direction: 'negative',
      },
    },
    {
      title: 'Reopen Rate',
      value: `${g.reopen_rate}%`,
      change: g.reopen_rate_change,
      target: `${g.reopen_rate_target}%`,
      positiveIsUp: false,
      href: '/diagnosis',
      tooltip: {
        definition: '% of cases reopened by the customer after Alfred marked them resolved. This is your false resolution detector.',
        whyItMatters: 'Reopen rate catches what CSAT misses. A customer who gives up without responding to CSAT but reopens their case is telling you Alfred failed. High automation + high reopen = Alfred is efficiently producing wrong answers at scale.',
        decisionTrigger: 'Reopen > 15% in any category = Alfred is creating false resolutions. Audit the decision logic, not just the response wording.',
        owner: 'CS Product / ML Product',
        direction: 'negative',
      },
    },
    {
      title: 'Compliance Block Rate',
      value: `${g.compliance_block_rate}%`,
      change: g.compliance_block_rate_change,
      positiveIsUp: false,
      href: '/escalation',
      tooltip: {
        definition: '% of cases blocked from automation due to legal, safety, fraud, privacy, or compliance constraints.',
        whyItMatters: 'A rising compliance block rate can mean two things: (1) more risky cases arriving — good detection, or (2) Alfred is correctly identifying cases that should never have been automated — a sign past automation was too broad.',
        decisionTrigger: 'Block rate rising without change in case mix = audit recent automation scope decisions. Block rate falling = verify guardrails are still active.',
        owner: 'Compliance / Trust & Safety',
        direction: 'negative',
      },
    },
    {
      title: 'Avg Resolution Time',
      value: `${g.avg_resolution_time} min`,
      change: g.avg_resolution_time_change,
      target: `${g.avg_resolution_time_target} min`,
      positiveIsUp: false,
      href: '/dashboard',
      tooltip: {
        definition: 'Average minutes from conversation start to resolution or escalation. Includes Alfred processing time, tool call latency, and any customer wait time.',
        whyItMatters: 'Speed matters to customers, but speed without correctness is worse than slower-but-right. Watch avg time alongside reopen rate — fast resolutions with high reopens = Alfred is rushing to wrong answers.',
        decisionTrigger: 'Avg time > 6 min = tool latency or routing bottleneck. Check tool error rates. If avg time spiking in a specific market = likely API issue in that market.',
        owner: 'Engineering / Platform',
        direction: 'negative',
      },
    },
    {
      title: 'Cost Deflection',
      value: `${g.cost_deflection_weekly.toLocaleString()} /wk`,
      change: g.cost_deflection_change,
      positiveIsUp: true,
      href: '/automation',
      tooltip: {
        definition: 'Estimated tickets per week fully resolved by Alfred without human agent involvement, at an estimated cost saving of $X per ticket avoided.',
        whyItMatters: 'This is the headline ROI metric for leadership — but it\'s only meaningful if quality is maintained. 14,200 deflections at CSAT 3.8 is good. 14,200 deflections at CSAT 2.5 is a liability.',
        decisionTrigger: 'If deflection grows but TAS drops — you\'re scaling bad resolution. Pause expansion and fix quality first.',
        owner: 'AI Ops Lead / Finance',
        direction: 'positive',
      },
    },
  ];

  return (
    <AppShell>
      <div style={{ maxWidth: 1200 }}>
        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Executive Health Dashboard
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Week of Apr 22 – 28, 2026 · Global view across 8 markets
          </p>
        </div>

        {/* Metric cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 12,
            marginBottom: 24,
          }}
        >
          {metricCards.map((card) => (
            <MetricCard key={card.title} {...card} />
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* Weekly Trend */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              padding: '20px 20px 12px',
              boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em' }}>
                Weekly Trend
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Last 5 weeks</div>
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="automation" name="Auto Rate" stroke="var(--bolt-green)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="trusted_auto" name="Trusted Auto" stroke="var(--violet)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="escalation" name="Escalation" stroke="var(--red)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="csat" name="CSAT" stroke="var(--blue)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance by Market */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              padding: '20px 20px 12px',
              boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em' }}>
                Performance by Market
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Health score / 100</div>
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...byMarket].sort((a, b) => b.health_score - a.health_score)}
                  margin={{ top: 4, right: 8, left: -24, bottom: 0 }}
                  barSize={18}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                  <XAxis dataKey="code" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip formatter={(v) => [`${v}`, 'Health Score']} />
                  <Bar
                    dataKey="health_score"
                    name="Health Score"
                    radius={[4, 4, 0, 0]}
                    fill="var(--bolt-green)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Signal Intelligence */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em' }}>
              Signal Intelligence
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
              What Alfred&apos;s standard metrics won&apos;t surface. A senior AI Ops lead checks these weekly.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            {/* Card 1: Confidence Calibration Risk */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 4px rgba(20,22,28,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <AlertTriangle size={14} color="var(--amber)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em' }}>Confidence Calibration Risk</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
                <thead>
                  <tr>
                    {['Category', 'Avg Conf.', 'Reopen Rate', 'Signal'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.02em', padding: '4px 6px', borderBottom: '1px solid var(--line)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: 'Poland Refund', conf: '0.81', reopen: '18.2%', signal: '⚠ Miscalibrated', signalColor: '#b96c00' },
                    { cat: 'NG Driver Payout', conf: '0.71', reopen: '24.6%', signal: '⚠ Miscalibrated', signalColor: '#b96c00' },
                    { cat: 'DE Vehicle Unlock', conf: '0.34', reopen: '12.4%', signal: '✓ Calibrated', signalColor: 'var(--bolt-green-700)' },
                    { cat: 'EE Promo Code', conf: '0.92', reopen: '6.1%', signal: '✓ Well calibrated', signalColor: 'var(--bolt-green-700)' },
                    { cat: 'MX Safety (P0)', conf: '0.77', reopen: '8.4%', signal: '⚠ Dangerous', signalColor: 'var(--red)' },
                  ].map((row) => (
                    <tr key={row.cat} style={{ borderBottom: '1px solid var(--line-soft)' }}>
                      <td style={{ padding: '6px 6px', fontSize: 11, color: 'var(--charade)', fontWeight: 500 }}>{row.cat}</td>
                      <td style={{ padding: '6px 6px', fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>{row.conf}</td>
                      <td style={{ padding: '6px 6px', fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>{row.reopen}</td>
                      <td style={{ padding: '6px 6px', fontSize: 11, fontWeight: 600, color: row.signalColor }}>{row.signal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                High confidence + high reopen rate = overconfident wrong resolution. More dangerous than openly uncertain failure.
              </p>
              <div style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--charade)', marginBottom: 8 }}>What this means for your teams</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    {
                      team: 'ML / AI Product',
                      color: '#b96c00',
                      bg: 'var(--amber-50)',
                      text: 'Do not use a single global confidence threshold. Build per-cohort calibration curves. Poland/NG/MX safety need market-specific thresholds. This is a 1-sprint fix with significant reopen rate impact.',
                    },
                    {
                      team: 'CS Product',
                      color: 'var(--bolt-green-700)',
                      bg: 'var(--bolt-green-50)',
                      text: 'Stop using confidence as a quality proxy. A case resolved at 0.82 confidence in Poland has 18% reopen rate. High confidence = high speed, not high accuracy in miscalibrated cohorts.',
                    },
                    {
                      team: 'Engineering',
                      color: 'var(--blue)',
                      bg: 'var(--blue-50)',
                      text: 'Instrument confidence × reopen rate correlation tracking per intent × market. This is a monitoring fix, not a model fix.',
                    },
                  ].map((item) => (
                    <div key={item.team} style={{ padding: '8px 10px', borderRadius: 8, background: item.bg, border: `1px solid ${item.bg}` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: item.color, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 3 }}>{item.team}</div>
                      <div style={{ fontSize: 11, color: 'var(--charade)', lineHeight: 1.5 }}>{item.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Knowledge Freshness Monitor */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 4px rgba(20,22,28,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <TrendingUp size={14} color="var(--blue)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em' }}>Knowledge Freshness Monitor</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                {[
                  { area: 'Bolt Nigeria payout policy', days: 47, status: 'critical' },
                  { area: 'Kenya food delivery SLA', days: 62, status: 'critical' },
                  { area: 'Poland refund eligibility rules', days: 31, status: 'stale' },
                  { area: 'Germany scooter rental terms', days: 12, status: 'ok' },
                  { area: 'India cancellation policy', days: 8, status: 'ok' },
                ].map((item) => {
                  const statusColor = item.status === 'critical' ? 'var(--red)' : item.status === 'stale' ? '#b96c00' : 'var(--bolt-green-700)';
                  const statusIcon = item.status === 'critical' ? '🔴' : item.status === 'stale' ? '⚠' : '✓';
                  return (
                    <div key={item.area} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--charade)', flex: 1 }}>{item.area}</span>
                      <span style={{ fontSize: 11, color: statusColor, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {statusIcon} {item.days}d ago
                      </span>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                Articles older than 21 days should be reviewed. Every product update creates a knowledge gap window. SLA target: max 14 days product change → Alfred update.
              </p>
              <div style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--charade)', marginBottom: 6 }}>The gap that matters</div>
                <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.55, margin: '0 0 10px' }}>
                  Time between product team shipping a change and Alfred knowing about it. Current average gap (estimated): 3–4 weeks. Every day of that gap = systematic wrong answers at scale.
                </p>
                <div style={{ padding: '10px 12px', background: 'var(--athens-gray)', borderRadius: 8, border: '1px solid var(--line)', marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 6 }}>Process Gap Diagram</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    {[
                      { label: 'Product ships', color: 'var(--bolt-green-700)', bg: 'var(--bolt-green-50)' },
                      { label: '→ [GAP] →', color: 'var(--red)', bg: 'transparent', noBorder: true },
                      { label: 'Alfred answers wrong', color: 'var(--red)', bg: 'var(--red-50)' },
                      { label: '→', color: 'var(--muted)', bg: 'transparent', noBorder: true },
                      { label: 'Override spike', color: '#b96c00', bg: 'var(--amber-50)' },
                      { label: '→', color: 'var(--muted)', bg: 'transparent', noBorder: true },
                      { label: 'Ops discovers', color: 'var(--blue)', bg: 'var(--blue-50)' },
                      { label: '→', color: 'var(--muted)', bg: 'transparent', noBorder: true },
                      { label: 'KM updates', color: 'var(--bolt-green-700)', bg: 'var(--bolt-green-50)' },
                    ].map((step, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 10,
                          fontWeight: step.noBorder ? 400 : 600,
                          color: step.color,
                          background: step.bg,
                          padding: step.noBorder ? '0' : '2px 6px',
                          borderRadius: step.noBorder ? 0 : 4,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {step.label}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--bolt-green-700)', marginTop: 6, fontWeight: 600 }}>
                    Target: Product ships → KM review triggered automatically → Alfred updated within 14 days
                  </div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 6 }}>Owner Callouts</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[
                    { role: 'KM', action: 'Create a knowledge impact checklist for every product launch.' },
                    { role: 'Local Ops', action: 'Own market-specific article freshness.' },
                    { role: 'Product Ops', action: 'Add "Alfred knowledge review" to every launch checklist.' },
                  ].map((o) => (
                    <div key={o.role} style={{ fontSize: 11, color: 'var(--charade)', display: 'flex', gap: 6 }}>
                      <span style={{ fontWeight: 700, color: 'var(--blue)', flexShrink: 0 }}>{o.role}:</span>
                      <span style={{ color: 'var(--muted)' }}>{o.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Override Quality Signal */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 4px rgba(20,22,28,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Wrench size={14} color="var(--violet)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em' }}>Override Quality Signal</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
                Total overrides this week: <strong style={{ color: 'var(--charade)' }}>9.1%</strong> of conversations
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
                {[
                  { label: 'Tone-only overrides', pct: 34, color: 'var(--bolt-green)', fix: 'Conversation Design fix' },
                  { label: 'Policy overrides', pct: 41, color: '#b96c00', fix: 'CS Product fix' },
                  { label: 'Escalation overrides', pct: 18, color: 'var(--red)', fix: 'Logic / Compliance fix' },
                  { label: 'Unknown / uncategorized', pct: 7, color: 'var(--muted)', fix: 'Data quality issue' },
                ].map((row) => (
                  <div key={row.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: 'var(--charade)', fontWeight: 500 }}>{row.label}</span>
                      <span style={{ fontSize: 11, color: row.color, fontWeight: 700 }}>{row.pct}%</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--line)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${row.pct}%`, height: '100%', background: row.color, borderRadius: 2 }} />
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--muted-2)', marginTop: 2 }}>{row.fix}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                Uncategorized overrides are invisible improvement signals. Categorizing them is the highest ROI ops investment this sprint.
              </p>
              <div style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--charade)', marginBottom: 8 }}>Override Breakdown — Action Table</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
                  <thead>
                    <tr>
                      {['Type', 'Count/wk', 'Owner', 'Fix', 'Sprint'].map((h) => (
                        <th key={h} style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.03em', textAlign: 'left', padding: '3px 5px', borderBottom: '1px solid var(--line)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: 'Tone-only', count: '314', owner: 'Conv. Design', fix: 'Prompt update', sprint: '1 sprint', color: 'var(--bolt-green-700)' },
                      { type: 'Policy', count: '378', owner: 'CS Product', fix: 'Decision tree', sprint: '2 sprints', color: '#b96c00' },
                      { type: 'Escalation', count: '165', owner: 'Logic/Compliance', fix: 'Rule update', sprint: '1-2 sprints', color: 'var(--red)' },
                      { type: 'Unknown', count: '64', owner: 'CS Ops', fix: 'Data labelling', sprint: '1 sprint', color: 'var(--muted)' },
                    ].map((row) => (
                      <tr key={row.type} style={{ borderBottom: '1px solid var(--line-soft)' }}>
                        <td style={{ padding: '4px 5px', fontSize: 10, fontWeight: 700, color: row.color }}>{row.type}</td>
                        <td style={{ padding: '4px 5px', fontSize: 10, color: 'var(--charade)', fontFamily: 'JetBrains Mono, monospace' }}>{row.count}</td>
                        <td style={{ padding: '4px 5px', fontSize: 10, color: 'var(--muted)' }}>{row.owner}</td>
                        <td style={{ padding: '4px 5px', fontSize: 10, color: 'var(--muted)' }}>{row.fix}</td>
                        <td style={{ padding: '4px 5px', fontSize: 10, color: 'var(--charade)', fontWeight: 600 }}>{row.sprint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: '7px 9px', background: 'var(--amber-50)', borderRadius: 7, border: '1px solid #FDE68A' }}>
                  <span style={{ fontSize: 11, color: '#92400E', lineHeight: 1.5 }}>
                    <strong>The 7% unknown overrides</strong> are invisible improvement signal. Each one is a failure mode we haven&apos;t named yet. Categorise these first — it&apos;s the highest ROI ops task this week.
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Feedback Bias Correction */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 4px rgba(20,22,28,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <TrendingUp size={14} color="var(--blue)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em' }}>Feedback Bias Correction</span>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--charade)', letterSpacing: '-0.03em' }}>3.8</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Raw CSAT</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--muted)', fontSize: 14 }}>→</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--bolt-green-700)', letterSpacing: '-0.03em' }}>~4.1</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Bias-adjusted</div>
                </div>
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: '0 0 10px', lineHeight: 1.5 }}>
                Only 31% of resolved conversations generate CSAT responses. Customers who got a bad experience are 3x more likely to respond. Our 3.8 CSAT is biased downward — but it still reveals real quality gaps at the bottom.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { cat: 'Safety complaints', rate: '82%', weight: 82, color: 'var(--red)' },
                  { cat: 'Payout delays', rate: '71%', weight: 71, color: '#b96c00' },
                  { cat: 'Promo code issues', rate: '12%', weight: 12, color: 'var(--bolt-green)' },
                ].map((row) => (
                  <div key={row.cat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: 'var(--muted)', width: 110, flexShrink: 0 }}>{row.cat}</span>
                    <div style={{ flex: 1, height: 4, background: 'var(--line)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${row.weight}%`, height: '100%', background: row.color, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: row.color, width: 28, textAlign: 'right', flexShrink: 0 }}>{row.rate}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic', margin: '8px 0 0', lineHeight: 1.5 }}>
                Low CSAT in high-response-rate categories is more signal than low CSAT in low-response-rate categories.
              </p>
              <div style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--charade)', marginBottom: 6 }}>What this means for CSAT interpretation</div>
                <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.55, margin: '0 0 10px' }}>
                  Our 3.8 CSAT is a pessimist&apos;s view. The customers most likely to rate are: (1) very unhappy (rating 1–2) and (2) very happy (rating 5). Middle scores are underrepresented. This means our CSAT distribution is bimodal — do not treat it as a normal distribution.
                </p>
                <div style={{ padding: '9px 11px', background: 'var(--blue-50)', borderRadius: 8, border: '1px solid #b3cef7' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 5 }}>Action</div>
                  <p style={{ fontSize: 11, color: 'var(--charade)', lineHeight: 1.55, margin: 0 }}>
                    Weight CSAT by response rate when comparing across categories. <strong>Safety complaints (82% response rate) CSAT of 3.1 is highly reliable signal.</strong> Promo code (12% response rate) CSAT of 4.0 is noise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top issues */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em', marginBottom: 12 }}>
            Top Issues This Week
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topIssues.map((issue) => {
              const sev = severityStyles[issue.severity] ?? severityStyles.P3;
              return (
                <div
                  key={issue.title}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: 12,
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
                  }}
                >
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: sev.bg,
                      color: sev.color,
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {issue.severity}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--charade)', letterSpacing: '-0.01em' }}>
                      {issue.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                      {issue.market} · {issue.action}
                    </div>
                  </div>
                  <Link
                    href={issue.href}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      background: 'var(--bolt-green)',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: 'none',
                      flexShrink: 0,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    View →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
