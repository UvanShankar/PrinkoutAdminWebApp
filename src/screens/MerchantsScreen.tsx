import React, { useState, useEffect } from 'react';
import {
  Store,
  CheckCircle,
  Clock,
  Ban,
  Search,
  Download,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';
import api from '../services/api';
import { MerchantsAnalytics, MerchantItem } from '../types';
import { Drawer } from '../components/Drawer';

export const MerchantsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MerchantsAnalytics | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'inactive'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.getMerchantsAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to load merchants analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (shopId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      await api.updateMerchantStatus(shopId, newStatus);
      setActionMessage(`Shop status successfully updated to ${newStatus}.`);
      await fetchData();
      if (selectedMerchant && selectedMerchant.shopId === shopId) {
        setSelectedMerchant({
          ...selectedMerchant,
          status: newStatus === 'approved' ? 'Verified' : 'Inactive',
        });
      }
    } catch (err) {
      alert('Failed to update shop status');
    } finally {
      setIsUpdating(false);
    }
  };

  const merchants = data?.topMerchants || [];
  const filteredMerchants = merchants.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      m.mobile.includes(search);
    const matchesLoc = locationFilter === 'all' || m.location.toLowerCase().includes(locationFilter.toLowerCase());

    if (!matchesLoc || !matchesSearch) return false;
    if (statusFilter === 'verified') return m.status === 'Verified';
    if (statusFilter === 'pending') return m.status === 'Pending';
    if (statusFilter === 'inactive') return m.status === 'Inactive';
    return true;
  });

  const totalMerchants = data?.totalMerchants || 0;
  const verifiedCount = merchants.filter((m) => m.status === 'Verified').length;
  const pendingCount = merchants.filter((m) => m.status === 'Pending').length;
  const inactiveCount = merchants.filter((m) => m.status === 'Inactive').length;

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
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Total Merchants</span>
            <Store size={16} color="#64748B" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            {loading ? '...' : totalMerchants.toLocaleString()}
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
              ↑ +8.5%
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
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Verified</span>
            <CheckCircle size={16} color="#10B981" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            {loading ? '...' : verifiedCount}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
              ({totalMerchants > 0 ? Math.round((verifiedCount / totalMerchants) * 100) : 0}%)
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
              Active on Map
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
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Pending Review</span>
            <Clock size={16} color="#F59E0B" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            {loading ? '...' : pendingCount}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#D97706',
                backgroundColor: '#FEF3C7',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              Needs KYC approval
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
            <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Inactive / Blocked</span>
            <Ban size={16} color="#EF4444" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            {loading ? '...' : inactiveCount}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: '#64748B' }}>
              {inactiveCount === 0 ? 'No suspended shops' : 'Action required'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Status Tabs */}
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
            { id: 'all', label: `All Merchants (${totalMerchants})` },
            { id: 'verified', label: `Verified (${verifiedCount})` },
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'inactive', label: `Inactive (${inactiveCount})` },
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

        {/* Search + Location Filter + Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Location Select */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{
              padding: '7px 12px',
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

          {/* Search */}
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
              placeholder="Search shop, owner, mobile..."
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
              const headers = 'Shop Name,Owner,Mobile,Location,Orders,GMV,Commission,Status\n';
              const rows = filteredMerchants
                .map((m) => `"${m.name}","${m.ownerName}","${m.mobile}","${m.location}",${m.orders},${m.orderValue},${m.commission},"${m.status}"`)
                .join('\n');
              const blob = new Blob([headers + rows], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `merchants_export_${new Date().toISOString().slice(0, 10)}.csv`;
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

      {/* Merchants Table */}
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
              <th style={{ padding: '12px 20px' }}>Merchant / Shop</th>
              <th style={{ padding: '12px 16px' }}>Location</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Orders</th>
              <th style={{ padding: '12px 16px' }}>Order Value (GMV)</th>
              <th style={{ padding: '12px 16px' }}>Commission (10%)</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 20px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: 48, textAlign: 'center', color: '#64748B' }}>
                  Loading real print shops from DynamoDB...
                </td>
              </tr>
            ) : filteredMerchants.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 48, textAlign: 'center', color: '#94A3B8' }}>
                  No print shops found matching the criteria.
                </td>
              </tr>
            ) : (
              filteredMerchants.map((shop) => {
                const initials = shop.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <tr
                    key={shop.shopId}
                    onClick={() => setSelectedMerchant(shop)}
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
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            backgroundColor: '#F5F3FF',
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
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{shop.name}</div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>
                            {shop.ownerName} • {shop.mobile}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#5000F6' }} />
                        <span>{shop.location}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600, color: '#0F172A' }}>
                      {shop.orders}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0F172A' }}>
                      ₹{shop.orderValue.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#5000F6' }}>
                      ₹{shop.commission.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          backgroundColor:
                            shop.status === 'Verified'
                              ? '#ECFDF5'
                              : shop.status === 'Pending'
                              ? '#FEF3C7'
                              : '#F1F5F9',
                          color:
                            shop.status === 'Verified'
                              ? '#059669'
                              : shop.status === 'Pending'
                              ? '#D97706'
                              : '#64748B',
                        }}
                      >
                        {shop.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMerchant(shop);
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
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Merchant Detail Drawer */}
      <Drawer
        isOpen={!!selectedMerchant}
        onClose={() => setSelectedMerchant(null)}
        title={selectedMerchant?.name || 'Shop Details'}
        subtitle={`ID: ${selectedMerchant?.shopId}`}
      >
        {selectedMerchant && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Header info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  backgroundColor: '#5000F6',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedMerchant.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
                  {selectedMerchant.name}
                </div>
                <div style={{ fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Building size={12} />
                  <span>{selectedMerchant.ownerName}</span>
                </div>
              </div>
            </div>

            {/* Financial Performance */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 14, backgroundColor: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Lifetime GMV</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                  ₹{selectedMerchant.orderValue.toLocaleString()}
                </div>
              </div>
              <div style={{ padding: 14, backgroundColor: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>Commission (10%)</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#5000F6', marginTop: 4 }}>
                  ₹{selectedMerchant.commission.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Shop Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Contact Mobile:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedMerchant.mobile}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Address / City:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedMerchant.location}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Total Fulfilled Orders:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedMerchant.orders}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Partner Since:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedMerchant.joinedOn}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#64748B' }}>Verification Status:</span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    backgroundColor:
                      selectedMerchant.status === 'Verified'
                        ? '#ECFDF5'
                        : selectedMerchant.status === 'Pending'
                        ? '#FEF3C7'
                        : '#F1F5F9',
                    color:
                      selectedMerchant.status === 'Verified'
                        ? '#059669'
                        : selectedMerchant.status === 'Pending'
                        ? '#D97706'
                        : '#64748B',
                  }}
                >
                  {selectedMerchant.status}
                </span>
              </div>
            </div>

            {/* KYC & Verification Controls */}
            <div style={{ paddingTop: 16, borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                KYC & Operational Controls
              </div>

              {selectedMerchant.status !== 'Verified' && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus(selectedMerchant.shopId, 'approved')}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 8,
                    border: 'none',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 2px 8px rgba(16,185,129,0.25)',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Approve & Verify Print Shop</span>
                </button>
              )}

              {selectedMerchant.status !== 'Inactive' && (
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus(selectedMerchant.shopId, 'rejected')}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 8,
                    border: '1px solid #EF4444',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <Ban size={16} />
                  <span>Suspend / Deactivate Shop</span>
                </button>
              )}

              <a
                href={`https://merchant.prinkout.com`}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  textDecoration: 'none',
                }}
              >
                <span>View Merchant Hub Portal</span>
                <ExternalLink size={14} color="#64748B" />
              </a>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
