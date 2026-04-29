'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import metrics from '@/data/metrics.json';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MARKETS = ['Estonia', 'Poland', 'Kenya', 'Nigeria', 'India', 'South Africa', 'Germany', 'Mexico'];
const VERTICALS = ['All', 'Ride-hailing', 'Food Delivery', 'Scooter/e-bike', 'Driver Support', 'Payments/Refunds', 'Safety Incidents'];
const CATEGORIES = ['All', 'Refund Request', 'Driver Cancellation', 'Wrong Charge', 'Delayed Food Order', 'Account Verification', 'Safety Complaint', 'Payout Delay', 'Vehicle Unlock Issue'];

const severityStyles: Record<string, { bg: string; color: string }> = {
  P0: { bg: '#2C2D33', color: '#fff' },
  P1: { bg: 'var(--red-50)', color: 'var(--red)' },
  P2: { bg: 'var(--amber-50)', color: '#b96c00' },
  P3: { bg: 'var(--blue-50)', color: 'var(--blue)' },
};

const activeIssuesByMarket: Record<string, Array<{ issue: string; severity: string; owner: string; type: string }>> = {
  Poland: [
    { issue: 'Refund logic mismatch — non-delivery exception not applied', severity: 'P1', owner: 'CS Product', type: 'Logic Fault' },
    { issue: 'Ghost trip pattern not detected in 2 cases', severity: 'P2', owner: 'Risk / Engineering', type: 'Logic Fault' },
    { issue: 'EU consumer protection compliance risk on denied refunds', severity: 'P1', owner: 'Compliance', type: 'Compliance Blocker' },
  ],
  Germany: [
    { issue: 'Vehicle telemetry API — 12.4% error rate (BLG-004)', severity: 'P1', owner: 'Engineering', type: 'Tool API Failure' },
    { issue: 'Account verification stuck cases — KYC API instability', severity: 'P1', owner: 'Engineering / Driver Ops', type: 'Tool API Failure' },
  ],
  Nigeria: [
    { issue: 'Driver payout knowledge gap — wrong timeline (BLG-003)', severity: 'P1', owner: 'Local Ops / KM', type: 'Knowledge Gap' },
    { issue: 'Ghost trip fraud enabling — 12 cases this month', severity: 'P1', owner: 'Risk / Engineering', type: 'Logic Fault' },
    { issue: 'Nigerian English register — tone mismatch (BLG-011)', severity: 'P3', owner: 'Conversation Design', type: 'UX Tone' },
  ],
  Mexico: [
    { issue: 'Safety complaints — cold response tone (BLG-005)', severity: 'P0', owner: 'Trust & Safety', type: 'UX Tone' },
    { issue: 'Safety severity classifier missing — P0/P1/P2 not distinguished', severity: 'P1', owner: 'CS Product', type: 'Logic Fault' },
  ],
  India: [
    { issue: 'Wrong charge misclassified as promo code — 28 cases/wk', severity: 'P1', owner: 'ML / AI Product', type: 'Classification Error' },
    { issue: 'Route fraud detection missing — 3x fare deviation dismissed', severity: 'P1', owner: 'Risk / CS Product', type: 'Logic Fault' },
  ],
  Estonia: [
    { issue: 'Minor: Driver cancellation empathy improvement opportunity', severity: 'P3', owner: 'Conversation Design', type: 'UX Tone' },
  ],
  Kenya: [
    { issue: 'Food delay refund trigger missing — 40+ min cases deflected', severity: 'P2', owner: 'CS Product', type: 'Logic Fault' },
    { issue: 'Lost item escalation path incomplete', severity: 'P3', owner: 'CS Ops', type: 'Knowledge Gap' },
  ],
  'South Africa': [
    { issue: 'Lost item — missing escalation when courier unresponsive', severity: 'P3', owner: 'CS Ops / KM', type: 'Knowledge Gap' },
    { issue: 'Surge pricing explanation without API verification', severity: 'P2', owner: 'CS Product / Engineering', type: 'Logic Fault' },
  ],
};

const recommendedActionsByMarket: Record<string, Array<{ title: string; priority: string; owner: string; due: string }>> = {
  Poland: [
    { title: 'Ship BLG-001 — update PL refund decision tree', priority: 'P1', owner: 'CS Product', due: 'May 5' },
    { title: 'Add 25 regression test cases for PL refund logic', priority: 'P1', owner: 'QA / CS Product', due: 'May 5' },
    { title: 'Brief CS Ops on interim manual override protocol', priority: 'P2', owner: 'CS Ops Lead', due: 'Apr 30' },
    { title: 'Legal review: EU consumer protection exposure assessment', priority: 'P1', owner: 'Compliance / Legal', due: 'Apr 29' },
  ],
  Germany: [
    { title: 'Ship BLG-004 — fix DE telemetry API root cause', priority: 'P1', owner: 'Engineering', due: 'May 2' },
    { title: 'Monitor 8s timeout fallback (BLG-007 shipped)', priority: 'P2', owner: 'Engineering', due: 'Ongoing' },
  ],
  Nigeria: [
    { title: 'Ship BLG-003 — NG payout knowledge article', priority: 'P1', owner: 'Local Ops / KM', due: 'Apr 30' },
    { title: 'Build ghost trip detection signal (BLG-006)', priority: 'P1', owner: 'Risk / Engineering', due: 'May 19' },
    { title: 'Localize Alfred responses to NG English register (BLG-011)', priority: 'P3', owner: 'Conversation Design', due: 'TBD' },
  ],
  Mexico: [
    { title: 'Deploy empathy-first template for MX safety (BLG-005)', priority: 'P1', owner: 'Conversation Design', due: 'May 9' },
    { title: 'Add P0 safety severity routing with <2min human SLA', priority: 'P0', owner: 'CS Product', due: 'Apr 29' },
  ],
  India: [
    { title: 'Ship BLG-002 — disambiguate wrong charge vs promo code', priority: 'P1', owner: 'ML / AI Product', due: 'May 12' },
    { title: 'Fix route fraud detection — 3x fare + deviation = fraud flag', priority: 'P1', owner: 'Risk / CS Product', due: 'May 19' },
  ],
  Estonia: [
    { title: 'Expand promo code automation — Sprint 26 (BLG-012)', priority: 'P3', owner: 'CS Product', due: 'May 19' },
  ],
  Kenya: [
    { title: 'Add 40+ min food delay refund trigger (BLG-008)', priority: 'P2', owner: 'CS Product', due: 'TBD' },
  ],
  'South Africa': [
    { title: 'Add 2hr courier non-response escalation gate', priority: 'P3', owner: 'CS Ops / KM', due: 'TBD' },
  ],
};

const failureTypeColors: Record<string, { color: string }> = {
  'Logic Fault': { color: 'var(--red)' },
  'Classification Error': { color: '#b96c00' },
  'Knowledge Gap': { color: 'var(--blue)' },
  'Tool API Failure': { color: 'var(--violet)' },
  'UX Tone': { color: 'var(--bolt-green-700)' },
  'Compliance Blocker': { color: '#7a0000' },
};

function StatCard({ label, value, target, change, lowerIsBetter = false }: {
  label: string;
  value: string;
  target?: string;
  change?: number;
  lowerIsBetter?: boolean;
}) {
  const isGood = change !== undefined ? (lowerIsBetter ? change < 0 : change > 0) : null;
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 12,
        padding: '14px 16px',
        boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
      }}
    >
      <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--charade)', letterSpacing: '-0.03em' }}>
        {value}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
        {change !== undefined && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              fontSize: 11,
              fontWeight: 700,
              color: isGood ? 'var(--bolt-green-700)' : 'var(--red)',
            }}
          >
            {change > 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {Math.abs(change)}
          </span>
        )}
        {target && (
          <span style={{ fontSize: 11, color: 'var(--muted-2)' }}>target {target}</span>
        )}
      </div>
    </div>
  );
}

export default function DrilldownPage() {
  const [selectedMarket, setSelectedMarket] = useState('Poland');
  const [selectedVertical, setSelectedVertical] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const marketData = metrics.by_market.find((m) => m.market === selectedMarket);
  const categoryData = metrics.by_category;

  const healthScore = marketData?.health_score ?? 0;
  const healthColor = healthScore >= 75 ? 'var(--bolt-green)' : healthScore >= 60 ? 'var(--amber)' : 'var(--red)';

  const activeIssues = activeIssuesByMarket[selectedMarket] ?? [];
  const recommendations = recommendedActionsByMarket[selectedMarket] ?? [];

  return (
    <AppShell>
      <div style={{ maxWidth: 1200 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Market / Vertical Drilldown
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Drill into any market, vertical, or category for a detailed performance view.
          </p>
        </div>

        {/* Filter selectors */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              Market
            </label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--bolt-green)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--charade)',
                background: 'var(--surface)',
                cursor: 'pointer',
                minWidth: 160,
              }}
            >
              {MARKETS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              Vertical
            </label>
            <select
              value={selectedVertical}
              onChange={(e) => setSelectedVertical(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--line)',
                fontSize: 13,
                color: 'var(--charade)',
                background: 'var(--surface)',
                cursor: 'pointer',
                minWidth: 180,
              }}
            >
              {VERTICALS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--line)',
                fontSize: 13,
                color: 'var(--charade)',
                background: 'var(--surface)',
                cursor: 'pointer',
                minWidth: 200,
              }}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {marketData && (
          <>
            {/* Health score + metric cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, marginBottom: 20 }}>
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 14,
                  padding: '24px',
                  textAlign: 'center',
                  boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                  {selectedMarket} Health
                </div>
                <div style={{ fontSize: 64, fontWeight: 900, color: healthColor, letterSpacing: '-0.05em', lineHeight: 1 }}>
                  {healthScore}
                </div>
                <div style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 500 }}>/100</div>
                <div
                  style={{
                    marginTop: 12,
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: healthScore >= 75 ? 'var(--bolt-green-50)' : healthScore >= 60 ? 'var(--amber-50)' : 'var(--red-50)',
                    color: healthColor,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {marketData.status.charAt(0).toUpperCase() + marketData.status.slice(1)}
                </div>
              </div>

              <div className="r-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                <StatCard
                  label="Automation Rate"
                  value={`${marketData.automation}%`}
                  target="78%"
                  change={parseFloat((marketData.automation - 78).toFixed(1))}
                  lowerIsBetter={false}
                />
                <StatCard
                  label="CSAT"
                  value={`${marketData.csat}/5`}
                  target="4.2"
                  change={parseFloat((marketData.csat - 4.2).toFixed(1))}
                  lowerIsBetter={false}
                />
                <StatCard
                  label="Escalation Rate"
                  value={`${marketData.escalation}%`}
                  target="15%"
                  change={parseFloat((marketData.escalation - 15).toFixed(1))}
                  lowerIsBetter={true}
                />
                <StatCard
                  label="Trusted Auto Score"
                  value={`${marketData.trusted_auto}`}
                  target="76"
                  change={parseFloat((marketData.trusted_auto - 76).toFixed(1))}
                  lowerIsBetter={false}
                />
              </div>
            </div>

            {/* Category performance chart */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: '20px 20px 12px',
                marginBottom: 16,
                boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em', marginBottom: 4 }}>
                Category Performance — {selectedMarket}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
                Automation rate and escalation rate by category (global data)
              </div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 4, right: 8, left: -24, bottom: 40 }} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 10, fill: 'var(--muted)' }}
                      axisLine={false}
                      tickLine={false}
                      angle={-30}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="automation" name="Auto Rate %" fill="var(--bolt-green)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="escalation" name="Escalation %" fill="var(--red)" radius={[3, 3, 0, 0]} opacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="r-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Active issues */}
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
                  Active Issues — {selectedMarket}
                </div>
                {activeIssues.length === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>
                    No active issues
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {activeIssues.map((issue, i) => {
                      const sev = severityStyles[issue.severity] ?? severityStyles.P3;
                      const ftc = failureTypeColors[issue.type] ?? { color: 'var(--muted)' };
                      return (
                        <div
                          key={i}
                          style={{
                            padding: '12px 14px',
                            borderRadius: 10,
                            background: 'var(--athens-gray)',
                            border: '1px solid var(--line)',
                            display: 'flex',
                            gap: 10,
                            alignItems: 'flex-start',
                          }}
                        >
                          <span style={{ padding: '2px 6px', borderRadius: 5, background: sev.bg, color: sev.color, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                            {issue.severity}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--charade)', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                              {issue.issue}
                            </div>
                            <div style={{ fontSize: 11, marginTop: 4 }}>
                              <span style={{ color: ftc.color, fontWeight: 600 }}>{issue.type}</span>
                              <span style={{ color: 'var(--muted-2)', marginLeft: 6 }}>→ {issue.owner}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recommended actions */}
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
                  Recommended Actions
                </div>
                {recommendations.length === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>
                    No recommendations
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {recommendations.map((action, i) => {
                      const sev = severityStyles[action.priority] ?? severityStyles.P3;
                      return (
                        <div
                          key={i}
                          style={{
                            padding: '12px 14px',
                            borderRadius: 10,
                            background: 'var(--bolt-green-50)',
                            border: '1px solid var(--bolt-mint)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--charade)', letterSpacing: '-0.01em', lineHeight: 1.3, flex: 1 }}>
                              {action.title}
                            </div>
                            <span style={{ padding: '2px 6px', borderRadius: 5, background: sev.bg, color: sev.color, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                              {action.priority}
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--bolt-green-700)', marginTop: 6 }}>
                            {action.owner} · Due {action.due}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
