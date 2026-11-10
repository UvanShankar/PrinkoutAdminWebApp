import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Users,
  Layers,
  BadgePercent,
  BarChart3,
  Bell,
  Headphones,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screenId: string, subtab?: string) => void;
  reportSubtab?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onNavigate,
  reportSubtab = 'overview',
}) => {
  const [reportsOpen, setReportsOpen] = React.useState(true);

  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'merchants', label: 'Merchants', icon: Store },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'pricing', label: 'Pricing & Commission', icon: BadgePercent },
  ];

  const reportTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'revenue', label: 'Revenue' },
    { id: 'orders', label: 'Orders' },
    { id: 'merchants', label: 'Merchants' },
    { id: 'customers', label: 'Customers' },
    { id: 'services', label: 'Services' },
    { id: 'locations', label: 'Locations' },
  ];

  return (
    <aside
      style={{
        width: 250,
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            backgroundColor: '#5000F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: 20,
            boxShadow: '0 4px 12px rgba(80, 0, 246, 0.25)',
          }}
        >
          P
        </div>
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Prinkout<span style={{ color: '#5000F6' }}>.</span>
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#64748B',
              marginTop: 1,
            }}
          >
            Admin Portal
          </div>
        </div>
      </div>

      {/* Navigation Body */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {/* Main section */}
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '9px 12px',
                borderRadius: 8,
                backgroundColor: isActive ? '#EEF2FF' : 'transparent',
                color: isActive ? '#5000F6' : '#475569',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Icon size={18} color={isActive ? '#5000F6' : '#64748B'} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Section Header */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#94A3B8',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '16px 12px 6px',
          }}
        >
          Platform Management
        </div>

        {/* Reports & Analytics Accordion */}
        <div>
          <button
            onClick={() => {
              if (activeScreen !== 'reports') {
                onNavigate('reports', 'overview');
              }
              setReportsOpen(!reportsOpen);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '9px 12px',
              borderRadius: 8,
              backgroundColor: activeScreen === 'reports' ? '#EEF2FF' : 'transparent',
              color: activeScreen === 'reports' ? '#5000F6' : '#475569',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeScreen === 'reports' ? 600 : 500,
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <BarChart3 size={18} color={activeScreen === 'reports' ? '#5000F6' : '#64748B'} />
              <span>Reports & Analytics</span>
            </div>
            {reportsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {reportsOpen && (
            <div
              style={{
                marginLeft: 26,
                paddingLeft: 10,
                borderLeft: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                marginTop: 4,
              }}
            >
              {reportTabs.map((sub) => {
                const isSubActive = activeScreen === 'reports' && reportSubtab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => onNavigate('reports', sub.id)}
                    style={{
                      display: 'block',
                      padding: '6px 10px',
                      borderRadius: 6,
                      backgroundColor: isSubActive ? '#F5F3FF' : 'transparent',
                      color: isSubActive ? '#5000F6' : '#64748B',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: isSubActive ? 600 : 400,
                      textAlign: 'left',
                      transition: 'all 0.12s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubActive) e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications & Support */}
        <button
          onClick={() => alert('All notifications are current. No pending critical platform alerts.')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '9px 12px',
            borderRadius: 8,
            backgroundColor: 'transparent',
            color: '#475569',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            textAlign: 'left',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Bell size={18} color="#64748B" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => alert('Support tickets queue is clear.')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '9px 12px',
            borderRadius: 8,
            backgroundColor: 'transparent',
            color: '#475569',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            textAlign: 'left',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Headphones size={18} color="#64748B" />
          <span>Support & Tickets</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => onNavigate('pricing', 'settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '9px 12px',
            borderRadius: 8,
            backgroundColor: activeScreen === 'pricing' && reportSubtab === 'settings' ? '#EEF2FF' : 'transparent',
            color: activeScreen === 'pricing' && reportSubtab === 'settings' ? '#5000F6' : '#475569',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            textAlign: 'left',
            marginTop: 'auto',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Settings size={18} color="#64748B" />
          <span>Settings</span>
        </button>
      </div>

      {/* Footer Status */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid #F1F5F9',
          backgroundColor: '#FBFBFC',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>Prinkout v1.0</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>Production, Live</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
