'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import portfolio from '@/data/automationPortfolio.json';
import { ChevronDown, ChevronUp } from 'lucide-react';

const recColors: Record<string, { bg: string; color: string }> = {
  'Scale': { bg: 'var(--bolt-green)', color: '#fff' },
  'Monitor / Fix': { bg: 'var(--amber-50)', color: '#b96c00' },
  'Monitor': { bg: 'var(--amber-50)', color: '#b96c00' },
  'Restrict': { bg: 'var(--red-50)', color: 'var(--red)' },
  'Pause / Fix API': { bg: 'var(--violet-50)', color: 'var(--violet)' },
  'Knowledge Fix Needed': { bg: 'var(--blue-50)', color: 'var(--blue)' },
  'Expansion Opportunity': { bg: 'var(--bolt-mint)', color: 'var(--bolt-green-700)' },
};

const riskColors: Record<string, { color: string }> = {
  'Low': { color: 'var(--bolt-green-700)' },
  'Medium': { color: '#b96c00' },
  'High': { color: 'var(--red)' },
  'Critical': { color: '#7a0000' },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  'Live': { bg: 'var(--bolt-green-50)', color: 'var(--bolt-green-700)' },
  'Degraded': { bg: 'var(--amber-50)', color: '#b96c00' },
  'Blocked': { bg: 'var(--red-50)', color: 'var(--red)' },
  'Restricted': { bg: 'var(--violet-50)', color: 'var(--violet)' },
};

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 75 ? 'var(--bolt-green-700)' : score >= 55 ? '#b96c00' : 'var(--red)';
  const bg = score >= 75 ? 'var(--bolt-green-50)' : score >= 55 ? 'var(--amber-50)' : 'var(--red-50)';
  return (
    <span style={{ fontWeight: 800, fontSize: 13, color, background: bg, padding: '2px 7px', borderRadius: 6 }}>
      {score}
    </span>
  );
}

// Summary counts
const summaryItems = [
  { label: 'Scale', count: portfolio.filter(p => p.recommendation === 'Scale').length, rec: 'Scale' },
  { label: 'Monitor / Fix', count: portfolio.filter(p => p.recommendation === 'Monitor / Fix' || p.recommendation === 'Monitor').length, rec: 'Monitor / Fix' },
  { label: 'Restrict', count: portfolio.filter(p => p.recommendation === 'Restrict').length, rec: 'Restrict' },
  { label: 'Pause / Fix API', count: portfolio.filter(p => p.recommendation === 'Pause / Fix API').length, rec: 'Pause / Fix API' },
  { label: 'Knowledge Fix', count: portfolio.filter(p => p.recommendation === 'Knowledge Fix Needed').length, rec: 'Knowledge Fix Needed' },
  { label: 'Expansion Opportunity', count: portfolio.filter(p => p.recommendation === 'Expansion Opportunity').length, rec: 'Expansion Opportunity' },
];

export default function AutomationPage() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <AppShell>
      <div style={{ maxWidth: 1200 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Automation Portfolio
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Trusted automation decisions by use case. Scale what works. Fix what doesn't. Restrict what's risky.
          </p>
        </div>

        {/* Summary chips */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {summaryItems.map(({ label, count, rec }) => {
            const rc = recColors[rec] ?? recColors['Monitor / Fix'];
            return (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  borderRadius: 10,
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: rc.bg,
                    color: rc.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  {count}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--charade)', letterSpacing: '-0.01em' }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Portfolio table */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: '0 0 4px',
            boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
            overflowX: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                {[
                  'Use Case', 'Market', 'Coverage', 'Auto Rate', 'TAS', 'CSAT',
                  'Escalation', 'Reopen', 'Risk', 'Status', 'Recommendation',
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--muted)',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      padding: '12px 12px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portfolio.map((item) => {
                const isExpanded = expandedRow === item.id;
                const rc = recColors[item.recommendation] ?? recColors['Monitor / Fix'];
                const risk = riskColors[item.compliance_risk] ?? { color: 'var(--muted)' };
                const st = statusColors[item.status] ?? statusColors.Live;
                return (
                  <>
                    <tr
                      key={item.id}
                      onClick={() => setExpandedRow(isExpanded ? null : item.id)}
                      style={{
                        cursor: 'pointer',
                        borderBottom: isExpanded ? 'none' : '1px solid var(--line-soft)',
                        background: isExpanded ? 'var(--bolt-green-50)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '12px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {isExpanded ? <ChevronUp size={13} color="var(--muted)" /> : <ChevronDown size={13} color="var(--muted)" />}
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--charade)', letterSpacing: '-0.01em' }}>
                              {item.use_case}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--muted-2)', fontFamily: 'JetBrains Mono, monospace' }}>
                              {item.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {item.market}
                      </td>
                      <td style={{ padding: '12px', fontSize: 13, fontWeight: 700, color: 'var(--charade)' }}>
                        {item.coverage}%
                      </td>
                      <td style={{ padding: '12px', fontSize: 13, fontWeight: 700, color: 'var(--charade)' }}>
                        {item.automation_resolution_rate}%
                      </td>
                      <td style={{ padding: '12px' }}>
                        <ScoreBadge score={item.trusted_auto_score} />
                      </td>
                      <td style={{ padding: '12px', fontSize: 13, fontWeight: 600, color: item.csat >= 4 ? 'var(--bolt-green-700)' : item.csat >= 3.5 ? '#b96c00' : 'var(--red)' }}>
                        {item.csat}
                      </td>
                      <td style={{ padding: '12px', fontSize: 13, fontWeight: 600, color: item.escalation_rate > 30 ? 'var(--red)' : item.escalation_rate > 20 ? '#b96c00' : 'var(--bolt-green-700)' }}>
                        {item.escalation_rate}%
                      </td>
                      <td style={{ padding: '12px', fontSize: 13, fontWeight: 600, color: item.reopen_rate > 14 ? 'var(--red)' : '#b96c00' }}>
                        {item.reopen_rate}%
                      </td>
                      <td style={{ padding: '12px', fontSize: 12, fontWeight: 600, color: risk.color }}>
                        {item.compliance_risk}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 20, background: st.bg, color: st.color, fontSize: 11, fontWeight: 600 }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: 20,
                            background: rc.bg,
                            color: rc.color,
                            fontSize: 11,
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.recommendation}
                        </span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${item.id}-expand`}>
                        <td colSpan={11} style={{ padding: '0 16px 16px', background: 'var(--bolt-green-50)', borderBottom: '1px solid var(--line)' }}>
                          <div
                            style={{
                              background: 'var(--surface)',
                              border: '1px solid var(--line)',
                              borderRadius: 10,
                              padding: '16px 18px',
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr 1fr',
                              gap: 16,
                            }}
                          >
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                                Recommendation Rationale
                              </div>
                              <div style={{ fontSize: 13, color: 'var(--charade)', lineHeight: 1.5 }}>
                                {item.recommendation_reason}
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                                Volume &amp; Owner
                              </div>
                              <div style={{ fontSize: 13, color: 'var(--charade)', lineHeight: 1.8 }}>
                                <div><strong>{item.volume_weekly.toLocaleString()}</strong> conversations/week</div>
                                <div>Owner: <strong>{item.owner}</strong></div>
                                <div>Vertical: {item.vertical}</div>
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                                Last Updated
                              </div>
                              <div style={{ fontSize: 13, color: 'var(--charade)' }}>
                                {new Date(item.last_updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </div>
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
