'use client';

import { User, ArrowRight } from 'lucide-react';

const PORTFOLIO_URL = 'https://viloljoshi.github.io/Vilol-joshiBLT/';

export default function PortfolioCTA() {
  return (
    <a
      href={PORTFOLIO_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: 'transparent',
        color: 'rgba(255,255,255,0.75)',
        padding: '14px 28px',
        borderRadius: 12,
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: '-0.01em',
        textDecoration: 'none',
        border: '1px solid rgba(255,255,255,0.2)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.5)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.75)';
        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.2)';
      }}
    >
      <User size={16} />
      View My Portfolio
      <ArrowRight size={16} />
    </a>
  );
}
