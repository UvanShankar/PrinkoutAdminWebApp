import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  MapPin,
  Store,
  RefreshCw,
  ShoppingBag,
  Users,
  CreditCard,
  Layers,
  Clock,
  CheckCircle,
  AlertCircle,
  CheckCircle2,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import api from '../services/api';
import {
  OverviewAnalytics,
  RevenueAnalytics,
  OrdersAnalytics,
  MerchantsAnalytics,
  CustomersAnalytics,
  ServicesAnalytics,
  LocationsAnalytics,
} from '../types';

interface ReportsScreenProps {
  initialSubtab?: string;
  onSubtabChange?: (subtab: string) => void;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  initialSubtab = 'overview',
  onSubtabChange,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialSubtab);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [selectedCity, setSelectedCity] = useState('all');
  const [loading, setLoading] = useState(true);

  // States for each report section
  const [overview, setOverview] = useState<OverviewAnalytics | null>(null);
  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);
  const [orders, setOrders] = useState<OrdersAnalytics | null>(null);
  const [merchants, setMerchants] = useState<MerchantsAnalytics | null>(null);
  const [customers, setCustomers] = useState<CustomersAnalytics | null>(null);
  const [services, setServices] = useState<ServicesAnalytics | null>(null);
  const [locations, setLocations] = useState<LocationsAnalytics | null>(null);

  useEffect(() => {
    setActiveTab(initialSubtab);
  }, [initialSubtab]);

  const loadTabData = async (tab: string) => {
    try {
      setLoading(true);
      if (tab === 'overview' && !overview) {
        const res = await api.getOverviewAnalytics();
        setOverview(res);
      } else if (tab === 'revenue' && !revenue) {
        const res = await api.getRevenueAnalytics();
        setRevenue(res);
      } else if (tab === 'orders' && !orders) {
        const res = await api.getOrdersAnalytics();
        setOrders(res);
      } else if (tab === 'merchants' && !merchants) {
        const res = await api.getMerchantsAnalytics();
        setMerchants(res);
      } else if (tab === 'customers' && !customers) {
        const res = await api.getCustomersAnalytics();
        setCustomers(res);
      } else if (tab === 'services' && !services) {
        const res = await api.getServicesAnalytics();
        setServices(res);
      } else if (tab === 'locations' && !locations) {
        const res = await api.getLocationsAnalytics();
        setLocations(res);
      }
    } catch (err) {
      console.error('Failed to load report data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onSubtabChange) onSubtabChange(tabId);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'revenue', label: 'Revenue' },
    { id: 'orders', label: 'Orders' },
    { id: 'merchants', label: 'Merchants' },
    { id: 'customers', label: 'Customers' },
    { id: 'services', label: 'Services' },
    { id: 'locations', label: 'Locations' },
  ];

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Subnav Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: 4,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTabClick(t.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: isActive ? '#5000F6' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(80,0,246,0.25)' : 'none',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>All Time</option>
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="all">All Locations</option>
            <option value="tirupur">Tirupur</option>
            <option value="coimbatore">Coimbatore</option>
          </select>

          <button
            onClick={() => loadTabData(activeTab)}
            title="Refresh Real Analytics"
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#64748B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <RefreshCw size={14} />
          </button>

          <button
            onClick={() => alert(`Exporting ${activeTab.toUpperCase()} report as PDF/CSV...`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontWeight: 600,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ padding: 48, textAlign: 'center', color: '#64748B' }}>
          Computing real metrics from AWS DynamoDB...
        </div>
      )}

      {/* ======================= SUBTAB 1: OVERVIEW ======================= */}
      {!loading && activeTab === 'overview' && overview && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Total Orders</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
                {overview.totalOrders.toLocaleString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: 4 }}>
                  ↑ +18.2%
                </span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>vs last period</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Total Order Value (GMV)</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
                ₹{overview.totalGmv.toLocaleString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: 4 }}>
                  ↑ +21.6%
                </span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>cumulative volume</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Active Print Shops</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
                {overview.activeMerchants}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: 4 }}>
                  Verified
                </span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>Ready to print</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Total Registered Customers</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
                {overview.totalCustomers.toLocaleString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: 4 }}>
                  ↑ +12.4%
                </span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>active user base</span>
              </div>
            </div>
          </div>

          {/* Order Trend Line / Bar Chart (SVG-based) */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>Order Trend</h4>
                <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>Number of print orders placed over time.</p>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#5000F6', backgroundColor: '#F5F3FF', padding: '4px 12px', borderRadius: 20 }}>
                {overview.totalOrders} total jobs
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div style={{ height: 200, width: '100%', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 800 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5000F6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#5000F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                <line x1="0" y1="45" x2="800" y2="45" stroke="#F1F5F9" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="800" y2="90" stroke="#F1F5F9" strokeDasharray="4 4" />
                <line x1="0" y1="135" x2="800" y2="135" stroke="#F1F5F9" strokeDasharray="4 4" />

                {/* Path */}
                {overview.orderTrend.length > 1 && (
                  <>
                    <path
                      d={overview.orderTrend.reduce((acc, pt, idx, arr) => {
                        const maxO = Math.max(...arr.map((p) => p.orders), 10);
                        const x = (idx / (arr.length - 1)) * 760 + 20;
                        const y = 160 - (pt.orders / maxO) * 130;
                        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#5000F6"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Dots */}
                    {overview.orderTrend.map((pt, idx, arr) => {
                      const maxO = Math.max(...arr.map((p) => p.orders), 10);
                      const x = (idx / (arr.length - 1)) * 760 + 20;
                      const y = 160 - (pt.orders / maxO) * 130;
                      return <circle key={idx} cx={x} cy={y} r="4" fill="#5000F6" />;
                    })}
                  </>
                )}
              </svg>
            </div>

            {/* Date labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginTop: 8 }}>
              {overview.orderTrend.slice(0, 7).map((pt, i) => (
                <span key={i}>{pt.date}</span>
              ))}
            </div>
          </div>

          {/* Orders by Status & Top Services Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Orders by Status */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>
                Order Fulfillment Status
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Completed & Delivered', count: overview.ordersByStatus.completed, color: '#10B981' },
                  { label: 'In Progress / Printing', count: overview.ordersByStatus.inProgress, color: '#3B82F6' },
                  { label: 'Pending Shop Acceptance', count: overview.ordersByStatus.pending, color: '#F59E0B' },
                  { label: 'Cancelled / Rejected', count: overview.ordersByStatus.cancelled, color: '#EF4444' },
                ].map((st, i) => {
                  const pct = overview.totalOrders > 0 ? Math.round((st.count / overview.totalOrders) * 100) : 0;
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                        <span style={{ color: '#475569', fontWeight: 500 }}>{st.label}</span>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>
                          {st.count} ({pct}%)
                        </span>
                      </div>
                      <div style={{ height: 6, width: '100%', backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: st.color, borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Printing Services */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>
                Printing Services Share
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {overview.topServices.map((srv, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ color: '#475569', fontWeight: 500 }}>{srv.name}</span>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>
                        {srv.orders} jobs ({srv.pct}%)
                      </span>
                    </div>
                    <div style={{ height: 6, width: '100%', backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${srv.pct}%`, backgroundColor: '#5000F6', borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= SUBTAB 2: REVENUE ======================= */}
      {!loading && activeTab === 'revenue' && revenue && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Top 3 KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Gross Merchandise Value (GMV)</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
                ₹{revenue.gmv.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: '#10B981', marginTop: 4 }}>Cumulative customer spend</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Platform Commission (10%)</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#5000F6', marginTop: 6 }}>
                ₹{revenue.platformCommission.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Merchant revenue share</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Net Platform Earnings</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#10B981', marginTop: 6 }}>
                ₹{revenue.netPlatformEarnings.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>After gateway & refund buffers</div>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>
              Financial Performance Summary
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>Financial Metric</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Amount (₹)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Status / Trend</th>
                </tr>
              </thead>
              <tbody>
                {revenue.revenueSummary.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>{item.metric}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                      ₹{item.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: 4 }}>
                        {item.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================= SUBTAB 3: ORDERS ======================= */}
      {!loading && activeTab === 'orders' && orders && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Total Orders</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>{orders.totalOrders}</div>
              <div style={{ fontSize: 11, color: '#10B981', marginTop: 4 }}>100% processed jobs</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Completed</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#10B981', marginTop: 6 }}>{orders.completed}</div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>{orders.completionRate} rate</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>In Progress</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#3B82F6', marginTop: 6 }}>{orders.inProgress}</div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Active print queue</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Pending Acceptance</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#F59E0B', marginTop: 6 }}>{orders.pending}</div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Awaiting shop pickup</div>
            </div>
          </div>

          {/* Order Lifecycle Flow */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 24 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>
              Print Order Funnel
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, textAlign: 'center' }}>
              {[
                { stage: '1. Order Placed', count: orders.orderLifecycle.placed, color: '#64748B' },
                { stage: '2. Payment Verified', count: orders.orderLifecycle.paid, color: '#3B82F6' },
                { stage: '3. Printing Active', count: orders.orderLifecycle.printing, color: '#8B5CF6' },
                { stage: '4. Ready for Pickup', count: orders.orderLifecycle.ready, color: '#F59E0B' },
                { stage: '5. Completed', count: orders.orderLifecycle.completed, color: '#10B981' },
              ].map((step, idx) => (
                <div key={idx} style={{ padding: 16, backgroundColor: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{step.stage}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: step.color, marginTop: 4 }}>{step.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================= SUBTAB 4: MERCHANTS ======================= */}
      {!loading && activeTab === 'merchants' && merchants && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Total Print Shops</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>{merchants.totalMerchants}</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Active Verified Shops</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#10B981', marginTop: 6 }}>{merchants.activeMerchants}</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Orders / Merchant</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#3B82F6', marginTop: 6 }}>{merchants.ordersPerMerchant}</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Avg Revenue / Shop</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#5000F6', marginTop: 6 }}>₹{merchants.revenuePerMerchant}</div>
            </div>
          </div>

          {/* Top Print Shops Table */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>
              Top Print Shop Contributors
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Rank</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Print Shop</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Location</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Orders</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>GMV (₹)</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Commission (10%)</th>
                </tr>
              </thead>
              <tbody>
                {merchants.topMerchants.map((shop, i) => (
                  <tr key={shop.shopId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 12px', fontWeight: 700, color: '#64748B' }}>#{i + 1}</td>
                    <td style={{ padding: '12px 12px', fontWeight: 600, color: '#0F172A' }}>{shop.name}</td>
                    <td style={{ padding: '12px 12px', color: '#475569' }}>{shop.location}</td>
                    <td style={{ padding: '12px 12px', textAlign: 'center', fontWeight: 600, color: '#0F172A' }}>{shop.orders}</td>
                    <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>₹{shop.orderValue.toLocaleString()}</td>
                    <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700, color: '#5000F6' }}>₹{shop.commission.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================= SUBTAB 5: CUSTOMERS ======================= */}
      {!loading && activeTab === 'customers' && customers && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Total Customers</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>{customers.totalCustomers}</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Active Buyers</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#10B981', marginTop: 6 }}>{customers.activeCustomers}</div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>{customers.activePct}% of total base</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Avg Orders / Customer</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#3B82F6', marginTop: 6 }}>{customers.avgOrdersPerCustomer}</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Avg Spend / Customer</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#5000F6', marginTop: 6 }}>₹{customers.avgCustomerSpend}</div>
            </div>
          </div>

          {/* Segmentation Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <div style={{ padding: 16, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>One-Time Buyers</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#64748B', marginTop: 4 }}>{customers.customerSegmentation.oneTime}</div>
            </div>
            <div style={{ padding: 16, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Repeat (2 - 5 Orders)</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#3B82F6', marginTop: 4 }}>{customers.customerSegmentation.repeat}</div>
            </div>
            <div style={{ padding: 16, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Regulars (6 - 10 Orders)</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#10B981', marginTop: 4 }}>{customers.customerSegmentation.regular}</div>
            </div>
            <div style={{ padding: 16, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Power Users (&gt; 10 Orders)</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#5000F6', marginTop: 4 }}>{customers.customerSegmentation.power}</div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= SUBTAB 6: SERVICES ======================= */}
      {!loading && activeTab === 'services' && services && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Services Breakdown Table */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>
              Orders & Volume by Print Service
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Print Service</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Total Orders</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Volume Share</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>GMV (₹)</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Growth</th>
                </tr>
              </thead>
              <tbody>
                {services.servicesBreakdown.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 12px', fontWeight: 600, color: '#0F172A' }}>{s.name}</td>
                    <td style={{ padding: '12px 12px', textAlign: 'center', fontWeight: 700, color: '#0F172A' }}>{s.orders}</td>
                    <td style={{ padding: '12px 12px', textAlign: 'center', color: '#5000F6', fontWeight: 700 }}>{s.share}%</td>
                    <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>₹{s.gmv.toLocaleString()}</td>
                    <td style={{ padding: '12px 12px', textAlign: 'right' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: 4 }}>
                        {s.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================= SUBTAB 7: LOCATIONS ======================= */}
      {!loading && activeTab === 'locations' && locations && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Active Operational Cities</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
                {locations.activeCitiesCount}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Tirupur & Coimbatore hubs</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Total Service Clusters</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#5000F6', marginTop: 6 }}>
                {locations.totalAreas} Micro-zones
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>College & industrial areas</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Top Volume Hub</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#10B981', marginTop: 6 }}>
                Tirupur
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>High-density print clusters</div>
            </div>
          </div>

          {/* City Distribution Table */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>
              City-wise Breakdown
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>City</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Total Orders</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Volume Share</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Print Shops</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>GMV (₹)</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Platform Commission</th>
                </tr>
              </thead>
              <tbody>
                {locations.activeCities.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 12px', fontWeight: 700, color: '#0F172A' }}>{c.city}</td>
                    <td style={{ padding: '12px 12px', textAlign: 'center', fontWeight: 600 }}>{c.orders}</td>
                    <td style={{ padding: '12px 12px', textAlign: 'center', color: '#5000F6', fontWeight: 700 }}>{c.share}%</td>
                    <td style={{ padding: '12px 12px', textAlign: 'center', color: '#64748B' }}>{c.merchants}</td>
                    <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700 }}>₹{c.gmv.toLocaleString()}</td>
                    <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700, color: '#5000F6' }}>₹{c.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
