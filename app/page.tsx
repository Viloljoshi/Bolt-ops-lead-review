import Link from 'next/link';
import { Activity, Search, RefreshCw, TrendingUp, ArrowRight, Zap } from 'lucide-react';

const pillars = [
  {
    icon: Activity,
    title: 'Monitor Health',
    description:
      'Track automation resolution rates, CSAT, escalation trends, and trusted automation scores across all markets in real time.',
    color: 'var(--bolt-green)',
    bg: 'var(--bolt-green-50)',
  },
  {
    icon: Search,
    title: 'Diagnose Failures',
    description:
      'Classify every failure type — logic faults, classification errors, knowledge gaps, tool failures — and surface the highest-impact patterns first.',
    color: 'var(--violet)',
    bg: 'var(--violet-50)',
  },
  {
    icon: RefreshCw,
    title: 'Close Feedback Loops',
    description:
      'Route failure signals into root cause clusters, assign owners, deploy fixes, and measure regression — closing the loop from signal to impact.',
    color: 'var(--blue)',
    bg: 'var(--blue-50)',
  },
  {
    icon: TrendingUp,
    title: 'Scale Trusted Automation',
    description:
      'Know which automations to expand, which to restrict, and which to pause. Every recommendation is grounded in real outcome data.',
    color: 'var(--amber)',
    bg: 'var(--amber-50)',
  },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--athens-gray)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Hero */}
      <section
        style={{
          background: 'var(--charade)',
          padding: '80px 40px 72px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(52, 187, 120, 0.15)',
            border: '1px solid rgba(52, 187, 120, 0.3)',
            borderRadius: 20,
            padding: '5px 14px',
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--bolt-green)',
              boxShadow: '0 0 0 2px rgba(52,187,120,0.3)',
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bolt-green)', letterSpacing: '0.04em' }}>
            LIVE · ALFRED v2.4
          </span>
        </div>

        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.035em',
            lineHeight: 1.08,
            maxWidth: 800,
            margin: '0 auto 20px',
          }}
        >
          Alfred AI Operations
          <br />
          <span style={{ color: 'var(--bolt-green)' }}>Command Center</span>
        </h1>

        <p
          style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 580,
            margin: '0 auto 40px',
            lineHeight: 1.6,
            letterSpacing: '-0.015em',
          }}
        >
          A decision system for monitoring, diagnosing, and improving AI support quality at global scale.
        </p>

        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--bolt-green)',
            color: '#fff',
            padding: '14px 28px',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: '-0.01em',
            textDecoration: 'none',
          }}
        >
          <Zap size={16} />
          Open Command Center
          <ArrowRight size={16} />
        </Link>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 48,
            marginTop: 56,
            paddingTop: 40,
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {[
            { label: 'Markets monitored', value: '8' },
            { label: 'Weekly ticket volume', value: '104K' },
            { label: 'Automation rate', value: '71.4%' },
            { label: 'Trusted Auto Score', value: '67.3' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
                {value}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4, letterSpacing: '-0.01em' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section style={{ padding: '64px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: 'var(--charade)',
                letterSpacing: '-0.03em',
                marginBottom: 12,
              }}
            >
              Four pillars of AI ops excellence
            </h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', letterSpacing: '-0.01em' }}>
              Alfred is built around a systematic approach to making AI support trustworthy and measurable.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
            }}
          >
            {pillars.map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 14,
                  padding: '24px 20px',
                  boxShadow: '0 1px 4px rgba(20,22,28,0.04)',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Icon size={20} color={color} strokeWidth={2} />
                </div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--charade)',
                    letterSpacing: '-0.02em',
                    marginBottom: 8,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--muted)',
                    lineHeight: 1.6,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy quote */}
      <section style={{ padding: '0 40px 80px' }}>
        <div
          style={{
            maxWidth: 760,
            margin: '0 auto',
            background: 'var(--bolt-green-50)',
            border: '1px solid var(--bolt-mint)',
            borderRadius: 16,
            padding: '32px 40px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--charade)',
              letterSpacing: '-0.02em',
              lineHeight: 1.55,
              fontStyle: 'italic',
            }}
          >
            "AI support operations is not about maximizing automation blindly. It is about maximizing trusted resolution at scale."
          </p>
          <div
            style={{
              marginTop: 16,
              fontSize: 12,
              color: 'var(--bolt-green-700)',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            — ALFRED AI OPS PHILOSOPHY
          </div>
        </div>
      </section>
    </div>
  );
}
