import React, { useState } from 'react';
import {
  LucideIcon,
  ShieldCheck,
  Store,
  Users,
  CreditCard,
  Activity,
  Layers,
  Settings,
  Bell,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Printer,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'shops' | 'orders' | 'users' | 'payouts' | 'settings'>('overview');

  interface NavItem {
    id: 'overview' | 'shops' | 'orders' | 'users' | 'payouts' | 'settings';
    label: string;
    icon: LucideIcon;
    badge?: string;
  }

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'shops', label: 'Shop Approvals', icon: Store, badge: '3 Pending' },
    { id: 'orders', label: 'Live Orders', icon: Printer },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'payouts', label: 'Settlements & Payouts', icon: CreditCard },
    { id: 'settings', label: 'System Configuration', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0B0D11', color: '#F3F4F6' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260,
        backgroundColor: '#0F1217',
        borderRight: '1px solid #1E232E',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 24, borderBottom: '1px solid #1E232E', marginBottom: 20 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16,185,129,0.3)',
          }}>
            <ShieldCheck size={24} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.04em', margin: 0, color: '#FFFFFF' }}>PRINKOUT</h1>
            <p style={{ fontSize: 10, color: '#10B981', fontWeight: 600, letterSpacing: '0.08em', margin: 0 }}>SUPER ADMIN</p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#4B5563', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 12px 4px' }}>
            Platform Controls
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 10,
                  backgroundColor: isActive ? '#1A212E' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#9CA3AF',
                  border: isActive ? '1px solid #2B3547' : '1px solid transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={16} color={isActive ? '#10B981' : '#6B7280'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 999,
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#EF4444',
                    fontWeight: 700,
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div style={{
          padding: 14,
          borderRadius: 12,
          backgroundColor: '#141821',
          border: '1px solid #1E232E',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block', boxShadow: '0 0 8px #10B981' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#D1D5DB' }}>AWS ap-south-1</span>
          </div>
          <p style={{ fontSize: 10, color: '#6B7280', margin: 0 }}>DynamoDB Single Query Active</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Top Header */}
        <header style={{
          height: 64,
          borderBottom: '1px solid #1E232E',
          backgroundColor: '#0F1217',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#161B24',
              border: '1px solid #232B3A',
              borderRadius: 8,
              padding: '6px 12px',
              width: 320,
            }}>
              <Search size={14} color="#6B7280" />
              <input
                placeholder="Search shops, orders, users, transactions..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#F3F4F6',
                  fontSize: 12,
                  width: '100%',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a
              href="https://prinkout.com"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: '#9CA3AF',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: 8,
                backgroundColor: '#161B24',
                border: '1px solid #232B3A',
              }}
            >
              <span>Main Website</span>
              <ExternalLink size={12} />
            </a>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 10px',
              borderRadius: 8,
              backgroundColor: '#141A24',
              border: '1px solid #202736',
            }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#000' }}>
                A
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF' }}>Ops Admin</div>
                <div style={{ fontSize: 9, color: '#9CA3AF' }}>Full Access</div>
              </div>
            </div>
          </div>
        </header>

        {/* Body Container */}
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Welcome Banner */}
          <div style={{
            padding: '24px 28px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #131722 0%, #171E2D 100%)',
            border: '1px solid #232B3C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, backgroundColor: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', marginBottom: 10 }}>
                <Sparkles size={12} color="#10B981" />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#10B981', letterSpacing: '0.05em' }}>EMPTY ADMIN SHELL READY</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', margin: 0, marginBottom: 6 }}>
                Prinkout Super Admin Portal
              </h2>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0, maxWidth: 650, lineHeight: 1.5 }}>
                Central management control tower for partner print shops, real-time print spoolers, KYC approvals, commission payouts, and user support.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => alert('Prinkout Admin app is running in starter mode. Features will be implemented in subsequent milestones.')}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  backgroundColor: '#10B981',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: 12,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                }}
              >
                + New Admin Action
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { label: 'Total Platform GMV', value: '₹0.00', change: '+0% today', icon: TrendingUp, color: '#10B981' },
              { label: 'Verified Print Shops', value: '0', change: 'Across all zones', icon: Store, color: '#3B82F6' },
              { label: 'Pending Shop KYCs', value: '3', change: 'Needs manual review', icon: Clock, color: '#F59E0B' },
              { label: 'Active Print Queue', value: '0 Jobs', change: 'Live processing', icon: Printer, color: '#8B5CF6' },
            ].map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={i}
                  style={{
                    padding: 20,
                    borderRadius: 14,
                    backgroundColor: '#10141C',
                    border: '1px solid #1E2533',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>{stat.label}</span>
                    <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <StatIcon size={16} color={stat.color} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>{stat.value}</div>
                    <div style={{ fontSize: 11, color: stat.color, marginTop: 4, fontWeight: 500 }}>{stat.change}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tab Content Placeholder */}
          <div style={{
            padding: 32,
            borderRadius: 16,
            backgroundColor: '#0F131A',
            border: '1px solid #1C2331',
            minHeight: 280,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: '#161C27',
              border: '1px solid #242D3E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Layers size={28} color="#10B981" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', margin: 0, marginBottom: 6 }}>
              {navItems.find((n) => n.id === activeTab)?.label || 'Overview Module'}
            </h3>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0, maxWidth: 500, lineHeight: 1.5 }}>
              This module is scaffolded and ready for implementation. API integrations with PrinkoutService and AWS DynamoDB will be hooked up in the next phase.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
