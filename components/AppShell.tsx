'use client';

import Sidebar from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--athens-gray)' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <header
          style={{
            height: 56,
            background: 'var(--surface)',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <div>
            <span
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: 'var(--charade)',
                letterSpacing: '-0.025em',
              }}
            >
              Alfred AI Operations Command Center
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Filter pills */}
            {['Apr 22 – Apr 28', 'All Markets', 'All Verticals'].map((label) => (
              <button
                key={label}
                style={{
                  padding: '5px 12px',
                  borderRadius: 20,
                  border: '1px solid var(--line)',
                  background: 'var(--surface)',
                  color: 'var(--charade)',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {label}
                <span style={{ color: 'var(--muted-2)', fontSize: 10 }}>▾</span>
              </button>
            ))}
            <div
              style={{
                padding: '5px 12px',
                borderRadius: 20,
                background: 'var(--bolt-green-50)',
                color: 'var(--bolt-green-700)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              {today}
            </div>
          </div>
        </header>
        {/* Main content */}
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
