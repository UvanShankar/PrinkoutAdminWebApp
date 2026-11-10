import React from 'react';
import { ExternalLink, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
  breadcrumb?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, breadcrumb }) => {
  return (
    <header
      style={{
        height: 70,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Title & Subtitle */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {breadcrumb && (
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
              {breadcrumb} ›
            </span>
          )}
          <h1
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#0F172A',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h1>
        </div>
        <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0', fontWeight: 400 }}>
          {subtitle}
        </p>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <a
          href="https://prinkout.com"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: '#475569',
            textDecoration: 'none',
            padding: '6px 12px',
            borderRadius: 8,
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            fontWeight: 500,
            transition: 'all 0.15s ease',
          }}
        >
          <span>Live Site</span>
          <ExternalLink size={12} color="#64748B" />
        </a>

        {/* User Profile Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '4px 8px 4px 6px',
            borderRadius: 24,
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#5000F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            S
          </div>
          <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Sabarish S</div>
            <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>Admin</div>
          </div>
          <ChevronDown size={14} color="#64748B" />
        </div>
      </div>
    </header>
  );
};
