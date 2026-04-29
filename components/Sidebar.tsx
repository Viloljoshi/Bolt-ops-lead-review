'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bug,
  RefreshCw,
  Calendar,
  Zap,
  ShieldAlert,
  SquareKanban,
  Globe,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/diagnosis', label: 'Failure Diagnosis', icon: Bug },
  { href: '/feedback', label: 'Feedback Loops', icon: RefreshCw },
  { href: '/weekly-review', label: 'Weekly Review', icon: Calendar },
  { href: '/automation', label: 'Automation Portfolio', icon: Zap },
  { href: '/escalation', label: 'Escalation Desk', icon: ShieldAlert },
  { href: '/backlog', label: 'Improvement Backlog', icon: SquareKanban },
  { href: '/drilldown', label: 'Market Drilldown', icon: Globe },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        minWidth: 240,
        height: '100vh',
        background: 'var(--surface)',
        borderRight: '1px solid var(--line)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'var(--bolt-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Zap size={16} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: 'var(--charade)',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
            }}
          >
            Alfred
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '-0.01em' }}>
            AI Ops Command
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: 'none',
                background: isActive ? 'var(--bolt-green)' : 'transparent',
                color: isActive ? '#fff' : 'var(--muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: 13,
                letterSpacing: '-0.01em',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon
                size={15}
                strokeWidth={isActive ? 2.5 : 2}
                color={isActive ? '#fff' : 'var(--muted-2)'}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer status */}
      <div
        style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--bolt-green)',
            boxShadow: '0 0 0 2px var(--bolt-green-50)',
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '-0.01em' }}>
          Alfred v2.4 · Live
        </span>
      </div>
    </aside>
  );
}
