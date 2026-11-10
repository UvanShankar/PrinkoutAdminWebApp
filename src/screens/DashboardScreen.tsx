import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Store,
  Users,
  ShoppingBag,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { OverviewAnalytics } from '../types';

interface DashboardScreenProps {
  onNavigate: (screen: string, subtab?: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const [data, setData] = useState<OverviewAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getOverviewAnalytics()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome Banner */}
      <div
        style={{
          padding: '28px 32px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(79, 70, 229, 0.2)',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.15)',
              marginBottom: 12,
            }}
          >
            <Sparkles size={12} color="#A7F3D0" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#A7F3D0', letterSpacing: '0.04em' }}>
              PRINKOUT PLATFORM CONTROL TOWER
            </span>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, marginBottom: 8, letterSpacing: '-0.02em' }}>
            Welcome to Prinkout Super Admin
          </h2>
          <p style={{ fontSize: 13, color: '#E0E7FF', margin: 0, maxWidth: 640, lineHeight: 1.5 }}>
            Real-time analytics and management control tower powered directly by live AWS DynamoDB database operations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => onNavigate('reports', 'revenue')}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              backgroundColor: '#FFFFFF',
              color: '#312E81',
              fontWeight: 700,
              fontSize: 13,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <span>Revenue Report</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Total Platform GMV</span>
            <TrendingUp size={16} color="#5000F6" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
            {loading ? '...' : `₹${(data?.totalGmv || 0).toLocaleString()}`}
          </div>
          <div style={{ fontSize: 11, color: '#10B981', marginTop: 4, fontWeight: 600 }}>
            Live customer volume
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Total Print Orders</span>
            <ShoppingBag size={16} color="#3B82F6" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
            {loading ? '...' : (data?.totalOrders || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: '#3B82F6', marginTop: 4, fontWeight: 600 }}>
            All-time processed
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Verified Print Shops</span>
            <Store size={16} color="#10B981" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
            {loading ? '...' : data?.activeMerchants || 0}
          </div>
          <div style={{ fontSize: 11, color: '#10B981', marginTop: 4, fontWeight: 600 }}>
            Active on network
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Registered Users</span>
            <Users size={16} color="#F59E0B" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
            {loading ? '...' : (data?.totalCustomers || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: '#F59E0B', marginTop: 4, fontWeight: 600 }}>
            Active across cities
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div
          onClick={() => onNavigate('merchants')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            padding: 20,
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Store size={18} color="#5000F6" />
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Merchant Approvals</h4>
          </div>
          <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
            Review pending shop KYC verifications, addresses, phone records, and commission agreements.
          </p>
        </div>

        <div
          onClick={() => onNavigate('pricing')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            padding: 20,
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <CreditCard size={18} color="#10B981" />
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Pricing & Commission</h4>
          </div>
          <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
            Configure default 10% platform commission, ₹20 checkout convenience fees, and per-page rates.
          </p>
        </div>

        <div
          onClick={() => onNavigate('reports', 'locations')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            padding: 20,
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Activity size={18} color="#3B82F6" />
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>City Hubs & Heatmap</h4>
          </div>
          <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
            Track operational density across Tirupur, Coimbatore, colleges, and residential hubs.
          </p>
        </div>
      </div>
    </div>
  );
};
