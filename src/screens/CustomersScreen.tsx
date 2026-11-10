import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Search,
  Filter,
  Download,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';
import { CustomersAnalytics, CustomerItem } from '../types';
import { Drawer } from '../components/Drawer';

export const CustomersScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CustomersAnalytics | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.getCustomersAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to load customers analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleBlock = async (cust: CustomerItem) => {
    try {
      setIsUpdating(true);
      const newBlockedState = cust.status !== 'Blocked';
      await api.updateCustomerStatus(cust.id, newBlockedState);
      setActionMessage(
        newBlockedState
          ? `Customer ${cust.name} has been blocked.`
          : `Customer ${cust.name} has been unblocked.`
      );
      // Refresh
      await fetchData();
      if (selectedCustomer && selectedCustomer.id === cust.id) {
        setSelectedCustomer({
          ...selectedCustomer,
          status: newBlockedState ? 'Blocked' : 'Active',
        });
      }
    } catch (err) {
      alert('Failed to update customer status');
    } finally {
      setIsUpdating(false);
    }
  };

  const customers = data?.customers || [];
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    if (statusFilter === 'active') return matchesSearch && c.status === 'Active';
    if (statusFilter === 'blocked') return matchesSearch && c.status === 'Blocked';
    return matchesSearch;
  });

  const totalCustomers = data?.totalCustomers || 0;
  const activeCustomers = data?.activeCustomers || 0;
  const newCustomers = data?.newCustomers || 0;
  const blockedCustomers = customers.filter((c) => c.status === 'Blocked').length;

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Toast Alert */}
      {actionMessage && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>{actionMessage}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#065F46', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {/* Card 1 */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Total Customers</span>
            <Users size={16} color="#64748B" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            {loading ? '...' : totalCustomers.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#10B981',
                backgroundColor: '#ECFDF5',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              ↑ +12.4%
            </span>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>vs last month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Active Customers</span>
            <UserCheck size={16} color="#10B981" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            {loading ? '...' : activeCustomers.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
              {totalCustomers > 0 ? `${Math.round((activeCustomers / totalCustomers) * 100)}%` : '0%'} of total
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#10B981',
                backgroundColor: '#ECFDF5',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              ↑ +18.7%
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>New Customers</span>
            <UserPlus size={16} color="#3B82F6" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            {loading ? '...' : newCustomers.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#3B82F6',
                backgroundColor: '#EFF6FF',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              All time verified
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Blocked Customers</span>
            <UserX size={16} color="#EF4444" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            {loading ? '...' : blockedCustomers}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: '#64748B' }}>
              {blockedCustomers === 0 ? 'Zero security blocks' : 'Requires review'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Tabs + Search + Filter + Export */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Sub-tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#F1F5F9',
            padding: 3,
            borderRadius: 8,
            gap: 4,
          }}
        >
          {[
            { id: 'all', label: `All Customers (${totalCustomers})` },
            { id: 'active', label: `Active (${activeCustomers})` },
            { id: 'blocked', label: `Blocked (${blockedCustomers})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: statusFilter === tab.id ? '#FFFFFF' : 'transparent',
                color: statusFilter === tab.id ? '#0F172A' : '#64748B',
                fontWeight: statusFilter === tab.id ? 700 : 500,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: statusFilter === tab.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Search Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: '6px 12px',
              width: 260,
            }}
          >
            <Search size={14} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search by name or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: 12,
                color: '#0F172A',
                width: '100%',
                background: 'transparent',
              }}
            />
          </div>

          {/* Refresh */}
          <button
            onClick={fetchData}
            title="Refresh Data"
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

          {/* Export CSV */}
          <button
            onClick={() => {
              const headers = 'ID,Name,Mobile,Location,Orders,Total Spent,Status\n';
              const rows = filteredCustomers
                .map((c) => `"${c.id}","${c.name}","${c.mobile}","${c.location}",${c.orders},${c.totalSpent},"${c.status}"`)
                .join('\n');
              const blob = new Blob([headers + rows], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `customers_export_${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
            }}
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
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 20px' }}>Customer</th>
              <th style={{ padding: '12px 16px' }}>Mobile</th>
              <th style={{ padding: '12px 16px' }}>Location</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Orders</th>
              <th style={{ padding: '12px 16px' }}>Total Spent</th>
              <th style={{ padding: '12px 16px' }}>Last Active</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 20px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ padding: 48, textAlign: 'center', color: '#64748B' }}>
                  Loading real customers from DynamoDB...
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: 48, textAlign: 'center', color: '#94A3B8' }}>
                  No matching customers found in database.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((cust) => {
                const initials = cust.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      cursor: 'pointer',
                      transition: 'background-color 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            backgroundColor: '#EEF2FF',
                            color: '#5000F6',
                            fontWeight: 700,
                            fontSize: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{cust.name}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>{cust.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#334155', fontFamily: 'monospace' }}>
                      {cust.mobile}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>
                      {cust.location}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600, color: '#0F172A' }}>
                      {cust.orders}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0F172A' }}>
                      ₹{cust.totalSpent.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748B', fontSize: 12 }}>
                      {cust.lastActive}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          backgroundColor: cust.status === 'Active' ? '#ECFDF5' : '#FEF2F2',
                          color: cust.status === 'Active' ? '#059669' : '#DC2626',
                        }}
                      >
                        {cust.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(cust);
                        }}
                        style={{
                          padding: '5px 12px',
                          borderRadius: 6,
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#FFFFFF',
                          color: '#5000F6',
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Drawer */}
      <Drawer
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.name || 'Customer Details'}
        subtitle={selectedCustomer?.id}
      >
        {selectedCustomer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Header info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: '#5000F6',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedCustomer.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
                  {selectedCustomer.name}
                </div>
                <div style={{ fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Phone size={12} />
                  <span>{selectedCustomer.mobile}</span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 14, backgroundColor: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Total Orders</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                  {selectedCustomer.orders}
                </div>
              </div>
              <div style={{ padding: 14, backgroundColor: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Total Spent</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                  ₹{selectedCustomer.totalSpent.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Details list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Primary Location:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedCustomer.location}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Member Since:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedCustomer.joinedOn}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Last Order / Active:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedCustomer.lastActive}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Account Status:</span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    backgroundColor: selectedCustomer.status === 'Active' ? '#ECFDF5' : '#FEF2F2',
                    color: selectedCustomer.status === 'Active' ? '#059669' : '#DC2626',
                  }}
                >
                  {selectedCustomer.status}
                </span>
              </div>
            </div>

            {/* Security Actions */}
            <div style={{ paddingTop: 16, borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Account Actions
              </div>

              <button
                disabled={isUpdating}
                onClick={() => handleToggleBlock(selectedCustomer)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: selectedCustomer.status === 'Blocked' ? '1px solid #10B981' : '1px solid #EF4444',
                  backgroundColor: selectedCustomer.status === 'Blocked' ? '#ECFDF5' : '#FEF2F2',
                  color: selectedCustomer.status === 'Blocked' ? '#059669' : '#DC2626',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {selectedCustomer.status === 'Blocked' ? (
                  <>
                    <ShieldCheck size={16} />
                    <span>Unblock Account</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={16} />
                    <span>Block Customer Account</span>
                  </>
                )}
              </button>

              <button
                onClick={() => alert(`Password reset link dispatched via SMS to ${selectedCustomer.mobile}.`)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Trigger Password Reset OTP
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
