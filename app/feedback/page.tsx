'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { CheckCircle2, XCircle, UserPlus, Plus, MessageSquare, AlertTriangle, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TABS = ['Feedback Inbox', 'Root Cause Clusters', 'Closed Loops'];

const pipelineSteps = [
  'Customer Query',
  'Alfred Response',
  'Outcome Signal',
  'Failure Classification',
  'Root Cause Cluster',
  'Improvement Action',
  'Owner Assignment',
  'Fix Deploy',
  'Regression Eval',
  'Metric Impact',
];

const feedbackItems = [
  {
    id: 'FB-001',
    source: 'CSAT',
    sourceLabel: '★ 1 — CSAT Rating',
    snippet: '"You guys charged me twice for the same trip! I can see two identical charges..."',
    issue: 'Duplicate charge misclassified as promo code issue',
    failureType: 'Classification Error',
    severity: 'P1',
    confidence: 0.88,
    stage: 3,
  },
  {
    id: 'FB-002',
    source: 'Agent Override',
    sourceLabel: '↩ Agent Override',
    snippet: '"My weekly payout hasn\'t arrived. It\'s been 5 days now. I have bills to pay..."',
    issue: 'Nigerian payout timeline incorrect in knowledge base',
    failureType: 'Knowledge Gap',
    severity: 'P1',
    confidence: 0.92,
    stage: 6,
  },
  {
    id: 'FB-003',
    source: 'System Alert',
    sourceLabel: '⚠ System Alert',
    snippet: '"Der Roller lässt sich nicht entsperren. Ich stehe hier seit 10 Minuten..."',
    issue: 'Vehicle telemetry API timeout — no fallback triggered',
    failureType: 'Tool API Failure',
    severity: 'P1',
    confidence: 0.95,
    stage: 7,
  },
  {
    id: 'FB-004',
    source: 'CSAT',
    sourceLabel: '★ 1 — CSAT Rating',
    snippet: '"El conductor me asustó mucho durante el viaje. Tomó rutas extrañas..."',
    issue: 'Safety complaint received cold, bureaucratic response',
    failureType: 'UX Tone',
    severity: 'P0',
    confidence: 0.84,
    stage: 4,
  },
  {
    id: 'FB-005',
    source: 'Customer Comment',
    sourceLabel: '💬 Customer Comment',
    snippet: '"Zamówiłem jedzenie ale nie dotarło. Chcę zwrotu..."',
    issue: 'Poland refund denied despite local non-delivery exception',
    failureType: 'Logic Fault',
    severity: 'P1',
    confidence: 0.91,
    stage: 5,
  },
  {
    id: 'FB-006',
    source: 'Agent Override',
    sourceLabel: '↩ Agent Override',
    snippet: '"The driver took a completely different route and my fare was 3x the estimate..."',
    issue: 'Route fraud signal dismissed — no fraud detection triggered',
    failureType: 'Logic Fault',
    severity: 'P1',
    confidence: 0.79,
    stage: 3,
  },
  {
    id: 'FB-007',
    source: 'CSAT',
    sourceLabel: '★ 2 — CSAT Rating',
    snippet: '"I left my phone in the delivery bag. The courier is not answering my calls..."',
    issue: 'Missing escalation path when self-service contact fails',
    failureType: 'Knowledge Gap',
    severity: 'P3',
    confidence: 0.76,
    stage: 4,
  },
  {
    id: 'FB-008',
    source: 'System Alert',
    sourceLabel: '⚠ System Alert',
    snippet: '"Mera account verify nahi ho raha hai. Documents upload kiye 2 hafte pehle..."',
    issue: 'KYC API timeout with no fallback or escalation path',
    failureType: 'Tool API Failure',
    severity: 'P1',
    confidence: 0.87,
    stage: 6,
  },
];

const rootCauses = [
  {
    id: 'RC-001',
    cluster: 'Wrong charge misclassified as promo issue',
    cases: 58,
    markets: ['🇮🇳 IN', '🇳🇬 NG', '🇿🇦 ZA'],
    csatImpact: -0.4,
    escalationImpact: '+8pp',
    owner: 'ML / AI Product',
    sprint: 'Sprint 25',
    priority: 'P1',
  },
  {
    id: 'RC-002',
    cluster: 'Refund denied despite eligible delivery delay',
    cases: 42,
    markets: ['🇵🇱 PL', '🇰🇪 KE'],
    csatImpact: -0.6,
    escalationImpact: '+11pp',
    owner: 'CS Product',
    sprint: 'Sprint 24',
    priority: 'P1',
  },
  {
    id: 'RC-003',
    cluster: 'Driver payout delay policy missing in Nigeria',
    cases: 47,
    markets: ['🇳🇬 NG'],
    csatImpact: -0.5,
    escalationImpact: '+34%',
    owner: 'Local Ops / KM',
    sprint: 'Sprint 24',
    priority: 'P1',
  },
  {
    id: 'RC-004',
    cluster: 'Safety complaints receiving generic tone',
    cases: 28,
    markets: ['🇲🇽 MX'],
    csatImpact: -0.7,
    escalationImpact: 'No impact',
    owner: 'Conversation Design',
    sprint: 'Sprint 25',
    priority: 'P2',
  },
  {
    id: 'RC-005',
    cluster: 'API timeout causing incomplete vehicle unlock support',
    cases: 89,
    markets: ['🇩🇪 DE'],
    csatImpact: -1.1,
    escalationImpact: '+22pp',
    owner: 'Engineering / Platform',
    sprint: 'Sprint 24',
    priority: 'P1',
  },
];

const closedLoops = [
  {
    id: 'CL-001',
    title: 'Nigeria Payout Knowledge Fix',
    date: 'Apr 14, 2026',
    status: 'Shipped',
    before: { automation: 44, escalation: 52, reopen: 24, csat: 3.0 },
    after: { automation: 58, escalation: 38, reopen: 16, csat: 3.4 },
    isActual: true,
  },
  {
    id: 'CL-002',
    title: 'Poland Refund Logic Fix (Sprint 23)',
    date: 'In Progress — projected impact',
    status: 'In Sprint',
    before: { automation: 52, escalation: 38, reopen: 14, csat: 3.1 },
    after: { automation: 68, escalation: 22, reopen: 7, csat: 4.0 },
    isActual: false,
  },
];

const failureTypeColors: Record<string, { bg: string; color: string }> = {
  'Logic Fault': { bg: 'var(--red-50)', color: 'var(--red)' },
  'Classification Error': { bg: 'var(--amber-50)', color: '#b96c00' },
  'Knowledge Gap': { bg: 'var(--blue-50)', color: 'var(--blue)' },
  'Tool API Failure': { bg: 'var(--violet-50)', color: 'var(--violet)' },
  'UX Tone': { bg: 'var(--bolt-green-50)', color: 'var(--bolt-green-700)' },
};

const severityStyles: Record<string, { bg: string; color: string }> = {
  P0: { bg: '#2C2D33', color: '#fff' },
  P1: { bg: 'var(--red-50)', color: 'var(--red)' },
  P2: { bg: 'var(--amber-50)', color: '#b96c00' },
  P3: { bg: 'var(--blue-50)', color: 'var(--blue)' },
};

function MetricDiff({ label, before, after, lowerIsBetter = false }: {
  label: string;
  before: number;
  after: number;
  lowerIsBetter?: boolean;
}) {
  const diff = after - before;
  const isGood = lowerIsBetter ? diff < 0 : diff > 0;
  return (
    <div
      style={{
        flex: 1,
        padding: '10px 12px',
        background: 'var(--surface-2)',
        borderRadius: 8,
        border: '1px solid var(--line)',
      }}
    >
      <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>{before}{label === 'CSAT' ? '' : '%'}</span>
        <span style={{ fontSize: 11, color: 'var(--muted-2)' }}>→</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--charade)' }}>{after}{label === 'CSAT' ? '' : '%'}</span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            padding: '1px 6px',
            borderRadius: 20,
            background: isGood ? 'var(--bolt-green-50)' : 'var(--red-50)',
            color: isGood ? 'var(--bolt-green-700)' : 'var(--red)',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {diff > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {Math.abs(diff)}{label === 'CSAT' ? '' : 'pp'}
        </span>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeStage, setActiveStage] = useState(4);

  return (
    <AppShell>
      <div style={{ maxWidth: 1200 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Feedback Loop System
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            From customer signal to deployed fix. Close every loop with evidence.
          </p>
        </div>

        {/* Pipeline visualization */}
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
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginBottom: 12 }}>
            Feedback Pipeline
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 4 }}>
            {pipelineSteps.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <button
                  onClick={() => setActiveStage(i)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: `1px solid ${activeStage === i ? 'var(--bolt-green)' : 'var(--line)'}`,
                    background: activeStage === i ? 'var(--bolt-green)' : i < activeStage ? 'var(--bolt-green-50)' : 'var(--surface)',
                    color: activeStage === i ? '#fff' : i < activeStage ? 'var(--bolt-green-700)' : 'var(--muted)',
                    fontSize: 11,
                    fontWeight: activeStage === i ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {i + 1}. {step}
                </button>
                {i < pipelineSteps.length - 1 && (
                  <div style={{ width: 20, height: 1, background: i < activeStage ? 'var(--bolt-green)' : 'var(--line)', flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--muted)' }}>
            Current stage: <strong style={{ color: 'var(--charade)' }}>{pipelineSteps[activeStage]}</strong>
            {' '}· Click any step to highlight it in the pipeline.
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: '1px solid',
                borderColor: activeTab === i ? 'var(--bolt-green)' : 'var(--line)',
                background: activeTab === i ? 'var(--bolt-green)' : 'var(--surface)',
                color: activeTab === i ? '#fff' : 'var(--muted)',
                fontSize: 13,
                fontWeight: activeTab === i ? 700 : 500,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab: Feedback Inbox */}
        {activeTab === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {feedbackItems.map((item) => {
              const ft = failureTypeColors[item.failureType] ?? { bg: 'var(--bolt-green-50)', color: 'var(--bolt-green-700)' };
              const sev = severityStyles[item.severity] ?? severityStyles.P3;
              return (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: 12,
                    padding: '16px 18px',
                    boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div
                      style={{
                        padding: '3px 10px',
                        borderRadius: 20,
                        background: 'var(--athens-gray)',
                        border: '1px solid var(--line)',
                        fontSize: 11,
                        color: 'var(--muted)',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {item.sourceLabel}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 6, lineHeight: 1.5 }}>
                        {item.snippet}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--charade)', letterSpacing: '-0.01em' }}>
                        {item.issue}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 20, background: ft.bg, color: ft.color, fontSize: 11, fontWeight: 600 }}>
                        {item.failureType}
                      </span>
                      <span style={{ padding: '2px 6px', borderRadius: 5, background: sev.bg, color: sev.color, fontSize: 11, fontWeight: 700 }}>
                        {item.severity}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--muted-2)' }}>{(item.confidence * 100).toFixed(0)}% conf</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button
                      style={{
                        padding: '5px 12px',
                        borderRadius: 8,
                        border: 'none',
                        background: 'var(--bolt-green)',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <CheckCircle2 size={12} /> Approve Classification
                    </button>
                    {['Reject', 'Assign Owner', 'Add to Backlog'].map((label) => (
                      <button
                        key={label}
                        style={{
                          padding: '5px 12px',
                          borderRadius: 8,
                          border: '1px solid var(--line)',
                          background: 'var(--surface)',
                          color: 'var(--muted)',
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab: Root Cause Clusters */}
        {activeTab === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {rootCauses.map((rc) => {
              const sev = severityStyles[rc.priority] ?? severityStyles.P3;
              return (
                <div
                  key={rc.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: 12,
                    padding: '18px 20px',
                    boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em', lineHeight: 1.3, flex: 1, marginRight: 8 }}>
                      {rc.cluster}
                    </div>
                    <span style={{ padding: '2px 7px', borderRadius: 5, background: sev.bg, color: sev.color, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {rc.priority}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--charade)' }}>{rc.cases} cases</span>
                    {rc.markets.map((m) => (
                      <span
                        key={m}
                        style={{
                          padding: '1px 8px',
                          borderRadius: 20,
                          background: 'var(--athens-gray)',
                          color: 'var(--muted)',
                          fontSize: 11,
                          fontWeight: 500,
                        }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                    <div style={{ padding: '8px 10px', background: 'var(--red-50)', borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: 'var(--red)', fontWeight: 500 }}>CSAT Impact</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--red)' }}>{rc.csatImpact}</div>
                    </div>
                    <div style={{ padding: '8px 10px', background: 'var(--amber-50)', borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: '#b96c00', fontWeight: 500 }}>Escalation Impact</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#b96c00' }}>{rc.escalationImpact}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      Owner: <strong style={{ color: 'var(--charade)' }}>{rc.owner}</strong>
                    </div>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 20,
                        background: 'var(--bolt-green-50)',
                        color: 'var(--bolt-green-700)',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {rc.sprint}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab: Closed Loops */}
        {activeTab === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {closedLoops.map((cl) => (
              <div
                key={cl.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 14,
                  padding: '22px 24px',
                  boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.025em' }}>
                      {cl.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{cl.date}</div>
                  </div>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 20,
                      background: cl.isActual ? 'var(--bolt-green-50)' : 'var(--amber-50)',
                      color: cl.isActual ? 'var(--bolt-green-700)' : '#b96c00',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {cl.status}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  <MetricDiff label="Automation" before={cl.before.automation} after={cl.after.automation} />
                  <MetricDiff label="Escalation" before={cl.before.escalation} after={cl.after.escalation} lowerIsBetter />
                  <MetricDiff label="Reopen" before={cl.before.reopen} after={cl.after.reopen} lowerIsBetter />
                  <MetricDiff label="CSAT" before={cl.before.csat} after={cl.after.csat} />
                </div>
                {!cl.isActual && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: '8px 14px',
                      background: 'var(--amber-50)',
                      borderRadius: 8,
                      fontSize: 12,
                      color: '#b96c00',
                      fontWeight: 500,
                    }}
                  >
                    Projected impact — BLG-001 in Sprint 24, expected to ship by May 5.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
