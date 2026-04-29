'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--athens-gray)' }}>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        style={{
          flex: 1,
          marginLeft: 240,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          minWidth: 0,
        }}
        className="content-area"
      >
        {/* Top bar */}
        <header
          style={{
            height: 56,
            background: 'var(--surface)',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {/* Hamburger — visible on mobile via CSS */}
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>
            <span
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: 'var(--charade)',
                letterSpacing: '-0.025em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Alfred AI Operations Command Center
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {['Apr 22 – Apr 28', 'All Markets', 'All Verticals'].map((label) => (
              <button
                key={label}
                className="filter-pill"
                style={{
                  padding: '5px 10px',
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
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
                <span style={{ color: 'var(--muted-2)', fontSize: 10 }}>▾</span>
              </button>
            ))}
            <div
              className="date-badge"
              style={{
                padding: '5px 10px',
                borderRadius: 20,
                background: 'var(--bolt-green-50)',
                color: 'var(--bolt-green-700)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
              }}
            >
              {today}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main data-shell style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
