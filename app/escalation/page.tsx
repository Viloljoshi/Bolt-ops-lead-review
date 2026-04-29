'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import incidents from '@/data/incidents.json';
import { X, AlertTriangle, Shield, Globe } from 'lucide-react';

const severityStyles: Record<string, { bg: string; color: string; border: string }> = {
  P0: { bg: '#2C2D33', color: '#fff', border: '#444' },
  P1: { bg: 'var(--red-50)', color: 'var(--red)', border: '#f5b8ba' },
  P2: { bg: 'var(--amber-50)', color: '#b96c00', border: '#f8d8a0' },
  P3: { bg: 'var(--blue-50)', color: 'var(--blue)', border: '#b3cef7' },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  'In Progress': { bg: 'var(--blue-50)', color: 'var(--blue)' },
  'Open': { bg: 'var(--red-50)', color: 'var(--red)' },
  'Resolved': { bg: 'var(--bolt-green-50)', color: 'var(--bolt-green-700)' },
  'Monitoring': { bg: 'var(--amber-50)', color: '#b96c00' },
};

const complianceRules = [
  { title: 'Physical safety incidents', description: 'Any report involving physical danger, assault, or threat must route immediately to Safety team with <2min human SLA. Alfred must never fully resolve these.', risk: 'Critical' },
  { title: 'GDPR Art.22 automated decisions', description: 'Alfred must log decision rationale for all automated decisions (refund denials, suspensions, safety outcomes). Customer must be able to request human review. Applies across all EU markets.', risk: 'Critical' },
  { title: 'Payment disputes above market threshold', description: 'Human review required by law in Kenya (>KSh 5,000), India (>₹10,000), Mexico (Banxico rules). Alfred cannot legally resolve high-value disputes automatically in these markets.', risk: 'Critical' },
  { title: 'Account suspensions and restrictions', description: 'Account suspensions and access restrictions always require human review. Automated suspension is a compliance risk under GDPR and most market-specific digital service laws.', risk: 'Critical' },
  { title: 'Fraud allegations (in either direction)', description: 'Cases where customers or drivers allege intentional fraud must be reviewed by Risk team + human agent before any response. Automated resolution creates liability exposure.', risk: 'High' },
  { title: 'Identity verification outcomes', description: 'KYC decisions (pass/fail) require human validation. Identity errors create downstream financial, safety, and regulatory exposure. Alfred must not make final KYC determinations.', risk: 'High' },
  { title: 'Repeated refund patterns (3+ in 30 days)', description: 'Customers with 3+ refund requests in 30 days must pass a fraud review gate before any refund is approved. Each individual interaction may look legitimate — only the pattern is the signal.', risk: 'High' },
  { title: 'Legal threats — "I will sue" language detected', description: 'Any message containing legal action threats must trigger immediate Legal team notification. Alfred response must acknowledge and route, never defend or dismiss.', risk: 'High' },
  { title: 'Child / minor safety mentions', description: 'Any mention of children, minors, or child safety must trigger mandatory human escalation and CSAM protocol. Zero tolerance for AI-only handling under any circumstances.', risk: 'Critical' },
  { title: 'Driver deactivation appeals', description: 'Driver deactivation appeals always require human + HR/legal review. Automated denial of livelihood appeals creates labor law exposure across multiple markets.', risk: 'High' },
];

const regulatoryExposure = [
  {
    market: '🇪🇪 Estonia / EU',
    regulation: 'GDPR Art. 22',
    requirement: 'Customers must be able to request human review of any automated decision that significantly affects them — refund denials, account suspensions, safety report outcomes. Alfred must log all automated decisions with explainability metadata.',
    alfredRisk: 'Alfred resolves cases without logging decision rationale. Customer cannot request review of a decision they do not know was automated.',
    status: 'Partial',
  },
  {
    market: '🇩🇪 Germany',
    regulation: 'GDPR + BDSG',
    requirement: 'Germany adds stricter data minimization rules — Alfred must not retain conversation content longer than necessary. BaFin oversight applies to any AI that makes payment-adjacent decisions. Automated decisions affecting financial interests require human escalation path.',
    alfredRisk: 'Alfred handles payment disputes without clear human review SLA. BDSG requires documentation of automated processing.',
    status: 'Gap',
  },
  {
    market: '🇵🇱 Poland',
    regulation: 'GDPR + UODO',
    requirement: 'Polish DPA (UODO) has been actively enforcing GDPR Art. 22. Consumer protection under EU Directive 2019/770 requires explainability for digital service decisions. Refund denial must be explainable and appealable.',
    alfredRisk: 'Alfred denies refunds without explanation or clear appeal path. UODO can fine up to €20M.',
    status: 'Gap — P1',
  },
  {
    market: '🇳🇬 Nigeria',
    regulation: 'NDPR + CBN Consumer Protection',
    requirement: 'Nigeria Data Protection Regulation (NDPR) requires consent for AI processing. CBN Circular on AI in Financial Services (2023) mandates human oversight for payment-adjacent decisions. CBN can suspend fintech licenses for non-compliance.',
    alfredRisk: 'Alfred processes payment disputes automatically without CBN-compliant human oversight pathway.',
    status: 'Needs Review',
  },
  {
    market: '🇰🇪 Kenya',
    regulation: 'Data Protection Act 2019 + NPSA',
    requirement: 'DPA 2019 regulates automated processing of personal data. NPSA governs payment dispute resolution timelines — human review required within 5 business days for disputes above KSh 5,000. Alfred cannot legally resolve high-value disputes automatically.',
    alfredRisk: 'Alfred automatically resolves payment disputes above the legal threshold without human review documentation.',
    status: 'Gap',
  },
  {
    market: '🇮🇳 India',
    regulation: 'DPDP Act 2023 + RBI Master Directions',
    requirement: 'Digital Personal Data Protection Act 2023 requires consent and grievance redressal. RBI Master Directions on Prepaid Payment Instruments mandate human escalation for disputes above ₹10,000. Automated resolution above threshold = RBI violation.',
    alfredRisk: 'Alfred resolves high-value payment disputes automatically. No grievance officer pathway evident.',
    status: 'Needs Review',
  },
  {
    market: '🇿🇦 South Africa',
    regulation: 'POPIA + National Credit Act',
    requirement: 'Protection of Personal Information Act requires data minimization and consent. NCA regulates credit and payment dispute resolution — human review required for disputes.',
    alfredRisk: 'Alfred processes sensitive personal data without clear POPIA consent framework.',
    status: 'Partial',
  },
  {
    market: '🇲🇽 Mexico',
    regulation: 'LFPDPPP + Banxico',
    requirement: 'Ley Federal de Protección de Datos Personales regulates automated processing. Banxico rules for payment service providers require human oversight for disputes.',
    alfredRisk: 'Alfred automated decisions on payment disputes may not meet Banxico review requirements.',
    status: 'Needs Review',
  },
];

const statusComplianceColors: Record<string, { bg: string; color: string }> = {
  'Gap': { bg: 'var(--red-50)', color: 'var(--red)' },
  'Gap — P1': { bg: '#2C2D33', color: '#fff' },
  'Needs Review': { bg: 'var(--amber-50)', color: '#b96c00' },
  'Partial': { bg: 'var(--blue-50)', color: 'var(--blue)' },
  'Compliant': { bg: 'var(--bolt-green-50)', color: 'var(--bolt-green-700)' },
};

const riskColors: Record<string, { bg: string; color: string }> = {
  'Critical': { bg: '#2C2D33', color: '#fff' },
  'High': { bg: 'var(--red-50)', color: 'var(--red)' },
  'Medium': { bg: 'var(--amber-50)', color: '#b96c00' },
};

const severityCounts = ['P0', 'P1', 'P2', 'P3'].map((sev) => ({
  sev,
  count: incidents.filter((i) => i.severity === sev).length,
}));

export default function EscalationPage() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'incidents' | 'regulatory'>('incidents');
  const selected = incidents.find((i) => i.id === selectedIncident) ?? null;

  return (
    <AppShell>
      <div style={{ maxWidth: 1200 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Escalation &amp; Compliance Desk
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Active incidents, compliance guardrails, and escalation tracking.
          </p>
        </div>

        {/* Severity counts */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {severityCounts.map(({ sev, count }) => {
            const s = severityStyles[sev];
            return (
              <div
                key={sev}
                style={{
                  padding: '14px 20px',
                  borderRadius: 12,
                  background: 'var(--surface)',
                  border: `1px solid ${s.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: s.bg,
                    color: s.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 15,
                  }}
                >
                  {count}
                </span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: s.bg === '#2C2D33' ? 'var(--charade)' : s.color, letterSpacing: '-0.03em' }}>
                    {sev}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {sev === 'P0' ? 'Critical' : sev === 'P1' ? 'High' : sev === 'P2' ? 'Medium' : 'Low'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab navigation */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--line)', paddingBottom: 0 }}>
          {[
            { id: 'incidents' as const, label: 'Open Incidents' },
            { id: 'regulatory' as const, label: 'Regulatory Exposure Matrix' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--charade)' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--charade)' : 'var(--muted)',
                letterSpacing: '-0.01em',
                marginBottom: -1,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'regulatory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
            {/* GDPR Art. 22 metrics */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: '20px',
                boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Shield size={15} color="var(--blue)" />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em' }}>
                  GDPR Article 22 — Automated Decision Monitoring
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  { label: 'Automated decisions this week', value: '14,200', sub: 'total AI resolutions', color: 'var(--charade)' },
                  { label: 'With logged decision rationale', value: '68%', sub: 'gap: 32% unlogged', color: '#b96c00' },
                  { label: 'Human review requests received', value: '4', sub: 'this week', color: 'var(--charade)' },
                  { label: 'Avg time to human review', value: '3.2 days', sub: 'SLA target: 1 day', color: 'var(--red)' },
                ].map((m) => (
                  <div key={m.label} style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--athens-gray)', border: '1px solid var(--line)' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, lineHeight: 1.3 }}>{m.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: m.color, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{m.value}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted-2)', marginTop: 4 }}>{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-market regulatory table */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 14,
                boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
                overflowX: 'auto',
              }}
            >
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe size={15} color="var(--muted)" />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em' }}>
                  Per-Market Regulatory Requirements
                </span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)' }}>
                    {['Market', 'Regulation', 'Requirement for AI', 'Alfred Risk', 'Status'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.03em', padding: '10px 14px', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {regulatoryExposure.map((row) => {
                    const sc = statusComplianceColors[row.status] ?? statusComplianceColors['Needs Review'];
                    return (
                      <tr key={row.market} style={{ borderBottom: '1px solid var(--line-soft)', verticalAlign: 'top' }}>
                        <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: 'var(--charade)', whiteSpace: 'nowrap' }}>{row.market}</td>
                        <td style={{ padding: '12px 14px', fontSize: 11, color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{row.regulation}</td>
                        <td style={{ padding: '12px 14px', fontSize: 11, color: 'var(--charade)', lineHeight: 1.5, maxWidth: 280 }}>{row.requirement}</td>
                        <td style={{ padding: '12px 14px', fontSize: 11, color: 'var(--red)', lineHeight: 1.5, maxWidth: 220 }}>{row.alfredRisk}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: 20, background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Enhanced guardrails */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: '20px',
                boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <AlertTriangle size={15} color="var(--red)" />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em' }}>
                  AI-Specific Compliance Guardrails Alfred Must Respect
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {complianceRules.map((rule, i) => {
                  const rc = riskColors[rule.risk] ?? riskColors.Medium;
                  return (
                    <div
                      key={rule.title}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: 'var(--athens-gray)',
                        border: '1px solid var(--line)',
                        borderLeft: `3px solid ${rule.risk === 'Critical' ? '#2C2D33' : rule.risk === 'High' ? 'var(--red)' : 'var(--amber)'}`,
                        display: 'flex',
                        gap: 10,
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted-2)', flexShrink: 0, width: 16 }}>{i + 1}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--charade)', lineHeight: 1.3, flex: 1 }}>{rule.title}</div>
                          <span style={{ padding: '1px 6px', borderRadius: 20, background: rc.bg, color: rc.color, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{rule.risk}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{rule.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'incidents' && (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: 16, marginBottom: 24 }}>
          {/* Incident table */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
              overflowX: 'auto',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', fontSize: 14, fontWeight: 700, color: 'var(--charade)' }}>
              Open Incidents
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  {['ID', 'Severity', 'Market', 'Category', 'Title', 'Status', 'SLA', 'Owner'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        padding: '10px 12px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => {
                  const sev = severityStyles[inc.severity];
                  const st = statusColors[inc.status] ?? statusColors.Open;
                  const isSelected = selectedIncident === inc.id;
                  return (
                    <tr
                      key={inc.id}
                      onClick={() => setSelectedIncident(isSelected ? null : inc.id)}
                      style={{
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--line-soft)',
                        background: isSelected ? 'var(--bolt-green-50)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '12px 12px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--muted)' }}>
                        {inc.id}
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        <span style={{ padding: '2px 7px', borderRadius: 5, background: sev.bg, color: sev.color, fontSize: 11, fontWeight: 700 }}>
                          {inc.severity}
                        </span>
                      </td>
                      <td style={{ padding: '12px 12px', fontSize: 12, color: 'var(--charade)', whiteSpace: 'nowrap' }}>
                        {inc.market}
                      </td>
                      <td style={{ padding: '12px 12px', fontSize: 12, color: 'var(--muted)' }}>
                        {inc.category}
                      </td>
                      <td style={{ padding: '12px 12px', fontSize: 12, color: 'var(--charade)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {inc.title}
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 20, background: st.bg, color: st.color, fontSize: 11, fontWeight: 600 }}>
                          {inc.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 12px', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {inc.sla}
                      </td>
                      <td style={{ padding: '12px 12px', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {inc.owner}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          {selected && (
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: '20px',
                boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setSelectedIncident(null)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'var(--athens-gray)',
                  border: '1px solid var(--line)',
                  borderRadius: 6,
                  padding: 4,
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <X size={14} color="var(--muted)" />
              </button>

              <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--muted)', marginBottom: 6 }}>
                {selected.id}
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <span style={{ padding: '2px 7px', borderRadius: 5, background: severityStyles[selected.severity].bg, color: severityStyles[selected.severity].color, fontSize: 11, fontWeight: 700 }}>
                  {selected.severity}
                </span>
                <span style={{ padding: '2px 8px', borderRadius: 20, background: (statusColors[selected.status] ?? statusColors.Open).bg, color: (statusColors[selected.status] ?? statusColors.Open).color, fontSize: 11, fontWeight: 600 }}>
                  {selected.status}
                </span>
              </div>

              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.02em', lineHeight: 1.4, marginBottom: 14 }}>
                {selected.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Description', value: selected.description },
                  { label: 'Trigger', value: selected.trigger },
                  { label: 'Customer Impact', value: selected.customer_impact },
                  { label: 'Recommended Action', value: selected.recommended_action },
                  { label: 'Escalated To', value: selected.escalated_to },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 4 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--charade)', lineHeight: 1.5 }}>{value}</div>
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 4 }}>
                    Compliance Risk
                  </div>
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: selected.compliance_risk.startsWith('Critical') || selected.compliance_risk.startsWith('High') ? 'var(--red-50)' : 'var(--amber-50)',
                      color: selected.compliance_risk.startsWith('Critical') || selected.compliance_risk.startsWith('High') ? 'var(--red)' : '#b96c00',
                      fontSize: 12,
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    {selected.compliance_risk}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        )}
      </div>
    </AppShell>
  );
}
