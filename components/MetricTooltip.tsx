'use client';
import { useState } from 'react';

interface MetricTooltipProps {
  definition: string;
  whyItMatters: string;
  decisionTrigger: string;
  owner: string;
  direction: 'positive' | 'negative';
}

export default function MetricTooltip({
  definition,
  whyItMatters,
  decisionTrigger,
  owner,
}: MetricTooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 14,
          height: 14,
          borderRadius: '50%',
          border: '1px solid var(--muted)',
          color: 'var(--muted)',
          fontSize: 9,
          fontWeight: 700,
          cursor: 'pointer',
          flexShrink: 0,
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        i
      </span>

      {visible && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 200,
            marginTop: 6,
            width: 280,
            background: '#fff',
            borderRadius: 14,
            borderTop: '3px solid var(--bolt-green)',
            boxShadow: '0 8px 32px rgba(20,22,28,0.16), 0 2px 8px rgba(20,22,28,0.08)',
            padding: '14px 16px',
            pointerEvents: 'none',
          }}
        >
          {/* Definition */}
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: 3,
              }}
            >
              Definition
            </div>
            <div style={{ fontSize: 12, color: '#2C2D33', lineHeight: 1.55 }}>
              {definition}
            </div>
          </div>

          {/* Why we track it */}
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: 3,
              }}
            >
              Why we track it
            </div>
            <div style={{ fontSize: 12, color: '#2C2D33', lineHeight: 1.55 }}>
              {whyItMatters}
            </div>
          </div>

          {/* Decision trigger */}
          <div
            style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 8,
              padding: '8px 10px',
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: 11, color: '#92400E', lineHeight: 1.55 }}>
              <span style={{ marginRight: 4 }}>⚡</span>
              {decisionTrigger}
            </div>
          </div>

          {/* Owner badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Owner
            </div>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 20,
                background: 'var(--athens-gray)',
                color: '#2C2D33',
                fontSize: 11,
                fontWeight: 600,
                border: '1px solid var(--line)',
              }}
            >
              {owner}
            </span>
          </div>
        </div>
      )}
    </span>
  );
}
