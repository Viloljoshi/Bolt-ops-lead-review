'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import backlog from '@/data/backlog.json';

const COLUMNS = [
  'New Signal',
  'Validated Issue',
  'Prioritized',
  'In Sprint',
  'Shipped',
  'Measuring Impact',
] as const;

type ColumnId = typeof COLUMNS[number];

const failureTypeColors: Record<string, { bg: string; color: string; leftBorder: string }> = {
  'Logic Fault': { bg: 'var(--red-50)', color: 'var(--red)', leftBorder: 'var(--red)' },
  'Classification Error': { bg: 'var(--amber-50)', color: '#b96c00', leftBorder: 'var(--amber)' },
  'Knowledge Gap': { bg: 'var(--blue-50)', color: 'var(--blue)', leftBorder: 'var(--blue)' },
  'Tool API Failure': { bg: 'var(--violet-50)', color: 'var(--violet)', leftBorder: 'var(--violet)' },
  'Compliance Blocker': { bg: 'var(--red-50)', color: '#7a0000', leftBorder: '#7a0000' },
  'UX Tone': { bg: 'var(--bolt-green-50)', color: 'var(--bolt-green-700)', leftBorder: 'var(--bolt-green)' },
  'Localization': { bg: 'var(--bolt-mint)', color: 'var(--bolt-green-700)', leftBorder: 'var(--bolt-green)' },
  'Expansion Opportunity': { bg: 'var(--bolt-green-50)', color: 'var(--bolt-green-700)', leftBorder: 'var(--bolt-green)' },
};

function PriorityBadge({ score }: { score: number }) {
  const bg = score >= 90 ? 'var(--bolt-green)' : score >= 75 ? 'var(--amber)' : 'var(--blue)';
  const color = score >= 90 ? '#fff' : score >= 75 ? '#fff' : '#fff';
  return (
    <span
      style={{
        padding: '2px 7px',
        borderRadius: 6,
        background: bg,
        color,
        fontSize: 11,
        fontWeight: 800,
      }}
    >
      {score}
    </span>
  );
}

function BacklogCard({ item }: { item: (typeof backlog)[number] }) {
  const ft = item.failure_type ? (failureTypeColors[item.failure_type] ?? failureTypeColors['Logic Fault']) : failureTypeColors['Expansion Opportunity'];
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 10,
        padding: '12px 14px',
        borderLeft: `3px solid ${ft.leftBorder}`,
        boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--charade)', lineHeight: 1.3, flex: 1, letterSpacing: '-0.01em' }}>
          {item.title}
        </div>
        <PriorityBadge score={item.priority_score} />
      </div>

      {item.failure_type && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 7px',
            borderRadius: 20,
            background: ft.bg,
            color: ft.color,
            fontSize: 10,
            fontWeight: 600,
            alignSelf: 'flex-start',
          }}
        >
          {item.failure_type}
        </span>
      )}
      {!item.failure_type && item.label && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 7px',
            borderRadius: 20,
            background: ft.bg,
            color: ft.color,
            fontSize: 10,
            fontWeight: 600,
            alignSelf: 'flex-start',
          }}
        >
          {item.label}
        </span>
      )}

      <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>
        {item.expected_impact}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--muted-2)', letterSpacing: '-0.01em' }}>
            {item.market} · {item.vertical}
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 500 }}>
            {item.owner}
          </div>
        </div>
        {item.due_date && (
          <span style={{ fontSize: 10, color: 'var(--muted-2)' }}>
            Due {new Date(item.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>
    </div>
  );
}

export default function BacklogPage() {
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const byStatus: Record<ColumnId, typeof backlog> = {
    'New Signal': [],
    'Validated Issue': [],
    'Prioritized': [],
    'In Sprint': [],
    'Shipped': [],
    'Measuring Impact': [],
  };

  for (const item of backlog) {
    const col = item.status as ColumnId;
    if (byStatus[col]) {
      byStatus[col].push(item);
    }
  }

  return (
    <AppShell>
      <div style={{ maxWidth: 1400 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--charade)', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Improvement Backlog
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Kanban board tracking every identified improvement from signal to measured impact.
          </p>
        </div>

        {/* Integration banner */}
        {!bannerDismissed && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '10px 16px',
              marginBottom: 20,
              borderRadius: 10,
              background: 'var(--blue-50)',
              border: '1px solid #b3cef7',
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🔗</span>
            <p style={{ fontSize: 12, color: 'var(--blue)', lineHeight: 1.5, flex: 1, margin: 0 }}>
              This board is live-synced with <strong>Jira</strong> (AI-OPS project), <strong>Slack</strong> (#alfred-ops-sprint), and <strong>Microsoft Teams</strong> (AI Ops channel). Card status changes trigger automated Slack notifications. Sprint assignments auto-populate the engineering sprint board. Jira ticket IDs are linked in each card.
            </p>
            <button
              onClick={() => setBannerDismissed(true)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 2,
                color: 'var(--blue)',
                fontSize: 16,
                lineHeight: 1,
                flexShrink: 0,
              }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* Summary */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {COLUMNS.map((col) => (
            <div
              key={col}
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                fontSize: 12,
                color: 'var(--muted)',
                fontWeight: 500,
              }}
            >
              <strong style={{ color: 'var(--charade)' }}>{byStatus[col].length}</strong> {col}
            </div>
          ))}
        </div>

        {/* Kanban board */}
        <div
          className="r-table-wrap"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(200px, 1fr))`,
            gap: 12,
            overflowX: 'auto',
          }}
        >
          {COLUMNS.map((col) => (
            <div key={col} style={{ minWidth: 200 }}>
              {/* Column header */}
              <div
                style={{
                  padding: '8px 12px 10px',
                  borderRadius: '10px 10px 0 0',
                  background: 'var(--charade)',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  marginBottom: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{col}</span>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    padding: '1px 6px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {byStatus[col].length}
                </span>
              </div>

              {/* Column body */}
              <div
                style={{
                  background: 'var(--athens-gray)',
                  border: '1px solid var(--line)',
                  borderTop: 'none',
                  borderRadius: '0 0 10px 10px',
                  padding: '10px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  minHeight: 200,
                }}
              >
                {byStatus[col].length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 12, color: 'var(--muted-2)' }}>
                    No items
                  </div>
                )}
                {byStatus[col]
                  .sort((a, b) => b.priority_score - a.priority_score)
                  .map((item) => (
                    <BacklogCard key={item.id} item={item} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
